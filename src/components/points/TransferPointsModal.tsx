"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/api";
import { Search, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  _id: string;
  name: string;
  points: number;
  avatar?: string;
}

interface TransferPointsModalProps {
  currentUserId: string;
  currentUserPoints: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  preSelectedTargetUser?: User | null;
}

export function TransferPointsModal({
  currentUserId,
  currentUserPoints,
  isOpen,
  onOpenChange,
  onSuccess,
  preSelectedTargetUser = null
}: TransferPointsModalProps) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(preSelectedTargetUser);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (preSelectedTargetUser) {
        setSelectedUser(preSelectedTargetUser);
      } else {
        setSelectedUser(null);
        setSearchQuery("");
      }
      setAmount("");
    }
  }, [isOpen, preSelectedTargetUser]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1 && !selectedUser) {
        setSearching(true);
        try {
          // Fallback if generic search doesn't return users, handle it via /api/users
          const res = await api.get(`/users?search=${encodeURIComponent(searchQuery)}`);
          // Filter out self
          const users = res.data.filter((u: any) => u._id !== currentUserId).slice(0, 5);
          setSearchResults(users);
        } catch (error) {
          console.error("User search failed", error);
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, currentUserId, selectedUser]);

  const handleTransfer = async () => {
    const numAmount = parseInt(amount, 10);
    
    if (currentUserPoints <= 10) {
      toast.error("You need more than 10 points to transfer.");
      return;
    }
    if (!numAmount || numAmount <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    if (numAmount > currentUserPoints) {
      toast.error("Insufficient points.");
      return;
    }
    if (!selectedUser) {
      toast.error("Please select a user to transfer to.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/points/transfer", {
        toUserId: selectedUser._id,
        amount: numAmount
      });
      
      toast.success(`✅ ${numAmount} points sent to ${selectedUser.name}!`);
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Transfer failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>💸</span> Transfer Points
          </DialogTitle>
          <DialogDescription>
            Your current balance: <strong>{currentUserPoints} pts</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {!selectedUser ? (
            <div className="relative">
              <label className="text-sm font-medium mb-1 block">Search user:</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder="Search by name..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {searching && (
                <div className="mt-2 flex items-center justify-center p-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Searching...
                </div>
              )}
              
              {searchResults.length > 0 && !selectedUser && (
                <div className="mt-2 border rounded-md shadow-sm max-h-48 overflow-y-auto w-full bg-background absolute z-10 w-full top-[60px]">
                  {searchResults.map((user) => (
                    <div 
                      key={user._id} 
                      className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b last:border-0"
                      onClick={() => {
                        setSelectedUser(user);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.points || 0} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 border rounded-md flex justify-between items-center bg-muted/30">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`} />
                  <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Selected User</span>
                  <span className="font-medium text-sm">{selectedUser.name}</span>
                </div>
              </div>
              {!preSelectedTargetUser && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                  Change
                </Button>
              )}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium">Amount to transfer:</label>
            <Input 
              type="number" 
              min={1} 
              max={currentUserPoints} 
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="text-yellow-500">⚠️</span> You must keep more than 10 pts in your balance.
          </p>

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleTransfer} 
              disabled={loading || !selectedUser || !amount || parseInt(amount, 10) <= 0 || currentUserPoints <= 10}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Transferring..." : "Transfer Points →"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
