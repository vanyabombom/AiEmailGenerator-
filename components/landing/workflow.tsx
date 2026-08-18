"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sliders, Sparkles, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Workflow() {
  const steps = [
    {
      number: "01",
      icon: <Sliders className="h-6 w-6 text-indigo-500" />,
      title: "Input Goal & Parameters",
      description: "Define your primary email objective, recipient details, and select from 6 specialized tone settings.",
    },
    {
      number: "02",
      icon: <Sparkles className="h-6 w-6 text-purple-500" />,
      title: "Stream AI Generation",
      description: "Watch line-by-line as Google Gemini AI drafts a high-converting, error-free message in real time.",
    },
    {
      number: "03",
      icon: <Send className="h-6 w-6 text-pink-500" />,
      title: "Copy & Send",
      description: "Copy to clipboard with one click, save to your history drawer, or send directly to your clients.",
    },
  ];

  return (
    <section id="workflow" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="gradient" className="px-4 py-1 text-xs">
            Simple 3-Step Process
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            How MailCraft AI <span className="gradient-text">Works</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            From prompt to polished email copy in less than 5 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="glass-card p-8 rounded-3xl relative border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black text-slate-300 dark:text-slate-700 font-mono">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
