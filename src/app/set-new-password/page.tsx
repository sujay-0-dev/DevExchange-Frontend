import { Suspense } from 'react';
import { SetNewPasswordContent } from '@/components/auth/SetNewPasswordContent';

export const dynamic = 'force-dynamic';

export default function SetNewPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">Loading secure environment...</div>}>
      <SetNewPasswordContent />
    </Suspense>
  );
}
