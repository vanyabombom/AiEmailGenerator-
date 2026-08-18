"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EmailForm } from "@/components/dashboard/email-form";
import { EmailOutput } from "@/components/dashboard/email-output";
import { HistoryDrawer } from "@/components/dashboard/history-drawer";
import { EmailGenerateConfig, EmailDraft } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { History, Sparkles, Zap, ShieldAlert, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export default function DashboardPage() {
  const { user, incrementQuota } = useAuth();
  const [outputContent, setOutputContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastConfig, setLastConfig] = useState<EmailGenerateConfig | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drafts, setDrafts] = useState<EmailDraft[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("mailcraft_drafts");
    if (saved) {
      try {
        setDrafts(JSON.parse(saved));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  const saveDraftsToStorage = (newDrafts: EmailDraft[]) => {
    setDrafts(newDrafts);
    localStorage.setItem("mailcraft_drafts", JSON.stringify(newDrafts));
  };

  const handleGenerate = async (config: EmailGenerateConfig) => {
    // Validate topic before proceeding
    if (!config.topic.trim()) {
      toast.error("Please enter an email topic or goal before generating.");
      return;
    }

    if (user && user.emailsGenerated >= user.maxQuota) {
      toast.error(
        `Usage quota reached (${user.emailsGenerated}/${user.maxQuota})! Please upgrade your plan for higher limits.`
      );
      return;
    }

    // Abort any in-progress generation to prevent race conditions
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLastConfig(config);
    setIsGenerating(true);
    setOutputContent("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to initialize AI stream handler.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("ReadableStream not supported by response.");
      }

      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setOutputContent(accumulated);
      }

      incrementQuota();
      toast.success("AI Email generated successfully!");
    } catch (err: unknown) {
      // Don't show error toast for intentional aborts
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      const message = err instanceof Error ? err.message : "Failed to generate email.";
      console.error(err);
      toast.error(message);
    } finally {
      setIsGenerating(false);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  };

  const handleRegenerate = () => {
    if (lastConfig) {
      handleGenerate(lastConfig);
    }
  };

  const handleSaveDraft = () => {
    if (!outputContent || !lastConfig) return;
    const newDraft: EmailDraft = {
      id: "draft_" + Math.random().toString(36).substring(2, 9),
      topic: lastConfig.topic,
      tone: lastConfig.tone,
      length: lastConfig.length,
      content: outputContent,
      createdAt: new Date().toISOString(),
      wordCount: outputContent.trim().split(/\s+/).length,
      charCount: outputContent.length,
    };
    saveDraftsToStorage([newDraft, ...drafts]);
    toast.success("Draft saved to history drawer!");
  };

  const handleDeleteDraft = (id: string) => {
    const updated = drafts.filter((d) => d.id !== id);
    saveDraftsToStorage(updated);
    toast.success("Draft deleted.");
  };

  const quotaPercent = user ? Math.min(100, Math.round((user.emailsGenerated / user.maxQuota) * 100)) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header Banner */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-indigo-500" />
              AI Email Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Welcome back, <strong className="text-slate-900 dark:text-slate-200">{user?.name || "Member"}</strong> ({user?.plan.toUpperCase() || "FREE"} Plan)
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            {/* Quota Usage Meter */}
            <div className="space-y-1.5 min-w-[160px]">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-400">Usage Quota</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">{user?.emailsGenerated || 0} / {user?.maxQuota || 10}</span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    quotaPercent >= 100
                      ? "bg-gradient-to-r from-red-500 to-orange-500"
                      : "bg-gradient-to-r from-indigo-500 to-pink-500"
                  }`}
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
              {quotaPercent >= 100 && (
                <p className="text-[10px] text-red-500 dark:text-red-400 font-semibold">
                  Quota exhausted — upgrade for more
                </p>
              )}
            </div>

            <Link href="/pricing">
              <Button variant="gradient" size="sm" className="gap-1.5 shadow-md text-xs">
                Upgrade <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>

            <Button
              onClick={() => setIsDrawerOpen(true)}
              variant="outline"
              size="sm"
              className="gap-2 text-xs"
            >
              <History className="h-4 w-4 text-indigo-500" />
              History ({drafts.length})
            </Button>
          </div>
        </div>

        {/* Main 2-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5">
            <EmailForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          </div>

          {/* Output Display Column */}
          <div className="lg:col-span-7">
            <EmailOutput
              content={outputContent}
              isGenerating={isGenerating}
              onRegenerate={handleRegenerate}
              onSaveDraft={handleSaveDraft}
            />
          </div>
        </div>

        {/* History Slide Drawer */}
        <HistoryDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          drafts={drafts}
          onSelectDraft={(draft) => {
            setOutputContent(draft.content);
            toast.info(`Loaded draft: ${draft.topic}`);
          }}
          onDeleteDraft={handleDeleteDraft}
        />
      </main>

      <Footer />
    </div>
  );
}
