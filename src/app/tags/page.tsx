"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { useTranslation } from 'react-i18next';

export default function TagsPage() {
  const { t } = useTranslation();
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get('/tags');
        setTags(res.data);
      } catch (err) {
        console.error('Failed to fetch tags:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="flex flex-col w-full px-4 py-6 md:px-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{t('nav.tags')}</h1>
        <p className="text-muted-foreground max-w-2xl">
          A tag is a keyword or label that categorizes your question with other, similar questions. Using the right tags makes it easier for others to find and answer your question.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading tags...</div>
      ) : tags.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground border rounded-md">No tags found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tags.map((tag) => (
            <Card key={tag.name} className="hover:border-primary/50 transition-colors">
              <CardHeader className="p-4">
                <CardTitle className="text-base mb-2">
                  <Badge variant="secondary" className="hover:bg-secondary/80">
                    <Link href={`/questions?tag=${encodeURIComponent(tag.name)}`}>
                      {tag.name}
                    </Link>
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  {tag.count} {tag.count === 1 ? 'question' : 'questions'}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
