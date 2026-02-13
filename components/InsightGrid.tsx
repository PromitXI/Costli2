import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Cpu,
  DollarSign,
  ExternalLink,
  GitMerge,
  Search,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { CloudProvider, InsightStep, InsightTile, InsightType } from '../types';
import { generateAgentActionPlan } from '../services/agentService';

interface InsightGridProps {
  insights: InsightTile[];
  isLoading: boolean;
  loadingStage?: string;
  provider: CloudProvider;
  onViewChange: (isOpen: boolean) => void;
}

const getStageIndex = (stage?: string) => {
  const value = (stage || '').toLowerCase();
  if (value.includes('analyz') || value.includes('orchestr')) return 0;
  if (value.includes('research') || value.includes('agent')) return 1;
  if (value.includes('synth') || value.includes('merge')) return 2;
  return 0;
};

const InsightGrid: React.FC<InsightGridProps> = ({ insights, isLoading, loadingStage, provider, onViewChange }) => {
  const [selectedInsight, setSelectedInsight] = useState<InsightTile | null>(null);
  const [actionPlan, setActionPlan] = useState<InsightStep[] | null>(null);
  const [isPlanLoading, setIsPlanLoading] = useState(false);

  useEffect(() => {
    onViewChange(Boolean(selectedInsight));
  }, [onViewChange, selectedInsight]);

  const getIcon = (type: InsightType) => {
    switch (type) {
      case InsightType.OPTIMIZATION:
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      case InsightType.WARNING:
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case InsightType.PRICING:
        return <DollarSign className="h-5 w-5 text-cyan-700" />;
      default:
        return <BookOpen className="h-5 w-5 text-slate-600" />;
    }
  };

  const getTypeLabel = (type: InsightType) => {
    switch (type) {
      case InsightType.OPTIMIZATION:
        return 'Optimization';
      case InsightType.PRICING:
        return 'Pricing';
      case InsightType.GUIDE:
        return 'Guide';
      case InsightType.WARNING:
        return 'Risk';
      default:
        return 'Insight';
    }
  };

  const handleInsightClick = async (insight: InsightTile) => {
    setSelectedInsight(insight);
    setActionPlan(null);
    setIsPlanLoading(true);

    try {
      const steps = await generateAgentActionPlan(insight.headline, insight.rationale, provider);
      setActionPlan(steps);
    } catch {
      setActionPlan(insight.detail.steps || []);
    } finally {
      setIsPlanLoading(false);
    }
  };

  if (isLoading) {
    const stageIndex = getStageIndex(loadingStage);
    const stages = [
      { title: 'Orchestrator', icon: Brain, tone: 'from-blue-500 to-cyan-500' },
      { title: 'Specialist Agents', icon: Search, tone: 'from-indigo-500 to-violet-500' },
      { title: 'Synthesis Engine', icon: GitMerge, tone: 'from-emerald-500 to-teal-500' },
    ];

    return (
      <div className="relative flex h-[60vh] flex-col items-center justify-center overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_90%_90%,rgba(16,185,129,0.18),transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-6">
        <div className="mb-6 rounded-2xl bg-white/80 p-4 shadow-[0_16px_32px_rgba(15,23,42,0.14)] backdrop-blur">
          <Cpu className="h-7 w-7 animate-pulse text-blue-600" />
        </div>
        <p className="text-center text-lg font-bold text-slate-900">{loadingStage || 'Analyzing...'}</p>
        <p className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Agentic dataflow · {provider}</p>

        <div className="mt-8 flex w-full max-w-4xl flex-col items-center gap-3 md:flex-row md:justify-center">
          {stages.map((stage, idx) => {
            const active = stageIndex === idx;
            return (
              <React.Fragment key={stage.title}>
                <div
                  className={`relative flex min-w-[210px] items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-500 ${
                    active
                      ? 'border-white/70 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.14)] scale-[1.02]'
                      : 'border-white/40 bg-white/55 shadow-[0_6px_14px_rgba(15,23,42,0.08)]'
                  }`}
                >
                  <div className={`rounded-xl bg-gradient-to-br p-2 text-white ${stage.tone}`}>
                    <stage.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</p>
                    <p className="text-sm font-semibold text-slate-900">{stage.title}</p>
                  </div>
                  {active && <Zap className="absolute right-3 top-3 h-4 w-4 text-blue-500" />}
                </div>
                {idx < stages.length - 1 && (
                  <div className="hidden items-center gap-1 md:flex">
                    <div className={`h-1 w-7 rounded-full ${stageIndex > idx ? 'bg-blue-500' : 'bg-slate-300'}`} />
                    <ArrowRight className={`h-4 w-4 ${stageIndex > idx ? 'text-blue-500' : 'text-slate-400'}`} />
                    <div className={`h-1 w-7 rounded-full ${stageIndex > idx ? 'bg-blue-500' : 'bg-slate-300'}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  if (!insights?.length) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center rounded-3xl bg-[radial-gradient(circle_at_30%_10%,rgba(59,130,246,0.15),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] text-center">
        <div className="rounded-2xl bg-white/85 p-4 shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
          <Sparkles className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900">Waiting for analysis input</h2>
        <p className="mt-2 text-sm text-slate-600">Agents Worksing to create the Savings Plan</p>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-7xl pb-10">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#1c56d6]">Recommendations</h1>
          <p className="mt-2 text-sm font-medium text-slate-600">Prioritized actions generated from your scenario.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {insights.map((insight, idx) => (
            <button
              key={insight.id || idx}
              onClick={() => handleInsightClick(insight)}
              className="group rounded-2xl border border-blue-100/90 bg-[linear-gradient(165deg,rgba(255,255,255,0.95),rgba(232,242,255,0.92))] p-5 text-left shadow-[0_14px_30px_rgba(16,62,139,0.12)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_34px_rgba(16,62,139,0.18)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{getTypeLabel(insight.type)}</span>
                {getIcon(insight.type)}
              </div>
              <h3 className="text-lg font-bold leading-snug text-[#0f2f72]">{insight.headline}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{insight.rationale}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1c56d6]">
                View details
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedInsight && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/35" onClick={() => setSelectedInsight(null)} />
          <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-blue-100 bg-[linear-gradient(165deg,rgba(255,255,255,0.98),rgba(236,245,255,0.96))] shadow-[0_22px_52px_rgba(16,62,139,0.22)]">
            <div className="border-b border-blue-100 p-6">
              <button onClick={() => setSelectedInsight(null)} className="absolute right-4 top-4 rounded-full border border-blue-100 p-1.5 text-slate-600 hover:text-[#1c56d6]">
                <X className="h-4 w-4" />
              </button>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{getTypeLabel(selectedInsight.type)}</p>
              <h3 className="mt-2 text-2xl font-bold text-[#0f2f72]">{selectedInsight.headline}</h3>
            </div>

            <div className="max-h-[58vh] overflow-y-auto p-6">
              <p className="rounded-2xl border border-blue-100 bg-white/90 p-4 text-sm leading-relaxed text-slate-700">{selectedInsight.rationale}</p>

              <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Implementation plan</h4>
              <div className="mt-3 space-y-4">
                {isPlanLoading && <p className="text-sm text-slate-500">Building plan...</p>}
                {!isPlanLoading &&
                  (actionPlan || []).map((step, idx) => (
                    <div key={idx} className="rounded-xl border border-blue-100 bg-white/95 p-4">
                      <p className="text-sm font-bold text-[#0f2f72]">{idx + 1}. {step.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{step.description}</p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-blue-100 p-4">
              <button className="inline-flex items-center gap-2 rounded-full border border-blue-100 px-4 py-2 text-sm font-semibold text-[#1c56d6]">
                <ExternalLink className="h-4 w-4" />
                Implement
              </button>
              <button onClick={() => setSelectedInsight(null)} className="rounded-full bg-[#1c56d6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1748b6]">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InsightGrid;
