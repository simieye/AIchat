// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge } from '@/components/ui';
// @ts-ignore;
import { Send } from 'lucide-react';

const mockTags = ['all-users', 'premium', 'active-users', 'beta-users', 'power-users', 'new-leads'];
export function BroadcastCreator({
  onCreate
}) {
  const [broadcast, setBroadcast] = useState({
    name: '',
    message: '',
    tags: [],
    platform: 'WhatsApp'
  });
  const toggleTag = tag => {
    setBroadcast(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };
  const handleCreate = () => {
    if (broadcast.name && broadcast.message && broadcast.tags.length > 0) {
      onCreate(broadcast);
      setBroadcast({
        name: '',
        message: '',
        tags: [],
        platform: 'WhatsApp'
      });
    }
  };
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Broadcast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Campaign Name</label>
            <Input placeholder="e.g., Summer Sale 2024" value={broadcast.name} onChange={e => setBroadcast({
            ...broadcast,
            name: e.target.value
          })} />
          </div>

          <div>
            <label className="text-sm font-medium">Platform</label>
            <Select value={broadcast.platform} onValueChange={value => setBroadcast({
            ...broadcast,
            platform: value
          })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Target Tags</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {mockTags.map(tag => <Badge key={tag} variant={broadcast.tags.includes(tag) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleTag(tag)}>
                  {tag}
                </Badge>)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Message</label>
            <Textarea placeholder="Type your broadcast message here..." className="min-h-[120px]" value={broadcast.message} onChange={e => setBroadcast({
            ...broadcast,
            message: e.target.value
          })} />
          </div>

          <Button onClick={handleCreate} disabled={!broadcast.name || !broadcast.message || broadcast.tags.length === 0} className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Schedule Broadcast
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="text-sm text-muted-foreground mb-2">Preview on {broadcast.platform}</div>
            <div className="bg-background p-3 rounded border">
              <p className="text-sm">{broadcast.message || 'Your message will appear here...'}</p>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Targeting: {broadcast.tags.join(', ') || 'No tags selected'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
}