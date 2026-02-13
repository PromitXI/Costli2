import React from 'react';
import { FileText, Gauge, Layers, PieChart, Sparkles, Users } from 'lucide-react';

const features = [
  {
    icon: Gauge,
    title: 'Deep spend visibility',
    desc: 'Analyze service-level cost movement and identify what changed, why it changed, and where spend pressure is building.',
  },
  {
    icon: Sparkles,
    title: 'Agentic AI analysis',
    desc: 'Multi-agent reasoning inspects cloud telemetry and pricing context, then prioritizes recommendations by likely impact.',
  },
  {
    icon: Layers,
    title: 'Cross-cloud intelligence',
    desc: 'Work across AWS, Azure, and GCP from one workflow, with comparable signals and consistent optimization logic.',
  },
  {
    icon: FileText,
    title: 'Execution-ready guidance',
    desc: 'Every recommendation includes practical remediation steps so engineering teams can implement without ambiguity.',
  },
  {
    icon: PieChart,
    title: 'Savings validation',
    desc: 'Track projected versus realized savings to understand which actions deliver durable cost discipline over time.',
  },
  {
    icon: Users,
    title: 'Team-level accountability',
    desc: 'Align platform, finance, and architecture stakeholders around one prioritized cost-reduction backlog.',
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="section-shell section-gap">
      <div className="px-6 py-6 md:px-8 md:py-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">Features built to win cloud cost control</h2>
          <p className="mt-3 text-base text-slate-600 md:text-lg">
            Designed for teams that need to analyze deeply, decide quickly, and execute confidently.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-3xl p-6">
              <div className="mb-4 inline-flex rounded-xl p-3">
                <feature.icon className="h-5 w-5 text-slate-900" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
