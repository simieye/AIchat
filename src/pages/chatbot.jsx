// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, useToast, Tabs, TabsContent, TabsList, TabsTrigger, Badge, Switch } from '@/components/ui';
// @ts-ignore;
import { Plus, Edit, Trash2, Play, Pause, Settings, Bot, MessageSquare, Users, Clock } from 'lucide-react';

import { Layout } from '@/components/Layout';
import { ChatbotCard } from '@/components/ChatbotCard';
import { ChatbotCreator } from '@/components/ChatbotCreator';
// @ts-ignore;
import { useTranslation } from '@/lib/i18n';
export default function Chatbot(props) {
  const [isDark, setIsDark] = useState(true);
  const [chatbots, setChatbots] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [activeTab, setActiveTab] = useState('chatbots');
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
  const fetchChatbots = async () => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'chatbot',
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
        setChatbots(result.records.map(record => ({
          id: record._id,
          name: record.name,
          description: record.description,
          status: record.status,
          platform: record.platform || 'web',
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
          config: record.config || {},
          triggers: record.triggers || [],
          responses: record.responses || []
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
  const fetchConversations = async () => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'conversation',
        methodName: 'wedaGetRecordsV2',
        params: {
          orderBy: [{
            last_interaction_at: 'desc'
          }],
          pageSize: 20,
          getCount: true
        }
      });
      if (result.records) {
        setConversations(result.records.map(record => ({
          id: record._id,
          leadId: record.lead_id,
          platform: record.platform,
          status: record.status,
          messages: record.messages || [],
          contact: record.contact || {},
          lastMessage: record.last_message || '',
          lastInteractionAt: record.last_interaction_at,
          unreadCount: record.unread_count || 0,
          assignedTo: record.assigned_to,
          priority: record.priority || 'medium',
          tags: record.tags || [],
          metadata: record.metadata || {}
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
  const handleCreateChatbot = async chatbotData => {
    try {
      await props.$w.cloud.callDataSource({
        dataSourceName: 'chatbot',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            name: chatbotData.name,
            description: chatbotData.description,
            status: 'active',
            platform: chatbotData.platform,
            config: chatbotData.config || {},
            triggers: chatbotData.triggers || [],
            responses: chatbotData.responses || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });
      toast({
        title: t('chatbotCreated'),
        description: `${chatbotData.name} has been created successfully`,
        variant: "success"
      });
      setShowCreator(false);
      fetchChatbots();
    } catch (error) {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleUpdateChatbot = async (id, updates) => {
    try {
      await props.$w.cloud.callDataSource({
        dataSourceName: 'chatbot',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            ...updates,
            updatedAt: new Date().toISOString()
          },
          filter: {
            where: {
              _id: {
                $eq: id
              }
            }
          }
        }
      });
      toast({
        title: t('chatbotUpdated'),
        variant: "success"
      });
      fetchChatbots();
    } catch (error) {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleDeleteChatbot = async id => {
    try {
      await props.$w.cloud.callDataSource({
        dataSourceName: 'chatbot',
        methodName: 'wedaDeleteV2',
        params: {
          filter: {
            where: {
              _id: {
                $eq: id
              }
            }
          }
        }
      });
      toast({
        title: t('chatbotDeleted'),
        variant: "success"
      });
      fetchChatbots();
    } catch (error) {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await props.$w.cloud.callDataSource({
        dataSourceName: 'chatbot',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            status: currentStatus === 'active' ? 'inactive' : 'active',
            updatedAt: new Date().toISOString()
          },
          filter: {
            where: {
              _id: {
                $eq: id
              }
            }
          }
        }
      });
      toast({
        title: t('statusUpdated'),
        variant: "success"
      });
      fetchChatbots();
    } catch (error) {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive"
      });
    }
  };
  useEffect(() => {
    Promise.all([fetchChatbots(), fetchConversations()]).finally(() => {
      setLoading(false);
    });
  }, []);
  if (loading) {
    return <Layout activePage="chatbot" onNavigate={handleNavigate} isDark={isDark} onToggleTheme={toggleTheme}>
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">{t('loading')}</div>
        </div>
      </div>
    </Layout>;
  }
  return <Layout activePage="chatbot" onNavigate={handleNavigate} isDark={isDark} onToggleTheme={toggleTheme}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Bot className="w-8 h-8" />
              {t('chatbotManagement')}
            </h2>
            <p className="text-muted-foreground">Manage your AI chatbots and conversations</p>
          </div>
          <Button onClick={() => setShowCreator(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t('createChatbot')}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="chatbots">Chatbots</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="chatbots">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chatbots.map(chatbot => <ChatbotCard key={chatbot.id} chatbot={chatbot} onUpdate={handleUpdateChatbot} onDelete={handleDeleteChatbot} onToggleStatus={handleToggleStatus} />)}
            </div>
          </TabsContent>

          <TabsContent value="conversations">
            <Card>
              <CardHeader>
                <CardTitle>Recent Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversations.length === 0 ? <div className="text-center text-muted-foreground py-8">
                      No conversations yet
                    </div> : conversations.map(conv => <div key={conv.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span className="font-medium">{conv.contact.name || 'Anonymous'}</span>
                          <Badge variant={conv.status === 'active' ? 'default' : 'secondary'}>
                            {conv.status}
                          </Badge>
                          {conv.unreadCount > 0 && <Badge variant="destructive">
                              {conv.unreadCount}
                            </Badge>}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(conv.lastInteractionAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Platform: {conv.platform} | Priority: {conv.priority}
                      </p>
                      <p className="text-sm">
                        {conv.lastMessage}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {conv.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>)}
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Chatbot Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{conversations.length}</div>
                    <div className="text-sm text-muted-foreground">Total Conversations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {conversations.filter(c => c.unreadCount > 0).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Unread Messages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{chatbots.filter(c => c.status === 'active').length}</div>
                    <div className="text-sm text-muted-foreground">Active Chatbots</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {showCreator && <ChatbotCreator onCreate={handleCreateChatbot} onCancel={() => setShowCreator(false)} />}
      </div>
    </Layout>;
}