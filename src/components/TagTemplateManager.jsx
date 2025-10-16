// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from '@/components/ui';
// @ts-ignore;
import { Tag, Plus, Trash2 } from 'lucide-react';

export function TagTemplateManager() {
  const [tagTemplates, setTagTemplates] = useState([{
    id: '1',
    name: 'Hot Lead',
    color: '#ef4444',
    description: 'High-value prospects ready to buy'
  }, {
    id: '2',
    name: 'Warm Lead',
    color: '#f59e0b',
    description: 'Interested but needs nurturing'
  }, {
    id: '3',
    name: 'Cold Lead',
    color: '#3b82f6',
    description: 'Early stage prospects'
  }, {
    id: '4',
    name: 'Enterprise',
    color: '#8b5cf6',
    description: 'Large company prospects'
  }]);
  const [newTag, setNewTag] = useState({
    name: '',
    color: '#3b82f6',
    description: ''
  });
  const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#06b6d4', '#f97316', '#ec4899'];
  const handleAddTag = () => {
    if (newTag.name && newTag.color) {
      const tag = {
        id: Date.now().toString(),
        ...newTag
      };
      setTagTemplates([...tagTemplates, tag]);
      setNewTag({
        name: '',
        color: '#3b82f6',
        description: ''
      });
    }
  };
  const handleDeleteTag = id => {
    setTagTemplates(tagTemplates.filter(tag => tag.id !== id));
  };
  return <Card>
      <CardHeader>
        <CardTitle>Tag Templates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tagTemplates.map(tag => <div key={tag.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{
                backgroundColor: tag.color
              }} />
                  <span className="font-medium">{tag.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteTag(tag.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{tag.description}</p>
            </div>)}
        </div>

        <div className="p-4 border rounded-lg space-y-3">
          <h4 className="font-medium">Add New Tag</h4>
          <Input placeholder="Tag Name" value={newTag.name} onChange={e => setNewTag({
          ...newTag,
          name: e.target.value
        })} />
          <Input placeholder="Description" value={newTag.description} onChange={e => setNewTag({
          ...newTag,
          description: e.target.value
        })} />
          <div className="flex gap-2">
            {colors.map(color => <button key={color} className={`w-8 h-8 rounded border-2 ${newTag.color === color ? 'border-foreground' : 'border-transparent'}`} style={{
            backgroundColor: color
          }} onClick={() => setNewTag({
            ...newTag,
            color
          })} />)}
          </div>
          <Button onClick={handleAddTag} disabled={!newTag.name} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Tag
          </Button>
        </div>
      </CardContent>
    </Card>;
}