"use client";
import { useState, useEffect } from 'react';

export function CountdownTimer({ expiresAt, onExpire }: { expiresAt: string | Date, onExpire?: () => void }) {
  const [timeLeft, setTimeLeft] = useState<number>(-1); // -1 signifies initializing

  useEffect(() => {
    const end = new Date(expiresAt).getTime();
    
    const tick = () => {
      const remaining = Math.max(0, end - Date.now());
      setTimeLeft(remaining);
      if (remaining === 0 && onExpire) {
        onExpire();
      }
    };
    
    tick(); // Initial tick
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (timeLeft === -1) return null; // Hydration avoidance

  if (timeLeft === 0) {
    return <div className="text-red-500 font-medium text-center">OTP Expired. Please request a new one tomorrow or via a different method.</div>;
  }

  const minutes = Math.floor((timeLeft / 1000) / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  
  const isDanger = timeLeft < 120000; // less than 2 minutes

  return (
    <div className={`font-mono text-sm font-medium flex items-center justify-center gap-2 ${isDanger ? 'text-red-500' : 'text-muted-foreground'}`}>
      <span>⏱️ Expires in:</span>
      <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
    </div>
  );
}
