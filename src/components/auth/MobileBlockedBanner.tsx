import { Card, CardContent } from "@/components/ui/card";

export function MobileBlockedBanner({ blockedData }: { blockedData: any }) {
  if (!blockedData) return null;

  return (
    <Card className="w-full bg-amber-500/10 border-amber-500/50">
      <CardContent className="pt-6 text-center">
        <div className="mx-auto w-12 h-12 bg-amber-500/20 flex items-center justify-center rounded-full mb-4">
          <span className="text-2xl">📱</span>
        </div>
        <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-500 mb-2">
          Mobile Login Restricted
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Mobile access is only available between<br/>
          <strong>{blockedData.allowedWindow || '10:00 AM – 1:00 PM IST'}</strong>
        </p>
        <div className="p-3 bg-background/50 rounded-md border text-sm font-medium">
          Current time: {blockedData.currentISTTime || 'Unknown'}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Please try again during the allowed time window.
        </p>
      </CardContent>
    </Card>
  );
}
