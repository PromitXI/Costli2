import React, { useEffect, useState } from 'react';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { CloudProvider, InsightTile, UserContext } from '../types';
import { analyzeWithAgents } from '../services/agentService';
import CostCompass from './CostCompass';
import InsightGrid from './InsightGrid';

interface WorkspaceProps {
  context: UserContext;
  onReset: () => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ context, onReset }) => {
  const [insights, setInsights] = useState<InsightTile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState('Starting analysis...');
  const [activeProvider, setActiveProvider] = useState<CloudProvider>(context.provider);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    setActiveProvider(context.provider);
  }, [context.provider]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setLoadingStage('Analyzing your scenario...');

      const safePrompt = context.prompt.replace(/\\/g, '').replace(/\t/g, ' ').replace(/\n{3,}/g, '\n').trim().substring(0, 2000);

      try {
        const data = await analyzeWithAgents(safePrompt, activeProvider, (stage) => setLoadingStage(stage));
        if (data?.length) {
          setInsights(data);
        }
      } catch (error) {
        console.error('Agent analysis failed:', error);
        setLoadingStage('Retrying analysis...');
      }

      setIsLoading(false);
    };

    fetchData();
  }, [activeProvider, context.prompt]);

  const handleChatUpdate = async (userText: string, modelText: string) => {
    setIsLoading(true);
    setLoadingStage('Re-analyzing with follow-up context...');

    const combinedPrompt = `Original scenario: ${context.prompt.trim().substring(0, 500)}\n\nUser follow-up: ${userText
      .trim()
      .substring(0, 1000)}\n\nExpert analysis: ${modelText.trim().substring(0, 1000)}`;

    try {
      const data = await analyzeWithAgents(combinedPrompt, activeProvider, (stage) => setLoadingStage(stage));
      setInsights(data || []);
    } catch (error) {
      console.error('Agent follow-up analysis failed:', error);
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_90%_100%,rgba(251,191,36,0.14),transparent_30%),#eef2f6] text-slate-900">
      <div className="flex h-full flex-col">
        <header className="flex h-16 items-center justify-between border-b border-black/10 bg-white/80 px-4 backdrop-blur-md md:px-7">
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-black/10 bg-white p-2 lg:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <div className="font-display text-lg font-bold">Costli Workspace</div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{activeProvider}</div>
            </div>
          </div>
          <button onClick={onReset} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            New research
          </button>
        </header>

        <div className="flex min-h-0 flex-1">
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          )}

          <aside
            className={`absolute bottom-0 left-0 top-16 z-50 w-[360px] border-r border-black/10 bg-white lg:static lg:z-auto lg:translate-x-0 ${
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300`}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-black/10 p-4 lg:hidden">
                <span className="font-semibold">Cost Compass</span>
                <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg border border-black/10 p-1.5">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <CostCompass initialPrompt={context.prompt} provider={activeProvider} onChatUpdate={handleChatUpdate} />
            </div>
          </aside>

          <main className={`min-w-0 flex-1 overflow-y-auto p-4 md:p-7 ${isDetailOpen ? 'lg:pr-[22rem]' : ''}`}>
            <InsightGrid
              insights={insights}
              isLoading={isLoading}
              loadingStage={loadingStage}
              provider={activeProvider}
              onViewChange={setIsDetailOpen}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
