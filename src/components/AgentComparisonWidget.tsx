import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  X, 
  Sparkles, 
  ArrowRight, 
  SlidersHorizontal, 
  Layers, 
  Play, 
  HelpCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Filter,
  PhoneCall,
  ShoppingCart,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import { AGENTS_DATA } from '../data/agentsData';
import { AgentItem } from '../types';

interface AgentComparisonWidgetProps {
  onSelectAgentForDemo: (agentId: string) => void;
  onOpenConsultation: (topic: string) => void;
}

interface ComparisonCriterion {
  id: string;
  category: string;
  label: string;
  tooltip?: string;
  renderValue: (agent: AgentItem) => React.ReactNode;
  getRawValue: (agent: AgentItem) => string | boolean | number;
}

export const AgentComparisonWidget: React.FC<AgentComparisonWidgetProps> = ({
  onSelectAgentForDemo,
  onOpenConsultation
}) => {
  // Selected agents for side-by-side comparison (defaults to first 3 agents)
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([
    'qualifier',
    'voice',
    'consultant'
  ]);

  // Diff mode: show only criteria where values differ
  const [showOnlyDiffs, setShowOnlyDiffs] = useState<boolean>(false);

  // Active category filter for criteria
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'qualifier': return <Filter className="w-4 h-4 text-[#136f97] dark:text-[#38bdf8]" />;
      case 'voice': return <PhoneCall className="w-4 h-4 text-[#136f97] dark:text-[#38bdf8]" />;
      case 'consultant': return <ShoppingCart className="w-4 h-4 text-[#136f97] dark:text-[#38bdf8]" />;
      case 'unified_inbox': return <MessageSquare className="w-4 h-4 text-[#136f97] dark:text-[#38bdf8]" />;
      case 'analyst': return <BarChart3 className="w-4 h-4 text-[#136f97] dark:text-[#38bdf8]" />;
      default: return <Sparkles className="w-4 h-4 text-[#136f97] dark:text-[#38bdf8]" />;
    }
  };

  const getAgentBadgeColor = (id: string) => {
    switch (id) {
      case 'qualifier': return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
      case 'voice': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      case 'consultant': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'unified_inbox': return 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20';
      case 'analyst': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default: return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
  };

  const toggleAgent = (id: string) => {
    if (selectedAgentIds.includes(id)) {
      // Don't allow deselecting if only 2 agents left (need at least 2 to compare)
      if (selectedAgentIds.length <= 2) return;
      setSelectedAgentIds(prev => prev.filter(item => item !== id));
    } else {
      // Max 4 agents simultaneously for readability
      if (selectedAgentIds.length >= 4) {
        setSelectedAgentIds(prev => [...prev.slice(1), id]);
      } else {
        setSelectedAgentIds(prev => [...prev, id]);
      }
    }
  };

  const selectPreset = (type: 'sales' | 'channels' | 'all') => {
    if (type === 'sales') {
      setSelectedAgentIds(['qualifier', 'consultant', 'voice']);
    } else if (type === 'channels') {
      setSelectedAgentIds(['voice', 'unified_inbox', 'qualifier']);
    } else {
      setSelectedAgentIds(AGENTS_DATA.map(a => a.id));
    }
  };

  // Detailed criteria list
  const CRITERIA: ComparisonCriterion[] = useMemo(() => [
    {
      id: 'purpose',
      category: 'general',
      label: 'Ключевая задача',
      tooltip: 'Какую главную проблему бизнеса решает агент',
      renderValue: (a) => (
        <span className="text-xs font-semibold text-[#0d1f36] dark:text-[#eaf3ff] leading-relaxed">
          {a.shortDesc}
        </span>
      ),
      getRawValue: (a) => a.shortDesc
    },
    {
      id: 'commType',
      category: 'tech',
      label: 'Среда взаимодействия',
      tooltip: 'Голосовые звонки, мессенджеры или фоновые интеграции',
      renderValue: (a) => {
        if (a.id === 'voice') {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <PhoneCall className="w-3.5 h-3.5" />
              Живой голос (SIP/IP)
            </span>
          );
        }
        if (a.id === 'analyst') {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <BarChart3 className="w-3.5 h-3.5" />
              BI-дашборды и отчёты
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <MessageSquare className="w-3.5 h-3.5" />
            Текстовые диалоги
          </span>
        );
      },
      getRawValue: (a) => (a.id === 'voice' ? 'voice' : a.id === 'analyst' ? 'bi' : 'text')
    },
    {
      id: 'responseTime',
      category: 'tech',
      label: 'Скорость реакции',
      tooltip: 'Время первого ответа клиенту в секундах',
      renderValue: (a) => {
        const time = a.id === 'voice' ? '< 0.8 сек (без пауз)' : a.id === 'analyst' ? 'Мгновенно по расписанию' : '5–15 секунд 24/7';
        return (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{time}</span>
          </div>
        );
      },
      getRawValue: (a) => (a.id === 'voice' ? '0.8s' : a.id === 'analyst' ? 'cron' : '15s')
    },
    {
      id: 'channels',
      category: 'tech',
      label: 'Каналы подключения',
      tooltip: 'Где конкретно работает данный агент',
      renderValue: (a) => (
        <div className="flex flex-wrap gap-1">
          {a.channels.map((ch, idx) => (
            <span key={idx} className="text-[0.68rem] px-2 py-0.5 rounded-md bg-[#136f97]/10 dark:bg-white/10 text-[#0d1f36] dark:text-[#eaf3ff] font-medium">
              {ch}
            </span>
          ))}
        </div>
      ),
      getRawValue: (a) => a.channels.join(', ')
    },
    {
      id: 'ragKnowledge',
      category: 'features',
      label: 'RAG-база знаний без галлюцинаций',
      tooltip: 'Поиск точных ответов по внутренним регламентам и прайсам',
      renderValue: (a) => {
        const hasRag = a.id === 'consultant' || a.id === 'voice' || a.id === 'qualifier';
        return hasRag ? (
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Включена (векторная база)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-[#5b7188] dark:text-[#7b8ea6]">
            <span className="w-4 h-4 flex items-center justify-center text-xs">—</span>
            <span>Не требуется для сценария</span>
          </div>
        );
      },
      getRawValue: (a) => (a.id === 'consultant' || a.id === 'voice' || a.id === 'qualifier')
    },
    {
      id: 'crmIntegration',
      category: 'features',
      label: 'Работа со сделками в CRM',
      tooltip: 'Создание сделки, распределение по ответственным, заполнение кастомных полей',
      renderValue: (a) => {
        const isCrmDirect = a.id === 'qualifier' || a.id === 'consultant' || a.id === 'voice' || a.id === 'unified_inbox';
        return isCrmDirect ? (
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Полная двухсторонняя связка</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-[#5b7188] dark:text-[#7b8ea6]">
            <span>Анализ выгрузок и воронки</span>
          </div>
        );
      },
      getRawValue: (a) => a.id !== 'analyst'
    },
    {
      id: 'costCalc',
      category: 'features',
      label: 'Расчёт стоимости и смет',
      tooltip: 'Способность рассчитать заказ по прайс-листу компании',
      renderValue: (a) => {
        const canCalculate = a.id === 'consultant' || a.id === 'qualifier';
        return canCalculate ? (
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Check className="w-4 h-4" />
            <span>Динамический расчёт</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-[#5b7188] dark:text-[#7b8ea6]">
            <X className="w-3.5 h-3.5 opacity-60" />
            <span>Нет</span>
          </div>
        );
      },
      getRawValue: (a) => (a.id === 'consultant' || a.id === 'qualifier')
    },
    {
      id: 'launchTime',
      category: 'business',
      label: 'Срок запуска под ключ',
      tooltip: 'Время от подписания ТЗ до ввода в боевую эксплуатацию',
      renderValue: (a) => (
        <span className="text-xs font-bold text-[#0d1f36] dark:text-[#eaf3ff] bg-[#136f97]/10 dark:bg-[#38bdf8]/15 px-2.5 py-1 rounded-md text-nowrap">
          {a.launchTime}
        </span>
      ),
      getRawValue: (a) => a.launchTime
    },
    {
      id: 'exampleResult',
      category: 'business',
      label: 'Главный бизнес-эффект',
      tooltip: 'Подтвержденная метрика окупаемости в реальных кейсах',
      renderValue: (a) => (
        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 leading-snug">
          {a.exampleResult}
        </span>
      ),
      getRawValue: (a) => a.exampleResult
    },
    {
      id: 'price',
      category: 'business',
      label: 'Стоимость внедрения',
      tooltip: 'Разовая разработка под ключ с гарантией',
      renderValue: (a) => (
        <div className="flex flex-col">
          <span className="text-sm font-black text-[#136f97] dark:text-[#38bdf8]">
            {a.price}
          </span>
          <span className="text-[0.65rem] text-[#5b7188] dark:text-[#7b8ea6]">разово под ключ</span>
        </div>
      ),
      getRawValue: (a) => a.priceNumber
    },
    {
      id: 'bestFor',
      category: 'business',
      label: 'Оптимально подходит для:',
      tooltip: 'Кому внедрение приносит максимальную отдачу с первого месяца',
      renderValue: (a) => {
        let text = '';
        if (a.id === 'qualifier') text = 'Отделы продаж с потоком лидов от 100/мес, где менеджеры тонут в нецелевых заявках';
        else if (a.id === 'voice') text = 'Клиники, салоны, сфера услуг и логистика с входящими звонками в нерабочие часы';
        else if (a.id === 'consultant') text = 'E-commerce, B2B с широким прайсом и онлайн-сервисы с долгим циклом выбора';
        else if (a.id === 'unified_inbox') text = 'Компании с разрозненными мессенджерами (TG, WA, Авито), теряющие переписки';
        else if (a.id === 'analyst') text = 'Собственники и РОПы, тратящие более 3 часов в неделю на сбор ручных отчетов';
        return <span className="text-xs text-[#3a4d63] dark:text-[#b6c6da] leading-tight">{text}</span>;
      },
      getRawValue: (a) => a.id
    }
  ], []);

  // Filtered criteria based on category and diff mode
  const displayedCriteria = useMemo(() => {
    return CRITERIA.filter(crit => {
      // Category filter
      if (activeCategory !== 'all' && crit.category !== activeCategory) {
        return false;
      }

      // Diff mode filter: only show if raw values across selected agents are NOT identical
      if (showOnlyDiffs && selectedAgentIds.length > 1) {
        const selectedAgents = AGENTS_DATA.filter(a => selectedAgentIds.includes(a.id));
        const firstVal = crit.getRawValue(selectedAgents[0]);
        const hasDifference = selectedAgents.some(a => crit.getRawValue(a) !== firstVal);
        if (!hasDifference) return false;
      }

      return true;
    });
  }, [CRITERIA, activeCategory, showOnlyDiffs, selectedAgentIds]);

  const selectedAgents = AGENTS_DATA.filter(a => selectedAgentIds.includes(a.id));

  return (
    <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#0c1e31]/90 backdrop-blur-xl border border-[#147aa6]/25 dark:border-white/10 shadow-xl" id="compare-agents">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#147aa6]/15 dark:border-white/10 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#136f97] dark:text-[#38bdf8] bg-[#136f97]/10 dark:bg-[#38bdf8]/15 border border-[#136f97]/20 mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Матрица возможностей</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight">
            Сравнение характеристик AI-агентов
          </h3>
          <p className="text-xs sm:text-sm text-[#5b7188] dark:text-[#7b8ea6] mt-1">
            Выберите от 2 до 5 агентов, чтобы наглядно сопоставить функционал, сроки и бизнес-результаты.
          </p>
        </div>

        {/* Quick Presets and Diff Toggle */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="inline-flex items-center p-1 rounded-xl bg-[#f0f6fa] dark:bg-[#071524] border border-[#147aa6]/15 dark:border-white/10 text-xs font-semibold">
            <span className="text-[#5b7188] dark:text-[#7b8ea6] px-2 text-[0.7rem] uppercase tracking-wider font-bold hidden sm:inline">Пресеты:</span>
            <button
              type="button"
              onClick={() => selectPreset('sales')}
              className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-[#0e2236] text-[#0d1f36] dark:text-[#eaf3ff] transition-colors cursor-pointer text-xs"
            >
              Отдел продаж
            </button>
            <button
              type="button"
              onClick={() => selectPreset('channels')}
              className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-[#0e2236] text-[#0d1f36] dark:text-[#eaf3ff] transition-colors cursor-pointer text-xs"
            >
              Голос vs Текст
            </button>
            <button
              type="button"
              onClick={() => selectPreset('all')}
              className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-[#0e2236] text-[#0d1f36] dark:text-[#eaf3ff] transition-colors cursor-pointer text-xs"
            >
              Все 5 агентов
            </button>
          </div>

          {/* Diff Toggle Button */}
          <button
            type="button"
            onClick={() => setShowOnlyDiffs(!showOnlyDiffs)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              showOnlyDiffs
                ? 'bg-[#136f97] text-white border-[#136f97] shadow-xs'
                : 'bg-white dark:bg-[#09182a] text-[#5b7188] dark:text-[#7b8ea6] border-[#147aa6]/20 dark:border-white/10 hover:text-[#0d1f36] dark:hover:text-[#eaf3ff]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Только различия</span>
          </button>
        </div>
      </div>

      {/* Agent Selector Chips */}
      <div className="mb-6">
        <span className="block text-xs font-bold text-[#5b7188] dark:text-[#7b8ea6] uppercase tracking-wider mb-2">
          Выберите агентов для сравнения (активно {selectedAgentIds.length} из 5):
        </span>
        <div className="flex flex-wrap gap-2">
          {AGENTS_DATA.map(agent => {
            const isSelected = selectedAgentIds.includes(agent.id);
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => toggleAgent(agent.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#136f97] to-[#0ea5e9] text-white border-[#136f97] shadow-sm'
                    : 'bg-white/70 dark:bg-[#09182a]/70 text-[#5b7188] dark:text-[#7b8ea6] border-[#147aa6]/20 dark:border-white/10 hover:border-[#136f97]/40'
                }`}
              >
                <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[0.65rem] ${isSelected ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10'}`}>
                  {agent.num}
                </div>
                <span>{agent.title}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-[#147aa6]/20 dark:border-white/10 shadow-inner bg-[#fcfdff] dark:bg-[#091828]">
        <table className="w-full text-left border-collapse min-w-[700px]">
          
          {/* Table Header: Selected Agents */}
          <thead>
            <tr className="border-b border-[#147aa6]/20 dark:border-white/10 bg-[#f0f6fa]/70 dark:bg-[#061422]/80">
              <th className="p-4 sm:p-5 w-1/4 text-xs font-black uppercase tracking-wider text-[#5b7188] dark:text-[#7b8ea6]">
                Характеристика / Критерий
              </th>
              {selectedAgents.map(agent => (
                <th key={agent.id} className="p-4 sm:p-5 text-left align-top" style={{ width: `${75 / selectedAgents.length}%` }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="p-1 rounded-md bg-[#136f97]/10 dark:bg-[#38bdf8]/15 shrink-0">
                      {getAgentIcon(agent.id)}
                    </span>
                    <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full border ${getAgentBadgeColor(agent.id)}`}>
                      {agent.category}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] leading-snug mb-1">
                    {agent.title}
                  </h4>
                  <div className="text-xs font-black text-[#136f97] dark:text-[#38bdf8]">
                    {agent.price}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body: Criteria Rows */}
          <tbody className="divide-y divide-[#147aa6]/10 dark:divide-white/5">
            {displayedCriteria.map((crit, idx) => (
              <tr 
                key={crit.id}
                className={`transition-colors hover:bg-[#136f97]/5 dark:hover:bg-white/5 ${
                  idx % 2 === 0 ? 'bg-transparent' : 'bg-[#f7fafc]/40 dark:bg-[#081726]/40'
                }`}
              >
                <td className="p-3.5 sm:p-4 text-xs font-bold text-[#0d1f36] dark:text-[#eaf3ff] align-top">
                  <div className="flex items-center gap-1.5">
                    <span>{crit.label}</span>
                    {crit.tooltip && (
                      <span title={crit.tooltip} className="cursor-help text-[#5b7188] dark:text-[#7b8ea6]">
                        <HelpCircle className="w-3 h-3 opacity-60 hover:opacity-100" />
                      </span>
                    )}
                  </div>
                </td>

                {selectedAgents.map(agent => (
                  <td key={agent.id} className="p-3.5 sm:p-4 align-top">
                    {crit.renderValue(agent)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          {/* Table Footer: Action CTA row */}
          <tfoot>
            <tr className="border-t-2 border-[#147aa6]/20 dark:border-white/10 bg-[#f0f6fa]/60 dark:bg-[#061422]/60">
              <td className="p-4 text-xs font-bold text-[#5b7188] dark:text-[#7b8ea6]">
                Действие:
              </td>
              {selectedAgents.map(agent => (
                <td key={agent.id} className="p-4">
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectAgentForDemo(agent.id)}
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-[#136f97] dark:text-[#38bdf8] bg-[#136f97]/10 dark:bg-[#38bdf8]/15 hover:bg-[#136f97]/20 transition-all cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Демо {agent.num}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenConsultation(`Выбор агента: ${agent.title}`)}
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 text-white bg-[#136f97] hover:bg-[#115d7f] dark:bg-[#38bdf8] dark:text-[#04121f] transition-all cursor-pointer shadow-xs"
                    >
                      <span>Выбрать</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              ))}
            </tr>
          </tfoot>

        </table>
      </div>

      {/* Footnote about multi-agent ecosystems */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#5b7188] dark:text-[#7b8ea6] px-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Все агенты могут работать как независимо, так и в единой связке со сквозной передачей контекста.</span>
        </div>
        <button
          type="button"
          onClick={() => onOpenConsultation('Подбор связки из нескольких агентов')}
          className="font-bold text-[#136f97] dark:text-[#38bdf8] hover:underline cursor-pointer"
        >
          Нужна индивидуальная связка? →
        </button>
      </div>

    </div>
  );
};
