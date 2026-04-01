"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { WarningBanner } from '@/components/auth/WarningBanner';
import { MethodToggle } from '@/components/auth/MethodToggle';
import { OTPInput } from '@/components/auth/OTPInput';
import { CountdownTimer } from '@/components/auth/CountdownTimer';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Verification State
  const [requestId, setRequestId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'phone' && (!phone || phone.length < 5)) {
      setError('A valid phone number is required to verify via SMS.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register-otp', { 
        identifier: method === 'email' ? email : phone,
        identifierType: method
      });
      
      setRequestId(res.data.requestId);
      const expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() + 10);
      setExpiresAt(expiry);
      setStep(2);
      toast.success('Verification OTP sent successfully!');
      if (res.data.otp) {
        toast('MOCK OTP (Dev): ' + res.data.otp, { duration: 10000 });
      }
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError('Rate limit exceeded. Try again in an hour.');
      } else {
        setError(err.response?.data?.message || 'Failed to dispatch verification OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please fill all 6 digits.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', { 
        name, 
        email, 
        phone: phone || undefined, 
        password, 
        requestId, 
        otp 
      });
      
      toast.success('Registration successful. Welcome to DevExchange!');
      login(res.data.token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center py-12 px-4 shadow-sm">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{step === 1 ? t('auth.signUp') : 'Verify Account'}</CardTitle>
          <CardDescription>
            {step === 1 ? 'Configure your profile and choose a verification method.' : `Enter the 6-digit OTP sent to your ${method}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address <span className="text-red-500">*</span></label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone Number (Optional)</label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mt-4 border-t pt-4">
                <label className="text-sm font-medium block mb-2 text-center text-muted-foreground">Verification Route</label>
                <MethodToggle method={method} setMethod={setMethod} />
              </div>

              {error && <WarningBanner message={error} type="error" />}

              <Button type="submit" className="w-full h-12" disabled={loading}>
                {loading ? 'Generating Security Token...' : `Verify via ${method === 'email' ? 'Email' : 'SMS'}`}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndRegister} className="grid gap-4">
              <OTPInput length={6} onChange={setOtp} />
              
              <div className="mb-2">
                {expiresAt && <CountdownTimer expiresAt={expiresAt} onExpire={() => setError('OTP has expired. Please go back and try again.')} />}
              </div>

              {error && <WarningBanner message={error} type="error" />}

              <Button type="submit" className="w-full h-12 mt-2" disabled={loading || otp.length !== 6}>
                {loading ? 'Finalizing Profile...' : 'Complete Registration'}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(1)} disabled={loading}>
                ← Back to Edit
              </Button>
            </form>
          )}
        </CardContent>
        {step === 1 && (
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              Already have an account?{' '}
              <Link href="/login" className="underline hover:text-primary">
                {t('auth.login')}
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
