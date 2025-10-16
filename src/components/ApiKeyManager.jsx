// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Switch, Badge } from '@/components/ui';
// @ts-ignore;
import { Key, Plus, Trash2, Save } from 'lucide-react';

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState([{
    id: '1',
    name: 'OpenAI API',
    key: 'sk-...abcd',
    status: 'active'
  }, {
    id: '2',
    name: 'Google Analytics',
    key: 'GA-...xyz789',
    status: 'active'
  }, {
    id: '3',
    name: 'Facebook API',
    key: 'FB-...123456',
    status: 'inactive'
  }]);
  const [newApiKey, setNewApiKey] = useState({
    name: '',
    key: ''
  });
  const [editingId, setEditingId] = useState(null);
  const handleAddApiKey = () => {
    if (newApiKey.name && newApiKey.key) {
      const apiKey = {
        id: Date.now().toString(),
        ...newApiKey,
        status: 'active'
      };
      setApiKeys([...apiKeys, apiKey]);
      setNewApiKey({
        name: '',
        key: ''
      });
    }
  };
  const handleDeleteApiKey = id => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };
  const handleToggleStatus = id => {
    setApiKeys(apiKeys.map(key => key.id === id ? {
      ...key,
      status: key.status === 'active' ? 'inactive' : 'active'
    } : key));
  };
  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  return <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiKeys.map(api => <div key={api.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                <span className="font-medium">{api.name}</span>
                <Badge className={getStatusColor(api.status)}>{api.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1 font-mono">{api.key}</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={api.status === 'active'} onCheckedChange={() => handleToggleStatus(api.id)} />
              <Button variant="ghost" size="sm" onClick={() => handleDeleteApiKey(api.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>)}
        <div className="p-4 border rounded-lg space-y-3">
          <h4 className="font-medium">Add New API Key</h4>
          <Input placeholder="Service Name" value={newApiKey.name} onChange={e => setNewApiKey({
          ...newApiKey,
          name: e.target.value
        })} />
          <Input placeholder="API Key" value={newApiKey.key} onChange={e => setNewApiKey({
          ...newApiKey,
          key: e.target.value
        })} />
          <Button onClick={handleAddApiKey} disabled={!newApiKey.name || !newApiKey.key} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add API Key
          </Button>
        </div>
      </CardContent>
    </Card>;
}