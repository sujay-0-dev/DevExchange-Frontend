"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionCard } from '@/components/question-card';
import { formatDistanceToNow } from 'date-fns';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { TransferPointsModal } from '@/components/points/TransferPointsModal';
import { PointsHistoryList } from '@/components/points/PointsHistoryList';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { LoginHistoryTable } from '@/components/auth/LoginHistoryTable';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  
  const [pointsHistory, setPointsHistory] = useState<any[]>([]);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/users/${params.id}`);
      setData(res.data);
      
      // If it's the current user, fetch points history
      if (currentUser && currentUser.id === params.id) {
        const historyRes = await api.get('/points/history');
        setPointsHistory(historyRes.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load profile');
      if (err.response?.status === 404) {
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchProfile();
    }
  }, [params.id, currentUser]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;
  if (!data) return null;

  const { user, stats, recentQuestions } = data;

  return (
    <div className="flex flex-col w-full max-w-5xl px-4 py-6 md:px-8 mx-auto gap-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <Avatar className="h-32 w-32 border-4 border-background shadow-sm">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
          <AvatarFallback className="text-4xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col items-center sm:items-start flex-1 w-full gap-4">
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">Member for {formatDistanceToNow(new Date(user.createdAt))}</p>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex flex-col items-center bg-muted/50 p-4 rounded-lg min-w-[100px]">
              <span className="text-3xl font-bold text-blue-500">{user.reputation}</span>
              <span className="text-xs text-muted-foreground uppercase font-semibold">{t('profile.reputation')}</span>
            </div>
            <div className="flex flex-col items-center bg-muted/50 p-4 rounded-lg min-w-[100px]">
              <span className="text-3xl font-bold text-amber-500">{user.level}</span>
              <span className="text-xs text-muted-foreground uppercase font-semibold">Level</span>
            </div>
            <div className="flex flex-col items-center bg-muted/50 p-4 rounded-lg min-w-[100px]">
              <span className="text-3xl font-bold text-foreground">{stats.answersCount}</span>
              <span className="text-xs text-muted-foreground uppercase font-semibold">{t('profile.answers')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Badges & Stats & Points */}
        <div className="md:col-span-1 space-y-6">
        
          {/* Points Display Block */}
          <Card className="border-primary/50 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-amber-600"></div>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center text-xl">
                <span>🏆 {t('profile.points')}</span>
                <span className="text-2xl font-bold">{user.points || 0}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentUser && currentUser.id === user._id ? (
                <>
                  <div className="mt-2 mb-4">
                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground">{t('profile.history')}:</h4>
                    <PointsHistoryList history={pointsHistory} />
                  </div>
                  <Button 
                    variant="default" 
                    className="w-full mt-2" 
                    onClick={() => setIsTransferModalOpen(true)}
                    disabled={(user.points || 0) <= 10}
                    title={(user.points || 0) <= 10 ? "Need more than 10 points to transfer" : ""}
                  >
                    💸 {t('profile.transferPoints')}
                  </Button>
                </>
              ) : (
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/50 hover:bg-primary/10" 
                    onClick={() => setIsTransferModalOpen(true)}
                  >
                    Send Points →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('profile.badges')}</CardTitle>
            </CardHeader>
            <CardContent>
              {user.badges && user.badges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((badge: string) => (
                    <Badge key={badge} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                      {badge}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No badges yet. Keep contributing!</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">{stats.questionsCount}</div>
                  <div className="text-xs text-muted-foreground">{t('profile.questions')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.answersCount}</div>
                  <div className="text-xs text-muted-foreground">{t('profile.answers')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Questions</CardTitle>
              <CardDescription>The most recent questions asked by {user.name}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentQuestions.length > 0 ? (
                  recentQuestions.map((q: any) => (
                    <QuestionCard key={q._id} question={q} />
                  ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    {user.name} hasn't asked any questions yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {currentUser && (
        <TransferPointsModal 
          isOpen={isTransferModalOpen}
          onOpenChange={setIsTransferModalOpen}
          currentUserId={currentUser.id}
          currentUserPoints={currentUser.id === user._id ? user.points : currentUser.reputation} // Note: This should ideally use actual refetched points for sender if sending to others
          preSelectedTargetUser={currentUser.id !== user._id ? user : null}
          onSuccess={fetchProfile}
        />
      )}

      {currentUser && currentUser.id === user._id && (
        <LoginHistoryTable />
      )}
    </div>
  );
}
