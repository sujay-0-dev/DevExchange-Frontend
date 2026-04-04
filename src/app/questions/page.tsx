"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function QuestionsPage() {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    api.get('/questions').then(res => setQuestions(res.data)).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('home.topQuestions')}</h1>
        <Link href="/questions/ask" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">{t('home.askQuestion')}</Link>
      </div>

      <div className="space-y-4">
        {questions.map(q => (
          <Card key={q._id}>
            <CardContent className="p-4 flex gap-4">
              <div className="flex flex-col items-center justify-center text-muted-foreground w-16 shrink-0 gap-2">
                <span className="text-sm font-semibold">{q.votesCount || 0} {t('home.votes')}</span>
                <span className="text-xs">{q.answers?.length || 0} {t('home.answers')}</span>
              </div>
              <div className="flex-1">
                <Link href={`/questions/${q._id}`} className="text-lg font-semibold text-primary hover:underline">
                  {q.title}
                </Link>
                <div className="flex flex-wrap gap-2 mt-2">
                  {q.tags?.map((t: string) => <span key={t} className="px-2 py-1 bg-muted rounded-md text-xs">{t}</span>)}
                </div>
                <div className="mt-4 text-xs text-muted-foreground text-right">
                  {t('home.postedBy')} {formatDistanceToNow(new Date(q.createdAt))} {t('home.ago')} <span className="text-primary">{q.author?.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {questions.length === 0 && <p className="text-muted-foreground">{t('home.noQuestions')}</p>}
      </div>
    </div>
  );
}
