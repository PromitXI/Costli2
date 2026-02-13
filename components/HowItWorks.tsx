import React from 'react';
import { BrainCircuit, GitMerge, Radar, Wrench } from 'lucide-react';

const steps = [
  {
    icon: Radar,
    id: '01',
    title: 'Orchestrator frames the mission',
    desc: 'Your prompt is normalized and scoped so the system targets cloud cost drivers, constraints, and execution risk before any recommendations are generated.',
  },
  {
    icon: BrainCircuit,
    id: '02',
    title: 'Specialist agents investigate',
    desc: 'Parallel agents evaluate pricing, architecture, and operational signals to surface where spend leakage, overprovisioning, or commitment gaps exist.',
  },
  {
    icon: GitMerge,
    id: '03',
    title: 'Synthesis engine prioritizes',
    desc: 'Findings are fused into ranked actions with rationale, expected impact, and implementation sequence so teams know what to fix first.',
  },
  {
    icon: Wrench,
    id: '04',
    title: 'Execution-ready plan is delivered',
    desc: 'You get concrete remediation steps, then can iterate with follow-up prompts to re-analyze and refine next actions.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="agentic-flow section-shell section-gap">
      <div className="agentic-shell">
        <div className="agentic-glow agentic-glow-one" />
        <div className="agentic-glow agentic-glow-two" />

        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">Agentic workflow</h2>
          <p className="mx-auto mt-3 max-w-3xl text-base text-slate-600 md:text-lg">
            Costli runs a multi-agent analysis loop that converts cloud cost signals into prioritized, execution-ready remediation plans.
          </p>
        </div>

        <div className="agentic-grid mt-10">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="agentic-tile"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="agentic-top">
                <div className="agentic-icon">
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="agentic-id">{step.id}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
