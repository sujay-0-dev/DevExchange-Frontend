"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { WarningBanner } from '@/components/auth/WarningBanner';
import { KeyRound, Wand2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function SetNewPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get('requestId');
  
  const [otp, setOtp] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionOtp = sessionStorage.getItem('temp_reset_otp');
    if (sessionOtp && requestId) {
      setOtp(sessionOtp);
    } else {
      router.push('/login');
    }
  }, [requestId, router]);

  const handleGenerate = () => {
    const length = 12;
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const all = upper + lower;
    
    let gen = '';
    gen += upper[Math.floor(Math.random() * upper.length)];
    gen += lower[Math.floor(Math.random() * lower.length)];
    for (let i = 2; i < length; i++) {
      gen += all[Math.floor(Math.random() * all.length)];
    }
    
    // Shuffle
    gen = gen.split('').sort(() => Math.random() - 0.5).join('');
    setPassword(gen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/reset-password', {
        requestId,
        otp,
        newPassword: password
      });
      
      sessionStorage.removeItem('temp_reset_otp');
      toast.success('Your password has been reset successfully!');
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to apply new password.');
    } finally {
      setLoading(false);
    }
  };

  if (!otp) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full mb-4">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create New Password</CardTitle>
          <CardDescription className="mt-2">
            Type a strict custom password or autogenerate a secure one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 relative">
              <label htmlFor="password" className="text-sm font-medium">New Password</label>
              <div className="flex items-center gap-2">
                <Input
                  id="password"
                  type="text"
                  placeholder="Enter secure password..."
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-12 flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGenerate}
                  className="h-12 px-3 hover:bg-primary/10 hover:text-primary transition-colors"
                  title="Auto-Generate secure 12-char string"
                >
                  <Wand2 className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-right">Must be at least 8 characters long.</p>
            </div>

            {error && <WarningBanner message={error} type="error" />}

            <Button type="submit" className="w-full h-12 mt-4" disabled={loading || !password}>
              {loading ? 'Saving...' : 'Set Password and Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
