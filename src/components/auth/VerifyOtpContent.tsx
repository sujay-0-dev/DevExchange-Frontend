"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OTPInput } from '@/components/auth/OTPInput';
import { CountdownTimer } from '@/components/auth/CountdownTimer';
import { WarningBanner } from '@/components/auth/WarningBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailOpen } from 'lucide-react';
import api from '@/lib/api';

export function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get('requestId');
  const target = searchParams.get('target');

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!requestId) {
      router.push('/forgot-password');
      return;
    }
    const date = new Date();
    date.setMinutes(date.getMinutes() + 10);
    setExpiresAt(date);
  }, [requestId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/verify-otp', {
        requestId,
        otp
      });

      sessionStorage.setItem('temp_reset_otp', otp);
      router.push(`/set-new-password?requestId=${requestId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!expiresAt) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full mb-4">
            <MailOpen className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Enter Your OTP</CardTitle>
          <CardDescription className="mt-2">
            We sent a secure 6-digit code to <br/>
            <strong className="text-foreground">{target}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <OTPInput length={6} onChange={setOtp} />
            
            <div className="mb-6">
              <CountdownTimer expiresAt={expiresAt} />
            </div>

            {error && (
              <div className="mb-6">
                <WarningBanner message={error} type="error" />
              </div>
            )}

            <Button type="submit" className="w-full h-12" disabled={loading || otp.length !== 6}>
              {loading ? 'Verifying...' : 'Verify OTP'}
             </Button>
           </form>
         </CardContent>
       </Card>
     </div>
   );
}
