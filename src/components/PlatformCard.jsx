// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
// @ts-ignore;
import { CheckCircle, XCircle, RefreshCw, Settings, ExternalLink, Globe, Video, Users } from 'lucide-react';

// @ts-ignore;
import { useTranslation } from '@/lib/i18n';
export function PlatformCard({
  platform,
  onConnect,
  onDisconnect
}) {
  const {
    t
  } = useTranslation();
  const getStatusIcon = status => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };
  const getStatusColor = status => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      case 'syncing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getRegionIcon = region => {
    switch (region) {
      case 'cn':
        return <span className="text-sm">🇨🇳</span>;
      case 'global':
        return <Globe className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };
  const getTypeIcon = type => {
    switch (type) {
      case 'social':
        return <Users className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'professional':
        return <Users className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };
  return <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl" style={{
            backgroundColor: platform.color
          }}>
              {platform.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{platform.displayName || platform.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{platform.description}</p>
            </div>
          </div>
          <Badge className={getStatusColor(platform.status)}>
            {getStatusIcon(platform.status)}
            <span className="ml-1">{t(platform.status)}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              {getRegionIcon(platform.region)}
              <span>{platform.region === 'cn' ? '国内' : '国际'}</span>
            </div>
            <div className="flex items-center gap-1">
              {getTypeIcon(platform.platformType)}
              <span>{platform.platformType}</span>
            </div>
            <div className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {platform.authType}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Features</h4>
            <div className="flex flex-wrap gap-1">
              {platform.features?.map((feature, index) => <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {feature}
                </span>)}
            </div>
          </div>

          {platform.scopes && platform.scopes.length > 0 && <div>
              <h4 className="text-sm font-medium mb-2">Permissions</h4>
              <div className="flex flex-wrap gap-1">
                {platform.scopes.map((scope, index) => <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    {scope}
                  </span>)}
              </div>
            </div>}

          {platform.lastSync && <div className="text-sm text-muted-foreground">
              Last sync: {new Date(platform.lastSync).toLocaleString()}
            </div>}

          <div className="flex gap-2">
            {platform.status === 'connected' ? <>
                <Button size="sm" variant="outline" onClick={() => onDisconnect(platform)}>
                  {t('disconnect')}
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4 mr-1" />
                  {t('settings')}
                </Button>
              </> : <Button size="sm" onClick={() => onConnect(platform)}>
                {t('connectPlatform')}
              </Button>}
          </div>
        </div>
      </CardContent>
    </Card>;
}