"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const mockBadges = [
  { name: 'First Question', desc: 'Asked a question for the first time', type: 'bronze' },
  { name: 'First Answer', desc: 'Answered a question for the first time', type: 'bronze' },
  { name: 'Teacher', desc: 'Answer received 10 upvotes', type: 'silver' },
  { name: 'Popular', desc: 'Question viewed 1000 times', type: 'silver' },
  { name: 'Legend', desc: 'Earned 1000 reputation points', type: 'gold' }
];

export default function BadgesPage() {
  const { t } = useTranslation();
  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-8">{t('nav.badges')}</h1>
      <p className="text-muted-foreground mb-8">Earn badges by participating in the DevExchange community.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockBadges.map(b => (
          <Card key={b.name}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Award className={`h-5 w-5 ${b.type === 'bronze' ? 'text-orange-500' : b.type === 'silver' ? 'text-slate-400' : 'text-yellow-500'}`} />
                <CardTitle className="text-lg">{b.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{b.desc}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
