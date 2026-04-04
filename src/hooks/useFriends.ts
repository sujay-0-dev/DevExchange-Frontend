import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { io, Socket } from 'socket.io-client';

export interface FriendRequest {
  _id: string;
  sender: {
    _id: string;
    name: string;
    profilePicture?: string;
    reputation: number;
    level: number;
  };
  status: string;
  createdAt: string;
}

export interface Friend {
  _id: string;
  name: string;
  profilePicture?: string;
  reputation: number;
  level: number;
}

export function useFriends() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriendsAndRequests = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [friendsRes, requestsRes] = await Promise.all([
        api.get(`/friends/${user.id}`),
        api.get('/friends/requests')
      ]);
      setFriends(friendsRes.data);
      setRequests(requestsRes.data);
    } catch (err) {
      console.error('Failed to fetch friends data', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFriendsAndRequests();

    if (user) {
      const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://devexchange.onrender.com');
      
      socket.on('friend_request', () => {
        fetchFriendsAndRequests();
      });
      socket.on('friend_accepted', () => {
        fetchFriendsAndRequests();
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user, fetchFriendsAndRequests]);

  const sendRequest = async (userId: string) => {
    await api.post(`/friends/request/${userId}`);
  };

  const acceptRequest = async (requestId: string) => {
    await api.patch(`/friends/accept/${requestId}`);
    fetchFriendsAndRequests();
  };

  const rejectRequest = async (requestId: string) => {
    await api.patch(`/friends/reject/${requestId}`);
    fetchFriendsAndRequests();
  };

  const unfriend = async (userId: string) => {
    await api.delete(`/friends/${userId}`);
    fetchFriendsAndRequests();
  };

  return {
    friends,
    requests,
    loading,
    sendRequest,
    acceptRequest,
    rejectRequest,
    unfriend,
    refresh: fetchFriendsAndRequests
  };
}
