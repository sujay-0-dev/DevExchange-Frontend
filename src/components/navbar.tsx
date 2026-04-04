"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { NotificationBell } from '@/components/notification-bell';
import { FriendRequestBell } from '@/components/social/FriendRequestBell';
import { useAuth } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';

export function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  return (
    <nav className="fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block">DevExchange</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {t('nav.about')}
            </Link>
            <Link href="/social" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {t('nav.community')}
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {t('nav.pricing')}
            </Link>
            <Link href="/leaderboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1">
              <span>🏆</span> {t('nav.leaderboard')}
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none max-w-sm relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('questions.searchPlaceholder')}
              className="pl-8 bg-muted/50 w-full"
            />
          </div>
          <nav className="flex items-center space-x-2">
            {!user ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">{t('nav.login')}</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">{t('nav.signup')}</Button>
                </Link>
              </>
            ) : (
              <>
                <FriendRequestBell />
                <NotificationBell />
                <Link href={`/profile/${user.id}`}>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 border bg-muted/30">
                    <span className="font-bold text-yellow-600 dark:text-yellow-500">{user.points || 0} pts</span>
                    <span className="hidden sm:inline-block">Profile</span>
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>{t('auth.logout')}</Button>
              </>
            )}
            <LanguageSwitcher />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </nav>
  );
}
