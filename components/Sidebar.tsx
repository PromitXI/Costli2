import React from 'react';
import { Compass, ChevronLeft } from 'lucide-react';
import { CloudProvider } from '../types';

interface SidebarProps {
  selectedProvider: CloudProvider;
  onSelectProvider: (provider: CloudProvider) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedProvider, isCollapsed, onToggleCollapse }) => {
  return (
    <div 
      className={`
        flex flex-col h-full bg-slate-50 border-r border-slate-200 transition-all duration-300 ease-in-out relative z-30
        ${isCollapsed ? 'w-20' : 'w-[280px]'}
      `}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200/50 flex-shrink-0">
        <div className="flex items-center gap-3 text-sky-500">
          <Compass size={28} strokeWidth={2.5} />
          {!isCollapsed && (
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight whitespace-nowrap">
              Cost Compass
            </span>
          )}
        </div>
      </div>

      {/* Footer Status - Moved up by removing spacer */}
      <div className="p-4 flex-shrink-0">
        {!isCollapsed ? (
          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-semibold text-slate-700">Connected to {selectedProvider}</span>
            </div>
            <div className="text-[10px] text-slate-400 pl-4.5">Syncing real-time...</div>
          </div>
        ) : (
            <div className="flex justify-center">
                 <div className="relative flex h-2.5 w-2.5">
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </div>
            </div>
        )}

        <button 
            onClick={onToggleCollapse}
            className="mt-4 w-full flex items-center justify-center p-2 text-slate-400 hover:bg-slate-100 rounded-md transition-colors"
        >
             <ChevronLeft size={16} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;