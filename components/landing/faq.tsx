"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Which AI model powers MailCraft AI?",
      answer: "MailCraft AI uses Vercel AI SDK integrated with Google Gemini 1.5/2.0 Flash models to deliver ultra-fast streaming email generation.",
    },
    {
      question: "What happens if I don't have a Gemini API key yet?",
      answer: "No worries! MailCraft AI includes a built-in Mock Streaming Generator mode that simulates realistic AI streaming responses so you can test the studio immediately offline.",
    },
    {
      question: "Can I customize the tone and length of my emails?",
      answer: "Yes! You can choose between 6 distinct tone presets (Professional, Persuasive/Sales, Urgent, Casual, Friendly, Empathetic) and 3 length options (Short, Medium, Long).",
    },
    {
      question: "How does the Free Tier quota work?",
      answer: "Free tier users receive 10 email generations per month. You can track your usage in real-time on your dashboard or profile page, and upgrade anytime to Pro for 250 emails/month.",
    },
    {
      question: "Is my data stored securely?",
      answer: "Yes! We use Supabase Auth for user authentication and encrypted data storage. Your drafts are saved locally in your history drawer or synced securely.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="gradient" className="px-4 py-1 text-xs">
            Got Questions?
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Everything you need to know about MailCraft AI.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 dark:text-white flex items-center justify-between gap-4 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span className="flex items-center gap-2.5 text-base">
                    <HelpCircle className="h-5 w-5 text-indigo-500 shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-indigo-500" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5 pt-0 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60"
                    >
                      <p className="pt-3">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
