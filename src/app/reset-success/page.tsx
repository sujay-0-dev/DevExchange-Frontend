"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PasswordDisplay } from '@/components/auth/PasswordDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function ResetSuccessPage() {
  const router = useRouter();
  const [password, setPassword] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const tempPwd = sessionStorage.getItem('temp_reset_pwd');
    if (tempPwd) {
      setPassword(tempPwd);
      sessionStorage.removeItem('temp_reset_pwd'); // Erase from memory instantly
    } else {
      // If no password in session, user probably refreshed or arrived illegally
      router.push('/login');
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  if (!password) return null; // Hydration avoidance

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-green-500/10 flex items-center justify-center rounded-full mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Password Reset Successful!</CardTitle>
          <CardDescription className="mt-2 text-base">
            Your new generated password is:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordDisplay password={password} />
          
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 p-4 rounded-md text-sm font-medium mb-6">
            ⚠️ Please save this password now. It will not be shown again once you leave this page.
          </div>
          
          <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 text-blue-700 p-4 rounded-md text-sm mb-6">
            <span className="text-xl leading-none">💡</span>
            <p>We recommend changing it to something memorable after you successfully log in.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={() => router.push('/login')} className="w-full h-12">
            Go to Login →
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Redirecting in {countdown} seconds...
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
