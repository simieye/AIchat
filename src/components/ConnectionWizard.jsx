// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button, Input, Label, useToast } from '@/components/ui';
// @ts-ignore;
import { CheckCircle, Loader2, ExternalLink } from 'lucide-react';

// @ts-ignore;
import { useTranslation } from '@/lib/i18n';
const platformConfigs = {
  weibo: {
    fields: ['app_key', 'app_secret', 'access_token', 'uid'],
    authUrl: 'https://api.weibo.com/oauth2/authorize',
    docsUrl: 'https://open.weibo.com/wiki/Oauth2'
  },
  bilibili: {
    fields: ['access_key', 'secret_key', 'sessdata', 'bili_jct'],
    authUrl: 'https://passport.bilibili.com/login/oauth2/authorize',
    docsUrl: 'https://openhome.bilibili.com/doc'
  },
  douyin: {
    fields: ['client_key', 'client_secret', 'access_token', 'open_id'],
    authUrl: 'https://open.douyin.com/platform/oauth/connect',
    docsUrl: 'https://open.douyin.com/platform/doc'
  },
  kuaishou: {
    fields: ['app_id', 'app_secret', 'access_token', 'open_id'],
    authUrl: 'https://open.kuaishou.com/oauth2/authorize',
    docsUrl: 'https://open.kuaishou.com/platform/doc'
  },
  xiaohongshu: {
    fields: ['client_id', 'client_secret', 'access_token', 'user_id'],
    authUrl: 'https://ark.xiaohongshu.com/app/authorize',
    docsUrl: 'https://school.xiaohongshu.com/rule'
  },
  zhihu: {
    fields: ['client_id', 'client_secret', 'access_token', 'uid'],
    authUrl: 'https://www.zhihu.com/oauth2/authorize',
    docsUrl: 'https://open.zhihu.com/wiki'
  },
  twitter: {
    fields: ['api_key', 'api_secret', 'access_token', 'access_token_secret'],
    authUrl: 'https://api.twitter.com/oauth/authorize',
    docsUrl: 'https://developer.twitter.com/en/docs/twitter-api'
  },
  facebook: {
    fields: ['app_id', 'app_secret', 'access_token', 'page_id'],
    authUrl: 'https://www.facebook.com/dialog/oauth',
    docsUrl: 'https://developers.facebook.com/docs'
  },
  instagram: {
    fields: ['app_id', 'app_secret', 'access_token', 'user_id'],
    authUrl: 'https://api.instagram.com/oauth/authorize',
    docsUrl: 'https://developers.facebook.com/docs/instagram'
  },
  linkedin: {
    fields: ['client_id', 'client_secret', 'access_token', 'person_id'],
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    docsUrl: 'https://docs.microsoft.com/en-us/linkedin'
  },
  youtube: {
    fields: ['client_id', 'client_secret', 'access_token', 'refresh_token'],
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    docsUrl: 'https://developers.google.com/youtube/v3'
  },
  tiktok: {
    fields: ['client_key', 'client_secret', 'access_token', 'open_id'],
    authUrl: 'https://www.tiktok.com/v2/auth/authorize',
    docsUrl: 'https://developers.tiktok.com/doc'
  }
};
export function ConnectionWizard({
  platform,
  onComplete,
  onCancel
}) {
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({});
  const [loading, setLoading] = useState(false);
  const {
    t
  } = useTranslation();
  const {
    toast
  } = useToast();
  const platformConfig = platformConfigs[platform.name?.toLowerCase()] || {
    fields: ['api_key', 'api_secret'],
    authUrl: '#',
    docsUrl: '#'
  };
  const handleInputChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleTestConnection = async () => {
    setLoading(true);
    try {
      // 模拟API测试
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: `${platform.displayName || platform.name} ${t('connectionTestSuccess')}`,
        variant: "success"
      });
      setStep(3);
    } catch (error) {
      toast({
        title: `${t('connectionTestFailed')}`,
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onComplete(platform, credentials);
    } catch (error) {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect {platform.displayName || platform.name}</DialogTitle>
          <DialogDescription>
            Follow the steps to connect your {platform.displayName || platform.name} account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: OAuth or API Keys */}
          {step === 1 && <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4" style={{
              backgroundColor: platform.color
            }}>
                  {platform.icon}
                </div>
                <h3 className="font-medium mb-2">Step 1: Authentication</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose your preferred authentication method
                </p>
              </div>

              <div className="space-y-3">
                <Button className="w-full" onClick={() => window.open(platformConfig.authUrl, '_blank')}>
                  OAuth Login
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setStep(2)}>
                  Manual API Keys
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => window.open(platformConfig.docsUrl, '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Documentation
                </Button>
              </div>
            </div>}

          {/* Step 2: API Configuration */}
          {step === 2 && <div className="space-y-4">
              <h3 className="font-medium">Step 2: API Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Enter your {platform.displayName || platform.name} API credentials
              </p>

              {platformConfig.fields.map(field => <div key={field} className="space-y-2">
                  <Label htmlFor={field}>{field.replace('_', ' ').toUpperCase()}</Label>
                  <Input id={field} type={field.includes('secret') || field.includes('token') || field.includes('key') ? 'password' : 'text'} value={credentials[field] || ''} onChange={e => handleInputChange(field, e.target.value)} placeholder={`Enter your ${field}`} />
                </div>)}

              <div className="flex gap-2">
                <Button onClick={handleTestConnection} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test Connection'}
                </Button>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
              </div>
            </div>}

          {/* Step 3: Success */}
          {step === 3 && <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="font-medium">Connection Successful!</h3>
              <p className="text-sm text-muted-foreground">
                Your {platform.displayName || platform.name} account has been successfully connected
              </p>
              <Button onClick={handleSubmit} className="w-full">
                Complete Setup
              </Button>
            </div>}
        </div>
      </DialogContent>
    </Dialog>;
}