// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button, Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast } from '@/components/ui';
// @ts-ignore;
import { Plus, X } from 'lucide-react';

// @ts-ignore;
import { useTranslation } from '@/lib/i18n';
export function ChatbotCreator({
  onCreate,
  onCancel
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    platform: 'web',
    triggers: [],
    responses: [],
    config: {}
  });
  const [newTrigger, setNewTrigger] = useState('');
  const [newResponse, setNewResponse] = useState('');
  const {
    t
  } = useTranslation();
  const {
    toast
  } = useToast();
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const addTrigger = () => {
    if (newTrigger.trim()) {
      setFormData(prev => ({
        ...prev,
        triggers: [...prev.triggers, newTrigger.trim()]
      }));
      setNewTrigger('');
    }
  };
  const addResponse = () => {
    if (newResponse.trim()) {
      setFormData(prev => ({
        ...prev,
        responses: [...prev.responses, newResponse.trim()]
      }));
      setNewResponse('');
    }
  };
  const removeTrigger = index => {
    setFormData(prev => ({
      ...prev,
      triggers: prev.triggers.filter((_, i) => i !== index)
    }));
  };
  const removeResponse = index => {
    setFormData(prev => ({
      ...prev,
      responses: prev.responses.filter((_, i) => i !== index)
    }));
  };
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a chatbot name',
        variant: "destructive"
      });
      return;
    }
    try {
      await onCreate(formData);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: "destructive"
      });
    }
  };
  return <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Chatbot</DialogTitle>
          <DialogDescription>
            Configure your AI chatbot with triggers and responses
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Chatbot Name</Label>
            <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="Enter chatbot name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} placeholder="Describe your chatbot" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select value={formData.platform} onValueChange={value => handleInputChange('platform', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="wechat">WeChat</SelectItem>
                <SelectItem value="weibo">Weibo</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Triggers</Label>
            <div className="flex gap-2">
              <Input value={newTrigger} onChange={e => setNewTrigger(e.target.value)} placeholder="Add trigger keyword" />
              <Button type="button" onClick={addTrigger}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.triggers.map((trigger, index) => <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                  <span className="text-sm">{trigger}</span>
                  <button type="button" onClick={() => removeTrigger(index)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Responses</Label>
            <div className="flex gap-2">
              <Input value={newResponse} onChange={e => setNewResponse(e.target.value)} placeholder="Add response message" />
              <Button type="button" onClick={addResponse}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.responses.map((response, index) => <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                  <span className="text-sm">{response}</span>
                  <button type="button" onClick={() => removeResponse(index)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit}>Create Chatbot</Button>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
}