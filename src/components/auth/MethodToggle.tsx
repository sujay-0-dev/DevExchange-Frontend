"use client";
export function MethodToggle({ method, setMethod }: { method: 'email' | 'phone', setMethod: (m: 'email' | 'phone') => void }) {
  return (
    <div className="flex bg-muted p-1 rounded-md w-full mb-6">
      <button 
        type="button"
        className={`flex-1 py-2 text-sm font-medium rounded-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary ${method === 'email' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'}`}
        onClick={() => setMethod('email')}
      >
        Email Address
      </button>
      <button 
        type="button"
        className={`flex-1 py-2 text-sm font-medium rounded-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary ${method === 'phone' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'}`}
        onClick={() => setMethod('phone')}
      >
        Phone Number
      </button>
    </div>
  );
}
