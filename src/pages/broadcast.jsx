// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Tabs, TabsContent, TabsList, TabsTrigger, useToast } from '@/components/ui';

import { BroadcastCreator } from '@/components/BroadcastCreator';
import { BroadcastHistory } from '@/components/BroadcastHistory';
import { Layout } from '@/components/Layout';
export default function Broadcast(props) {
  const [isDark, setIsDark] = useState(true);
  const [broadcasts, setBroadcasts] = useState([]);
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
  const fetchBroadcasts = async () => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'broadcast',
        methodName: 'wedaGetRecordsV2',
        params: {
          orderBy: [{
            sent_at: 'desc'
          }],
          getCount: true
        }
      });
      if (result.records) {
        setBroadcasts(result.records.map(broadcast => ({
          id: broadcast._id,
          name: broadcast.title,
          message: broadcast.message,
          tags: broadcast.segments || [],
          platform: broadcast.platform,
          created: new Date(broadcast.sent_at).toLocaleDateString(),
          stats: broadcast.stats || {
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0
          },
          status: broadcast.status || 'completed'
        })));
      }
    } catch (error) {
      toast({
        title: "Error loading broadcasts",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBroadcasts();
  }, []);
  const handleCreateBroadcast = async broadcast => {
    try {
      await props.$w.cloud.callDataSource({
        dataSourceName: 'broadcast',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            title: broadcast.name,
            message: broadcast.message,
            segments: broadcast.tags,
            platform: broadcast.platform,
            sent_at: new Date().toISOString(),
            stats: {
              sent: 0,
              delivered: 0,
              opened: 0,
              clicked: 0
            },
            status: 'scheduled'
          }
        }
      });
      toast({
        title: "Broadcast created",
        description: "Your broadcast has been scheduled successfully."
      });
      fetchBroadcasts(); // 刷新列表
    } catch (error) {
      toast({
        title: "Error creating broadcast",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  if (loading) {
    return <Layout activePage="broadcast" onNavigate={handleNavigate} isDark={isDark} onToggleTheme={toggleTheme}>
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading broadcasts...</div>
        </div>
      </div>
    </Layout>;
  }
  return <Layout activePage="broadcast" onNavigate={handleNavigate} isDark={isDark} onToggleTheme={toggleTheme}>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground">Broadcast</h2>
          <p className="text-muted-foreground">Create and manage broadcast campaigns</p>
        </div>

        <Tabs defaultValue="create" className="space-y-4">
          <TabsList>
            <TabsTrigger value="create">Create Broadcast</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <BroadcastCreator onCreate={handleCreateBroadcast} />
          </TabsContent>

          <TabsContent value="history">
            <BroadcastHistory broadcasts={broadcasts} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>;
}