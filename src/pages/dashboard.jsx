// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, useToast } from '@/components/ui';
// @ts-ignore;
import { TrendingUp, TrendingDown, Users, MessageSquare, Eye, DollarSign, RefreshCw } from 'lucide-react';

import { Layout } from '@/components/Layout';
import { MetricCard } from '@/components/MetricCard';
import { Chart } from '@/components/Chart';
import { RecentActivity } from '@/components/RecentActivity';
// @ts-ignore;
import { useTranslation } from '@/lib/i18n';
export default function Dashboard(props) {
  const [isDark, setIsDark] = useState(true);
  const [metrics, setMetrics] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    t
  } = useTranslation();
  const {
    toast
  } = useToast();
  const handleNavigate = pageId => {
    props.$w.utils.navigateTo({
      pageId,
      params: {}
    });
  };
  const toggleTheme = () => setIsDark(!isDark);
  const fetchMetrics = async () => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'metric_snapshot',
        methodName: 'wedaGetRecordsV2',
        params: {
          orderBy: [{
            recorded_at: 'desc'
          }],
          pageSize: 100,
          getCount: true
        }
      });
      if (result.records) {
        // 按指标名称分组，获取最新值
        const latestMetrics = {};
        result.records.forEach(record => {
          if (!latestMetrics[record.metric_name] || new Date(record.recorded_at) > new Date(latestMetrics[record.metric_name].recordedAt)) {
            latestMetrics[record.metric_name] = {
              id: record._id,
              metricName: record.metric_name,
              value: record.value,
              unit: record.unit || '',
              recordedAt: record.recorded_at,
              sourcePlatform: record.source_platform || 'System',
              tags: record.tags || [],
              category: record.category || 'general',
              change: 0
            };
          }
        });
        // 计算变化率（与前一天比较）
        const metricsArray = Object.values(latestMetrics);
        const metricsWithChange = metricsArray.map(metric => {
          const previousRecord = result.records.find(r => r.metric_name === metric.metricName && new Date(r.recorded_at) < new Date(metric.recordedAt) && new Date(r.recorded_at) >= new Date(new Date(metric.recordedAt).getTime() - 24 * 60 * 60 * 1000));
          const change = previousRecord ? (metric.value - previousRecord.value) / previousRecord.value * 100 : 0;
          return {
            ...metric,
            change: Math.round(change * 100) / 100
          };
        });
        setMetrics(metricsWithChange);
        // 准备图表数据 - 按日期和指标分组
        const chartDataByDate = {};
        result.records.forEach(record => {
          const date = new Date(record.recorded_at).toLocaleDateString();
          if (!chartDataByDate[date]) {
            chartDataByDate[date] = {};
          }
          chartDataByDate[date][record.metric_name] = record.value;
        });
        const chartMetrics = Object.entries(chartDataByDate).map(([date, values]) => ({
          name: date,
          leads: values.total_leads || 0,
          messages: values.total_messages || 0,
          views: values.total_views || 0,
          revenue: values.total_revenue || 0
        })).slice(-30); // 最近30天
        setChartData(chartMetrics);
      }
    } catch (error) {
      toast({
        title: t('errorLoadingData'),
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const fetchActivities = async () => {
    try {
      const [leadsResult, conversationsResult] = await Promise.all([props.$w.cloud.callDataSource({
        dataSourceName: 'lead',
        methodName: 'wedaGetRecordsV2',
        params: {
          orderBy: [{
            createdAt: 'desc'
          }],
          pageSize: 5,
          getCount: true
        }
      }), props.$w.cloud.callDataSource({
        dataSourceName: 'conversation',
        methodName: 'wedaGetRecordsV2',
        params: {
          orderBy: [{
            last_interaction_at: 'desc'
          }],
          pageSize: 5,
          getCount: true
        }
      })]);
      const activities = [];
      if (leadsResult.records) {
        activities.push(...leadsResult.records.map(lead => ({
          id: lead._id,
          type: 'lead',
          title: `${t('newLead')}: ${lead.name || 'Anonymous'}`,
          description: `${t('from')}: ${lead.source || 'Unknown'}`,
          time: new Date(lead.createdAt).toLocaleString(),
          value: lead.value || 0
        })));
      }
      if (conversationsResult.records) {
        activities.push(...conversationsResult.records.map(conv => ({
          id: conv._id,
          type: 'message',
          title: t('newConversation'),
          description: `${t('platform')}: ${conv.platform || 'Unknown'} - ${conv.last_message?.substring(0, 50) || 'No message'}`,
          time: new Date(conv.last_interaction_at).toLocaleString(),
          value: 0,
          unreadCount: conv.unread_count || 0
        })));
      }
      setActivities(activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10));
    } catch (error) {
      toast({
        title: t('errorLoadingData'),
        description: error.message,
        variant: "destructive"
      });
    }
  };
  useEffect(() => {
    Promise.all([fetchMetrics(), fetchActivities()]).finally(() => {
      setLoading(false);
    });
  }, []);
  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchMetrics(), fetchActivities()]);
    setLoading(false);
    toast({
      title: t('dataRefreshed'),
      description: t('dashboardDataUpdated')
    });
  };
  const getMetricByName = name => {
    return metrics.find(m => m.metricName === name) || {
      value: 0,
      change: 0,
      unit: ''
    };
  };
  if (loading) {
    return <Layout activePage="dashboard" onNavigate={handleNavigate} isDark={isDark} onToggleTheme={toggleTheme}>
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">{t('loading')}</div>
        </div>
      </div>
    </Layout>;
  }
  return <Layout activePage="dashboard" onNavigate={handleNavigate} isDark={isDark} onToggleTheme={toggleTheme}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground">{t('dashboard')}</h2>
            <p className="text-muted-foreground">{t('welcomeBack')}</p>
          </div>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('refresh')}
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard title={t('totalLeads')} value={getMetricByName('total_leads').value} change={getMetricByName('total_leads').change} icon={Users} />
          <MetricCard title={t('totalMessages')} value={getMetricByName('total_messages').value} change={getMetricByName('total_messages').change} icon={MessageSquare} />
          <MetricCard title={t('totalViews')} value={getMetricByName('total_views').value} change={getMetricByName('total_views').change} icon={Eye} />
          <MetricCard title={t('revenue')} value={getMetricByName('total_revenue').value} change={getMetricByName('total_revenue').change} icon={DollarSign} prefix="$" />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Chart data={chartData} />
          </div>
          <div>
            <RecentActivity activities={activities} />
          </div>
        </div>
      </div>
    </Layout>;
}