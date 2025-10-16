// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
// @ts-ignore;
import { Key, Globe, Shield, CheckCircle } from 'lucide-react';

// @ts-ignore;
import { PlatformIcon } from '@/components/PlatformIcons';
// @ts-ignore;
import { useTranslation } from '@/lib/i18n';
export function EnhancedConnectionWizard({
  platform,
  isOpen,
  onClose,
  onConnect
}) {
  const [step, setStep] = useState(1);
  const [authMethod, setAuthMethod] = useState('oauth');
  const [credentials, setCredentials] = useState({
    apiKey: '',
    apiSecret: '',
    accessToken: '',
    refreshToken: '',
    webhookUrl: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const {
    t
  } = useTranslation();
  const handleOAuthFlow = async () => {
    setLoading(true);
    // 模拟OAuth流程
    setTimeout(() => {
      setStep(3);
      setLoading(false);
    }, 2000);
  };
  const handleTokenAuth = async () => {
    setLoading(true);
    // 模拟Token验证
    setTimeout(() => {
      onConnect({
        platform: platform.id,
        credentials,
        authMethod: 'token'
      });
      setLoading(false);
      onClose();
    }, 1500);
  };
  const handleConnect = async () => {
    if (authMethod === 'oauth') {
      await handleOAuthFlow();
    } else {
      await handleTokenAuth();
    }
  };
  const renderOAuthFlow = () => <div className="space-y-4">
      <div className="text-center">
        <PlatformIcon platform={platform.id} size={48} />
        <h3 className="text-lg font-semibold mt-2">{platform.name} OAuth</h3>
        <p className="text-muted-foreground">Connect your {platform.name} account securely</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm">Secure OAuth 2.0 authentication</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          <span className="text-sm">No password required</span>
        </div>
      </div>
      <Button onClick={handleOAuthFlow} disabled={loading} className="w-full">
        {loading ? 'Connecting...' : `Connect ${platform.name}`}
      </Button>
    </div>;
  const renderTokenAuth = () => <div className="space-y-4">
      <div className="text-center">
        <PlatformIcon platform={platform.id} size={48} />
        <h3 className="text-lg font-semibold mt-2">{platform.name} API Token</h3>
        <p className="text-muted-foreground">Enter your API credentials</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">API Key</label>
          <Input placeholder="Enter your API key" value={credentials.apiKey} onChange={e => setCredentials({
          ...credentials,
          apiKey: e.target.value
        })} />
        </div>
        {platform.authType === 'oauth' && <div>
            <label className="text-sm font-medium">API Secret</label>
            <Input type="password" placeholder="Enter your API secret" value={credentials.apiSecret} onChange={e => setCredentials({
          ...credentials,
          apiSecret: e.target.value
        })} />
          </div>}
        <div>
          <label className="text-sm font-medium">Access Token</label>
          <Input placeholder="Enter your access token" value={credentials.accessToken} onChange={e => setCredentials({
          ...credentials,
          accessToken: e.target.value
        })} />
        </div>
      </div>
      <Button onClick={handleTokenAuth} disabled={loading} className="w-full">
        {loading ? 'Validating...' : 'Connect'}
      </Button>
    </div>;
  const renderSuccess = () => <div className="text-center space-y-4">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      <h3 className="text-xl font-semibold">Connected Successfully!</h3>
      <p className="text-muted-foreground">
        Your {platform.name} account has been connected successfully.
      </p>
      <Button onClick={onClose} className="w-full">
        Done
      </Button>
    </div>;
  if (!isOpen || !platform) return null;
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Connect {platform.name}
          </DialogTitle>
          <DialogDescription>
            Choose your preferred authentication method
          </DialogDescription>
        </DialogHeader>
        
        {step === 1 && <div className="space-y-4">
            <Tabs value={authMethod} onValueChange={setAuthMethod}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="oauth">
                  <Globe className="w-4 h-4 mr-2" />
                  OAuth
                </TabsTrigger>
                <TabsTrigger value="token">
                  <Key className="w-4 h-4 mr-2" />
                  API Token
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="oauth" className="mt-4">
                {renderOAuthFlow()}
              </TabsContent>
              
              <TabsContent value="token" className="mt-4">
                {renderTokenAuth()}
              </TabsContent>
            </Tabs>
          </div>}
        
        {step === 3 && renderSuccess()}
      </DialogContent>
    </Dialog>;
}