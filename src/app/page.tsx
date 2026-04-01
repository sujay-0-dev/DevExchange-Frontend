"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { QuestionCard } from '@/components/question-card';
import api from '@/lib/api';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get('/questions');
        setQuestions(res.data);
      } catch (err) {
        console.error('Failed to fetch questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="flex flex-col w-full px-4 py-6 md:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Top Questions</h1>
        <Link href="/questions/ask">
          <Button>{t('questions.askQuestion')}</Button>
        </Link>
      </div>

      <div className="border border-muted rounded-md divide-y overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">{t('common.loading')}</div>
        ) : questions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">{t('questions.noQuestions')}</div>
        ) : (
          questions.map((q) => (
            <QuestionCard key={q._id} question={q} />
          ))
        )}
      </div>
    </div>
  );
}
