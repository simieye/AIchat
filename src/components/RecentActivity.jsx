// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
// @ts-ignore;
import { User, MessageCircle, Clock } from 'lucide-react';

export function RecentActivity({
  activities
}) {
  const getActivityIcon = type => {
    switch (type) {
      case 'lead':
        return <User className="h-4 w-4" />;
      case 'message':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  const getActivityColor = type => {
    switch (type) {
      case 'lead':
        return 'text-blue-500';
      case 'message':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };
  return <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? <div className="text-center text-muted-foreground py-8">
              No recent activity
            </div> : activities.map(activity => <div key={activity.id} className="flex items-start space-x-3">
              <div className={`mt-1 ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                {activity.unreadCount && activity.unreadCount > 0 && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {activity.unreadCount} unread
                  </span>}
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}