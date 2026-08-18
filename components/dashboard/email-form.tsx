"use client";

import React, { useState } from "react";
import { Sparkles, Sliders, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { EmailGenerateConfig, EmailTone, EmailLength } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface EmailFormProps {
  onGenerate: (config: EmailGenerateConfig) => void;
  isGenerating: boolean;
}

export function EmailForm({ onGenerate, isGenerating }: EmailFormProps) {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<EmailTone>("professional");
  const [length, setLength] = useState<EmailLength>("medium");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [useMockMode, setUseMockMode] = useState(false);
  const [topicError, setTopicError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setTopicError(true);
      toast.error("Please enter an email topic or goal.");
      return;
    }
    setTopicError(false);
    onGenerate({
      topic,
      tone,
      length,
      recipientName,
      senderName,
      additionalContext,
      useMockMode,
    });
  };

  const tonesList: { value: EmailTone; label: string }[] = [
    { value: "professional", label: "👔 Professional" },
    { value: "casual", label: "☕ Casual" },
    { value: "persuasive", label: "🔥 Persuasive / Sales" },
    { value: "urgent", label: "🚨 Urgent / Priority" },
    { value: "friendly", label: "😊 Friendly / Warm" },
    { value: "empathetic", label: "🤝 Empathetic" },
  ];

  return (
    <Card className="glass-panel border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <Sliders className="h-5 w-5 text-indigo-500" />
            Email Parameters
          </CardTitle>

          {/* Mock Mode Switch */}
          <button
            type="button"
            onClick={() => setUseMockMode(!useMockMode)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {useMockMode ? (
              <ToggleRight className="h-5 w-5 text-indigo-500" />
            ) : (
              <ToggleLeft className="h-5 w-5 text-slate-400" />
            )}
            <span>Mock AI Stream: <strong className={useMockMode ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"}>{useMockMode ? "ON" : "OFF"}</strong></span>
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Topic Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              Email Topic or Primary Goal <span className="text-pink-500">*</span>
            </label>
            <Input
              placeholder="e.g. Schedule a demo for our new SaaS feature with VP of Sales"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                if (e.target.value.trim()) setTopicError(false);
              }}
              className={topicError ? "border-red-500 dark:border-red-500 focus-visible:ring-red-500" : ""}
              required
            />
            {topicError && (
              <p className="text-[11px] text-red-500 font-medium">
                This field is required — enter the primary email goal.
              </p>
            )}
          </div>

          {/* Tone & Length grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tone</label>
              <Select value={tone} onChange={(e) => setTone(e.target.value as EmailTone)}>
                {tonesList.map((t) => (
                  <option key={t.value} value={t.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Length</label>
              <Select value={length} onChange={(e) => setLength(e.target.value as EmailLength)}>
                <option value="short" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">⚡ Short (2-3 Sentences)</option>
                <option value="medium" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">📝 Medium (Balanced)</option>
                <option value="long" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">📄 Long (Detailed & Formal)</option>
              </Select>
            </div>
          </div>

          {/* Recipient & Sender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Recipient Name (Optional)</label>
              <Input
                placeholder="e.g. Sarah Connor"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sender Name (Optional)</label>
              <Input
                placeholder="e.g. Alex Rivera"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
              />
            </div>
          </div>

          {/* Additional Context */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Additional Context / Special Instructions
            </label>
            <Textarea
              placeholder="e.g. Mention 15% discount code 'SUMMER2026' and deadline this Friday."
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Action */}
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full gap-2 shadow-xl shadow-indigo-500/25 mt-2"
            disabled={isGenerating || !topic.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Streaming Email Generation...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate AI Email
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
