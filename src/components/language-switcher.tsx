'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const languages = [
    { code: 'nl', name: 'Nederlands', shortName: 'NL' },
    { code: 'en', name: 'English', shortName: 'EN' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  const otherLanguage = languages.find(lang => lang.code !== i18n.language) || languages[1];

  const handleLanguageToggle = () => {
    const newLanguage = i18n.language === 'nl' ? 'en' : 'nl';
    i18n.changeLanguage(newLanguage);
    
    // Update HTML attributes
    if (typeof window !== 'undefined') {
      document.documentElement.lang = newLanguage;
      document.documentElement.dir = 'ltr';
      
      // Save to localStorage
      localStorage.setItem('i18nextLng', newLanguage);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="relative px-4 py-2 h-9 text-sm font-medium bg-transparent hover:bg-accent/50 border-0"
        disabled
      >
        <div className="flex items-center gap-2">
          <span className="text-foreground">NL</span>
          <div className="w-px h-4 bg-border"></div>
          <span className="text-muted-foreground text-xs">EN</span>
        </div>
      </Button>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLanguageToggle}
      className="relative px-4 py-2 h-9 text-sm font-medium bg-transparent hover:bg-accent/50 border-0 transition-all duration-200 group"
      data-testid="button-language-switcher"
      title={`Switch to ${otherLanguage.name}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-foreground group-hover:text-primary transition-colors font-semibold">
          {currentLanguage.shortName}
        </span>
        <div className="w-px h-4 bg-border group-hover:bg-primary/30 transition-colors"></div>
        <span className="text-muted-foreground text-xs group-hover:text-primary/70 transition-colors">
          {otherLanguage.shortName}
        </span>
      </div>
    </Button>
  );
}
