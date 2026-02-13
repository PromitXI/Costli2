import React from 'react';
import { CloudProvider } from '../types';

interface CloudSelectorProps {
  selected: CloudProvider;
  onSelect: (provider: CloudProvider) => void;
}

const options: { id: CloudProvider; label: string; icon: React.ReactNode }[] = [
  {
    id: 'AWS',
    label: 'AWS',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <rect x="4" y="4.5" width="16" height="15" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7.2 10.5h9.6M7.2 14h9.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'Azure',
    label: 'Azure',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path d="M4 17.5 10.8 5l4.2 6.8-3.8 5.7z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M13.8 17.5h6.2l-3.1-5.3z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'GCP',
    label: 'GCP',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path d="M7.5 16.5A4.5 4.5 0 0 1 8 7.5a5.5 5.5 0 0 1 10.2 2.6 3.6 3.6 0 0 1-.2 7.1H7.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const CloudSelector: React.FC<CloudSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-transparent p-0">
      {options.map((option) => {
        const active = selected === option.id;

        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              active
                ? 'bg-slate-950 text-white shadow-md shadow-slate-900/25'
                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
            }`}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CloudSelector;
