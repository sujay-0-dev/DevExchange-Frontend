import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/lib/auth';

export function useSocialFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async (pageNum: number, overwrite = false) => {
    try {
      setLoading(true);
      const res = await api.get(`/social/posts?page=${pageNum}&limit=10`);
      
      if (overwrite) {
        setPosts(res.data.posts);
      } else {
        setPosts(prev => {
          // Prevent duplicates
          const newPosts = res.data.posts.filter(
            (np: any) => !prev.some(p => p._id === np._id)
          );
          return [...prev, ...newPosts];
        });
      }
      
      setHasMore(res.data.currentPage < res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1, true);

    const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://devexchange.onrender.com');
    
    socket.on('new_social_post', (data) => {
      setPosts(prev => {
        if (prev.some(p => p._id === data.post._id)) return prev;
        return [data.post, ...prev]
      });
    });

    socket.on('post_liked', (data) => {
      setPosts(prev => prev.map(p => {
        if (p._id === data.postId) {
          return { ...p, likeCount: data.likeCount };
        }
        return p;
      }));
    });

    socket.on('post_commented', (data) => {
      setPosts(prev => prev.map(p => {
        if (p._id === data.postId) {
          return { ...p, commentCount: p.commentCount + 1 };
        }
        return p;
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchPosts]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  const likePost = async (postId: string) => {
    if (!user) return;
    try {
      const res = await api.post(`/social/posts/${postId}/like`);
      setPosts(prev => prev.map(p => {
        if (p._id === postId) {
          return { ...p, likes: res.data, likeCount: res.data.length };
        }
        return p;
      }));
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  const sharePost = async (postId: string) => {
    if (!user) return;
    try {
      const res = await api.post(`/social/posts/${postId}/share`);
      setPosts(prev => prev.map(p => {
        if (p._id === postId) {
          return { ...p, shareCount: res.data.shareCount };
        }
        return p;
      }));
    } catch (err) {
      console.error('Failed to share post', err);
    }
  };

  return { posts, loading, hasMore, loadMore, likePost, sharePost, refresh: () => fetchPosts(1, true) };
}
