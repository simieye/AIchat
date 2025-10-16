// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
// @ts-ignore;
import { CheckCircle, XCircle, Plus } from 'lucide-react';

// @ts-ignore;
import { PlatformIcon } from '@/components/PlatformIcons';
// @ts-ignore;
import { useTranslation } from '@/lib/i18n';
const platforms = [{
  id: 'weibo',
  name: '微博',
  englishName: 'Weibo',
  color: '#E6162D',
  description: '新浪微博开放平台',
  authType: 'oauth'
}, {
  id: 'bilibili',
  name: '哔哩哔哩',
  englishName: 'Bilibili',
  color: '#00A1D6',
  description: 'B站开放平台',
  authType: 'oauth'
}, {
  id: 'douyin',
  name: '抖音',
  englishName: 'Douyin',
  color: '#000000',
  description: '抖音开放平台',
  authType: 'oauth'
}, {
  id: 'kuaishou',
  name: '快手',
  englishName: 'Kuaishou',
  color: '#FF6B00',
  description: '快手开放平台',
  authType: 'oauth'
}, {
  id: 'xiaohongshu',
  name: '小红书',
  englishName: 'Xiaohongshu',
  color: '#FF2442',
  description: '小红书开放平台',
  authType: 'oauth'
}, {
  id: 'facebook',
  name: 'Facebook',
  englishName: 'Facebook',
  color: '#1877F2',
  description: 'Facebook Graph API',
  authType: 'oauth'
}, {
  id: 'instagram',
  name: 'Instagram',
  englishName: 'Instagram',
  color: '#E4405F',
  description: 'Instagram Graph API',
  authType: 'oauth'
}, {
  id: 'twitter',
  name: 'Twitter',
  englishName: 'Twitter',
  color: '#1DA1F2',
  description: 'Twitter API v2',
  authType: 'oauth'
}, {
  id: 'linkedin',
  name: 'LinkedIn',
  englishName: 'LinkedIn',
  color: '#0077B5',
  description: 'LinkedIn API',
  authType: 'oauth'
}, {
  id: 'youtube',
  name: 'YouTube',
  englishName: 'YouTube',
  color: '#FF0000',
  description: 'YouTube Data API',
  authType: 'oauth'
}, {
  id: 'whatsapp',
  name: 'WhatsApp',
  englishName: 'WhatsApp',
  color: '#25D366',
  description: 'WhatsApp Business API',
  authType: 'token'
}, {
  id: 'tiktok',
  name: 'TikTok',
  englishName: 'TikTok',
  color: '#000000',
  description: 'TikTok for Developers',
  authType: 'oauth'
}];
export function PlatformGrid({
  connectedPlatforms,
  onConnect
}) {
  const {
    t
  } = useTranslation();
  const isConnected = platformId => {
    return connectedPlatforms.some(p => p.platform === platformId);
  };
  const getConnectionStatus = platformId => {
    const platform = connectedPlatforms.find(p => p.platform === platformId);
    return platform ? platform.status : 'disconnected';
  };
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {platforms.map(platform => {
      const connected = isConnected(platform.id);
      const status = getConnectionStatus(platform.id);
      return <Card key={platform.id} className="hover:shadow-lg transition-shadow" style={{
        borderTop: `4px solid ${platform.color}`
      }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PlatformIcon platform={platform.id} size={32} />
                <div>
                  <CardTitle className="text-lg">{platform.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{platform.englishName}</p>
                </div>
              </div>
              {connected ? status === 'connected' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" /> : null}
            </div>
            <p className="text-sm text-muted-foreground mt-2">{platform.description}</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                {connected ? <span className={`px-2 py-1 rounded-full text-xs ${status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {status === 'connected' ? t('connected') : t('disconnected')}
                  </span> : <span className="text-muted-foreground text-xs">{t('notConnected')}</span>}
              </div>
              <Button size="sm" variant={connected ? "outline" : "default"} onClick={() => onConnect(platform)}>
                {connected ? t('manage') : <><Plus className="w-4 h-4 mr-1" />{t('connect')}</>}
              </Button>
            </div>
          </CardContent>
        </Card>;
    })}
    </div>;
}