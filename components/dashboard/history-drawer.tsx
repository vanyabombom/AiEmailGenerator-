"use client";

import React, { useEffect } from "react";
import { History, X, Copy, Trash2, Calendar, FileText } from "lucide-react";
import { EmailDraft } from "@/types";
import { formatDate, copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "@/components/lenis-provider";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: EmailDraft[];
  onSelectDraft: (draft: EmailDraft) => void;
  onDeleteDraft: (id: string) => void;
}

export function HistoryDrawer({
  isOpen,
  onClose,
  drafts,
  onSelectDraft,
  onDeleteDraft,
}: HistoryDrawerProps) {
  const { stop, start } = useLenis();

  // Stop/start Lenis smooth scroll when drawer opens/closes
  useEffect(() => {
    if (isOpen) {
      stop();
    } else {
      start();
    }
  }, [isOpen, stop, start]);

  const handleCopyDraft = async (content: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      toast.success("Draft copied to clipboard!");
    } else {
      toast.error("Failed to copy — try selecting the text manually.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col justify-between"
            data-lenis-prevent
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <History className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Draft History</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                    {drafts.length}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Draft List */}
              <div
                className="space-y-3 overflow-y-auto max-h-[calc(100vh-140px)] pr-1 overscroll-contain"
                data-lenis-prevent
              >
                {drafts.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 space-y-2">
                    <FileText className="h-8 w-8 mx-auto text-slate-400 dark:text-slate-600" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No saved drafts yet</p>
                    <p className="text-xs text-slate-500">Generated emails saved to history will appear here.</p>
                  </div>
                ) : (
                  drafts.map((draft) => (
                    <div
                      key={draft.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500/50 transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 uppercase">
                          {draft.tone}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleCopyDraft(draft.content)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                            title="Copy Draft"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteDraft(draft.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                            title="Delete Draft"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 line-clamp-1">
                        {draft.topic}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 font-sans">
                        {draft.content}
                      </p>

                      <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-700/40">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatDate(draft.createdAt)}
                        </span>
                        <button
                          onClick={() => {
                            onSelectDraft(draft);
                            onClose();
                          }}
                          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                        >
                          Load into editor
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
