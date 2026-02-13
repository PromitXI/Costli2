import React from 'react';

const logos = ['Accelera', 'dYdX', 'Prospera', 'Arabian Estates', 'Axis', 'Raposa', 'Superteam', 'OpenZeppelin'];

const SocialProof: React.FC = () => {
  return (
    <section className="section-shell pb-8 pt-2">
      <div className="rounded-[30px] border border-black/10 bg-white/68 px-6 py-8 text-center backdrop-blur-sm">
        <p className="text-lg font-medium text-slate-600 md:text-[1.9rem]">Used by 5,000+ businesses and platform teams in 129+ countries</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xl font-semibold text-slate-400 md:text-2xl">
          {logos.map((logo) => (
            <span key={logo} className="opacity-70 transition hover:opacity-100">{logo}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
