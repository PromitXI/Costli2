import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import CloudSelector from './CloudSelector';
import { CloudProvider } from '../types';

interface HeroProps {
  onResearch: (prompt: string, provider: CloudProvider) => void;
}

const PHRASES = [
  { text: 'Financial Discipline for Cloud.', hero: 'Financial' },
  { text: 'Margin Starts in Infrastructure.', hero: 'Margin' },
  { text: 'Capital Efficiency at Scale.', hero: 'Capital' },
  { text: 'Run Lean. Report Strong.', hero: 'Lean' },
  { text: 'Cloud Economics. Mastered.', hero: 'Economics' },
  { text: 'Cloud Spend, Rationalized.', hero: 'Spend' },
  { text: 'Cloud Spend. Under Control.', hero: 'Control' },
  { text: 'Protect Margin. Eliminate Waste.', hero: 'Margin' },
  { text: 'Where Cloud Meets Discipline.', hero: 'Cloud' },
  { text: 'Engineering Capital Efficiency.', hero: 'Capital' },
  { text: 'Cut Burn. Expand Margin.', hero: 'Margin' },
  { text: 'Infrastructure. Without Leakage.', hero: 'Infrastructure' },
  { text: 'From Chaos to Control.', hero: 'Control' },
  { text: 'Operational Spend, Engineered.', hero: 'Spend' },
  { text: 'Spend Accountability, Automated.', hero: 'Accountability' },
];

const SUBHEADINGS = [
  'Agentic AI analyzes cloud spend patterns and surfaces the fastest path to cost reduction.',
  'An agentic AI workflow audits usage, identifies waste, and maps practical remediation steps.',
  'Use agentic AI to trace cost drivers, rightsize infrastructure, and prioritize savings actions.',
  'Agentic AI continuously evaluates your cloud estate to detect inefficiency before it scales.',
  'From telemetry to action, agentic AI converts cloud cost data into clear engineering moves.',
  'Agentic AI breaks down service-level spend and recommends high-confidence optimization actions.',
  'Designed for cloud teams, agentic AI pinpoints cost leakage and prescribes implementable fixes.',
  'Agentic AI correlates usage and billing signals to deliver focused, execution-ready cost guidance.',
  'Move faster with agentic AI that investigates cloud cost anomalies and ranks what to fix first.',
  'Agentic AI gives cloud architects a structured path from cost analysis to operational remediation.',
];

const Hero: React.FC<HeroProps> = ({ onResearch }) => {
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState<CloudProvider>('AWS');
  const [isLeaving, setIsLeaving] = useState(false);
  const [activePhrase, setActivePhrase] = useState(0);
  const [subheading] = useState(
    () => SUBHEADINGS[Math.floor(Math.random() * SUBHEADINGS.length)]
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePhrase((prev) => {
        let next = Math.floor(Math.random() * PHRASES.length);
        while (next === prev) {
          next = Math.floor(Math.random() * PHRASES.length);
        }
        return next;
      });
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!prompt.trim()) return;

    setIsLeaving(true);
    setTimeout(() => onResearch(prompt, provider), 500);
  };

  const currentPhrase = PHRASES[activePhrase];
  const heroIndex = currentPhrase.text.indexOf(currentPhrase.hero);
  const prefix = heroIndex >= 0 ? currentPhrase.text.slice(0, heroIndex) : '';
  const suffix = heroIndex >= 0 ? currentPhrase.text.slice(heroIndex + currentPhrase.hero.length) : currentPhrase.text;

  return (
    <header className={`section-shell relative flex min-h-screen flex-col items-center justify-center pt-36 text-center transition-all duration-500 ${isLeaving ? 'opacity-40 blur-sm' : 'opacity-100'}`}>
      <h1
        className="reveal-up reveal-delay-1 mt-6 min-h-[7.5rem] max-w-4xl text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-[#111318] transition-all duration-500 sm:min-h-[9rem] sm:text-[3.8rem] md:min-h-[10rem] md:text-[5.2rem]"
        style={{ fontFamily: '"Cormorant Garamond", serif' }}
      >
        {prefix}
        <span className="text-[#1c56d6]">{currentPhrase.hero}</span>
        {suffix}
      </h1>

      <p className="reveal-up reveal-delay-2 mt-5 max-w-2xl text-sm font-medium text-slate-500 md:text-base">
        {subheading}
      </p>

      <form onSubmit={handleSubmit} className="reveal-up reveal-delay-3 mt-9 w-full max-w-3xl p-0">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }
          }}
          placeholder="Example: Our EC2 and RDS bill spiked 27% this month, but workload traffic stayed flat."
          rows={3}
          className="keep-input-border w-full resize-none rounded-2xl border border-slate-300 bg-white/92 px-5 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
        />

        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <CloudSelector selected={provider} onSelect={setProvider} />
          <button
            type="submit"
            disabled={!prompt.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-[#1c56d6] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_18px_rgba(28,86,214,0.28)] transition hover:-translate-y-0.5 hover:bg-[#1748b6] disabled:cursor-not-allowed disabled:opacity-55"
          >
            Create analysis in seconds
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </header>
  );
};

export default Hero;
