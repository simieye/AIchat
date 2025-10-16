// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, ScrollArea, Avatar, AvatarFallback, AvatarImage, useToast } from '@/components/ui';
// @ts-ignore;
import { MessageCircle, Send } from 'lucide-react';

import { Layout } from '@/components/Layout';
export default function Chatbot(props) {
  const [isDark, setIsDark] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
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
  const fetchConversations = async () => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'conversation',
        methodName: 'wedaGetRecordsV2',
        params: {
          orderBy: [{
            last_interaction_at: 'desc'
          }],
          getCount: true
        }
      });
      if (result.records) {
        setConversations(result.records);
        if (result.records.length > 0 && !selectedConversation) {
          setSelectedConversation(result.records[0]);
        }
      }
    } catch (error) {
      toast({
        title: "Error loading conversations",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const fetchMessages = async conversationId => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'conversation',
        methodName: 'wedaGetItemV2',
        params: {
          filter: {
            where: {
              _id: {
                $eq: conversationId
              }
            }
          },
          select: {
            messages: true
          }
        }
      });
      if (result) {
        setMessages(result.messages || []);
      }
    } catch (error) {
      toast({
        title: "Error loading messages",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  useEffect(() => {
    fetchConversations();
    setLoading(false);
  }, []);
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      const newMsg = {
        role: 'bot',
        text: newMessage,
        timestamp: new Date().toISOString()
      };
      const updatedMessages = [...messages, newMsg];
      await props.$w.cloud.callDataSource({
        dataSourceName: 'conversation',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            messages: updatedMessages,
            last_message: newMessage,
            last_interaction_at: new Date().toISOString()
          },
          filter: {
            where: {
              _id: {
                $eq: selectedConversation._id
              }
            }
          }
        }
      });
      setMessages(updatedMessages);
      setNewMessage('');
      fetchConversations(); // 刷新对话列表
    } catch (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const filteredConversations = conversations.filter(conv => selectedPlatform === 'all' || conv.platform.toLowerCase() === selectedPlatform);
  const getPlatformColor = platform => {
    switch (platform?.toLowerCase()) {
      case 'whatsapp':
        return 'bg-green-500';
      case 'facebook':
        return 'bg-blue-500';
      case 'instagram':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };
  if (loading) {
    return <Layout activePage="chatbot" onNavigate={handleNavigate} isDark={isDark} onToggleTheme={toggleTheme}>
      <div className="flex h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading conversations...</div>
        </div>
      </div>
    </Layout>;
  }
  return <Layout activePage="chatbot" onNavigate={handleNavigate} isDark={isDark} onToggleTheme={toggleTheme}>
      <div className="flex h-full">
        {/* Conversations List */}
        <div className="w-96 border-r border-border">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Conversations</h2>
              <Badge variant="secondary">{filteredConversations.length} active</Badge>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ScrollArea className="h-[calc(100%-120px)]">
            {filteredConversations.map(conv => <div key={conv._id} className={`p-4 border-b border-border cursor-pointer hover:bg-accent/50 ${selectedConversation?._id === conv._id ? 'bg-accent' : ''}`} onClick={() => setSelectedConversation(conv)}>
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={conv.contact?.avatar} />
                    <AvatarFallback>{conv.contact?.name?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conv.contact?.name || 'Unknown'}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(conv.last_interaction_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.last_message || 'No messages'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${getPlatformColor(conv.platform)} text-white text-xs`}>
                        {conv.platform}
                      </Badge>
                      {conv.unread_count > 0 && <Badge variant="destructive" className="text-xs">
                          {conv.unread_count}
                        </Badge>}
                    </div>
                  </div>
                </div>
              </div>)}
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? <>
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedConversation.contact?.avatar} />
                    <AvatarFallback>{selectedConversation.contact?.name?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedConversation.contact?.name || 'Unknown'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.platform} • {selectedConversation.status}
                    </p>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, idx) => <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                        </p>
                      </div>
                    </div>)}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input placeholder="Type a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </> : <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a conversation to start chatting</p>
              </div>
            </div>}
        </div>
      </div>
    </Layout>;
}