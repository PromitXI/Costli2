import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const columns = [
  { title: 'Product', links: ['Features', 'Pricing', 'API', 'Roadmap'] },
  { title: 'Resources', links: ['Documentation', 'Blog', 'Status', 'Community'] },
  { title: 'Company', links: ['About', 'Contact', 'Partners', 'Careers'] },
  { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Compliance'] },
];

const Footer: React.FC = () => {
  return (
    <footer className="section-shell pb-12 pt-2">
      <div className="rounded-[34px] border border-black/10 bg-white/82 p-8 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <div className="font-display text-3xl font-extrabold tracking-tight text-slate-900">costli</div>
            <p className="mt-2 text-sm text-slate-600">Intelligent cloud cost reduction for modern teams.</p>
            <div className="mt-4 flex items-center gap-3">
              {[Twitter, Linkedin, Github].map((Icon, index) => (
                <a key={index} href="#" className="rounded-full border border-black/10 bg-white p-2 text-slate-600 transition hover:text-slate-900">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">{column.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition hover:text-slate-900">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-black/10 pt-4 text-sm text-slate-500">Copyright 2026 Costli. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
