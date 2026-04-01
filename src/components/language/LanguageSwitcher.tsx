"use client";

import { useLanguageStore } from "@/store/languageStore";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
];

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage, setPendingLanguage } = useLanguageStore();
  const { user } = useAuth();
  const { i18n } = useTranslation();

  const handleSelectLanguage = (code: string) => {
    if (code === currentLanguage) return;

    if (!user) {
      // Guest: Switch immediately
      setLanguage(code);
      i18n.changeLanguage(code);
    } else {
      // Auth user: Need OTP
      setPendingLanguage(code);
    }
  };

  const activeLang = LANGUAGES.find(l => l.code === (currentLanguage || 'en')) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 px-3 flex items-center gap-2 border bg-muted/30">
        <span className="text-base">{activeLang.flag}</span>
        <span className="hidden sm:inline-block font-medium uppercase">{activeLang.code}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => handleSelectLanguage(lang.code)}
            className={`cursor-pointer flex items-center gap-2 ${currentLanguage === lang.code ? 'bg-primary/10 font-bold' : ''}`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
