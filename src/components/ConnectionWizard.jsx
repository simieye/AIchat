// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge } from '@/components/ui';
// @ts-ignore;
import { Plus, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function ConnectionWizard({
  onConnect
}) {
  const [step, setStep] = useState(1);
  const [connection, setConnection] = useState({
    platform: '',
    name: '',
    apiKey: '',
    token: '',
    webhook: ''
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const platforms = [{
    value: 'whatsapp_business',
    label: 'WhatsApp Business',
    icon: '💬',
    fields: ['apiKey', 'token', 'webhook']
  }, {
    value: 'facebook_messenger',
    label: 'Facebook Messenger',
    icon: '👤',
    fields: ['apiKey', 'token']
  }, {
    value: 'instagram_messenger',
    label: 'Instagram Messenger',
    icon: '📸',
    fields: ['apiKey', 'token']
  }, {
    value: 'google_analytics',
    label: 'Google Analytics',
    icon: '📊',
    fields: ['apiKey']
  }];
  const selectedPlatform = platforms.find(p => p.value === connection.platform);
  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    // 模拟测试连接
    setTimeout(() => {
      setTesting(false);
      setTestResult(Math.random() > 0.2 ? 'success' : 'error');
    }, 2000);
  };
  const handleConnect = () => {
    if (connection.platform && connection.name && connection.apiKey) {
      onConnect({
        ...connection,
        id: Date.now().toString(),
        status: 'connected',
        lastSync: new Date().toLocaleString()
      });
      setConnection({
        platform: '',
        name: '',
        apiKey: '',
        token: '',
        webhook: ''
      });
      setStep(1);
    }
  };
  return <Card>
      <CardHeader>
        <CardTitle>Add New Platform</CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={step >= 1 ? "default" : "outline"}>1. Select</Badge>
          <Badge variant={step >= 2 ? "default" : "outline"}>2. Configure</Badge>
          <Badge variant={step >= 3 ? "default" : "outline"}>3. Test</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {step === 1 && <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Choose Platform</label>
              <Select value={connection.platform} onValueChange={value => setConnection({
            ...connection,
            platform: value
          })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(platform => <SelectItem key={platform.value} value={platform.value}>
                      <span className="flex items-center gap-2">
                        <span>{platform.icon}</span>
                        <span>{platform.label}</span>
                      </span>
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setStep(2)} disabled={!connection.platform}>
              Next: Configure
            </Button>
          </div>}
        {step === 2 && selectedPlatform && <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Connection Name</label>
              <Input placeholder="e.g., Main WhatsApp Account" value={connection.name} onChange={e => setConnection({
            ...connection,
            name: e.target.value
          })} />
            </div>
            <div>
              <label className="text-sm font-medium">API Key</label>
              <Input placeholder="Enter your API key" value={connection.apiKey} onChange={e => setConnection({
            ...connection,
            apiKey: e.target.value
          })} />
            </div>
            {selectedPlatform.fields.includes('token') && <div>
                <label className="text-sm font-medium">Access Token</label>
                <Input placeholder="Enter access token" value={connection.token} onChange={e => setConnection({
            ...connection,
            token: e.target.value
          })} />
              </div>}
            {selectedPlatform.fields.includes('webhook') && <div>
                <label className="text-sm font-medium">Webhook URL</label>
                <Input placeholder="https://your-domain.com/webhook" value={connection.webhook} onChange={e => setConnection({
            ...connection,
            webhook: e.target.value
          })} />
              </div>}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>
                Next: Test Connection
              </Button>
            </div>
          </div>}
        {step === 3 && <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Test Connection</h4>
              <div className="flex items-center gap-2">
                <Button onClick={testConnection} disabled={testing}>
                  {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test Connection'}
                </Button>
                {testResult === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {testResult === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
              </div>
              {testResult && <p className={`text-sm mt-2 ${testResult === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {testResult === 'success' ? 'Connection successful!' : 'Connection failed. Please check your credentials.'}
                </p>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={handleConnect} disabled={testResult !== 'success'}>
                Connect Platform
              </Button>
            </div>
          </div>}
      </CardContent>
    </Card>;
}