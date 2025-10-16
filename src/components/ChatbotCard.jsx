// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Switch } from '@/components/ui';
// @ts-ignore;
import { Edit, Trash2, Play, Pause, Settings, Bot, MessageSquare, Users } from 'lucide-react';

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
  return <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{chatbot.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{chatbot.description}</p>
            </div>
          </div>
          <Badge className={chatbot.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {chatbot.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Platform</span>
            <span className="text-sm font-medium">{chatbot.platform}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Triggers</span>
            <span className="text-sm font-medium">{chatbot.triggers.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Responses</span>
            <span className="text-sm font-medium">{chatbot.responses.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Switch checked={chatbot.status === 'active'} onCheckedChange={() => onToggleStatus(chatbot.id, chatbot.status)} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onUpdate(chatbot.id, chatbot)}>
              <Edit className="w-4 h-4 mr-1" />
              {t('edit')}
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(chatbot.id)}>
              <Trash2 className="w-4 h-4 mr-1" />
              {t('delete')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
}