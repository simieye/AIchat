// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Switch, Badge } from '@/components/ui';
// @ts-ignore;
import { Play, Pause, Clock, Tag, MessageSquare } from 'lucide-react';

export function WorkflowCard({
  workflow,
  onToggleStatus
}) {
  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
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
  return <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{workflow.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(workflow.status)}>{workflow.status}</Badge>
            <Switch checked={workflow.enabled} onCheckedChange={() => onToggleStatus(workflow.id)} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Trigger Conditions</h4>
            <div className="flex flex-wrap gap-2">
              {workflow.conditions.tags.map(tag => <Badge key={tag} variant="outline">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>)}
              <Badge className={getPlatformColor(workflow.conditions.platform)}>
                {workflow.conditions.platform}
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Action</h4>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{workflow.action.type}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{workflow.action.message}</p>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last run: {workflow.lastRun}
            </span>
            <span>{workflow.runCount} runs</span>
          </div>
        </div>
      </CardContent>
    </Card>;
}