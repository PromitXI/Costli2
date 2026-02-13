import React from 'react';
import { Book, FileCode, Terminal, Video } from 'lucide-react';

const docs = [
  { icon: Book, title: 'Getting started', desc: 'Connect accounts and run your first analysis quickly.' },
  { icon: Terminal, title: 'API reference', desc: 'Programmatic access to insights and savings data.' },
  { icon: FileCode, title: 'Integration guides', desc: 'Send actions to Slack, Jira, and your ops systems.' },
  { icon: Video, title: 'Video tutorials', desc: 'Watch practical walkthroughs from setup to rollout.' },
];

const Documentation: React.FC = () => {
  return (
    <section id="documentation" className="section-shell section-gap">
      <div className="rounded-[34px] panel-soft px-6 py-10 md:px-10 md:py-14">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">Guides and documentation</h2>
          <p className="mt-3 text-base text-slate-600 md:text-lg">Everything needed to run Costli in production.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {docs.map((doc) => (
            <article key={doc.title} className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_18px_rgba(15,23,42,0.08)]">
              <div className="mb-4 inline-flex rounded-xl border border-black/10 bg-slate-50 p-2.5">
                <doc.icon className="h-5 w-5 text-slate-900" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{doc.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{doc.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Documentation;
