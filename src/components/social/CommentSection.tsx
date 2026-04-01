import { useState, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/lib/auth';

export function CommentSection({ postId, commentCount }: { postId: string, commentCount: number }) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(commentCount);

  useEffect(() => {
    if (expanded && comments.length === 0) {
      setLoading(true);
      api.get(`/social/posts/${postId}/comments`)
        .then(res => setComments(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [expanded, postId, comments.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;
    try {
      const res = await api.post(`/social/posts/${postId}/comments`, { content });
      setComments([...comments, res.data]);
      setContent('');
      setCount(prev => prev + 1);
    } catch (err) {}
  };

  return (
    <div className="w-full flex-1 md:flex-none">
      <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="gap-2 text-muted-foreground">
        <MessageSquare className="h-4 w-4" />
        <span>{count}</span>
      </Button>

      {expanded && (
        <div className="mt-4 space-y-4 w-full">
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {loading ? <p className="text-sm text-muted-foreground">Loading comments...</p> : comments.map(c => {
              const author = c.author || { _id: 'deleted', name: 'Deleted User' };
              return (
              <div key={c._id} className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{author.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 bg-muted/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold">{author.name}</span>
                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(c.createdAt))} ago</span>
                  </div>
                  <p className="text-sm">{c.content}</p>
                </div>
              </div>
            )})}
            {!loading && comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>}
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-2 relative mt-4">
            <Input 
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Drop a comment..."
              className="pr-10 w-full"
              disabled={!user}
            />
            <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 text-primary" disabled={!user || !content.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
