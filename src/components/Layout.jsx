// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { cn } from '@/lib/utils';
// @ts-ignore;
import { BarChart3, MessageSquare, Megaphone, Users, Settings, Sun, Moon, Zap, Link } from 'lucide-react';
// @ts-ignore;
import { Button, useToast } from '@/components/ui';

// @ts-ignore;
import { useTranslation } from '@/lib/i18n';
const navItems = [{
  id: 'dashboard',
  label: 'dashboard',
  icon: BarChart3
}, {
  id: 'chatbot',
  label: 'chatbot',
  icon: MessageSquare
}, {
  id: 'broadcast',
  label: 'broadcast',
  icon: Megaphone
}, {
  id: 'leads',
  label: 'leads',
  icon: Users
}, {
  id: 'automation',
  label: 'automation',
  icon: Zap
}, {
  id: 'integration',
  label: 'integration',
  icon: Link
}, {
  id: 'settings',
  label: 'settings',
  icon: Settings
}];
export function Layout({
  children,
  activePage,
  onNavigate,
  isDark,
  onToggleTheme
}) {
  const {
    t
  } = useTranslation();
  const {
    toast
  } = useToast();
  return <div className={cn("flex h-screen", isDark ? "dark" : "")}>
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-foreground">AI SEO+</h1>
          <p className="text-sm text-muted-foreground">Business System</p>
        </div>
        
        <nav className="flex-1 px-4">
          {navItems.map(item => {
          const Icon = item.icon;
          return <Button key={item.id} variant={activePage === item.id ? "secondary" : "ghost"} className="w-full justify-start mb-2" onClick={() => onNavigate(item.id)}>
                <Icon className="w-4 h-4 mr-3" />
                {t(item.label)}
              </Button>;
        })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onToggleTheme}>
            {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-background">
        {children}
      </div>
    </div>;
}