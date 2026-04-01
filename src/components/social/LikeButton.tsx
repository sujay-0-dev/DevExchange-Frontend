import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

export function LikeButton({ likes, onLike }: { likes: any[], onLike: () => void }) {
  const { user } = useAuth();
  const isLiked = user && likes.some((id: any) => (id._id || id) === user.id);

  return (
    <Button variant="ghost" size="sm" onClick={onLike} className={`gap-2 ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}>
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      <span>{likes.length}</span>
    </Button>
  );
}
