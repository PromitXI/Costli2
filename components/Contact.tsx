import React from 'react';
import { Briefcase, Mail, User } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="section-shell section-gap">
      <div className="px-6 py-6 md:px-8 md:py-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">Contact</h2>
          <p className="mt-3 text-base text-slate-600 md:text-lg">
            Reach out to discuss cloud cost optimization, architecture strategy, or implementation support.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-5 md:grid-cols-2">
          <div className="rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-slate-700" />
              <span className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">Name</span>
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-900">Promit Bhattacherjee</p>
          </div>

          <div className="rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-slate-700" />
              <span className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">Role</span>
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-900">Intelligence Architect</p>
          </div>

          <div className="rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-slate-700" />
              <span className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">Email</span>
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-900">promit.xi@gmail.com</p>
          </div>

          <div className="rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" aria-hidden="true">
                <path d="M4 4h4.6l3.6 5.1L16.8 4H20l-6.2 7.3L20 20h-4.6l-4-5.7L6.6 20H4l6.4-7.4z" fill="currentColor" />
              </svg>
              <span className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">X</span>
            </div>
            <a
              href="https://x.com/PromitXi"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-lg font-semibold text-[#1c56d6] hover:underline"
            >
              x.com/PromitXi
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
