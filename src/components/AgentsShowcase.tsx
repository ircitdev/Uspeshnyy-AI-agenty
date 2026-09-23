import React, { useState, lazy, Suspense } from 'react';
import { AGENTS_DATA } from '../data/agentsData';
import { AgentItem } from '../types';
import { RevealText } from './RevealText';
import { TextRevealMask } from './TextRevealMask';
// График тянет Recharts (сотни КБ) и стоит далеко внизу — грузим отдельно.
const AgentEfficiencyChart = lazy(() =>
  import('./AgentEfficiencyChart').then(m => ({ default: m.AgentEfficiencyChart })));
import { GradientBoldCard } from './GradientBoldCard';
import { AgentComparisonWidget } from './AgentComparisonWidget';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Check, 
  ExternalLink, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  PhoneCall,
  MessageSquare,
  BarChart3,
  Filter,
  ShoppingCart,
  SlidersHorizontal
} from 'lucide-react';

interface AgentsShowcaseProps {
  onSelectAgentForDemo: (agentId: string) => void;
  onOpenConsultation: (agentTitle: string) => void;
}

const AGENT_GRADIENTS: Record<string, { gradient: string; glow: string; badge: string; numGradient: string }> = {
  qualifier: {
    gradient: 'from-[#0284c7] via-[#0ea5e9] to-[#38bdf8]',
    glow: 'from-[#0284c7]/40 via-[#0ea5e9]/30 to-[#38bdf8]/40',
    badge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/25',
    numGradient: 'from-[#0284c7] to-[#0ea5e9]'
  },
  voice: {
    gradient: 'from-[#4f46e5] via-[#6366f1] to-[#818cf8]',
    glow: 'from-[#4f46e5]/40 via-[#6366f1]/30 to-[#818cf8]/40',
    badge: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/25',
    numGradient: 'from-[#4f46e5] to-[#6366f1]'
  },
  consultant: {
    gradient: 'from-[#059669] via-[#10b981] to-[#34d399]',
    glow: 'from-[#059669]/40 via-[#10b981]/30 to-[#34d399]/40',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
    numGradient: 'from-[#059669] to-[#10b981]'
  },
  unified_inbox: {
    gradient: 'from-[#7c3aed] via-[#8b5cf6] to-[#a78bfa]',
    glow: 'from-[#7c3aed]/40 via-[#8b5cf6]/30 to-[#a78bfa]/40',
    badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25',
    numGradient: 'from-[#7c3aed] to-[#8b5cf6]'
  },
  analyst: {
    gradient: 'from-[#d97706] via-[#f59e0b] to-[#fbbf24]',
    glow: 'from-[#d97706]/40 via-[#f59e0b]/30 to-[#fbbf24]/40',
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25',
    numGradient: 'from-[#d97706] to-[#f59e0b]'
  }
};

