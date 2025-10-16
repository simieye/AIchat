// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, useToast, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
// @ts-ignore;
import { Plus, RefreshCw, Settings, Link } from 'lucide-react';

import { Layout } from '@/components/Layout';
import { PlatformCard } from '@/components/PlatformCard';
import { ConnectionWizard } from '@/components/ConnectionWizard';
import { DataMapping } from '@/components/DataMapping';
import { SyncLogs } from '@/components/SyncLogs';
// @ts-ignore;
import { useTranslation } from '@/lib/i18n';

// 基于新数据模型的平台配置
const platformConfigs = {
  weibo: {
    name: '微博',
    icon: 'M',
    color: '#E6162D',
    description: '中国最大的社交媒体平台之一',
    platform_type: 'social',
    region: 'cn',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'user_info'],
    features: ['发布内容', '用户互动', '数据分析']
  },
  bilibili: {
    name: 'B站',
    icon: 'B',
    color: '#00A1D6',
    description: '中国领先的视频分享平台',
    platform_type: 'video',
    region: 'cn',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'video_upload'],
    features: ['视频发布', '弹幕互动', 'UP主数据']
  },
  douyin: {
    name: '抖音',
    icon: '♪',
    color: '#000000',
    description: '中国最受欢迎的短视频平台',
    platform_type: 'video',
    region: 'cn',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'video_upload', 'live'],
    features: ['短视频发布', '直播', '电商数据']
  },
  kuaishou: {
    name: '快手',
    icon: 'K',
    color: '#FF6B35',
    description: '中国领先的短视频和直播平台',
    platform_type: 'video',
    region: 'cn',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'video_upload', 'live'],
    features: ['短视频', '直播', '电商']
  },
  xiaohongshu: {
    name: '小红书',
    icon: 'X',
    color: '#FE2C55',
    description: '中国生活方式分享平台',
    platform_type: 'social',
    region: 'cn',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'user_info'],
    features: ['笔记发布', '种草营销', '用户画像']
  },
  zhihu: {
    name: '知乎',
    icon: '知',
    color: '#0066FF',
    description: '中国知识分享社区',
    platform_type: 'social',
    region: 'cn',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'user_info'],
    features: ['问答', '专栏', '知识付费']
  },
  twitter: {
    name: 'Twitter',
    icon: '𝕏',
    color: '#000000',
    description: '全球实时信息分享平台',
    platform_type: 'social',
    region: 'global',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'tweet', 'user_info'],
    features: ['推文', '话题标签', '实时趋势']
  },
  facebook: {
    name: 'Facebook',
    icon: 'f',
    color: '#1877F2',
    description: '全球最大的社交网络',
    platform_type: 'social',
    region: 'global',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'pages', 'groups'],
    features: ['帖子', '群组', '广告管理']
  },
  instagram: {
    name: 'Instagram',
    icon: '📷',
    color: '#E4405F',
    description: '图片和视频分享平台',
    platform_type: 'social',
    region: 'global',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'media', 'user_info'],
    features: ['帖子', '故事', 'Reels']
  },
  linkedin: {
    name: 'LinkedIn',
    icon: 'in',
    color: '#0A66C2',
    description: '职业社交平台',
    platform_type: 'professional',
    region: 'global',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'profile', 'posts'],
    features: ['动态', '文章', '职业数据']
  },
  youtube: {
    name: 'YouTube',
    icon: '▶',
    color: '#FF0000',
    description: '全球最大的视频平台',
    platform_type: 'video',
    region: 'global',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'upload', 'manage'],
    features: ['视频', '直播', '频道管理']
  },
  tiktok: {
    name: 'TikTok',
    icon: '🎵',
    color: '#FF0050',
    description: '全球短视频平台',
    platform_type: 'video',
    region: 'global',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'video_upload', 'live'],
    features: ['短视频', '直播', '挑战']
  }
};
export default function Integration(props) {
  const [isDark, setIsDark] = useState(true);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [activeTab, setActiveTab] = useState('platforms');
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
  const fetchPlatforms = async () => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'integration',
        methodName: 'wedaGetRecordsV2',
        params: {
          orderBy: [{
            createdAt: 'desc'
          }],
          pageSize: 50,
          getCount: true
        }
      });
      if (result.records) {
        // 将数据库记录转换为平台对象
        const connectedPlatforms = result.records.map(record => ({
          id: record._id,
          name: record.name,
          displayName: record.display_name,
          platformType: record.platform_type,
          region: record.region,
          authType: record.auth_type,
          scopes: record.scopes || [],
          features: record.features || [],
          status: record.status,
          lastSync: record.last_sync_at,
          syncEnabled: record.sync_enabled,
          accountId: record.account_id,
          account: record.account,
          config: record.config || {},
          metadata: record.metadata || {},
          errorMessage: record.error_message,
          retryCount: record.retry_count || 0,
          // 从配置中获取图标和颜色
          ...(platformConfigs[record.name?.toLowerCase()] || {
            icon: '🔗',
            color: '#666666',
            description: 'Connected platform'
          })
        }));

        // 添加未连接的平台配置
        const allPlatforms = Object.entries(platformConfigs).map(([key, config]) => {
          const existing = connectedPlatforms.find(p => p.name === key);
          if (existing) return existing;
          return {
            id: key,
            name: key,
            displayName: config.name,
            platformType: config.platform_type,
            region: config.region,
            authType: config.auth_type,
            scopes: config.scopes,
            features: config.features,
            status: 'disconnected',
            lastSync: null,
            syncEnabled: false,
            accountId: null,
            account: null,
            config: {},
            metadata: {},
            errorMessage: null,
            retryCount: 0,
            ...config
          };
        });
        setPlatforms(allPlatforms);
      } else {
        // 如果没有记录，显示所有平台配置
        const allPlatforms = Object.entries(platformConfigs).map(([key, config]) => ({
          id: key,
          name: key,
          displayName: config.name,
          platformType: config.platform_type,
          region: config.region,
          authType: config.auth_type,
          scopes: config.scopes,
          features: config.features,
          status: 'disconnected',
          lastSync: null,
          syncEnabled: false,
          accountId: null,
          account: null,
          config: {},
          metadata: {},
          errorMessage: null,
          retryCount: 0,
          ...config
        }));
        setPlatforms(allPlatforms);
      }
    } catch (error) {
      toast({
        title: t('errorLoadingData'),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleConnect = async platform => {
    setSelectedPlatform(platform);
    setShowWizard(true);
  };
  const handleDisconnect = async platform => {
    try {
      await props.$w.cloud.callDataSource({
        dataSourceName: 'integration',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            status: 'disconnected',
            last_sync_at: null,
            sync_enabled: false,
            error_message: null
          },
          filter: {
            where: {
              name: {
                $eq: platform.name
              }
            }
          }
        }
      });
      toast({
        title: `${platform.displayName} ${t('platformDisconnected')}`,
        variant: "success"
      });
      fetchPlatforms();
    } catch (error) {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleWizardComplete = async (platform, credentials) => {
    try {
      // 检查是否已存在
      const existing = await props.$w.cloud.callDataSource({
        dataSourceName: 'integration',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              name: {
                $eq: platform.name
              }
            }
          }
        }
      });
      const platformData = {
        name: platform.name,
        display_name: platform.displayName,
        platform_type: platform.platformType,
        region: platform.region,
        auth_type: platform.authType,
        scopes: platform.scopes,
        features: platform.features,
        status: 'connected',
        last_sync_at: new Date().toISOString(),
        sync_enabled: true,
        credentials: credentials,
        config: {
          api_endpoint: platformConfigs[platform.name]?.authUrl || '',
          rate_limits: {
            requests_per_hour: 1000,
            requests_per_day: 10000
          }
        },
        metadata: {
          connected_at: new Date().toISOString(),
          version: '1.0'
        },
        error_message: null,
        retry_count: 0
      };
      if (existing.records?.length > 0) {
        // 更新现有记录
        await props.$w.cloud.callDataSource({
          dataSourceName: 'integration',
          methodName: 'wedaUpdateV2',
          params: {
            data: platformData,
            filter: {
              where: {
                name: {
                  $eq: platform.name
                }
              }
            }
          }
        });
      } else {
        // 创建新记录
        await props.$w.cloud.callDataSource({
          dataSourceName: 'integration',
          methodName: 'wedaCreateV2',
          params: {
            data: {
              ...platformData,
              createdAt: new Date().toISOString()
            }
          }
        });
      }
      toast({
        title: `${platform.displayName} ${t('platformConnected')}`,
        variant: "success"
      });
      setShowWizard(false);
      fetchPlatforms();
    } catch (error) {
      toast({
        title: t('errorConnectingPlatform'),
        description: error.message,
        variant: "destructive"
      });
    }
  };
  useEffect(() => {
    fetchPlatforms();
  }, []);
  if (loading) {
    return <Layout activePage="integration" onNavigate={handleNavigate} isDark={isDark} onToggleTheme={toggleTheme}>
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">{t('loading')}</div>
        </div>
      </div>
    </Layout>;
  }
  return <Layout activePage="integration" onNavigate={handleNavigate} isDark={isDark} onToggleTheme={toggleTheme}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Link className="w-8 h-8" />
              {t('integrationManagement')}
            </h2>
            <p className="text-muted-foreground">Connect and manage your social media platforms</p>
          </div>
          <Button onClick={fetchPlatforms} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('refresh')}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="mapping">Data Mapping</TabsTrigger>
            <TabsTrigger value="logs">Sync Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="platforms">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {platforms.map(platform => <PlatformCard key={platform.id} platform={platform} onConnect={handleConnect} onDisconnect={handleDisconnect} />)}
            </div>
          </TabsContent>

          <TabsContent value="mapping">
            <Card>
              <CardHeader>
                <CardTitle>Data Mapping Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <DataMapping platforms={platforms.filter(p => p.status === 'connected')} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Sync Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <SyncLogs />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {showWizard && <ConnectionWizard platform={selectedPlatform} onComplete={handleWizardComplete} onCancel={() => setShowWizard(false)} />}
      </div>
    </Layout>;
}