import { Suspense } from 'react';
import { VerifyOtpContent } from '@/components/auth/VerifyOtpContent';

export const dynamic = 'force-dynamic';

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">Loading verification...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
