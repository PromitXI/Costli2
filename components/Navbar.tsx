import React, { useEffect, useState } from 'react';

const links = [
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'documentation', label: 'Guides' },
  { id: 'contact', label: 'Contact' },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-4 z-50 px-4">
      <div className={`section-shell rounded-full px-5 py-3 transition-all duration-300 md:px-8 ${isScrolled ? 'bg-white/45 backdrop-blur-sm' : 'bg-transparent'}`}>
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-display text-[1.85rem] font-extrabold tracking-tighter text-slate-900 md:text-[2rem]">
            <svg
              viewBox="0 0 64 44"
              className="h-7 w-10 md:h-8 md:w-11"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="costliCloudFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0a2a9a" />
                  <stop offset="55%" stopColor="#1c56d6" />
                  <stop offset="100%" stopColor="#2bd4d4" />
                </linearGradient>
              </defs>
              <path
                d="M24 40H14C7.4 40 2 34.6 2 28S7.4 16 14 16c1 0 2 .1 3 .4C19.2 8.6 25.7 3 33.5 3c8.4 0 15.3 6.5 16 14.7.8-.2 1.7-.2 2.5-.2 5.5 0 10 4.5 10 10s-4.5 10-10 10H40l-7-7-9 9z"
                fill="url(#costliCloudFill)"
                stroke="white"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </svg>
            <span>costli</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="text-base font-semibold text-slate-700 transition-colors hover:text-slate-900">
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href="#login" className="hidden text-base font-semibold text-slate-700 hover:text-slate-900 sm:block">
              Log in
            </a>
            <a href="#signup" className="rounded-full bg-[#101114] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(0,0,0,0.28)] hover:bg-black">
              Sign up for free
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
