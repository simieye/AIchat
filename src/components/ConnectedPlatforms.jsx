// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
// @ts-ignore;
import { RefreshCw, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';

// @ts-ignore;
import { PlatformIcon } from '@/components/PlatformIcons';
// @ts-ignore;
import { useTranslation } from '@/lib/i18n';
export function ConnectedPlatforms({
  platforms,
  onReconnect,
  onDisconnect
}) {
  const {
    t
  } = useTranslation();
  const getStatusIcon = status => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'syncing':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };
  const getStatusColor = status => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50';
      case 'disconnected':
        return 'text-red-600 bg-red-50';
      case 'syncing':
        return 'text-blue-600 bg-blue-50';
      case 'error':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };
  if (platforms.length === 0) {
    return <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">{t('noConnectedPlatforms')}</div>
        <p className="text-sm text-muted-foreground">{t('connectPlatformsToStart')}</p>
      </div>;
  }
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {platforms.map(platform => <Card key={platform.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PlatformIcon platform={platform.platform} size={32} />
                <div>
                  <CardTitle className="text-lg">{platform.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{platform.account}</p>
                  {platform.accountEmail && <p className="text-xs text-muted-foreground">{platform.accountEmail}</p>}
                </div>
              </div>
              {getStatusIcon(platform.status)}
            </div>
            {platform.errorMessage && <p className="text-xs text-red-600 mt-2">{platform.errorMessage}</p>}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(platform.status)}`}>
                  {t(platform.status)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>{t('lastSync')}: {platform.lastSync}</div>
                {platform.connectedAt && <div>{t('connectedAt')}: {new Date(platform.connectedAt).toLocaleString()}</div>}
                {platform.expiresAt && <div>{t('expiresAt')}: {new Date(platform.expiresAt).toLocaleString()}</div>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onReconnect(platform.id)} disabled={platform.status === 'syncing'}>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  {t('reconnect')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDisconnect(platform.id)} disabled={platform.status === 'syncing'}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  {t('disconnect')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>)}
    </div>;
}