"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { LeaderboardTable } from "@/components/points/LeaderboardTable";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function LeaderboardPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/points/leaderboard');
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to load leaderboard", error);
        toast.error("Failed to load leaderboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 w-full">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
          🏆 {t('nav.leaderboard')}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          The most helpful members of the DevExchange community.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <LeaderboardTable users={users} />
      )}
    </div>
  );
}
