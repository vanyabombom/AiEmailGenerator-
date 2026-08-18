"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Sliders, ShieldCheck, History, Sparkles, Code2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Features() {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-indigo-500" />,
      title: "Real-Time AI Streaming",
      description: "Sub-200ms time-to-first-token streaming powered by Vercel AI SDK and Google Gemini 1.5 Flash models.",
    },
    {
      icon: <Sliders className="h-6 w-6 text-pink-500" />,
      title: "6 Adaptive Tones & Custom Length",
      description: "Match your exact brand voice with Professional, Persuasive, Urgent, Casual, Friendly, or Empathetic options.",
    },
    {
      icon: <History className="h-6 w-6 text-purple-500" />,
      title: "Draft History Drawer",
      description: "Save, manage, copy, and reload generated emails instantly with persistent local and cloud state.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
      title: "Offline Mock Mode Fallback",
      description: "Continuous testing without API keys via a built-in mock stream generator designed for offline environments.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-amber-500" />,
      title: "Smart Metrics Counter",
      description: "Instant character count, word count, and monthly email quota tracking right inside your studio dashboard.",
    },
    {
      icon: <Code2 className="h-6 w-6 text-blue-500" />,
      title: "Strictly Typed & Responsive",
      description: "Built with 100% strict TypeScript types, Next.js 14 App Router, and Tailwind CSS for flawless performance.",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="features" className="py-20 relative bg-slate-50/50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="gradient" className="px-4 py-1 text-xs">
            Engineered for Productivity
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Everything You Need for <span className="gradient-text">High-Converting</span> Outreach
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Designed for sales executives, founders, marketers, and busy professionals who demand perfection.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="glass-card h-full hover:-translate-y-1 transition-all duration-300 p-6 rounded-3xl border-slate-200 dark:border-slate-800">
                <CardHeader className="p-0 space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
