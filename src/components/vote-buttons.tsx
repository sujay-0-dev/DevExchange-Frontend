"use client";

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface VoteButtonsProps {
  targetId: string;
  targetType: 'question' | 'answer';
  initialVotes: number;
  initialUserVote?: 'up' | 'down' | null;
}

export function VoteButtons({ targetId, targetType, initialVotes, initialUserVote = null }: VoteButtonsProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(initialUserVote);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) {
      toast.error('You must be logged in to vote');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/votes', { targetId, targetType, voteType });
      // If the backend returns the same voteType but userVote was already voteType,
      // it means we toggled it off.
      if (userVote === voteType) {
        setUserVote(null);
        setVotes(res.data.votes);
      } else {
        setUserVote(voteType);
        setVotes(res.data.votes);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to vote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-1">
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-full ${userVote === 'up' ? 'text-blue-500 bg-blue-500/10' : 'text-muted-foreground'}`}
        onClick={() => handleVote('up')}
        disabled={loading}
      >
        <ChevronUp className="h-6 w-6" />
      </Button>
      <span className="font-semibold text-lg">{votes}</span>
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-full ${userVote === 'down' ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground'}`}
        onClick={() => handleVote('down')}
        disabled={loading}
      >
        <ChevronDown className="h-6 w-6" />
      </Button>
    </div>
  );
}
