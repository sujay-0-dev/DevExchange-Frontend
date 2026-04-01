"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import api from "@/lib/api";

interface Plan {
  name: string;
  price: number;
  questionsPerDay: string | number;
  planId: string;
}

interface PaymentModalProps {
  plan: Plan;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PaymentModal({ plan, isOpen, onOpenChange, onSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      const { data: orderData } = await api.post("/payments/create-order", { plan: plan.name.toLowerCase() });
      
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "DevExchange",
        description: `Upgrade to ${plan.name} Plan`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            await api.post("/payments/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              plan: plan.name.toLowerCase()
            });
            toast.success(`Successfully upgraded to ${plan.name} plan!`);
            onSuccess();
            onOpenChange(false);
          } catch (error: any) {
            toast.error(error?.response?.data?.message || "Payment verification failed.");
          }
        },
        prefill: {
          name: "DevExchange User",
        },
        theme: {
          color: "#3b82f6"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error(response.error.description || "Payment failed.");
      });
      rzp.open();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to initiate payment. Are you within the allowed time window?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to {plan.name}</DialogTitle>
          <DialogDescription>
            You are about to upgrade to the {plan.name} plan for ₹{plan.price}/month.
            This plan provides capacity for {plan.questionsPerDay} questions per day.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : "Pay with Razorpay"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
