import React from 'react';
import { Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  return (
    <section className="section-shell section-gap">
      <div className="rounded-[34px] panel-soft px-6 py-12 text-center md:px-12">
        <Quote className="mx-auto h-10 w-10 text-slate-300" />
        <blockquote className="mx-auto mt-5 max-w-4xl text-2xl font-semibold leading-tight text-slate-900 md:text-4xl">
          Costli found over $24k in monthly savings during our first week and gave us an action plan we could execute without guesswork.
        </blockquote>

        <div className="mt-8 flex flex-col items-center">
          <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah" alt="Sarah Chen" className="h-14 w-14 rounded-full border border-black/10 bg-white" />
          <p className="mt-3 text-base font-bold text-slate-900">Sarah Chen</p>
          <p className="text-sm text-slate-500">VP Infrastructure, TechScale</p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
