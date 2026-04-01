"use client";
import { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';

export function PasswordDisplay({ password }: { password: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-muted border border-border rounded-md p-6 my-6 flex flex-col items-center gap-4">
      <div className="font-mono text-2xl sm:text-3xl font-bold tracking-wider text-foreground select-all text-center break-all">
        {password}
      </div>
      <button 
        onClick={handleCopy}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${copied ? 'bg-green-500/20 text-green-600' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
      >
        {copied ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy to Clipboard
          </>
        )}
      </button>
    </div>
  );
}
