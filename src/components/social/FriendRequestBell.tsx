"use client";

import { Users } from 'lucide-react';
import { useFriends } from '@/hooks/useFriends';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export function FriendRequestBell() {
  const { requests } = useFriends();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
        <Users className="h-5 w-5" />
        {requests.length > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {requests.length > 9 ? '9+' : requests.length}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Friend Requests</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {requests.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No pending requests.
            </div>
          ) : (
            requests.slice(0, 5).map((req) => (
              <DropdownMenuItem key={req._id} className="flex flex-col items-start p-4 hover:bg-muted/50 focus:bg-muted/50 cursor-pointer" onClick={() => router.push('/social/friends')}>
                <div className="flex items-center gap-2 w-full">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold">{req.sender.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{req.sender.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Sent you a friend request
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="w-full text-center cursor-pointer justify-center text-sm font-medium text-primary" onClick={() => router.push('/social/friends')}>
            Manage Friends
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