export const AgentsShowcase: React.FC<AgentsShowcaseProps> = ({ 
  onSelectAgentForDemo, 
  onOpenConsultation 
}) => {
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);
  // На мобильном пять карточек подряд — семь экранов. Показываем две, остальные по кнопке.
  const [showAllAgents, setShowAllAgents] = useState(false);

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'qualifier': return <Filter className="w-4 h-4 text-[#136f97] dark:text-[#38bdf8]" />;
      case 'voice': return <PhoneCall className="w-4 h-4 text-[#136f97] dark:text-[#38bdf8]" />;
      case 'consultant': return <ShoppingCart className="w-4 h-4 text-[#136f97] dark:text-[#38bdf8]" />;
      case 'unified_inbox': return <MessageSquare className="w-4 h-4 text-[#136f97] dark:text-[#38bdf8]" />;
      case 'analyst': return <BarChart3 className="w-4 h-4 text-[#136f97] dark:text-[#38bdf8]" />;
      default: return <MessageSquare className="w-4 h-4 text-[#136f97] dark:text-[#38bdf8]" />;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedAgentId(prev => prev === id ? null : id);
  };

  const scrollToComparison = () => {
    const el = document.getElementById('compare-agents');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 sm:py-14" id="agents">
      <div className="max-w-[1480px] mx-auto px-5 sm:px-7">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-[#136f97] dark:text-[#38bdf8] mb-2">
              Каталог решений
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight">
              <RevealText text="Пять проверенных агентов для вашего бизнеса" as="span" />
            </h2>
            <TextRevealMask
              text="Каждый агент решает конкретную бизнес-задачу, проверен в продакшене и подкреплен реальным кейсом с цифрами."
              className="text-base text-[#3a4d63] dark:text-[#b6c6da] mt-2 max-w-2xl"
              delay={0.2}
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={scrollToComparison}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#136f97] dark:text-[#38bdf8] bg-[#136f97]/10 dark:bg-[#38bdf8]/15 border border-[#136f97]/25 hover:bg-[#136f97]/20 transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Сравнить характеристики</span>
            </button>

            <motion.a 
              href="https://blog.uspeshnyy.ru/rubriki/keysy/" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ x: 3 }}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#136f97] dark:text-[#38bdf8] hover:underline shrink-0 group"
            >
              <span>Все кейсы</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.a>
          </div>
        </div>

        {/* 5 Agents Responsive Grid with Gradient Bold Card style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {AGENTS_DATA.map((agent: AgentItem, agentIdx: number) => {
            const isExpanded = expandedAgentId === agent.id;
            const theme = AGENT_GRADIENTS[agent.id] || AGENT_GRADIENTS.qualifier;
            const hiddenOnMobile = !showAllAgents && agentIdx >= 2;

            return (
              <motion.div
                key={agent.id}
                className={hiddenOnMobile ? 'hidden md:block' : ''}
                // Карточки выходят снизу одна за другой: каталог читается
                // как появление команды, а не как готовая сетка.
                initial={{ opacity: 0, y: 64 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: agentIdx * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
              <GradientBoldCard
                gradient={theme.gradient}
                glowGradient={theme.glow}
                className="h-full"
                innerClassName="p-5 sm:p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Образ агента: у каждого свой робот — карточки перестают
                      быть одинаковыми блоками текста и читаются как персонажи. */}
                  <div className="relative -mx-5 -mt-5 mb-3 h-36 overflow-hidden rounded-t-[1.35rem]">
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.glow} opacity-60`} />
                    <img
                      src={`https://uspeshnyy.ru/assets/agenty3/agent-${agent.id}.webp`}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      width={560}
                      height={699}
                      className="absolute left-1/2 top-2 h-[150%] w-auto -translate-x-1/2 select-none object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    {/* Растушёвка к низу, чтобы образ уходил в карточку */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent dark:from-[#0c1e31]" />
                  </div>

                  {/* Top Bar: Number & Category with Bold Gradient Styling */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl font-black text-xs text-white bg-gradient-to-br ${theme.numGradient} shadow-xs`}>
                      {agent.num}
                    </span>
                    <span className={`text-[0.68rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${theme.badge}`}>
                      {agent.category}
                    </span>
                  </div>

                  {/* Title with icon */}
                  <h3 className="text-base font-bold text-[#0d1f36] dark:text-[#eaf3ff] mb-2 flex items-start gap-2">
                    <span className="p-1 rounded-md bg-[#136f97]/10 dark:bg-[#38bdf8]/15 shrink-0 mt-0.5">
                      {getAgentIcon(agent.id)}
                    </span>
                    <span className="leading-snug">{agent.title}</span>
                  </h3>

                  {/* Short description */}
                  <p className="text-[0.82rem] text-[#3a4d63] dark:text-[#b6c6da] leading-relaxed mb-4">
                    {agent.shortDesc}
                  </p>

                  {/* Meta Pills: Launch time & Channels */}
                  <div className="space-y-1.5 mb-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.72rem] text-[#3a4d63] dark:text-[#b6c6da] bg-[#136f97]/8 dark:bg-[#38bdf8]/10">
                      <Clock className="w-3.5 h-3.5 text-[#136f97] dark:text-[#38bdf8]" />
                      <span>Запуск: {agent.launchTime}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {agent.channels.slice(0, 3).map((ch, i) => (
                        <span key={i} className="text-[0.66rem] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800/60 text-[#5b7188] dark:text-[#7b8ea6]">
                          {ch}
                        </span>
                      ))}
                      {agent.channels.length > 3 && (
                        <span className="text-[0.66rem] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800/60 text-[#5b7188] dark:text-[#7b8ea6]">
                          +{agent.channels.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expandable details toggle */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(agent.id)}
                    className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-[#136f97] dark:text-[#38bdf8] hover:text-[#0d1f36] dark:hover:text-white transition-all hover:translate-x-0.5 mb-3 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Скрыть детали' : 'Что входит'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* Expanded Features List */}
                  {isExpanded && (
                    <div className="pt-2 pb-3 mb-3 border-t border-dashed border-[#147aa6]/20 text-[0.75rem] space-y-2 animate-in fade-in-50">
                      <p className="text-[#5b7188] dark:text-[#7b8ea6] leading-tight">
                        {agent.fullDesc}
                      </p>
                      <div className="space-y-1">
                        {agent.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[#0d1f36] dark:text-[#eaf3ff]">
                            <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="leading-tight">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Actions: Price + Buttons */}
                <div className="pt-4 border-t border-[#147aa6]/15 dark:border-white/10 mt-auto">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-xs text-[#5b7188] dark:text-[#7b8ea6]">Стоимость</span>
                    <span className="text-base font-extrabold text-[#0d1f36] dark:text-[#eaf3ff]">
                      {agent.price}
                    </span>
                  </div>

                  {/* Live Simulation Try-out Button */}
                  <motion.button
                    type="button"
                    onClick={() => onSelectAgentForDemo(agent.id)}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full mb-2 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-[#136f97] dark:text-[#38bdf8] bg-[#136f97]/10 dark:bg-[#38bdf8]/15 hover:bg-[#136f97]/20 hover:shadow-[0_6px_16px_-3px_rgba(19,111,151,0.2)] dark:hover:shadow-[0_6px_16px_-3px_rgba(56,189,248,0.2)] transition-all cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Попробовать в демо</span>
                  </motion.button>

                  {/* Order Consultation Button */}
                  <motion.button
                    type="button"
                    onClick={() => onOpenConsultation(`Обсудить внедрение агента: ${agent.title}`)}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-white bg-gradient-to-b from-[#157ba4] to-[#136f97] dark:from-[#38bdf8] dark:to-[#0284c7] dark:text-[#04121f] shadow-xs hover:shadow-[0_8px_22px_-3px_rgba(19,111,151,0.4)] dark:hover:shadow-[0_8px_22px_-3px_rgba(56,189,248,0.35)] transition-all cursor-pointer"
                  >
                    <span>Обсудить агента</span>
                    <ArrowRight className="w-3 h-3" />
                  </motion.button>

                  {/* Link to actual real-life case */}
                  <a
                    href={agent.caseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center mt-2.5 text-[0.72rem] text-[#5b7188] dark:text-[#7b8ea6] hover:text-[#136f97] dark:hover:text-[#38bdf8] transition-colors"
                  >
                    Разбор кейса в блоге →
                  </a>
                </div>
              </GradientBoldCard>
              </motion.div>
            );
          })}
        </div>

        {!showAllAgents && (
          <button
            type="button"
            onClick={() => setShowAllAgents(true)}
            className="md:hidden mt-5 w-full min-h-[48px] rounded-xl border border-[#136f97]/30 dark:border-[#38bdf8]/30 bg-white/70 dark:bg-white/5 px-5 text-[0.95rem] font-medium text-[#0f5578] dark:text-[#7dd3fc] transition-colors hover:bg-white dark:hover:bg-white/10"
          >
            Показать ещё {AGENTS_DATA.length - 2} агента
          </button>
        )}

        {/* Comparison Matrix Widget */}
        <AgentComparisonWidget 
          onSelectAgentForDemo={onSelectAgentForDemo}
          onOpenConsultation={onOpenConsultation}
        />

        {/* Recharts Visualization: Time Saved vs Manual Cost */}
        <Suspense fallback={<div className="min-h-[420px]" aria-hidden="true" />}>
          <AgentEfficiencyChart onSelectAgent={onSelectAgentForDemo} />
        </Suspense>

      </div>
    </section>
  );
};
