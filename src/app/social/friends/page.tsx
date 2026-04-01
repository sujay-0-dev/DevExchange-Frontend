"use client";

import { useFriends } from '@/hooks/useFriends';
import { FriendCard } from '@/components/social/FriendCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function FriendsPage() {
  const { user } = useAuth();
  const { friends, requests, acceptRequest, rejectRequest, sendRequest, unfriend } = useFriends();
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.get('/users');
        const allUsers = res.data;
        
        const friendIds = friends.map((f: any) => f._id);
        const requestSenderIds = requests.map((r: any) => r.sender._id);
        
        const filtered = allUsers.filter((u: any) => 
          u._id !== user?.id && 
          !friendIds.includes(u._id) && 
          !requestSenderIds.includes(u._id)
        );
        setSuggestions(filtered);
      } catch (err) {
        console.error('Failed to fetch users for suggestions', err);
      }
    };
    
    if (user && friends) {
      fetchSuggestions();
    }
  }, [user, friends, requests]);

  if (!user) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Friends</h1>
      
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="mb-8 w-full justify-start border-b rounded-none px-0 h-auto bg-transparent">
          <TabsTrigger value="requests" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">
            Pending Requests ({requests.length})
          </TabsTrigger>
          <TabsTrigger value="friends" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">
            My Friends ({friends.length})
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">
            Suggestions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="space-y-4">
          {requests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No pending friend requests.</p>
          ) : (
            requests.map(req => (
              <FriendCard 
                key={req._id} 
                user={req.sender} 
                type="request" 
                onAccept={() => acceptRequest(req._id)}
                onReject={() => rejectRequest(req._id)}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="friends" className="space-y-4">
          {friends.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">You haven't added any friends yet.</p>
          ) : (
            friends.map((friend: any) => (
              <FriendCard 
                key={friend._id} 
                user={friend} 
                type="friend" 
                onRemove={() => unfriend(friend._id)}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="suggestions" className="space-y-4">
          {suggestions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No new people to discover right now.</p>
          ) : (
            suggestions.map(s => (
              <FriendCard 
                key={s._id} 
                user={s} 
                type="suggestion" 
                onAdd={() => {
                  sendRequest(s._id);
                  setSuggestions(suggestions.filter(u => u._id !== s._id));
                }}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
