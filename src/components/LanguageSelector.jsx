// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
// @ts-ignore;
import { Globe } from 'lucide-react';

// @ts-ignore;
import { useTranslation } from '@/lib/i18n';
export function LanguageSelector() {
  const {
    t,
    language,
    changeLanguage,
    languages
  } = useTranslation();
  return <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <Select value={language} onValueChange={changeLanguage}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>
            {languages.find(l => l.code === language)?.flag} {languages.find(l => l.code === language)?.name}
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
    </div>;
}