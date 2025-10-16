// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, useToast } from '@/components/ui';
// @ts-ignore;
import { Plus, Link, Settings } from 'lucide-react';

import { Layout } from '@/components/Layout';
import { PlatformCard } from '@/components/PlatformCard';
import { ConnectionWizard } from '@/components/ConnectionWizard';
import { DataMapping } from '@/components/DataMapping';
import { SyncLogs } from '@/components/SyncLogs';
export default function Integration(props) {
  const [isDark, setIsDark] = useState(true);
  const [platforms, setPlatforms] = useState([]);
  const [mappings, setMappings] = useState({});
  const [logs, setLogs] = useState([]);
  const [showWizard, setShowWizard] = useState(false);
  const [loading, setLoading] = useState(true);
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
          name: platform.name,
          type: platform.platform,
          status: platform.status || 'disconnected',
          lastSync: platform.last_sync_at ? new Date(platform.last_sync_at).toLocaleString() : 'Never',
          account: platform.account || 'Unknown',
          syncEnabled: platform.sync_enabled || false
        })));
      }
    } catch (error) {
      toast({
        title: "Error loading platforms",
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
        title: "Error loading logs",
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
        title: "Platform reconnected",
        description: "Platform has been successfully reconnected."
      });
      await fetchPlatforms();
    } catch (error) {
      toast({
        title: "Error reconnecting platform",
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
        title: "Platform disconnected",
        description: "Platform has been disconnected."
      });
      await fetchPlatforms();
    } catch (error) {
      toast({
        title: "Error disconnecting platform",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleConnect = async platform => {
    try {
      await props.$w.cloud.callDataSource({
        dataSourceName: 'integration',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            platform: platform.platform,
            name: platform.name,
            credentials: {
              apiKey: platform.apiKey,
              token: platform.token,
              webhook: platform.webhook
            },
            status: 'connected',
            account: platform.account || 'Unknown',
            last_sync_at: new Date().toISOString(),
            sync_enabled: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {
              field_mappings: {
                [platform.platform]: {
                  phone: 'phone',
                  name: 'name',
                  email: 'email',
                  avatar: 'avatar'
                }
              }
            }
          }
        }
      });
      toast({
        title: "Platform connected",
        description: `${platform.name} has been connected successfully.`
      });
      setShowWizard(false);
      await Promise.all([fetchPlatforms(), fetchMappings()]);
    } catch (error) {
      toast({
        title: "Error connecting platform",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleMappingChange = async (platform, platformField, systemField) => {
    try {
      const platformRecord = platforms.find(p => p.type === platform);
      if (platformRecord) {
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
      }
    } catch (error) {
      toast({
        title: "Error updating mapping",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  if (loading) {
    return <Layout activePage="integration" onNavigate={handleNavigate} isDark={isDark} onToggleTheme={toggleTheme}>
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading integration data...</div>
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
              Integration
            </h2>
            <p className="text-muted-foreground">Manage platform connections and data synchronization</p>
          </div>
          <Button onClick={() => setShowWizard(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Platform
          </Button>
        </div>

        <Tabs defaultValue="platforms" className="space-y-4">
          <TabsList>
            <TabsTrigger value="platforms">Connected Platforms</TabsTrigger>
            <TabsTrigger value="mapping">Data Mapping</TabsTrigger>
            <TabsTrigger value="logs">Sync Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="platforms">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.map(platform => <PlatformCard key={platform.id} platform={platform} onReconnect={handleReconnect} onDisconnect={handleDisconnect} />)}
              {platforms.length === 0 && <div className="col-span-full text-center py-8 text-muted-foreground">
                  No platforms connected. Click "Add Platform" to get started.
                </div>}
            </div>
          </TabsContent>

          <TabsContent value="mapping">
            <DataMapping mappings={mappings} onMappingChange={handleMappingChange} />
          </TabsContent>

          <TabsContent value="logs">
            <SyncLogs logs={logs} />
          </TabsContent>
        </Tabs>

        {showWizard && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Add New Platform</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowWizard(false)}>
                  Close
                </Button>
              </div>
              <ConnectionWizard onConnect={handleConnect} />
            </div>
          </div>}
      </div>
    </Layout>;
}