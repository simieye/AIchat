// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from '@/components/ui';
// @ts-ignore;
import { Calendar, Clock, Users, Send, Eye } from 'lucide-react';

export function BroadcastHistory({
  broadcasts
}) {
  const getStatusColor = status => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'scheduled':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  return <div className="space-y-4">
      {broadcasts.map(broadcast => <Card key={broadcast.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{broadcast.name}</CardTitle>
              <Badge className={getStatusColor(broadcast.status)}>
                {broadcast.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{broadcast.message}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {broadcast.created}
                  </span>
                  <span className="flex items-center gap-1">
                    <Send className="w-4 h-4" />
                    {broadcast.platform}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {broadcast.tags.join(', ')}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Delivery Rate</span>
                    <span>{(broadcast.stats.delivered / broadcast.stats.sent * 100 || 0).toFixed(1)}%</span>
                  </div>
                  <Progress value={broadcast.stats.delivered / broadcast.stats.sent * 100 || 0} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Open Rate</span>
                    <span>{(broadcast.stats.opened / broadcast.stats.delivered * 100 || 0).toFixed(1)}%</span>
                  </div>
                  <Progress value={broadcast.stats.opened / broadcast.stats.delivered * 100 || 0} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Click Rate</span>
                    <span>{(broadcast.stats.clicked / broadcast.stats.delivered * 100 || 0).toFixed(1)}%</span>
                  </div>
                  <Progress value={broadcast.stats.clicked / broadcast.stats.delivered * 100 || 0} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>)}
    </div>;
}