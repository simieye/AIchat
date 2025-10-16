// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button, useToast, Label } from '@/components/ui';
// @ts-ignore;
import { RefreshCw, Save } from 'lucide-react';

// @ts-ignore;
import { useTranslation } from '@/lib/i18n';
export function DataMapping({
  platforms
}) {
  const [mappings, setMappings] = useState({});
  const [loading, setLoading] = useState(false);
  const {
    t
  } = useTranslation();
  const {
    toast
  } = useToast();
  const fieldMappings = {
    leads: {
      name: '姓名',
      email: '邮箱',
      phone: '电话',
      source: '来源',
      platform: '平台',
      created_at: '创建时间',
      status: '状态',
      tags: '标签',
      value: '价值'
    },
    conversations: {
      contact_name: '联系人',
      platform: '平台',
      last_message: '最后消息',
      status: '状态',
      unread_count: '未读数',
      last_interaction_at: '最后交互时间'
    },
    posts: {
      content: '内容',
      platform: '平台',
      created_at: '发布时间',
      likes: '点赞数',
      shares: '分享数',
      comments: '评论数',
      views: '浏览量'
    }
  };
  const handleMappingChange = (platform, field, target) => {
    setMappings(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: target
      }
    }));
  };
  const handleSaveMappings = async () => {
    setLoading(true);
    try {
      // 模拟保存映射配置
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: '映射配置已保存',
        description: '数据映射配置已成功更新',
        variant: "success"
      });
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
  if (!platforms || platforms.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">
        请先连接至少一个平台
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">数据字段映射</h3>
        <Button onClick={handleSaveMappings} disabled={loading}>
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>
              <Save className="w-4 h-4 mr-2" />
              保存配置
            </>}
        </Button>
      </div>

      {platforms.map(platform => <Card key={platform.id}>
          <CardHeader>
            <CardTitle className="text-base">
              {platform.displayName} 数据映射
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(fieldMappings).map(([category, fields]) => <div key={category} className="space-y-2">
                  <h4 className="font-medium capitalize">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(fields).map(([field, label]) => <div key={field} className="space-y-1">
                        <Label className="text-sm">{label}</Label>
                        <Select value={mappings[platform.name]?.[field] || field} onValueChange={value => handleMappingChange(platform.name, field, value)}>
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={field}>{label}</SelectItem>
                            {Object.entries(fields).map(([f, l]) => <SelectItem key={f} value={f}>{l}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>)}
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>)}
    </div>;
}