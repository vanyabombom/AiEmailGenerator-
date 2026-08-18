"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function AccordionItem({
  title,
  children,
  isOpen = false,
  onToggle,
  className,
}: AccordionItemProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/50 backdrop-blur-md overflow-hidden transition-all duration-200",
        isOpen && "ring-1 ring-indigo-500/50 shadow-md",
        className
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 text-left text-base font-semibold text-slate-900 dark:text-slate-100 transition-all hover:text-indigo-600 dark:hover:text-indigo-400"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-slate-500 transition-transform duration-300",
            isOpen && "rotate-180 text-indigo-500"
          )}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-0 text-sm leading-relaxed text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/50 mt-1 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}

export function Accordion({
  items,
  allowMultiple = false,
  className,
}: {
  items: { id: string; question: string; answer: string }[];
  allowMultiple?: boolean;
  className?: string;
}) {
  const [openIds, setOpenIds] = React.useState<string[]>([items[0]?.id || ""]);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn("space-y-3.5", className)}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          title={item.question}
          isOpen={openIds.includes(item.id)}
          onToggle={() => toggle(item.id)}
        >
          {item.answer}
        </AccordionItem>
      ))}
    </div>
  );
}
