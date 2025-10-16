// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, useToast } from '@/components/ui';
// @ts-ignore;
import { RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

// @ts-ignore;
import { useTranslation } from '@/lib/i18n';
export function SyncLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    t
  } = useTranslation();
  const {
    toast
  } = useToast();
  const mockLogs = [{
    id: '1',
    platform: 'weibo',
    platform_name: '微博',
    status: 'success',
    operation: 'sync_posts',
    message: '成功同步100条微博',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    duration: 120,
    records_count: 100
  }, {
    id: '2',
    platform: 'douyin',
    platform_name: '抖音',
    status: 'error',
    operation: 'sync_videos',
    message: 'API限流，请稍后重试',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    duration: 30,
    error_code: 'RATE_LIMIT'
  }, {
    id: '3',
    platform: 'instagram',
    platform_name: 'Instagram',
    status: 'success',
    operation: 'sync_posts',
    message: '成功同步50条帖子',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    duration: 45,
    records_count: 50
  }, {
    id: '4',
    platform: 'tiktok',
    platform_name: 'TikTok',
    status: 'warning',
    operation: 'sync_videos',
    message: '部分数据同步失败',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    duration: 90,
    records_count: 75
  }, {
    id: '5',
    platform: 'xiaohongshu',
    platform_name: '小红书',
    status: 'success',
    operation: 'sync_notes',
    message: '成功同步80条笔记',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    records_count: 80
  }];
  const fetchLogs = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLogs(mockLogs);
    } catch (error) {
      toast({
        title: '获取日志失败',
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const getStatusIcon = status => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };
  const getStatusColor = status => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  const formatDuration = seconds => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };
  useEffect(() => {
    fetchLogs();
  }, []);
  if (loading) {
    return <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>;
  }
  return <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">同步日志</h3>
        <Button onClick={fetchLogs} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          刷新
        </Button>
      </div>

      <div className="space-y-3">
        {logs.map(log => <Card key={log.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(log.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{log.platform_name}</span>
                      <Badge className={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {log.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <span>操作: {log.operation}</span>
                      <span>耗时: {formatDuration(log.duration)}</span>
                      {log.records_count && <span>记录: {log.records_count}</span>}
                      {log.error_code && <span>错误码: {log.error_code}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>

      {logs.length === 0 && <div className="text-center py-8 text-muted-foreground">
          暂无同步日志
        </div>}
    </div>;
}