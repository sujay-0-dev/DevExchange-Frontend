"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Monitor, Smartphone, Globe } from "lucide-react";
import api from "@/lib/api";

export function LoginHistoryTable() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/auth/login-history');
        setHistory(res.data.history);
      } catch (err) {
        console.error("Failed to fetch login history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">✅ Success</Badge>;
      case 'blocked':
        return <Badge variant="destructive">🔴 Blocked</Badge>;
      case 'otp_pending':
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">⏳ Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDeviceIcon = (type: string) => {
    if (type === 'mobile' || type === 'tablet') return <Smartphone className="h-4 w-4 mr-2 text-muted-foreground" />;
    return <Monitor className="h-4 w-4 mr-2 text-muted-foreground" />;
  };

  // Partially mask IP
  const maskIp = (ip: string) => {
    if (!ip || ip === 'Unknown') return 'Unknown';
    const parts = ip.split('.');
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.*`;
    return ip; // Let IPv6 pass or handle similarly
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <Card className="mt-6 border-muted/60">
      <CardHeader className="bg-muted/20 border-b pb-4">
        <CardTitle className="flex items-center text-lg">
          🔐 Login History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Date / Time</th>
                <th className="px-4 py-3 font-medium">Browser</th>
                <th className="px-4 py-3 font-medium">OS</th>
                <th className="px-4 py-3 font-medium">Device</th>
                <th className="px-4 py-3 font-medium">IP</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/50">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No login history records found.
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record._id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium">
                        {new Date(record.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(record.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>{record.browser} {record.browserVersion && <span className="text-xs text-muted-foreground">v{record.browserVersion.split('.')[0]}</span>}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{record.os}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center capitalize">
                        {getDeviceIcon(record.deviceType)}
                        {record.deviceType}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {maskIp(record.ipAddress)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        {getStatusBadge(record.status)}
                        {record.status === 'blocked' && record.blockedReason && (
                          <span className="text-[10px] text-destructive max-w-[150px] truncate" title={record.blockedReason}>
                            {record.blockedReason}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
