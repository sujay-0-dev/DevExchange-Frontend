"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { LoginOTPModal } from '@/components/auth/LoginOTPModal';
import { MobileBlockedBanner } from '@/components/auth/MobileBlockedBanner';

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [showLoginOtpModal, setShowLoginOtpModal] = useState(false);
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null);
  const [phoneOtpRequestId, setPhoneOtpRequestId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [mobileBlocked, setMobileBlocked] = useState(false);
  const [blockedData, setBlockedData] = useState<any>(null);

  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let clientIp = undefined;
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        clientIp = (await ipRes.json()).ip;
      } catch (err) {}

      const res = await api.post('/auth/login', { email, password, clientIp });
      
      if (res.data.requiresOtp) {
        setOtpRequestId(res.data.otpRequestId);
        setPhoneOtpRequestId(res.data.phoneOtpRequestId || null);
        setUserId(res.data.userId);
        setUserPhone(res.data.hasPhone ? 'true' : null);
        setShowLoginOtpModal(true);
      } else {
        login(res.data.token, res.data.user);
        toast.success('Login successful');
      }
    } catch (err: any) {
      if (err.response?.status === 403 && err.response.data.message?.includes('Mobile login')) {
        setMobileBlocked(true);
        setBlockedData(err.response.data);
      } else {
        toast.error(err.response?.data?.message || 'Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (mobileBlocked) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center -mt-16 px-4">
        <div className="w-full max-w-sm">
          <MobileBlockedBanner blockedData={blockedData} />
          <Button variant="ghost" className="w-full mt-4" onClick={() => setMobileBlocked(false)}>
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center -mt-16">
      <LoginOTPModal 
        open={showLoginOtpModal} 
        onOpenChange={setShowLoginOtpModal} 
        otpRequestId={otpRequestId}
        phoneOtpRequestId={phoneOtpRequestId}
        userId={userId}
        userPhone={userPhone}
        onVerifySuccess={() => setShowLoginOtpModal(false)}
      />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t('auth.login')}</CardTitle>
          <CardDescription>{t('login.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="email">{t('auth.email')}</label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="password">{t('auth.password')}</label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="text-right mb-2">
              <Link href="/forgot-password"
                className="text-sm text-gray-400 hover:text-white hover:underline">
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('common.loading') : t('auth.login')}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            {t('auth.noAccount')}{' '}
            <Link href="/register" className="underline hover:text-primary">
              {t('auth.signUp')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
