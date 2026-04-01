"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function AskQuestionPage() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Parse tags (comma separated, trimmed)
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0);

    try {
      const res = await api.post('/questions', { title, description, tags });
      toast.success('Question posted successfully!');
      router.push(`/questions/${res.data._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to post question');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-full w-full max-w-3xl mx-auto items-start justify-center px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">{t('questions.askQuestion')}</CardTitle>
          <CardDescription>
            Be specific and imagine you're asking a question to another person.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="font-semibold text-sm">Title</label>
              <p className="text-xs text-muted-foreground">
                Be specific and imagine you're asking a question to another person.
              </p>
              <Input
                id="title"
                placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="font-semibold text-sm">What are the details of your problem?</label>
              <p className="text-xs text-muted-foreground">
                Introduce the problem and expand on what you put in the title. Minimum 20 characters.
              </p>
              <Textarea
                id="description"
                placeholder="Write your question details..."
                className="min-h-[200px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                minLength={20}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="font-semibold text-sm">Tags</label>
              <p className="text-xs text-muted-foreground">
                Add up to 5 tags to describe what your question is about (comma separated).
              </p>
              <Input
                id="tags"
                placeholder="e.g. react, typescript, css"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? 'Posting...' : 'Post your question'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
