// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Button } from '@/components/ui';
// @ts-ignore;
import { Settings, Key, Globe, Tag } from 'lucide-react';

import { Layout } from '@/components/Layout';
import { ApiKeyManager } from '@/components/ApiKeyManager';
import { PlatformTokenManager } from '@/components/PlatformTokenManager';
import { TagTemplateManager } from '@/components/TagTemplateManager';
import { LanguageSelector } from '@/components/LanguageSelector';
// @ts-ignore;
import { useTranslation } from '@/lib/i18n';
export default function SettingsPage(props) {
  const [isDark, setIsDark] = useState(true);
  const {
    t
  } = useTranslation();
  const handleNavigate = pageId => {
    props.$w.utils.navigateTo({
      pageId,
      params: {}
    });
  };
  const toggleTheme = () => setIsDark(!isDark);
  return <Layout activePage="settings" onNavigate={handleNavigate} isDark={isDark} onToggleTheme={toggleTheme}>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-8 h-8" />
            {t('settings')}
          </h2>
          <p className="text-muted-foreground">Manage your application settings and preferences</p>
        </div>

        <Tabs defaultValue="api-keys" className="space-y-4">
          <TabsList>
            <TabsTrigger value="api-keys">{t('apiKeys')}</TabsTrigger>
            <TabsTrigger value="tokens">{t('platformTokens')}</TabsTrigger>
            <TabsTrigger value="tags">{t('tagTemplates')}</TabsTrigger>
            <TabsTrigger value="preferences">{t('preferences')}</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys">
            <Card>
              <CardHeader>
                <CardTitle>{t('apiKeys')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ApiKeyManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tokens">
            <Card>
              <CardHeader>
                <CardTitle>{t('platformTokens')}</CardTitle>
              </CardHeader>
              <CardContent>
                <PlatformTokenManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tags">
            <Card>
              <CardHeader>
                <CardTitle>{t('tagTemplates')}</CardTitle>
              </CardHeader>
              <CardContent>
                <TagTemplateManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>{t('preferences')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('language')}</h3>
                    <LanguageSelector />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('theme')}</h3>
                    <div className="flex items-center gap-4">
                      <Button variant={isDark ? "default" : "outline"} onClick={() => setIsDark(true)}>
                        Dark
                      </Button>
                      <Button variant={!isDark ? "default" : "outline"} onClick={() => setIsDark(false)}>
                        Light
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>;
}