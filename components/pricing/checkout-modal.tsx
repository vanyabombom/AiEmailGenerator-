"use client";

import React, { useState, useEffect } from "react";
import { Check, Sparkles, X, ShieldCheck, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "@/components/lenis-provider";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: 'pro' | 'enterprise';
  price: number;
  billingCycle: 'monthly' | 'yearly';
}

export function CheckoutModal({
  isOpen,
  onClose,
  planName,
  price,
  billingCycle,
}: CheckoutModalProps) {
  const { upgradePlan } = useAuth();
  const { stop, start } = useLenis();
  const [isProcessing, setIsProcessing] = useState(false);

  // Freeze/resume Lenis when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      stop();
    } else {
      start();
    }
  }, [isOpen, stop, start]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleConfirmUpgrade = async () => {
    setIsProcessing(true);
    await new Promise((res) => setTimeout(res, 1200));
    upgradePlan(planName);
    setIsProcessing(false);
    triggerConfetti();
    toast.success(`Successfully upgraded to ${planName.toUpperCase()} plan! 🎉`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-6"
            data-lenis-prevent
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  Upgrade to {planName}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Selected Tier:</span>
                <span className="text-indigo-600 dark:text-indigo-400 capitalize">{planName} Plan</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Billing Interval:</span>
                <span className="text-indigo-600 dark:text-indigo-400 capitalize">{billingCycle}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-base font-bold text-slate-900 dark:text-white">
                <span>Total Due Today:</span>
                <span className="text-emerald-600 dark:text-emerald-400">${price}</span>
              </div>
            </div>

            {/* Simulated Payment details */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                Simulated Checkout Payment Method
              </span>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-mono text-slate-700 dark:text-slate-300">•••• •••• •••• 4242</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">Test Sandbox</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Instant activation & 14-day money-back guarantee.</span>
            </div>

            <Button
              onClick={handleConfirmUpgrade}
              disabled={isProcessing}
              variant="gradient"
              size="lg"
              className="w-full gap-2 shadow-xl shadow-indigo-500/25"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing Payment...
                </>
              ) : (
                <>
                  Confirm Upgrade (${price})
                </>
              )}
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
