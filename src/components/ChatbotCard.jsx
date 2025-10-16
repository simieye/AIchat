// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
// @ts-ignore;
import { Play, Pause, Edit, Trash2, MessageSquare, Clock, TrendingUp } from 'lucide-react';

// @ts-ignore;
import { useTranslation } from '@/lib/i18n';
export function ChatbotCard({
  chatbot,
  onUpdate,
  onDelete,
  onToggleStatus
}) {
  const {
    t
  } = useTranslation();
  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{chatbot.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{chatbot.description}</p>
          </div>
          <Badge className={getStatusColor(chatbot.status)}>
            {chatbot.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Conversations</span>
              </div>
              <div className="text-lg font-semibold">{chatbot.totalConversations}</div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Messages</span>
              </div>
              <div className="text-lg font-semibold">{chatbot.totalMessages}</div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Response Rate</span>
              </div>
              <div className="text-lg font-semibold">{chatbot.responseRate}%</div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Avg Time</span>
              </div>
              <div className="text-lg font-semibold">{chatbot.averageResponseTime}s</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Platform: {chatbot.platform}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onToggleStatus(chatbot.id, chatbot.status)}>
                {chatbot.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="outline" onClick={() => onUpdate(chatbot.id, chatbot)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => onDelete(chatbot.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
}