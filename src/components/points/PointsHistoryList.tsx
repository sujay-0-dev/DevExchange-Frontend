import { formatDistanceToNow } from 'date-fns';

export function PointsHistoryList({ history }: { history: any[] }) {
  if (!history || history.length === 0) {
    return <div className="text-sm text-muted-foreground pt-2">No recent activity.</div>;
  }
  
  return (
    <div className="space-y-3">
      {history.slice(0, 5).map((tx) => (
        <div key={tx._id} className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0">
          <div className="flex gap-2 items-center text-left">
            <span className={`font-semibold shrink-0 w-8 text-right ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {tx.amount > 0 ? '+' : ''}{tx.amount}
            </span>
            <span className="text-muted-foreground truncate max-w-[150px]">{tx.description}</span>
          </div>
          <span className="text-xs text-muted-foreground shrink-0 pl-2">
            {formatDistanceToNow(new Date(tx.createdAt))} ago
          </span>
        </div>
      ))}
    </div>
  );
}
