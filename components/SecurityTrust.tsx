import React from 'react';
import { EyeOff, Lock, Server, Shield } from 'lucide-react';

const items = [
  { icon: Shield, title: 'SOC 2 Type II', desc: 'Audited controls and operational security processes.' },
  { icon: Lock, title: 'Read-only access', desc: 'No write permissions to your cloud infrastructure.' },
  { icon: EyeOff, title: 'Data minimization', desc: 'Only required metadata is processed for analysis.' },
  { icon: Server, title: 'Reliable platform', desc: 'Built for teams running continuous cost optimization.' },
];

const SecurityTrust: React.FC = () => {
  return (
    <section className="section-shell section-gap">
      <div className="rounded-[34px] panel-soft px-6 py-10 md:px-10 md:py-14">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">Enterprise-grade security</h2>
          <p className="mt-3 text-base text-slate-600 md:text-lg">Designed for engineering and finance teams that need confidence.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article key={item.title} className="rounded-3xl border border-black/10 bg-white p-6 text-center shadow-[0_10px_18px_rgba(15,23,42,0.08)]">
              <div className="mx-auto mb-4 inline-flex rounded-full border border-black/10 bg-slate-50 p-3">
                <item.icon className="h-5 w-5 text-slate-900" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecurityTrust;
