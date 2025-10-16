// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
// @ts-ignore;
import { ArrowRight } from 'lucide-react';

export function DataMapping({
  mappings,
  onMappingChange
}) {
  const systemFields = ['name', 'email', 'phone', 'avatar', 'tags', 'source', 'last_interaction'];
  const platformFields = {
    whatsapp: ['phone', 'name', 'profile_pic', 'status', 'last_seen'],
    facebook: ['id', 'name', 'email', 'profile_pic', 'locale', 'timezone'],
    instagram: ['id', 'username', 'full_name', 'profile_pic', 'bio', 'followers_count'],
    google_analytics: ['client_id', 'user_id', 'email', 'phone', 'custom_dimensions']
  };
  const [selectedPlatform, setSelectedPlatform] = useState('whatsapp');
  const currentPlatformFields = platformFields[selectedPlatform] || [];
  const handleMappingChange = (platform, platformField, systemField) => {
    onMappingChange(selectedPlatform, platformField, systemField);
  };
  return <Card>
      <CardHeader>
        <CardTitle>Data Field Mapping</CardTitle>
        <p className="text-sm text-muted-foreground">Map platform fields to system customer fields</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="text-sm font-medium">Select Platform</label>
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(platformFields).map(platform => <SelectItem key={platform} value={platform}>
                  {platform.replace('_', ' ').toUpperCase()}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {currentPlatformFields.map(platformField => <div key={platformField} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="w-32 text-sm font-medium">{platformField}</div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                <Select value={mappings[selectedPlatform]?.[platformField] || '__none__'} onValueChange={handleMappingChange(platformField)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select system field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Don't map</SelectItem>
                    {systemFields.map(field => <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}