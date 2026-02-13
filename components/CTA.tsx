import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="section-shell section-gap">
      <div className="rounded-[34px] panel-soft px-6 py-12 text-center md:px-12">
        <h2 className="text-4xl font-bold text-slate-900 md:text-6xl">Start reducing cloud waste today</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 md:text-xl">Create your first analysis in minutes and hand clear actions to your team.</p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <input type="email" placeholder="Enter your work email" className="w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-slate-900 placeholder:text-slate-400 sm:max-w-xs" />
          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111318] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_16px_rgba(15,23,42,0.24)]">
            Get started
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
