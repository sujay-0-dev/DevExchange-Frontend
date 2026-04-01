import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";
import { OTPInput } from "@/components/auth/OTPInput";
import { CountdownTimer } from "@/components/auth/CountdownTimer";
import { WarningBanner } from "@/components/auth/WarningBanner";
import { useAuth } from '@/lib/auth';

export function LoginOTPModal({ open, onOpenChange, otpRequestId, onVerifySuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleVerify = async () => {
    if (!otp || otp.length !== 6 || !otpRequestId) {
      setError("Invalid OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/verify-login-otp", {
        otpRequestId,
        otp
      });

      // Verification successful
      toast.success(res.data.message || "Login successful!");
      login(res.data.token, res.data.user);
      if (onVerifySuccess) onVerifySuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>🔐</span> Chrome Login Verification
          </DialogTitle>
          <DialogDescription>
            📧 An OTP has been sent to your registered email address.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <OTPInput length={6} onChange={setOtp} />

          <div className="mb-2 text-center">
            <CountdownTimer expiresAt={expiresAt} onExpire={() => setError('OTP has expired. Please go back and try again.')} />
          </div>

          {error && <WarningBanner message={error} type="error" />}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleVerify} disabled={loading || otp.length !== 6}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Verify & Login →
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
