"use client";

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MediaGallery } from './MediaGallery';
import { LikeButton } from './LikeButton';
import { CommentSection } from './CommentSection';
import { ShareButton } from './ShareButton';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PostCard({ post, onLike, onShare }: { post: any, onLike: () => void, onShare: () => void }) {
  const author = post.author || { _id: 'deleted', name: 'Deleted User', level: 0 };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        {author._id === 'deleted' ? (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <span className="font-bold text-muted-foreground">?</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold leading-none text-muted-foreground">{author.name}</span>
              <span className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(new Date(post.createdAt))} ago</span>
            </div>
          </div>
        ) : (
          <Link href={`/profile/${author._id}`} className="flex items-center gap-3 hover:underline">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-bold text-primary">{author.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold leading-none">{author.name}</span>
              <span className="text-xs text-muted-foreground mt-1">Level {author.level || 0} • {formatDistanceToNow(new Date(post.createdAt))} ago</span>
            </div>
          </Link>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {post.content && <p className="text-sm mb-4 whitespace-pre-wrap">{post.content}</p>}
        <MediaGallery urls={post.mediaUrls} types={post.mediaTypes} />
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t p-2 pt-3">
        <div className="flex items-start md:items-center w-full justify-between flex-wrap gap-2">
          <LikeButton likes={post.likes} onLike={onLike} />
          <CommentSection postId={post._id} commentCount={post.commentCount} />
          <ShareButton shareCount={post.shareCount} onShare={onShare} />
        </div>
      </CardFooter>
    </Card>
  );
}
