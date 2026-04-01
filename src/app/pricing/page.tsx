"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "@/components/PaymentModal";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import Script from "next/script";
import { useTranslation } from "react-i18next";

interface Plan {
  name: string;
  price: number;
  questionsPerDay: string | number;
  planId: string;
}

export default function PricingPage() {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentWindow, setIsPaymentWindow] = useState(false);

  useEffect(() => {
    checkPaymentWindow();
    const interval = setInterval(checkPaymentWindow, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const checkPaymentWindow = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    const hours = istTime.getUTCHours();
    const minutes = istTime.getUTCMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    // 10:00 AM IST = 600 mins, 11:00 AM IST = 660 mins
    if (totalMinutes >= 600 && totalMinutes < 660) {
      setIsPaymentWindow(true);
    } else {
      setIsPaymentWindow(false);
    }
  };

  const fetchData = async () => {
    try {
      const plansRes = await api.get("/payments/plans");
      setPlans(plansRes.data);

      try {
        const subRes = await api.get("/payments/my-subscription");
        setCurrentPlan(subRes.data.currentPlan);
      } catch (err) {
        // User might not be logged in or other error
        console.log("No active subscription/user session found");
      }
    } catch (error) {
      console.error("Failed to load pricing data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpgrade = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="container py-10 max-w-6xl mx-auto">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
        <p className="text-muted-foreground text-lg mb-4">
          Upgrade your plan to post more questions and boost your productivity.
        </p>
        {!isPaymentWindow && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <span className="text-xl">⏰</span>
            <p><strong>Payment Window Closed:</strong> Payments are accepted between 10:00 AM – 11:00 AM IST only.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan.toLowerCase() === plan.name.toLowerCase();
          
          return (
            <Card key={plan.planId} className={`relative flex flex-col ${isCurrentPlan ? 'border-primary shadow-lg ring-1 ring-primary' : ''}`}>
              {isCurrentPlan && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge variant="default">Current Plan</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4 flex items-baseline justify-center gap-x-2">
                  <span className="text-4xl font-bold tracking-tight text-primary">₹{plan.price}</span>
                  <span className="text-sm font-semibold leading-6 text-muted-foreground">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 text-center mt-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex justify-center items-center gap-2">
                    <span className="font-semibold text-foreground">{plan.questionsPerDay}</span> Questions / day
                  </li>
                  <li className="text-xs mt-4">
                    ⏰ Payments accepted: 10:00 AM – 11:00 AM IST only
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {plan.name.toLowerCase() === 'free' ? (
                  <Button className="w-full" variant="outline" disabled>
                    {isCurrentPlan ? t('subscription.currentPlan') : "Free Forever"}
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant={isCurrentPlan ? "outline" : "default"}
                    disabled={isCurrentPlan || !isPaymentWindow}
                    onClick={() => handleUpgrade(plan)}
                    title={!isPaymentWindow ? "Payment window is closed. Come back between 10-11 AM IST." : ""}
                  >
                    {isCurrentPlan ? t('subscription.currentPlan') : t('subscription.upgrade')}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {selectedPlan && (
        <PaymentModal 
          isOpen={isModalOpen} 
          onOpenChange={setIsModalOpen} 
          plan={selectedPlan} 
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
