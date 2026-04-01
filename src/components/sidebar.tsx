"use client";

import Link from 'next/link';
import { Home, Users, HelpCircle, Tag, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Sidebar() {
  const { t } = useTranslation();
  return (
    <aside className="fixed top-14 left-0 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r md:sticky md:block md:w-64">
      <div className="h-full py-6 pr-6 lg:py-8">
        <div className="flex flex-col space-y-4">
          <Link href="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link href="/questions" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
            <HelpCircle className="h-4 w-4" />
            <span>{t('nav.questions')}</span>
          </Link>
          <Link href="/tags" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
            <Tag className="h-4 w-4" />
            <span>{t('nav.tags')}</span>
          </Link>
          <Link href="/users" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
            <Users className="h-4 w-4" />
            <span>{t('nav.users')}</span>
          </Link>
          <Link href="/badges" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
            <Trophy className="h-4 w-4" />
            <span>{t('nav.badges')}</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
