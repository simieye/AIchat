// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, useToast } from '@/components/ui';
// @ts-ignore;
import { Plus, Link, Settings } from 'lucide-react';

import { Layout } from '@/components/Layout';
import { PlatformGrid } from '@/components/PlatformGrid';
import { ConnectedPlatforms } from '@/components/ConnectedPlatforms';
import { DataMapping } from '@/components/DataMapping';
import { SyncLogs } from '@/components/SyncLogs';
import { EnhancedConnectionWizard } from '@/components/EnhancedConnectionWizard';
// @ts-ignore;
import { useTranslation } from '@/lib/i18n';
export default function Integration(props) {
  const [isDark, setIsDark] = useState(true);
  const [platforms, setPlatforms] = useState([]);
  const [mappings, setMappings] = useState({});
  const [logs, setLogs] = useState([]);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
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
  const fetchPlatforms = async () => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'integration',
        methodName: 'wedaGetRecordsV2',
        params: {
          orderBy: [{
            createdAt: 'desc'
          }],
          getCount: true
        }
      });
      if (result.records) {
        setPlatforms(result.records.map(platform => ({
          id: platform._id,
          platform: platform.platform,
          name: platform.display_name || platform.name,
          status: platform.status || 'disconnected',
          lastSync: platform.last_sync_at ? new Date(platform.last_sync_at).toLocaleString() : 'Never',
          account: platform.account_name || platform.account_id || 'Unknown',
          syncEnabled: platform.sync_enabled || false,
          credentials: platform.credentials || {},
          clientId: platform.client_id,
          clientSecret: platform.client_secret,
          accessToken: platform.access_token,
          refreshToken: platform.refresh_token,
          scope: platform.scope || [],
          expiresAt: platform.expires_at,
          connectedAt: platform.connected_at,
          accountEmail: platform.account_email,
          accountAvatar: platform.account_avatar,
          apiVersion: platform.api_version,
          syncFrequency: platform.sync_frequency,
          errorMessage: platform.error_message,
          metadata: platform.metadata || {},
          config: platform.config || {},
          tags: platform.tags || []
        })));
      }
    } catch (error) {
      toast({
        title: t('errorLoadingData'),
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const fetchLogs = async () => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'sync_log',
        methodName: 'wedaGetRecordsV2',
        params: {
          orderBy: [{
            started_at: 'desc'
          }],
          pageSize: 20,
          getCount: true
        }
      });
      if (result.records) {
        setLogs(result.records.map(log => ({
          id: log._id,
          platform: log.platform || 'Unknown',
          status: log.status || 'unknown',
          details: log.details?.message || log.details || 'No details',
          timestamp: new Date(log.started_at).toLocaleString(),
          duration: log.duration_ms || 0,
          records: log.records_processed || 0,
          error: log.error_msg || undefined
        })));
      }
    } catch (error) {
      toast({
        title: t('errorLoadingData'),
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const fetchMappings = async () => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'integration',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            platform: true,
            metadata: true
          }
        }
      });
      if (result.records) {
        const newMappings = {};
        result.records.forEach(platform => {
          if (platform.metadata?.field_mappings) {
            newMappings[platform.platform] = platform.metadata.field_mappings;
          }
        });
        setMappings(newMappings);
      }
    } catch (error) {
      console.error('Error loading mappings:', error);
    }
  };
  useEffect(() => {
    Promise.all([fetchPlatforms(), fetchLogs(), fetchMappings()]).finally(() => {
      setLoading(false);
    });
  }, []);
  const handleConnect = async platformData => {
    try {
      const platformConfig = {
        weibo: {
          clientId: 'weibo_app_key',
          clientSecret: 'weibo_app_secret'
        },
        bilibili: {
          clientId: 'bilibili_app_key',
          clientSecret: 'bilibili_app_secret'
        },
        douyin: {
          clientId: 'douyin_client_key',
          clientSecret: 'douyin_client_secret'
        },
        kuaishou: {
          clientId: 'kuaishou_app_id',
          clientSecret: 'kuaishou_app_secret'
        },
        xiaohongshu: {
          clientId: 'xhs_app_key',
          clientSecret: 'xhs_app_secret'
        },
        facebook: {
          clientId: 'facebook_app_id',
          clientSecret: 'facebook_app_secret'
        },
        instagram: {
          clientId: 'instagram_app_id',
          clientSecret: 'instagram_app_secret'
        },
        twitter: {
          clientId: 'twitter_api_key',
          clientSecret: 'twitter_api_secret'
        },
        linkedin: {
          clientId: 'linkedin_client_id',
          clientSecret: 'linkedin_client_secret'
        },
        youtube: {
          clientId: 'youtube_client_id',
          clientSecret: 'youtube_client_secret'
        },
        whatsapp: {
          clientId: 'whatsapp_phone_id',
          clientSecret: 'whatsapp_access_token'
        },
        tiktok: {
          clientId: 'tiktok_client_key',
          clientSecret: 'tiktok_client_secret'
        }
      };
      const config = platformConfig[platformData.platform] || {};
      await props.$w.cloud.callDataSource({
        dataSourceName: 'integration',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            platform: platformData.platform,
            name: platformData.name,
            display_name: platformData.display_name || platformData.name,
            client_id: config.clientId,
            client_secret: config.clientSecret,
            access_token: platformData.credentials?.accessToken,
            refresh_token: platformData.credentials?.refreshToken,
            scope: platformData.credentials?.scope || [],
            status: 'connected',
            account_name: platformData.account || 'Connected Account',
            account_id: platformData.account_id || 'unknown',
            connected_at: new Date().toISOString(),
            last_sync_at: new Date().toISOString(),
            sync_enabled: true,
            sync_frequency: 'hourly',
            api_version: 'v1.0',
            metadata: {
              field_mappings: {
                phone: 'phone',
                name: 'name',
                email: 'email',
                avatar: 'avatar',
                bio: 'bio',
                followers: 'followers_count',
                following: 'following_count',
                posts: 'posts_count'
              },
              platform_config: {
                rate_limits: {
                  requests_per_hour: 1000,
                  requests_per_day: 10000
                }
              }
            },
            config: {
              auto_sync: true,
              sync_fields: ['profile', 'posts', 'followers'],
              webhook_enabled: false
            },
            tags: [platformData.platform, 'social_media', 'active']
          }
        }
      });
      toast({
        title: t('platformConnected'),
        description: `${platformData.display_name || platformData.name} ${t('hasBeenConnected')}`
      });
      setShowWizard(false);
      setSelectedPlatform(null);
      await Promise.all([fetchPlatforms(), fetchMappings()]);
    } catch (error) {
      toast({
        title: t('errorConnectingPlatform'),
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleReconnect = async platformId => {
    try {
      await props.$w.cloud.callDataSource({
        dataSourceName: 'integration',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            status: 'connected',
            last_sync_at: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          filter: {
            where: {
              _id: {
                $eq: platformId
              }
            }
          }
        }
      });
      toast({
        title: t('platformConnected'),
        description: "Platform has been successfully reconnected."
      });
      await fetchPlatforms();
    } catch (error) {
      toast({
        title: t('errorConnectingPlatform'),
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleDisconnect = async platformId => {
    try {
      await props.$w.cloud.callDataSource({
        dataSourceName: 'integration',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            status: 'disconnected',
            last_sync_at: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          filter: {
            where: {
              _id: {
                $eq: platformId
              }
            }
          }
        }
      });
      toast({
        title: t('platformDisconnected'),
        description: "Platform has been disconnected."
      });
      await fetchPlatforms();
    } catch (error) {
      toast({
        title: t('errorConnectingPlatform'),
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleMappingChange = async (platform, platformField, systemField) => {
    try {
      const newMappings = {
        ...(mappings[platform] || {}),
        [platformField]: systemField === '__none__' ? null : systemField
      };
      await props.$w.cloud.callDataSource({
        dataSourceName: 'integration',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            metadata: {
              field_mappings: newMappings
            },
            updatedAt: new Date().toISOString()
          },
          filter: {
            where: {
              platform: {
                $eq: platform
              }
            }
          }
        }
      });
      setMappings(prev => ({
        ...prev,
        [platform]: newMappings
      }));
      toast({
        title: "Mapping updated",
        description: "Field mapping has been updated."
      });
    } catch (error) {
      toast({
        title: "Error updating mapping",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handlePlatformConnect = platform => {
    setSelectedPlatform(platform);
    setShowWizard(true);
  };
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
            <p className="text-muted-foreground">{t('managePlatformConnections')}</p>
          </div>
          <Button onClick={() => setShowWizard(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t('addPlatform')}
          </Button>
        </div>

        <Tabs defaultValue="platforms" className="space-y-4">
          <TabsList>
            <TabsTrigger value="platforms">{t('availablePlatforms')}</TabsTrigger>
            <TabsTrigger value="connected">{t('connectedPlatforms')}</TabsTrigger>
            <TabsTrigger value="mapping">{t('dataMapping')}</TabsTrigger>
            <TabsTrigger value="logs">{t('syncLogs')}</TabsTrigger>
          </TabsList>

          <TabsContent value="platforms">
            <PlatformGrid connectedPlatforms={platforms} onConnect={handlePlatformConnect} />
          </TabsContent>

          <TabsContent value="connected">
            <ConnectedPlatforms platforms={platforms} onReconnect={handleReconnect} onDisconnect={handleDisconnect} />
          </TabsContent>

          <TabsContent value="mapping">
            <DataMapping platforms={platforms} mappings={mappings} onMappingChange={handleMappingChange} />
          </TabsContent>

          <TabsContent value="logs">
            <SyncLogs logs={logs} />
          </TabsContent>
        </Tabs>

        <EnhancedConnectionWizard platform={selectedPlatform} isOpen={showWizard} onClose={() => {
        setShowWizard(false);
        setSelectedPlatform(null);
      }} onConnect={handleConnect} />
      </div>
    </Layout>;
}