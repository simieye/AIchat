// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button, Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast } from '@/components/ui';
// @ts-ignore;
import { CheckCircle, Loader2 } from 'lucide-react';

// @ts-ignore;
import { useTranslation } from '@/lib/i18n';
export function ChatbotCreator({
  onCreate,
  onCancel
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    platform: 'weibo',
    config: {
      greeting: '',
      fallback: '',
      maxRetries: 3,
      responseDelay: 1000
    }
  });
  const [loading, setLoading] = useState(false);
  const {
    t
  } = useTranslation();
  const {
    toast
  } = useToast();
  const handleInputChange = (field, value) => {
    if (field.startsWith('config.')) {
      const configField = field.replace('config.', '');
      setFormData(prev => ({
        ...prev,
        config: {
          ...prev.config,
          [configField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Chatbot name is required',
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      await onCreate(formData);
    } catch (error) {
      toast({
        title: 'Error',
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
          <DialogTitle>Create New Chatbot</DialogTitle>
          <DialogDescription>
            Configure your AI chatbot for automated customer interactions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Chatbot Name</Label>
            <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="Enter chatbot name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} placeholder="Describe what this chatbot does" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select value={formData.platform} onValueChange={value => handleInputChange('platform', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weibo">微博</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="douyin">抖音</SelectItem>
                <SelectItem value="xiaohongshu">小红书</SelectItem>
                <SelectItem value="zhihu">知乎</SelectItem>
                <SelectItem value="bilibili">B站</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="greeting">Welcome Message</Label>
            <Textarea id="greeting" value={formData.config.greeting} onChange={e => handleInputChange('config.greeting', e.target.value)} placeholder="Welcome message for new users" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fallback">Fallback Message</Label>
            <Textarea id="fallback" value={formData.config.fallback} onChange={e => handleInputChange('config.fallback', e.target.value)} placeholder="Message when bot doesn't understand" />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Chatbot'}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
}