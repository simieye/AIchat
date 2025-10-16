// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge } from '@/components/ui';
// @ts-ignore;
import { Plus, Send, Eye } from 'lucide-react';

export function WorkflowCreator({
  onCreate
}) {
  const [step, setStep] = useState(1);
  const [workflow, setWorkflow] = useState({
    name: '',
    conditions: {
      tags: [],
      platform: ''
    },
    action: {
      type: 'send_message',
      message: ''
    }
  });
  const [newTag, setNewTag] = useState('');
  const platforms = ['WhatsApp', 'Facebook', 'Instagram'];
  const addTag = () => {
    if (newTag && !workflow.conditions.tags.includes(newTag)) {
      setWorkflow(prev => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          tags: [...prev.conditions.tags, newTag]
        }
      }));
      setNewTag('');
    }
  };
  const removeTag = tag => {
    setWorkflow(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        tags: prev.conditions.tags.filter(t => t !== tag)
      }
    }));
  };
  const handleCreate = () => {
    if (workflow.name && workflow.conditions.platform && workflow.action.message) {
      onCreate({
        ...workflow,
        id: Date.now().toString(),
        status: 'active',
        enabled: true,
        lastRun: 'Never',
        runCount: 0
      });
      setWorkflow({
        name: '',
        conditions: {
          tags: [],
          platform: ''
        },
        action: {
          type: 'send_message',
          message: ''
        }
      });
      setStep(1);
    }
  };
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Workflow</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={step >= 1 ? "default" : "outline"}>1. Conditions</Badge>
            <Badge variant={step >= 2 ? "default" : "outline"}>2. Action</Badge>
            <Badge variant={step >= 3 ? "default" : "outline"}>3. Preview</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 && <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Workflow Name</label>
                <Input placeholder="e.g., Price Sensitive WhatsApp Users" value={workflow.name} onChange={e => setWorkflow({
              ...workflow,
              name: e.target.value
            })} />
              </div>

              <div>
                <label className="text-sm font-medium">Platform</label>
                <Select value={workflow.conditions.platform} onValueChange={value => setWorkflow({
              ...workflow,
              conditions: {
                ...workflow.conditions,
                platform: value
              }
            })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map(platform => <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">User Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input placeholder="Add tag..." value={newTag} onChange={e => setNewTag(e.target.value)} onKeyPress={e => e.key === 'Enter' && addTag()} />
                  <Button size="sm" onClick={addTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {workflow.conditions.tags.map(tag => <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag}
                    </Badge>)}
                </div>
              </div>

              <Button onClick={() => setStep(2)} disabled={!workflow.name || !workflow.conditions.platform}>
                Next: Set Action
              </Button>
            </div>}
          {step === 2 && <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Action Type</label>
                <Select value={workflow.action.type} onValueChange={value => setWorkflow({
              ...workflow,
              action: {
                ...workflow.action,
                type: value
              }
            })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="send_message">Send Message</SelectItem>
                    <SelectItem value="send_coupon">Send Coupon</SelectItem>
                    <SelectItem value="add_tag">Add Tag</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea placeholder="Type your automated message..." className="min-h-[120px]" value={workflow.action.message} onChange={e => setWorkflow({
              ...workflow,
              action: {
                ...workflow.action,
                message: e.target.value
              }
            })} />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Next: Preview
                </Button>
              </div>
            </div>}
          {step === 3 && <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Workflow Preview</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Name:</strong> {workflow.name}
                  </div>
                  <div>
                    <strong>Trigger:</strong> When user has tags {workflow.conditions.tags.join(', ')} and platform is {workflow.conditions.platform}
                  </div>
                  <div>
                    <strong>Action:</strong> {workflow.action.type}
                  </div>
                  <div>
                    <strong>Message:</strong>
                    <div className="mt-1 p-2 bg-background rounded border text-sm">
                      {workflow.action.message}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={handleCreate} disabled={!workflow.action.message}>
                  Create Workflow
                </Button>
              </div>
            </div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="text-sm text-muted-foreground mb-2">Message Preview</div>
            <div className="bg-background p-3 rounded border">
              <p className="text-sm">{workflow.action.message || 'Your message will appear here...'}</p>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Target: {workflow.conditions.platform} users with tags: {workflow.conditions.tags.join(', ') || 'No tags selected'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
}