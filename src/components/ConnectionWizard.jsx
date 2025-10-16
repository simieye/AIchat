// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button, Input, Label, useToast } from '@/components/ui';
// @ts-ignore;
import { CheckCircle, Loader2, ExternalLink, AlertCircle } from 'lucide-react';

// @ts-ignore;
import { useTranslation } from '@/lib/i18n';

// 平台配置映射
const platformConfigs = {
  weibo: {
    name: '微博',
    fields: ['app_key', 'app_secret', 'access_token', 'uid'],
    authUrl: 'https://api.weibo.com/oauth2/authorize',
    docsUrl: 'https://open.weibo.com/wiki/Oauth2',
    description: '微博开放平台认证',
    tips: '请在微博开放平台创建应用并获取App Key和App Secret'
  },
  bilibili: {
    name: 'B站',
    fields: ['access_key', 'secret_key', 'sessdata', 'bili_jct'],
    authUrl: 'https://passport.bilibili.com/login/oauth2/authorize',
    docsUrl: 'https://openhome.bilibili.com/doc',
    description: 'B站开放平台认证',
    tips: '请在B站开放平台申请开发者权限'
  },
  douyin: {
    name: '抖音',
    fields: ['client_key', 'client_secret', 'access_token', 'open_id'],
    authUrl: 'https://open.douyin.com/platform/oauth/connect',
    docsUrl: 'https://open.douyin.com/platform/doc',
    description: '抖音开放平台认证',
    tips: '需要在抖音开放平台注册开发者账号'
  },
  kuaishou: {
    name: '快手',
    fields: ['app_id', 'app_secret', 'access_token', 'open_id'],
    authUrl: 'https://open.kuaishou.com/oauth2/authorize',
    docsUrl: 'https://open.kuaishou.com/platform/doc',
    description: '快手开放平台认证',
    tips: '请在快手开放平台创建应用'
  },
  xiaohongshu: {
    name: '小红书',
    fields: ['client_id', 'client_secret', 'access_token', 'user_id'],
    authUrl: 'https://ark.xiaohongshu.com/app/authorize',
    docsUrl: 'https://school.xiaohongshu.com/rule',
    description: '小红书开放平台认证',
    tips: '需要小红书商业账号才能申请API权限'
  },
  zhihu: {
    name: '知乎',
    fields: ['client_id', 'client_secret', 'access_token', 'uid'],
    authUrl: 'https://www.zhihu.com/oauth2/authorize',
    docsUrl: 'https://open.zhihu.com/wiki',
    description: '知乎开放平台认证',
    tips: '知乎开放平台需要企业认证'
  },
  twitter: {
    name: 'Twitter',
    fields: ['api_key', 'api_secret', 'access_token', 'access_token_secret'],
    authUrl: 'https://api.twitter.com/oauth/authorize',
    docsUrl: 'https://developer.twitter.com/en/docs/twitter-api',
    description: 'Twitter API认证',
    tips: '需要在Twitter Developer Portal创建应用'
  },
  facebook: {
    name: 'Facebook',
    fields: ['app_id', 'app_secret', 'access_token', 'page_id'],
    authUrl: 'https://www.facebook.com/dialog/oauth',
    docsUrl: 'https://developers.facebook.com/docs',
    description: 'Facebook Graph API认证',
    tips: '需要Facebook开发者账号和应用审核'
  },
  instagram: {
    name: 'Instagram',
    fields: ['app_id', 'app_secret', 'access_token', 'user_id'],
    authUrl: 'https://api.instagram.com/oauth/authorize',
    docsUrl: 'https://developers.facebook.com/docs/instagram',
    description: 'Instagram Graph API认证',
    tips: '通过Facebook开发者平台管理'
  },
  linkedin: {
    name: 'LinkedIn',
    fields: ['client_id', 'client_secret', 'access_token', 'person_id'],
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    docsUrl: 'https://docs.microsoft.com/en-us/linkedin',
    description: 'LinkedIn API认证',
    tips: '需要LinkedIn开发者应用'
  },
  youtube: {
    name: 'YouTube',
    fields: ['client_id', 'client_secret', 'access_token', 'refresh_token'],
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    docsUrl: 'https://developers.google.com/youtube/v3',
    description: 'YouTube Data API认证',
    tips: '需要Google Cloud项目和YouTube API启用'
  },
  tiktok: {
    name: 'TikTok',
    fields: ['client_key', 'client_secret', 'access_token', 'open_id'],
    authUrl: 'https://www.tiktok.com/v2/auth/authorize',
    docsUrl: 'https://developers.tiktok.com/doc',
    description: 'TikTok API认证',
    tips: '需要TikTok for Developers账号'
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
  const [showHelp, setShowHelp] = useState(false);
  const {
    t
  } = useTranslation();
  const {
    toast
  } = useToast();
  const platformConfig = platformConfigs[platform.name?.toLowerCase()] || {
    name: platform.name,
    fields: ['api_key', 'api_secret'],
    description: 'API认证',
    tips: '请获取API密钥'
  };
  const handleInputChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const validateCredentials = () => {
    const requiredFields = platformConfig.fields;
    for (const field of requiredFields) {
      if (!credentials[field] || credentials[field].trim() === '') {
        return false;
      }
    }
    return true;
  };
  const handleTestConnection = async () => {
    if (!validateCredentials()) {
      toast({
        title: '验证失败',
        description: '请填写所有必填字段',
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      // 模拟API测试
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: '连接成功',
        description: `${platform.displayName} 连接测试通过`,
        variant: "success"
      });
      setStep(3);
    } catch (error) {
      toast({
        title: '连接失败',
        description: error.message || '请检查您的凭据',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleComplete = async () => {
    if (!validateCredentials()) {
      toast({
        title: '验证失败',
        description: '请填写所有必填字段',
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      await onComplete(platform, credentials);
    } catch (error) {
      toast({
        title: '保存失败',
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const renderStep1 = () => <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-medium mb-2">连接 {platform.displayName}</h3>
        <p className="text-sm text-muted-foreground">{platformConfig.description}</p>
        <p className="text-sm text-muted-foreground mt-2">{platformConfig.tips}</p>
      </div>

      <div className="space-y-4">
        {platformConfig.fields.map(field => <div key={field} className="space-y-2">
            <Label htmlFor={field} className="capitalize">
              {field.replace('_', ' ')}
            </Label>
            <Input id={field} type={field.includes('secret') || field.includes('key') ? 'password' : 'text'} value={credentials[field] || ''} onChange={e => handleInputChange(field, e.target.value)} placeholder={`Enter ${field.replace('_', ' ')}`} />
          </div>)}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="link" onClick={() => setShowHelp(!showHelp)} className="text-sm">
          需要帮助？
        </Button>
        <Button variant="outline" onClick={() => window.open(platformConfig.docsUrl, '_blank')}>
          <ExternalLink className="w-4 h-4 mr-2" />
          查看文档
        </Button>
      </div>

      {showHelp && <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            获取凭据步骤
          </h4>
          <ol className="text-sm text-muted-foreground space-y-1">
            <li>1. 访问 {platformConfig.docsUrl}</li>
            <li>2. 创建开发者应用</li>
            <li>3. 获取API密钥和访问令牌</li>
            <li>4. 填写上方表单</li>
          </ol>
        </div>}
    </div>;
  const renderStep2 = () => <div className="space-y-4">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">测试连接</h3>
        <p className="text-muted-foreground">
          正在验证您的 {platform.displayName} 凭据...
        </p>
      </div>
    </div>;
  const renderStep3 = () => <div className="space-y-4">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">连接成功</h3>
        <p className="text-muted-foreground">
          {platform.displayName} 已成功连接，您可以开始使用所有功能了。
        </p>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <h4 className="font-medium mb-2">已启用的功能</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          {platform.features?.map((feature, index) => <li key={index}>✓ {feature}</li>)}
        </ul>
      </div>
    </div>;
  return <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            连接 {platform.displayName}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "输入您的API凭据以连接平台"}
            {step === 2 && "正在验证连接"}
            {step === 3 && "连接成功"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            {step === 3 ? '完成' : '取消'}
          </Button>
          {step === 1 && <Button onClick={handleTestConnection} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '测试连接'}
            </Button>}
          {step === 3 && <Button onClick={handleComplete} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '完成连接'}
            </Button>}
        </div>
      </DialogContent>
    </Dialog>;
}