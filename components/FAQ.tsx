import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

const faqs = [
  {
    q: 'How does Costli connect to cloud accounts?',
    a: 'Costli uses read-only roles and API permissions to inspect usage and billing metadata safely.',
  },
  {
    q: 'How quickly can we see recommendations?',
    a: 'Initial analysis usually appears within minutes after your scenario or account data is provided.',
  },
  {
    q: 'Can we use this for multi-cloud environments?',
    a: 'Yes. Costli supports AWS, Azure, and GCP workflows in one interface.',
  },
  {
    q: 'Does each recommendation include implementation details?',
    a: 'Yes. Every insight includes rationale, impact context, and a step-by-step execution plan.',
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-shell section-gap">
      <div className="rounded-[34px] panel-soft px-6 py-10 md:px-10 md:py-14">
        <h2 className="text-center text-4xl font-bold text-slate-900 md:text-5xl">Frequently asked questions</h2>

        <div className="mx-auto mt-8 max-w-3xl space-y-3">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <article key={item.q} className="rounded-2xl border border-black/10 bg-white px-5 py-4 shadow-[0_8px_14px_rgba(15,23,42,0.06)]">
                <button onClick={() => setOpenIndex(isOpen ? null : index)} className="flex w-full items-center justify-between gap-3 text-left">
                  <span className="text-base font-bold text-slate-900">{item.q}</span>
                  {isOpen ? <Minus className="h-4 w-4 text-slate-700" /> : <Plus className="h-4 w-4 text-slate-500" />}
                </button>
                {isOpen && <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
