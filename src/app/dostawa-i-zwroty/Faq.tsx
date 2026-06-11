"use client";

import { useId, useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  items: FaqItem[];
}

/**
 * Accessible accordion (button + aria-expanded / aria-controls, panels as
 * labelled regions). Height animates via the grid-rows trick; the transition
 * is disabled under `prefers-reduced-motion`.
 */
export function Faq({ items }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="border-line border-t">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const buttonId = `${baseId}-faq-button-${i}`;
        const panelId = `${baseId}-faq-panel-${i}`;

        return (
          <div key={item.question} className="border-line border-b">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="group flex w-full items-baseline gap-5 py-6 text-left md:gap-8"
              >
                <span className="text-gold font-mono text-[11px] tracking-[0.2em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-crema group-hover:text-gold-soft flex-1 text-lg font-light transition-colors duration-300 motion-reduce:transition-none md:text-xl">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={`text-latte group-hover:text-gold inline-block font-mono text-base transition-transform duration-300 motion-reduce:transition-none ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-latte max-w-2xl pb-7 pl-[2.05rem] text-sm leading-relaxed md:pl-[3.1rem] md:text-base">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Faq;
