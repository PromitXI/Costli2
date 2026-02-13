import React from 'react';
import { ArrowRight } from 'lucide-react';

const posts = [
  {
    title: 'How one platform team reduced waste by 38%',
    excerpt: 'A practical breakdown of idle compute cleanup and storage lifecycle fixes.',
    date: 'Apr 16, 2026',
    category: 'Case Study',
  },
  {
    title: 'Budgeting Kubernetes without blind spots',
    excerpt: 'Set ownership boundaries and catch cross-team spend drift earlier.',
    date: 'Apr 10, 2026',
    category: 'Guide',
  },
  {
    title: 'New: effort-aware recommendation scoring',
    excerpt: 'We now rank actions by impact, complexity, and execution confidence.',
    date: 'Apr 02, 2026',
    category: 'Product',
  },
];

const Blog: React.FC = () => {
  return (
    <section id="blog" className="section-shell section-gap">
      <div className="rounded-[34px] panel-soft px-6 py-10 md:px-10 md:py-14">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">Latest from our blog</h2>
          <p className="mt-3 text-base text-slate-600 md:text-lg">Insights from cloud optimization teams and operators.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_18px_rgba(15,23,42,0.08)]">
              <div className="rounded-2xl bg-slate-100 p-5 text-xs font-bold uppercase tracking-[0.15em] text-slate-600">{post.category}</div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{post.date}</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">{post.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
              <button className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-slate-900">
                Read article
                <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
