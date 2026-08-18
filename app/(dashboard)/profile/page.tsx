"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/lib/auth-context";
import { User, Mail, Shield, Zap, LogOut, ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    toast.info("Signed out successfully");
    router.push("/");
  };

  const quotaPercent = user ? Math.min(100, Math.round((user.emailsGenerated / user.maxQuota) * 100)) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">User Profile & Account</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Manage your subscription, view email usage metrics, and update preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Bio Card */}
          <Card className="glass-panel md:col-span-1 border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white text-2xl font-black shadow-xl">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{user?.name || "Member"}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{user?.email || "user@example.com"}</p>
            </div>
            <Badge variant="gradient" className="uppercase px-3 py-1 font-mono text-xs">
              {user?.plan || "FREE"} TIER
            </Badge>

            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="w-full gap-2 text-xs text-red-500 border-red-500/20 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </Card>

          {/* Quota & Usage Info Card */}
          <Card className="glass-panel md:col-span-2 border-slate-200 dark:border-slate-800 p-6 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-indigo-500" />
                Monthly Generation Quota
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Track your active monthly AI email generation limits.
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Emails Generated This Month</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                  {user?.emailsGenerated || 0} / {user?.maxQuota || 10}
                </span>
              </div>
              <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>{quotaPercent}% Used</span>
                <span>Resets on 1st of next month</span>
              </div>
            </div>

            {/* Plan Specs */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 dark:text-slate-400 block">AI Engine</span>
                <strong className="text-slate-900 dark:text-slate-200">Google Gemini 1.5/2.0</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 dark:text-slate-400 block">Streaming Rate</span>
                <strong className="text-emerald-600 dark:text-emerald-400">High Priority</strong>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link href="/pricing">
                <Button variant="gradient" size="sm" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Upgrade Plan Limits
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
