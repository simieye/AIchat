// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
// @ts-ignore;
import { Clock, User, MessageSquare } from 'lucide-react';

export function RecentActivity({
  activities
}) {
  const getIcon = type => {
    switch (type) {
      case 'lead':
        return <User className="w-4 h-4" />;
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };
  return <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map(activity => <div key={activity.id} className="flex items-start space-x-4">
              <div className="bg-primary/10 p-2 rounded-full">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>)}
          {activities.length === 0 && <div className="text-center text-muted-foreground py-8">
              No recent activity
            </div>}
        </div>
      </CardContent>
    </Card>;
}