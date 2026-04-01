"use client";

import { useSocialFeed } from '@/hooks/useSocialFeed';
import { CreatePostModal } from '@/components/social/CreatePostModal';
import { PostCard } from '@/components/social/PostCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useTranslation } from 'react-i18next';

export default function SocialFeedPage() {
  const { posts, loading, hasMore, loadMore, likePost, sharePost, refresh } = useSocialFeed();
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="container max-w-3xl py-8 mt-6">
      <h1 className="text-3xl font-bold mb-6">{t('nav.community')}</h1>
      
      {user && (
        <div className="mb-8">
          <CreatePostModal onPostCreated={() => refresh()} />
        </div>
      )}

      <div className="space-y-4">
        {posts.map(post => (
          <PostCard 
            key={post._id} 
            post={post} 
            onLike={() => likePost(post._id)}
            onShare={() => sharePost(post._id)}
          />
        ))}

        {loading && <div className="py-8 text-center text-muted-foreground animate-pulse">Loading feed...</div>}
        
        {!loading && hasMore && posts.length > 0 && (
          <div className="py-4 flex justify-center">
            <Button variant="secondary" onClick={loadMore}>Load More Timeline</Button>
          </div>
        )}

        {!loading && !hasMore && posts.length > 0 && (
          <p className="text-center text-muted-foreground py-8">You've reached the end of the timeline.</p>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-16 border rounded-lg bg-muted/20">
            <h3 className="text-xl font-semibold mb-2">It's quiet here</h3>
            <p className="text-muted-foreground">Be the first to share something with the community.</p>
          </div>
        )}
      </div>
    </div>
  );
}
