// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
// @ts-ignore;
import { CheckCircle, XCircle, Clock, RefreshCw, Unlink } from 'lucide-react';

export function PlatformCard({
  platform,
  onReconnect,
  onDisconnect
}) {
  const getStatusColor = status => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'disconnected':
        return 'bg-red-500';
      case 'syncing':
        return 'bg-blue-500';
      case 'error':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };
  const getPlatformIcon = type => {
    switch (type?.toLowerCase()) {
      case 'whatsapp':
        return '💬';
      case 'facebook':
        return '👤';
      case 'instagram':
        return '📸';
      case 'google_analytics':
        return '📊';
      default:
        return '🔗';
    }
  };
  return <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getPlatformIcon(platform.type)}</span>
            <div>
              <CardTitle className="text-lg">{platform.name}</CardTitle>
              <Badge className={getStatusColor(platform.status)}>{platform.status}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Last sync: {platform.lastSync}</p>
            <p className="text-sm text-muted-foreground">Account: {platform.account}</p>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onReconnect(platform.id)}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Reconnect
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDisconnect(platform.id)}>
              <Unlink className="w-4 h-4 mr-1" />
              Disconnect
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
}