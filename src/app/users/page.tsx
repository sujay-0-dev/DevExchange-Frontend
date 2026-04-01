"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export default function UsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data)).catch(console.error);
  }, []);

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-8">{t('nav.users')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users.map(u => (
          <Card key={u._id}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold">{u.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${u._id}`} className="font-semibold text-primary hover:underline truncate block">
                  {u.name}
                </Link>
                <div className="text-xs text-muted-foreground truncate">Level {u.level || 0} • {u.reputation || 0} Rep</div>
              </div>
            </CardContent>
          </Card>
        ))}
        {users.length === 0 && <p className="text-muted-foreground col-span-full">No users found.</p>}
      </div>
    </div>
  );
}
