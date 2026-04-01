"use client";

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Lock, Unlock } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useFriends } from '@/hooks/useFriends';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export function PostLimitBanner() {
  const { user } = useAuth();
  const { friends, loading } = useFriends();
  const [postsToday, setPostsToday] = useState(0);

  useEffect(() => {
    const countMyTodayPosts = async () => {
      try {
        const res = await api.get('/social/posts?limit=100'); 
        const mine = res.data.posts.filter((p: any) => p.author._id === user?.id);
        const today = new Date();
        today.setUTCHours(0,0,0,0);
        const todayCount = mine.filter((p: any) => new Date(p.createdAt) >= today).length;
        setPostsToday(todayCount);
      } catch (err) {}
    };
    if (user) countMyTodayPosts();
  }, [user]);

  if (!user || loading) return null;

  const friendCount = friends.length;

  if (friendCount === 0) {
    return (
      <Alert variant="destructive" className="mb-6">
        <Lock className="h-4 w-4" />
        <AlertTitle>Posting Locked</AlertTitle>
        <AlertDescription>
          You must connect with at least 1 friend to start posting to the timeline.
        </AlertDescription>
      </Alert>
    );
  }

  if (friendCount > 10) {
    return (
      <Alert className="mb-6 bg-primary/10 border-primary text-primary">
        <Unlock className="h-4 w-4" />
        <AlertTitle>Unlimited Posts Unlocked! 🎉</AlertTitle>
        <AlertDescription>
          You have {friendCount} friends. You can post as much as you want!
        </AlertDescription>
      </Alert>
    );
  }

  const remaining = friendCount - postsToday;

  return (
    <Alert className="mb-6 bg-accent border-accent text-accent-foreground">
      <Info className="h-4 w-4" />
      <AlertTitle>Daily Posting Limit Active</AlertTitle>
      <AlertDescription>
        You have {friendCount} friend{friendCount === 1 ? '' : 's'}. You currently have {Math.max(0, remaining)} post{remaining === 1 ? '' : 's'} remaining today. Add more friends to post more!
      </AlertDescription>
    </Alert>
  );
}
