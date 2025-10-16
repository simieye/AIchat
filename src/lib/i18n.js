
// @ts-ignore;
import React, { useState } from 'react';

// 国际化配置
export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' }
];

// 翻译内容
export const translations = {
  'en': {
    // 通用
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    confirm: 'Confirm',
    newLead: 'New lead',
    from: 'From',
    newConversation: 'New conversation',
    platform: 'Platform',
    
    // 导航
    dashboard: 'Dashboard',
    chatbot: 'Chatbot',
    broadcast: 'Broadcast',
    leads: 'Leads',
    automation: 'Automation',
    integration: 'Integration',
    settings: 'Settings',
    
    // Dashboard
    welcomeBack: 'Welcome back! Here\'s your business overview.',
    totalLeads: 'Total Leads',
    totalMessages: 'Total Messages',
    totalViews: 'Total Views',
    revenue: 'Revenue',
    performanceOverview: 'Performance Overview',
    recentActivity: 'Recent Activity',
    refresh: 'Refresh',
    dataRefreshed: 'Data refreshed',
    dashboardDataUpdated: 'Dashboard data has been updated.',
    
    // Chatbot
    chatbotManagement: 'Chatbot Management',
    createChatbot: 'Create Chatbot',
    editChatbot: 'Edit Chatbot',
    chatbotName: 'Chatbot Name',
    chatbotDescription: 'Description',
    chatbotStatus: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    
    // Broadcast
    broadcastManagement: 'Broadcast Management',
    createBroadcast: 'Create Broadcast',
    broadcastHistory: 'Broadcast History',
    messageContent: 'Message Content',
    targetAudience: 'Target Audience',
    scheduleTime: 'Schedule Time',
    
    // Leads
    leadManagement: 'Lead Management',
    leadDetails: 'Lead Details',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    source: 'Source',
    status: 'Status',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    
    // Integration
    integrationManagement: 'Integration Management',
    connectedPlatforms: 'Connected Platforms',
    addPlatform: 'Add Platform',
    platformName: 'Platform Name',
    connectionStatus: 'Connection Status',
    lastSync: 'Last Sync',
    reconnect: 'Reconnect',
    disconnect: 'Disconnect',
    dataMapping: 'Data Mapping',
    syncLogs: 'Sync Logs',
    
    // Settings
    settings: 'Settings',
    apiKeys: 'API Keys',
    platformTokens: 'Platform Tokens',
    tagTemplates: 'Tag Templates',
    language: 'Language',
    theme: 'Theme',
    preferences: 'Preferences',
    
    // 状态
    connected: 'Connected',
    disconnected: 'Disconnected',
    syncing: 'Syncing',
    error: 'Error',
    
    // 操作
    testConnection: 'Test Connection',
    connectPlatform: 'Connect Platform',
    platformConnected: 'Platform connected',
    platformDisconnected: 'Platform disconnected',
    
    // 错误信息
    errorLoadingData: 'Error loading data',
    errorConnectingPlatform: 'Error connecting platform',
    errorUpdatingMapping: 'Error updating mapping'
  },
  'zh-CN': {
    // 通用
    loading: '加载中...',
    error: '错误',
    success: '成功',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    confirm: '确认',
    newLead: '新潜在客户',
    from: '来自',
    newConversation: '新对话',
    platform: '平台',
    
    // 导航
    dashboard: '仪表板',
    chatbot: '聊天机器人',
    broadcast: '广播',
    leads: '潜在客户',
    automation: '自动化',
    integration: '集成',
    settings: '设置',
    
    // Dashboard
    welcomeBack: '欢迎回来！这是您的业务概览。',
    totalLeads: '总潜在客户',
    totalMessages: '总消息数',
    totalViews: '总浏览量',
    revenue: '收入',
    performanceOverview: '性能概览',
    recentActivity: '最近活动',
    refresh: '刷新',
    dataRefreshed: '数据已刷新',
    dashboardDataUpdated: '仪表板数据已更新。',
    
    // Chatbot
    chatbotManagement: '聊天机器人管理',
    createChatbot: '创建聊天机器人',
    editChatbot: '编辑聊天机器人',
    chatbotName: '聊天机器人名称',
    chatbotDescription: '描述',
    chatbotStatus: '状态',
    active: '活跃',
    inactive: '非活跃',
    
    // Broadcast
    broadcastManagement: '广播管理',
    createBroadcast: '创建广播',
    broadcastHistory: '广播历史',
    messageContent: '消息内容',
    targetAudience: '目标受众',
    scheduleTime: '计划时间',
    
    // Leads
    leadManagement: '潜在客户管理',
    leadDetails: '潜在客户详情',
    name: '姓名',
    email: '邮箱',
    phone: '电话',
    source: '来源',
    status: '状态',
    createdAt: '创建时间',
    updatedAt: '更新时间',
    
    // Integration
    integrationManagement: '集成管理',
    connectedPlatforms: '已连接平台',
    addPlatform: '添加平台',
    platformName: '平台名称',
    connectionStatus: '连接状态',
    lastSync: '最后同步',
    reconnect: '重新连接',
    disconnect: '断开连接',
    dataMapping: '数据映射',
    syncLogs: '同步日志',
    
    // Settings
    settings: '设置',
    apiKeys: 'API密钥',
    platformTokens: '平台令牌',
    tagTemplates: '标签模板',
    language: '语言',
    theme: '主题',
    preferences: '偏好设置',
    
    // 状态
    connected: '已连接',
    disconnected: '已断开',
    syncing: '同步中',
    error: '错误',
    
    // 操作
    testConnection: '测试连接',
    connectPlatform: '连接平台',
    platformConnected: '平台已连接',
    platformDisconnected: '平台已断开',
    
    // 错误信息
    errorLoadingData: '加载数据时出错',
    errorConnectingPlatform: '连接平台时出错',
    errorUpdatingMapping: '更新映射时出错'
  }
  // 其他语言的翻译可以按需添加
};

// 国际化Hook
export function useTranslation() {
  const [language, setLanguage] = useState(() => {
    // 从localStorage获取保存的语言，或检测浏览器语言
    const saved = localStorage.getItem('language');
    if (saved && translations[saved]) return saved;
    
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.toLowerCase();
    
    // 尝试匹配完整语言代码
    if (translations[langCode]) return langCode;
    
    // 尝试匹配基础语言代码
    const baseLang = langCode.split('-')[0];
    const matched = Object.keys(translations).find(key => key.startsWith(baseLang));
    return matched || 'en';
  });

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('language', lang);
    }
  };

  return { t, language, changeLanguage, languages };
}
