"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { VoteButtons } from '@/components/vote-buttons';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestion = async () => {
    try {
      const res = await api.get(`/questions/${params.id}`);
      setData(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load question');
      if (err.response?.status === 404) {
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchQuestion();
    }
  }, [params.id]);

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to answer');
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post('/answers', { questionId: params.id, content: answerContent });
      setAnswerContent('');
      toast.success('Answer posted successfully');
      fetchQuestion(); // Reload answers
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    try {
      await api.patch(`/answers/accept/${params.id}/${answerId}`);
      toast.success('Answer accepted');
      fetchQuestion(); // Reload
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to accept answer');
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (!data) return null;

  const { question, answers } = data;
  const isQuestionOwner = user?.id === question.author._id;

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 w-full">
      {/* Question Header */}
      <div className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold mb-2">{question.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
        </div>
      </div>

      {/* Question Body */}
      <div className="flex gap-4 sm:gap-6 mb-8">
        <VoteButtons targetId={question._id} targetType="question" initialVotes={question.votes} />
        <div className="flex-1 min-w-0">
          <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
            <p className="whitespace-pre-wrap">{question.description}</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {question.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <div className="flex justify-end">
            <div className="bg-muted/30 p-3 rounded-md min-w-[200px] text-sm flex flex-col items-end">
              <span className="text-muted-foreground mb-1">
                asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
              </span>
              <span className="text-blue-400 font-medium">{question.author.name}</span>
              <span className="font-bold text-muted-foreground">{question.author.reputation} rep</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">{answers.length} {t('question.answers')}</h2>

      {/* Answers List */}
      <div className="space-y-6 mb-10">
        {answers.map((answer: any) => (
          <div key={answer._id} className="flex gap-4 sm:gap-6 border-b pb-6">
            <VoteButtons targetId={answer._id} targetType="answer" initialVotes={answer.votes} />
            <div className="flex-1 min-w-0">
              <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
                <p className="whitespace-pre-wrap">{answer.content}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  {isQuestionOwner && !answer.isAccepted && (
                    <Button variant="outline" size="sm" onClick={() => handleAcceptAnswer(answer._id)}>
                      {t('question.acceptAnswer')}
                    </Button>
                  )}
                  {answer.isAccepted && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white border-transparent">
                      {t('question.accepted')}
                    </Badge>
                  )}
                </div>
                
                <div className="bg-muted/30 p-3 rounded-md min-w-[200px] text-sm flex flex-col items-end">
                  <span className="text-muted-foreground mb-1">
                    answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                  </span>
                  <span className="text-blue-400 font-medium">{answer.author.name}</span>
                  <span className="font-bold text-muted-foreground">{answer.author.reputation} rep</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Answer Form */}
      <div className="border-t pt-8">
        <h3 className="text-xl font-semibold mb-4">{t('question.postAnswer')}</h3>
        <form onSubmit={handlePostAnswer} className="space-y-4">
          <Textarea 
            placeholder="Write your answer here..." 
            className="min-h-[200px]"
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            required
          />
          <Button type="submit" disabled={submitting || !user}>
            {submitting ? t('common.loading') : t('question.submitAnswer')}
          </Button>
          {!user && (
            <p className="text-sm text-destructive mt-2">You must be logged in to post an answer.</p>
          )}
        </form>
      </div>
    </div>
  );
}
