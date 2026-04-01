"use client";

import { Friend } from '@/hooks/useFriends';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserMinus, Check, X, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface FriendCardProps {
  user: any;
  type: 'friend' | 'request' | 'suggestion';
  onAccept?: () => void;
  onReject?: () => void;
  onRemove?: () => void;
  onAdd?: () => void;
}

export function FriendCard({ user, type, onAccept, onReject, onRemove, onAdd }: FriendCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <Link href={`/profile/${user._id || user.id}`} className="flex items-center gap-4 hover:underline">
          <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10">
             <span className="text-lg font-bold">{(user.name || 'U').charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">Level {user.level || 0} • {user.reputation || 0} Rep</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {type === 'request' && (
            <>
              <Button size="sm" onClick={onAccept} className="gap-2"><Check className="h-4 w-4" /> Accept</Button>
              <Button size="sm" variant="destructive" onClick={onReject} className="gap-2"><X className="h-4 w-4" /> Reject</Button>
            </>
          )}
          {type === 'friend' && (
            <Button size="sm" variant="outline" onClick={onRemove} className="gap-2 text-destructive hover:bg-destructive/10"><UserMinus className="h-4 w-4" /> Remove</Button>
          )}
          {type === 'suggestion' && (
            <Button size="sm" onClick={onAdd} className="gap-2"><UserPlus className="h-4 w-4" /> Add Friend</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
