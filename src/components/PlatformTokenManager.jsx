// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Switch, Badge } from '@/components/ui';
// @ts-ignore;
import { Globe, Plus, Trash2 } from 'lucide-react';

export function PlatformTokenManager() {
  const [platformTokens, setPlatformTokens] = useState([{
    id: '1',
    platform: 'WhatsApp',
    token: 'WA-...token123',
    webhook: 'https://api.example.com/webhook/whatsapp',
    status: 'connected'
  }, {
    id: '2',
    platform: 'Facebook',
    token: 'FB-...token456',
    webhook: 'https://api.example.com/webhook/facebook',
    status: 'connected'
  }, {
    id: '3',
    platform: 'Instagram',
    token: 'IG-...token789',
    webhook: 'https://api.example.com/webhook/instagram',
    status: 'disconnected'
  }]);
  const [newToken, setNewToken] = useState({
    platform: '',
    token: '',
    webhook: ''
  });
  const platforms = ['WhatsApp', 'Facebook', 'Instagram'];
  const handleAddToken = () => {
    if (newToken.platform && newToken.token && newToken.webhook) {
      const token = {
        id: Date.now().toString(),
        ...newToken,
        status: 'connected'
      };
      setPlatformTokens([...platformTokens, token]);
      setNewToken({
        platform: '',
        token: '',
        webhook: ''
      });
    }
  };
  const handleDeleteToken = id => {
    setPlatformTokens(platformTokens.filter(token => token.id !== id));
  };
  const handleToggleStatus = id => {
    setPlatformTokens(platformTokens.map(token => token.id === id ? {
      ...token,
      status: token.status === 'connected' ? 'disconnected' : 'connected'
    } : token));
  };
  const getStatusColor = status => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'disconnected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  return <Card>
      <CardHeader>
        <CardTitle>Platform Tokens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {platformTokens.map(token => <div key={token.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="font-medium">{token.platform}</span>
                <Badge className={getStatusColor(token.status)}>{token.status}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={token.status === 'connected'} onCheckedChange={() => handleToggleStatus(token.id)} />
                <Button variant="ghost" size="sm" onClick={() => handleDeleteToken(token.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Token</label>
              <Input value={token.token} readOnly className="font-mono text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">Webhook URL</label>
              <Input value={token.webhook} readOnly className="font-mono text-sm" />
            </div>
          </div>)}
        <div className="p-4 border rounded-lg space-y-3">
          <h4 className="font-medium">Add New Platform</h4>
          <select className="w-full p-2 border rounded-md" value={newToken.platform} onChange={e => setNewToken({
          ...newToken,
          platform: e.target.value
        })}>
            <option value="">Select Platform</option>
            {platforms.map(platform => <option key={platform} value={platform}>
                {platform}
              </option>)}
          </select>
          <Input placeholder="Access Token" value={newToken.token} onChange={e => setNewToken({
          ...newToken,
          token: e.target.value
        })} />
          <Input placeholder="Webhook URL" value={newToken.webhook} onChange={e => setNewToken({
          ...newToken,
          webhook: e.target.value
        })} />
          <Button onClick={handleAddToken} disabled={!newToken.platform || !newToken.token || !newToken.webhook} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Platform
          </Button>
        </div>
      </CardContent>
    </Card>;
}