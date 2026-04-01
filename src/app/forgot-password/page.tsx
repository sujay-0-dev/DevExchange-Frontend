"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MethodToggle } from '@/components/auth/MethodToggle';
import { WarningBanner } from '@/components/auth/WarningBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setError('Please enter your email or phone number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/forgot-password', {
        identifier,
        identifierType: method
      });

      if (res.data.otp) {
        toast('MOCK OTP (Dev): ' + res.data.otp, { duration: 10000 });
      }

      // Navigate to OTP verification page on success
      router.push(`/verify-otp?requestId=${res.data.requestId}&target=${encodeURIComponent(identifier)}`);
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError(err.response.data.message || 'You can use this option only one time per day.');
      } else {
        setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Choose a method to receive your recovery OTP code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <MethodToggle method={method} setMethod={setMethod} />
            
            <div className="space-y-2">
              <Input
                type={method === 'email' ? 'email' : 'tel'}
                placeholder={method === 'email' ? 'name@example.com' : '+1 (555) 000-0000'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={loading}
                className="h-12"
              />
            </div>

            {error && (
              <WarningBanner 
                message={error} 
                type={error.includes('one time per day') ? 'warning' : 'error'} 
              />
            )}

            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
