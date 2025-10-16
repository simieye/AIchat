// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, useToast, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
// @ts-ignore;
import { Plus, RefreshCw, Settings, Link, Globe, Video, Users, MessageSquare, ShoppingBag, BookOpen, Music } from 'lucide-react';

import { Layout } from '@/components/Layout';
import { PlatformCard } from '@/components/PlatformCard';
import { ConnectionWizard } from '@/components/ConnectionWizard';
import { DataMapping } from '@/components/DataMapping';
import { SyncLogs } from '@/components/SyncLogs';
// @ts-ignore;
import { useTranslation } from '@/lib/i18n';

// 扩展的平台配置 - 支持12个国内外主流平台
const platformConfigs = {
  weibo: {
    name: '微博',
    icon: '📱',
    color: '#E6162D',
    description: '中国最大的社交媒体平台之一',
    platform_type: 'social',
    region: 'cn',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'user_info', 'post'],
    features: ['发布内容', '用户互动', '数据分析', '话题营销'],
    category: 'social_media'
  },
  bilibili: {
    name: 'B站',
    icon: '📺',
    color: '#00A1D6',
    description: '中国领先的视频分享平台',
    platform_type: 'video',
    region: 'cn',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'video_upload', 'danmaku'],
    features: ['视频发布', '弹幕互动', 'UP主数据', '直播管理'],
    category: 'video_platform'
  },
  douyin: {
    name: '抖音',
    icon: '🎵',
    color: '#000000',
    description: '中国最受欢迎的短视频平台',
    platform_type: 'video',
    region: 'cn',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'video_upload', 'live', 'ecommerce'],
    features: ['短视频发布', '直播', '电商数据', '挑战赛'],
    category: 'short_video'
  },
  kuaishou: {
    name: '快手',
    icon: '📹',
    color: '#FF6B35',
    description: '中国领先的短视频和直播平台',
    platform_type: 'video',
    region: 'cn',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'video_upload', 'live', 'ecommerce'],
    features: ['短视频', '直播', '电商', '同城服务'],
    category: 'short_video'
  },
  xiaohongshu: {
    name: '小红书',
    icon: '📒',
    color: '#FE2C55',
    description: '中国生活方式分享平台',
    platform_type: 'social',
    region: 'cn',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'user_info', 'note'],
    features: ['笔记发布', '种草营销', '用户画像', '品牌合作'],
    category: 'lifestyle'
  },
  zhihu: {
    name: '知乎',
    icon: '❓',
    color: '#0066FF',
    description: '中国知识分享社区',
    platform_type: 'social',
    region: 'cn',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'user_info', 'answer', 'article'],
    features: ['问答', '专栏', '知识付费', '圆桌讨论'],
    category: 'knowledge'
  },
  twitter: {
    name: 'Twitter',
    icon: '🐦',
    color: '#1DA1F2',
    description: '全球实时信息分享平台',
    platform_type: 'social',
    region: 'global',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'tweet', 'user_info', 'dm'],
    features: ['推文', '话题标签', '实时趋势', '私信'],
    category: 'social_media'
  },
  facebook: {
    name: 'Facebook',
    icon: '👤',
    color: '#1877F2',
    description: '全球最大的社交网络',
    platform_type: 'social',
    region: 'global',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'pages', 'groups', 'ads'],
    features: ['帖子', '群组', '广告管理', '直播'],
    category: 'social_media'
  },
  instagram: {
    name: 'Instagram',
    icon: '📷',
    color: '#E4405F',
    description: '图片和视频分享平台',
    platform_type: 'social',
    region: 'global',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'media', 'user_info', 'story'],
    features: ['帖子', '故事', 'Reels', '购物标签'],
    category: 'visual_content'
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    color: '#0A66C2',
    description: '职业社交平台',
    platform_type: 'professional',
    region: 'global',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'profile', 'posts', 'company'],
    features: ['动态', '文章', '职业数据', '公司主页'],
    category: 'professional'
  },
  youtube: {
    name: 'YouTube',
    icon: '▶️',
    color: '#FF0000',
    description: '全球最大的视频平台',
    platform_type: 'video',
    region: 'global',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'upload', 'manage', 'analytics'],
    features: ['视频', '直播', '频道管理', '数据分析'],
    category: 'video_platform'
  },
  tiktok: {
    name: 'TikTok',
    icon: '🎵',
    color: '#FF0050',
    description: '全球短视频平台',
    platform_type: 'video',
    region: 'global',
    auth_type: 'oauth',
    scopes: ['read', 'write', 'video_upload', 'live', 'ecommerce'],
    features: ['短视频', '直播', '挑战', '电商'],
    category: 'short_video'
  }
};
export default function Integration(props) {
  const [isDark, setIsDark] = useState(true);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [activeTab, setActiveTab] = useState('platforms');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
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
          category: record.category || 'social_media',
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
            category: config.category,
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
          category: config.category,
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
        category: platform.category,
        status: 'connected',
        last_sync_at: new Date().toISOString(),
        sync_enabled: true,
        credentials: credentials,
        config: {
          api_endpoint: `https://api.${platform.name}.com`,
          rate_limits: {
            requests_per_hour: platform.region === 'cn' ? 200 : 300,
            requests_per_day: platform.region === 'cn' ? 2000 : 3000
          }
        },
        metadata: {
          connected_at: new Date().toISOString(),
          version: '1.0',
          platform_info: {
            name: platform.displayName,
            icon: platform.icon,
            color: platform.color
          }
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
  const filteredPlatforms = platforms.filter(platform => {
    if (filterRegion !== 'all' && platform.region !== filterRegion) return false;
    if (filterCategory !== 'all' && platform.category !== filterCategory) return false;
    return true;
  });
  const connectedCount = platforms.filter(p => p.status === 'connected').length;
  const totalCount = platforms.length;
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
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {connectedCount}/{totalCount} platforms connected
            </div>
            <Button onClick={fetchPlatforms} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('refresh')}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)} className="px-3 py-2 border rounded-md bg-background">
            <option value="all">All Regions</option>
            <option value="cn">🇨🇳 China</option>
            <option value="global">🌍 Global</option>
          </select>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-3 py-2 border rounded-md bg-background">
            <option value="all">All Categories</option>
            <option value="social_media">Social Media</option>
            <option value="video_platform">Video Platform</option>
            <option value="short_video">Short Video</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="knowledge">Knowledge</option>
            <option value="professional">Professional</option>
            <option value="visual_content">Visual Content</option>
          </select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="mapping">Data Mapping</TabsTrigger>
            <TabsTrigger value="logs">Sync Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="platforms">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlatforms.map(platform => <PlatformCard key={platform.id} platform={platform} onConnect={handleConnect} onDisconnect={handleDisconnect} />)}
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