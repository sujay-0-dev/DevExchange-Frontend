"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

export function LanguageVerificationModal() {
  const { t, i18n } = useTranslation();
  const { pendingLanguage, setPendingLanguage, setLanguage } = useLanguageStore();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [method, setMethod] = useState<"email" | "mobile" | null>(null);

  const getLanguageName = (code: string) => {
    const names: Record<string, string> = {
      en: "English 🇬🇧", es: "Spanish 🇪🇸", hi: "Hindi 🇮🇳",
      pt: "Portuguese 🇧🇷", zh: "Chinese 🇨🇳", fr: "French 🇫🇷"
    };
    return names[code] || code;
  };

  useEffect(() => {
    if (pendingLanguage) {
      const requestSwitch = async () => {
        try {
          const res = await api.post("/language/request-switch", {
            targetLanguage: pendingLanguage
          });
          setRequestId(res.data.requestId);
          setMethod(res.data.method);
          toast.success(res.data.message);
          if (res.data.otp) {
            toast('MOCK OTP (Dev): ' + res.data.otp, { duration: 10000 });
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to initiate language switch");
          setPendingLanguage(null);
        }
      };
      
      requestSwitch();
    } else {
      setOtp("");
      setRequestId(null);
    }
  }, [pendingLanguage, setPendingLanguage]);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6 || !requestId) {
      toast.error(t("language.invalidOtp") || "Invalid OTP");
      return;
    }

    setLoading(true);
    try {
      await api.post("/language/verify-switch", {
        requestId,
        otp
      });

      // Verification successful
      setLanguage(pendingLanguage as string);
      i18n.changeLanguage(pendingLanguage as string);
      toast.success(t("language.success") || "Language switched successfully!");
      setPendingLanguage(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("language.invalidOtp") || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!pendingLanguage} onOpenChange={(open) => !open && setPendingLanguage(null)}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>🔐</span> {t('language.verificationRequired')}
          </DialogTitle>
          <DialogDescription>
            {t('language.switchingTo')}: <strong>{pendingLanguage ? getLanguageName(pendingLanguage) : ''}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <p className="text-sm text-center font-medium bg-muted/50 p-3 rounded-md">
            {method === 'email' ? '📧 ' + t('language.otpSentEmail') : '📱 ' + t('language.otpSentMobile')}
          </p>

          <div className="space-y-2 mt-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">{t('language.enterOtp')}</label>
            <Input 
              type="text" 
              maxLength={6} 
              placeholder="000000"
              className="text-center text-lg tracking-[0.5em] font-mono"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\\D/g, ''))}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setPendingLanguage(null)} disabled={loading}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleVerify} disabled={loading || otp.length !== 6}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {t('language.verify')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
