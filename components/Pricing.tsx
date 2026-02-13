import React, { useMemo } from 'react';

const PHRASES = [
  'Free. Always will be.',
  'Why pay to save?',
  'Zero Cost. Full Discipline.',
  'No spend to reduce spend.',
  'Free. Forever.',
  'Saving costs nothing.',
];

const Pricing: React.FC = () => {
  const phrase = useMemo(
    () => PHRASES[Math.floor(Math.random() * PHRASES.length)],
    []
  );

  return (
    <section id="pricing" className="section-shell section-gap">
      <div className="px-6 py-10 text-center md:px-10 md:py-14">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">{phrase}</h2>
          <p className="mt-3 text-base text-slate-600 md:text-lg">Agentic cloud cost analysis with zero subscription cost.</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
