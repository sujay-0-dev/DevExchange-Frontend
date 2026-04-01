import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeaderboardUser {
  _id: string;
  name: string;
  points: number;
  level: number;
  badges: string[];
  avatar?: string;
}

export function LeaderboardTable({ users }: { users: LeaderboardUser[] }) {
  const getMedal = (index: number) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return `${index + 1}`;
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted uppercase text-muted-foreground border-b text-xs font-semibold">
            <tr>
              <th className="px-4 py-3 text-center w-16">#</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3 text-right">Points</th>
              <th className="px-4 py-3 text-center w-24">Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No users found on the leaderboard yet.
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr key={user._id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-4 text-center text-lg font-medium">
                    {getMedal(idx)}
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/profile/${user._id}`} className="flex items-center gap-3 group">
                      <Avatar className="h-10 w-10 border group-hover:border-primary transition-colors">
                        <AvatarImage src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {user.name}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-lg text-yellow-600 dark:text-yellow-500">
                    {user.points || 0}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 font-bold border">
                      {user.level || 0}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
