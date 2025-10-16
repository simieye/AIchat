// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Switch, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast, Tabs, TabsContent, TabsList, TabsTrigger, Label } from '@/components/ui';
// @ts-ignore;
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Palette, Save, RefreshCw } from 'lucide-react';

import { Layout } from '@/components/Layout';
import { ApiKeyManager } from '@/components/ApiKeyManager';
import { PlatformTokenManager } from '@/components/PlatformTokenManager';
import { TagTemplateManager } from '@/components/TagTemplateManager';
import { LanguageSelector } from '@/components/LanguageSelector';
// @ts-ignore;
import { useTranslation } from '@/lib/i18n';
export default function Settings(props) {
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    notifications: true,
    autoSync: true,
    darkMode: true,
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    emailNotifications: true,
    pushNotifications: false,
    analytics: true
  });
  const {
    t,
    changeLanguage,
    currentLanguage
  } = useTranslation();
  const {
    toast
  } = useToast();
  const handleNavigate = pageId => {
    props.$w.utils.navigateTo({
      pageId,
      params: {}
    });
  };
  const toggleTheme = () => setIsDark(!isDark);
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const saveSettings = async () => {
    setLoading(true);
    try {
      // 保存设置到本地存储
      localStorage.setItem('app_settings', JSON.stringify(settings));

      // 更新语言
      changeLanguage(settings.language);

      // 更新主题
      if (settings.darkMode !== isDark) {
        toggleTheme();
      }
      toast({
        title: t('settingsSaved'),
        description: t('settingsUpdatedSuccessfully'),
        variant: "success"
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const resetSettings = () => {
    const defaultSettings = {
      notifications: true,
      autoSync: true,
      darkMode: true,
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: '24h',
      emailNotifications: true,
      pushNotifications: false,
      analytics: true
    };
    setSettings(defaultSettings);
    changeLanguage(defaultSettings.language);
    toast({
      title: t('settingsReset'),
      description: t('settingsResetToDefault'),
      variant: "success"
    });
  };
  useEffect(() => {
    // 从本地存储加载设置
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        changeLanguage(parsed.language || 'zh-CN');
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);
  const languages = [{
    code: 'zh-CN',
    name: '简体中文',
    flag: '🇨🇳'
  }, {
    code: 'zh-TW',
    name: '繁體中文',
    flag: '🇹🇼'
  }, {
    code: 'en-US',
    name: 'English',
    flag: '🇺🇸'
  }, {
    code: 'ja-JP',
    name: '日本語',
    flag: '🇯🇵'
  }, {
    code: 'ko-KR',
    name: '한국어',
    flag: '🇰🇷'
  }, {
    code: 'es-ES',
    name: 'Español',
    flag: '🇪🇸'
  }, {
    code: 'fr-FR',
    name: 'Français',
    flag: '🇫🇷'
  }, {
    code: 'de-DE',
    name: 'Deutsch',
    flag: '🇩🇪'
  }, {
    code: 'ru-RU',
    name: 'Русский',
    flag: '🇷🇺'
  }, {
    code: 'ar-SA',
    name: 'العربية',
    flag: '🇸🇦'
  }, {
    code: 'pt-PT',
    name: 'Português',
    flag: '🇵🇹'
  }, {
    code: 'it-IT',
    name: 'Italiano',
    flag: '🇮🇹'
  }, {
    code: 'nl-NL',
    name: 'Nederlands',
    flag: '🇳🇱'
  }, {
    code: 'th-TH',
    name: 'ไทย',
    flag: '🇹🇭'
  }, {
    code: 'vi-VN',
    name: 'Tiếng Việt',
    flag: '🇻🇳'
  }, {
    code: 'id-ID',
    name: 'Bahasa Indonesia',
    flag: '🇮🇩'
  }, {
    code: 'ms-MY',
    name: 'Bahasa Melayu',
    flag: '🇲🇾'
  }, {
    code: 'tr-TR',
    name: 'Türkçe',
    flag: '🇹🇷'
  }, {
    code: 'hi-IN',
    name: 'हिन्दी',
    flag: '🇮🇳'
  }, {
    code: 'pl-PL',
    name: 'Polski',
    flag: '🇵🇱'
  }, {
    code: 'sv-SE',
    name: 'Svenska',
    flag: '🇸🇪'
  }, {
    code: 'no-NO',
    name: 'Norsk',
    flag: '🇳🇴'
  }, {
    code: 'da-DK',
    name: 'Dansk',
    flag: '🇩🇰'
  }, {
    code: 'fi-FI',
    name: 'Suomi',
    flag: '🇫🇮'
  }];
  const timezones = [{
    value: 'Asia/Shanghai',
    label: 'Asia/Shanghai (UTC+8)'
  }, {
    value: 'America/New_York',
    label: 'America/New_York (UTC-5)'
  }, {
    value: 'Europe/London',
    label: 'Europe/London (UTC+0)'
  }, {
    value: 'Asia/Tokyo',
    label: 'Asia/Tokyo (UTC+9)'
  }, {
    value: 'Europe/Berlin',
    label: 'Europe/Berlin (UTC+1)'
  }, {
    value: 'America/Los_Angeles',
    label: 'America/Los_Angeles (UTC-8)'
  }];
  return <Layout activePage="settings" onNavigate={handleNavigate} isDark={isDark} onToggleTheme={toggleTheme}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <SettingsIcon className="w-8 h-8" />
              {t('settings')}
            </h2>
            <p className="text-muted-foreground">{t('manageYourPreferences')}</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">
              <SettingsIcon className="w-4 h-4 mr-2" />
              {t('general')}
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              {t('notifications')}
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              {t('security')}
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Globe className="w-4 h-4 mr-2" />
              {t('integrations')}
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="w-4 h-4 mr-2" />
              {t('appearance')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>{t('generalSettings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">{t('language')}</Label>
                  <Select value={settings.language} onValueChange={value => handleSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue>
                        {languages.find(l => l.code === settings.language)?.flag} {languages.find(l => l.code === settings.language)?.name}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">{t('languageDescription')}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">{t('timezone')}</Label>
                  <Select value={settings.timezone} onValueChange={value => handleSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map(tz => <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">{t('dateFormat')}</Label>
                  <Select value={settings.dateFormat} onValueChange={value => handleSettingChange('dateFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YYYY-MM-DD">2024-01-15</SelectItem>
                      <SelectItem value="MM/DD/YYYY">01/15/2024</SelectItem>
                      <SelectItem value="DD/MM/YYYY">15/01/2024</SelectItem>
                      <SelectItem value="DD.MM.YYYY">15.01.2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeFormat">{t('timeFormat')}</Label>
                  <Select value={settings.timeFormat} onValueChange={value => handleSettingChange('timeFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24小时制 (14:30)</SelectItem>
                      <SelectItem value="12h">12小时制 (2:30 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveSettings} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {t('saveSettings')}
                  </Button>
                  <Button variant="outline" onClick={resetSettings}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('reset')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>{t('notificationSettings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('emailNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">{t('emailNotificationsDescription')}</p>
                  </div>
                  <Switch checked={settings.emailNotifications} onCheckedChange={checked => handleSettingChange('emailNotifications', checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('pushNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">{t('pushNotificationsDescription')}</p>
                  </div>
                  <Switch checked={settings.pushNotifications} onCheckedChange={checked => handleSettingChange('pushNotifications', checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('autoSync')}</Label>
                    <p className="text-sm text-muted-foreground">{t('autoSyncDescription')}</p>
                  </div>
                  <Switch checked={settings.autoSync} onCheckedChange={checked => handleSettingChange('autoSync', checked)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>{t('securitySettings')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ApiKeyManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>{t('integrationSettings')}</CardTitle>
              </CardHeader>
              <CardContent>
                <PlatformTokenManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>{t('appearanceSettings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('darkMode')}</Label>
                    <p className="text-sm text-muted-foreground">{t('darkModeDescription')}</p>
                  </div>
                  <Switch checked={settings.darkMode} onCheckedChange={checked => handleSettingChange('darkMode', checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('analytics')}</Label>
                    <p className="text-sm text-muted-foreground">{t('analyticsDescription')}</p>
                  </div>
                  <Switch checked={settings.analytics} onCheckedChange={checked => handleSettingChange('analytics', checked)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>;
}