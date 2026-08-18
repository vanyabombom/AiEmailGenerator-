"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Check, Sparkles, Zap, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckoutModal } from "@/components/pricing/checkout-modal";
import { useAuth } from "@/lib/auth-context";

export default function PricingPage() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<"pro" | "enterprise" | null>(null);

  const tiers = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for testing and lightweight email drafting.",
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        "10 Email generations per month",
        "Google Gemini 1.5 streaming",
        "All 6 Tone selections",
        "Draft History Drawer (5 items)",
        "Standard support",
      ],
      highlighted: false,
      ctaText: "Current Plan",
    },
    {
      id: "pro",
      name: "Pro",
      description: "For sales reps, founders, and active copywriters.",
      priceMonthly: 19,
      priceYearly: 15,
      features: [
        "250 Email generations per month",
        "High-priority Gemini AI streaming",
        "Unlimited Draft History Storage",
        "Custom Recipient & Sender presets",
        "Export to Markdown & Plaintext",
        "Offline Mock Mode Toggle",
        "Priority email support",
      ],
      highlighted: true,
      ctaText: "Upgrade to Pro",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For high-volume teams requiring unlimited scale.",
      priceMonthly: 49,
      priceYearly: 39,
      features: [
        "Unlimited Email Generations",
        "Custom API integrations",
        "Dedicated Supabase DB tenant",
        "Team Workspace collaboration",
        "24/7 SLA Dedicated Support",
        "Custom brand tone fine-tuning",
      ],
      highlighted: false,
      ctaText: "Upgrade to Enterprise",
    },
  ];

  const handleSelectTier = (tierId: string) => {
    if (tierId === "pro" || tierId === "enterprise") {
      setSelectedPlan(tierId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="gradient" className="px-4 py-1 text-xs">
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Choose the Perfect Plan for Your Team
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Streamline your email communications with intelligent AI streaming. Upgrade or downgrade anytime.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center space-x-3">
            <span className={`text-xs font-semibold ${billingCycle === "monthly" ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-800 p-1 transition-colors"
            >
              <div
                className={`w-6 h-6 rounded-full bg-indigo-500 shadow-md transition-transform duration-300 ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
              Annual Billing <Badge variant="success" className="text-[10px] px-2">Save 20%</Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => {
            const price = billingCycle === "yearly" ? tier.priceYearly : tier.priceMonthly;
            const isCurrent = user?.plan === tier.id;

            return (
              <Card
                key={tier.id}
                className={`relative glass-card flex flex-col justify-between p-6 rounded-3xl ${
                  tier.highlighted
                    ? "border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 bg-white dark:bg-slate-900/90"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold text-xs shadow-md">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">{tier.name}</CardTitle>
                    <CardDescription className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {tier.description}
                    </CardDescription>

                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900 dark:text-white">${price}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">/ month</span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 border-t border-slate-200 dark:border-slate-800/60 pt-6 space-y-3">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Included Features
                    </span>
                    <ul className="space-y-2.5">
                      {tier.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center space-x-2.5 text-xs text-slate-700 dark:text-slate-300">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>

                <CardFooter className="p-0 pt-8 mt-4">
                  <Button
                    onClick={() => handleSelectTier(tier.id)}
                    disabled={isCurrent}
                    variant={tier.highlighted ? "gradient" : "outline"}
                    className="w-full gap-2 font-semibold"
                  >
                    {isCurrent ? "Active Plan" : tier.ctaText}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Upgrade Simulation Modal */}
      {selectedPlan && (
        <CheckoutModal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          planName={selectedPlan}
          price={
            selectedPlan === "pro"
              ? billingCycle === "yearly"
                ? 15
                : 19
              : billingCycle === "yearly"
              ? 39
              : 49
          }
          billingCycle={billingCycle}
        />
      )}

      <Footer />
    </div>
  );
}
