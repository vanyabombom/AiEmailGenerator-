"use client";

import React from "react";
import { Copy, RefreshCw, BookmarkPlus, Zap, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { calculateStats, copyToClipboard } from "@/lib/utils";

interface EmailOutputProps {
  content: string;
  isGenerating: boolean;
  onRegenerate: () => void;
  onSaveDraft: () => void;
}

export function EmailOutput({
  content,
  isGenerating,
  onRegenerate,
  onSaveDraft,
}: EmailOutputProps) {
  const [copied, setCopied] = React.useState(false);
  const { words, chars } = calculateStats(content);

  const handleCopy = async () => {
    if (!content) return;
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      toast.success("Email copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy — try selecting the text manually.");
    }
  };

  return (
    <Card className="glass-panel border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
      <div>
        <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <FileText className="h-5 w-5 text-indigo-500" />
              Generated Email Output
            </CardTitle>

            {isGenerating && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-semibold animate-pulse">
                <Zap className="h-3.5 w-3.5" /> Streaming...
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {!content && !isGenerating ? (
            <div className="min-h-[280px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">No Email Generated Yet</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Fill in your email goal and click &quot;Generate AI Email&quot; to see streaming output here.
              </p>
            </div>
          ) : isGenerating && !content ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : (
            <div className="relative">
              <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 min-h-[260px] shadow-inner selection:bg-indigo-500/30">
                {content}
                {isGenerating && (
                  <span className="inline-block w-2 h-4 ml-1 bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </div>

      {/* Footer Metrics & Actions */}
      <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Counter */}
        <div className="flex items-center space-x-4 text-xs font-mono text-slate-600 dark:text-slate-400">
          <span>Words: <strong className="text-indigo-600 dark:text-indigo-400">{words}</strong></span>
          <span>Characters: <strong className="text-indigo-600 dark:text-indigo-400">{chars}</strong></span>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-2.5 w-full sm:w-auto">
          <Button
            onClick={onRegenerate}
            disabled={isGenerating || !content}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
            Regenerate
          </Button>

          <Button
            onClick={onSaveDraft}
            disabled={!content}
            variant="secondary"
            size="sm"
            className="gap-1.5"
          >
            <BookmarkPlus className="h-4 w-4" />
            Save Draft
          </Button>

          <Button
            onClick={handleCopy}
            disabled={!content}
            variant="gradient"
            size="sm"
            className="gap-1.5"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
