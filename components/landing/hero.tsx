"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2, Copy, RefreshCw, Zap, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/utils";

export function Hero() {
  const [topicInput, setTopicInput] = useState("Request a project update meeting with client");
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewContent, setPreviewContent] = useState(
    "Subject: Quick Update & Next Steps - Q3 Deliverables\n\nHi Sarah,\n\nI hope you're having a productive week! I'm reaching out to provide a brief status report on our ongoing deliverables and suggest a quick 15-minute check-in call.\n\nBest regards,\nAlex"
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const demoPresets = [
    { title: "Project Update", tone: "Professional", text: "Subject: Project Update & Sync\n\nHi Sarah,\n\nI hope your week is off to a great start! We've made fantastic progress on the milestone targets. I'd love to schedule a quick 15-minute call to review the final deliverables.\n\nBest regards,\nAlex" },
    { title: "Cold Sales Outreach", tone: "Persuasive", text: "Subject: Transforming your team's email workflow 🚀\n\nHi David,\n\nNoticed your team is scaling fast. Are you spending 10+ hours a week drafting outreach emails?\n\nOur AI engine automates high-converting emails in seconds with personalized tone matching.\n\nWorth 5 minutes this Thursday?\n\nBest,\nAlex" },
    { title: "Friendly Follow-Up", tone: "Friendly", text: "Subject: Great catching up at the conference!\n\nHey Mark,\n\nIt was awesome connecting with you yesterday! Loved our conversation on AI workflows.\n\nLet's grab coffee next week if you're free!\n\nCheers,\nAlex" },
  ];

  const handleRunDemo = useCallback((preset: typeof demoPresets[0]) => {
    // Clear any existing interval to prevent race conditions
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTopicInput(preset.title);
    setSelectedTone(preset.tone);
    setIsGenerating(true);
    setPreviewContent("");

    let current = 0;
    const fullText = preset.text;
    const interval = setInterval(() => {
      if (current < fullText.length) {
        setPreviewContent(fullText.slice(0, current + 4));
        current += 4;
      } else {
        setPreviewContent(fullText);
        setIsGenerating(false);
        clearInterval(interval);
        intervalRef.current = null;
      }
    }, 25);
    intervalRef.current = interval;
  }, []);

  // Cleanup interval on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    const success = await copyToClipboard(previewContent);
    if (success) {
      toast.success("Email copied to clipboard!");
    } else {
      toast.error("Failed to copy — try selecting the text manually.");
    }
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Ambient Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/15 dark:bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-pink-500/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="gradient" className="px-4 py-1.5 text-xs sm:text-sm gap-2 shadow-lg">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              Powered by Google Gemini AI & Streaming Architecture
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white"
          >
            Draft High-Converting Emails in <span className="gradient-text">Seconds</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-normal"
          >
            Stop staring at blank drafts. Let AI tailor sales cold outreach, executive updates, and follow-ups with instant real-time streaming text.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="gradient" className="w-full sm:w-auto gap-2.5 shadow-xl shadow-indigo-500/25">
                <Sparkles className="h-5 w-5" />
                Start Generating Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                View Pricing & Plans
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Real-time streaming
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 10 Free Emails/Month
            </span>
          </motion.div>
        </div>

        {/* Interactive Demo Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="glass-panel rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
            {/* Header bar of window */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Bot className="h-3.5 w-3.5 text-indigo-500" /> Live Demo Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">Presets:</span>
                {demoPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRunDemo(preset)}
                    disabled={isGenerating}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Input controls summary */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Goal / Topic
                  </label>
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    className="w-full text-xs font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between pt-1 text-xs text-slate-600 dark:text-slate-400">
                  <span>Tone: <strong className="text-indigo-600 dark:text-indigo-400">{selectedTone}</strong></span>
                  <span>Length: <strong className="text-indigo-600 dark:text-indigo-400">Medium</strong></span>
                </div>
                <Button
                  onClick={() => handleRunDemo(demoPresets[0])}
                  disabled={isGenerating}
                  size="sm"
                  variant="gradient"
                  className="w-full gap-2 text-xs"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                  {isGenerating ? "Streaming Email..." : "Test Stream Generation"}
                </Button>
              </div>

              {/* Right Output text area */}
              <div className="relative p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed min-h-[180px] flex flex-col justify-between border border-slate-800">
                <div className="whitespace-pre-wrap">
                  {previewContent}
                  {isGenerating && <span className="inline-block w-2 h-4 ml-1 bg-indigo-400 animate-pulse" />}
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Zap className="h-3 w-3" /> Live Streaming
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Copy className="h-3 w-3" /> Copy Result
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
