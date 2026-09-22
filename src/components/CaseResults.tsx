import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { TextRevealMask } from './TextRevealMask';
import { CASE_STUDIES } from '../data/agentsData';
import { 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Building2, 
  Stethoscope, 
  Wrench, 
  Quote, 
  TrendingDown, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw,
  Timer,
  BarChart3,
  Percent,
  Check
} from 'lucide-react';

interface AnimatedCounterProps {
  value: string | number;
  trigger: boolean;
  duration?: number;
  className?: string;
  prefixOverride?: string;
  suffixOverride?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  trigger,
  duration = 1500,
  className = '',
  prefixOverride,
  suffixOverride
}) => {
  const parsed = useMemo(() => {
    if (typeof value === 'number') {
      return { prefix: '', target: value, suffix: '', decimals: 0, isRaw: false };
    }
    const str = String(value).trim();
    // Match prefix (like +, −, -, с ), number, and trailing suffix (% , сек, часа, etc.)
    const match = str.match(/^([^\d.]*)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) {
      return { prefix: '', target: 0, suffix: str, decimals: 0, isRaw: true };
    }
    const prefix = match[1];
    const target = parseFloat(match[2]);
    const suffix = match[3];
    const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0;
    return { prefix, target, suffix, decimals, isRaw: false };
  }, [value]);

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!trigger) {
      setDisplayValue(0);
      return;
    }
    if (parsed.isRaw) return;

    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo for energetic counter feel
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(ease * parsed.target);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(parsed.target);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [trigger, parsed.target, parsed.isRaw, duration]);

  if (parsed.isRaw) {
    return <span className={className}>{value}</span>;
  }

  const prefix = prefixOverride !== undefined ? prefixOverride : parsed.prefix;
  const suffix = suffixOverride !== undefined ? suffixOverride : parsed.suffix;

  const formattedNumber = parsed.decimals > 0
    ? displayValue.toFixed(parsed.decimals)
    : Math.round(displayValue).toString();

  return (
    <span className={`inline-flex items-baseline font-mono tracking-tight tabular-nums ${className}`}>
      {prefix && <span>{prefix}</span>}
      <span>{formattedNumber}</span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
};

export const CaseResults: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(CASE_STUDIES[0].id);
  const [isInView, setIsInView] = useState(false);
  const [animationCycle, setAnimationCycle] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeCase = CASE_STUDIES.find(c => c.id === selectedCaseId) || CASE_STUDIES[0];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleReplayAnimation = () => {
    setIsInView(false);
    setTimeout(() => {
      setAnimationCycle(prev => prev + 1);
      setIsInView(true);
    }, 80);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'services': return <Wrench className="w-4 h-4" />;
      case 'clinic': return <Stethoscope className="w-4 h-4" />;
      case 'b2b': return <Building2 className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="bg-white/85 dark:bg-[#0e2236]/85 backdrop-blur-md rounded-3xl p-5 sm:p-7 lg:p-8 border border-[#147aa6]/20 dark:border-white/10 shadow-lg relative overflow-hidden"
    >
      {/* Subtle Background Glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 right-0 w-64 h-64 bg-[#136f97]/5 dark:bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none" 
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              <span>Замеренный эффект</span>
            </span>
            <motion.button
              type="button"
              onClick={handleReplayAnimation}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              title="Перезапустить анимацию метрик"
              className="inline-flex items-center gap-1 text-[0.68rem] text-[#5b7188] dark:text-[#7b8ea6] hover:text-[#136f97] dark:hover:text-[#38bdf8] transition-colors p-1 rounded-md cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Пересчитать</span>
            </motion.button>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-black text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight">
            Реальные результаты внедрения
          </h2>
          <TextRevealMask
            text="Короткие выжимки из проектов с динамическими счётчиками окупаемости и точности."
            className="text-xs sm:text-sm text-[#5b7188] dark:text-[#7b8ea6] mt-1"
            delay={0.2}
          />
        </div>

        <a
          href="https://blog.uspeshnyy.ru/rubriki/keysy/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-[#136f97] dark:text-[#33a4d4] hover:underline inline-flex items-center gap-1 shrink-0 self-start sm:self-auto"
        >
          <span>Читать все кейсы</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Key Metrics Impact Showcase Strip (Immediate visual punch) */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: Operational Cost Reduction */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#136f97]/10 via-[#136f97]/5 to-transparent dark:from-[#38bdf8]/15 dark:via-[#38bdf8]/5 dark:to-transparent border border-[#136f97]/20 dark:border-[#38bdf8]/25 relative overflow-hidden group transition-shadow hover:shadow-md cursor-default"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#5b7188] dark:text-[#7b8ea6] truncate">
              Операционные расходы
            </span>
            <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-[#0d1f36] dark:text-[#eaf3ff]">
              <AnimatedCounter
                key={`cost-red-${animationCycle}`}
                value="−54%"
                trigger={isInView}
                duration={1600}
                className="text-[#136f97] dark:text-[#38bdf8]"
              />
            </span>
          </div>
          <p className="text-[0.7rem] text-[#5b7188] dark:text-[#8aa0b7] mt-1 leading-snug">
            <strong>Operational Cost Reduction</strong> за счёт автоматизации рутинной квалификации
          </p>
        </motion.div>

        {/* Metric 2: Response Time Improvement */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-400/15 dark:via-amber-400/5 dark:to-transparent border border-amber-500/20 dark:border-amber-400/25 relative overflow-hidden group transition-shadow hover:shadow-md cursor-default"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#5b7188] dark:text-[#7b8ea6] truncate">
              Скорость первого ответа
            </span>
            <div className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-[#0d1f36] dark:text-[#eaf3ff]">
              <AnimatedCounter
                key={`resp-time-${animationCycle}`}
                value="14 сек"
                trigger={isInView}
                duration={1400}
                className="text-amber-700 dark:text-amber-300"
              />
            </span>
          </div>
          <p className="text-[0.7rem] text-[#5b7188] dark:text-[#8aa0b7] mt-1 leading-snug">
            <strong>Response Time Improvement:</strong> с 45 минут ожидания до мгновенного контакта
          </p>
        </motion.div>

        {/* Metric 3: Autonomous Resolution Rate */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-400/15 dark:via-emerald-400/5 dark:to-transparent border border-emerald-500/20 dark:border-emerald-400/25 relative overflow-hidden group transition-shadow hover:shadow-md cursor-default"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#5b7188] dark:text-[#7b8ea6] truncate">
              Автономность 24/7
            </span>
            <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-[#0d1f36] dark:text-[#eaf3ff]">
              <AnimatedCounter
                key={`auto-rate-${animationCycle}`}
                value="85%"
                trigger={isInView}
                duration={1500}
                className="text-emerald-600 dark:text-emerald-400"
              />
            </span>
          </div>
          <p className="text-[0.7rem] text-[#5b7188] dark:text-[#8aa0b7] mt-1 leading-snug">
            Диалогов закрываются без участия менеджера с фиксацией заявки в CRM
          </p>
        </motion.div>
      </div>

      {/* Case Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {CASE_STUDIES.map(item => {
          const isSelected = selectedCaseId === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setSelectedCaseId(item.id)}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className={`p-2.5 sm:p-3 rounded-xl text-left transition-all border flex flex-col sm:flex-row items-center sm:items-start gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#136f97]/15 dark:bg-[#33a4d4]/20 border-[#136f97] dark:border-[#33a4d4] shadow-xs hover:shadow-[0_6px_16px_-3px_rgba(19,111,151,0.25)] dark:hover:shadow-[0_6px_16px_-3px_rgba(51,164,212,0.25)]'
                  : 'bg-[#f6f9fc] dark:bg-[#09182a] border-[#147aa6]/15 hover:border-[#136f97]/30 hover:shadow-[0_6px_16px_-3px_rgba(19,111,151,0.15)] dark:hover:shadow-[0_6px_16px_-3px_rgba(51,164,212,0.15)] text-[#5b7188] dark:text-[#7b8ea6]'
              }`}
            >
              <span className="p-1.5 rounded-lg bg-white dark:bg-[#0e2236] text-[#136f97] dark:text-[#33a4d4] shrink-0 shadow-xs">
                {getCategoryIcon(item.category)}
              </span>
              <div className="text-center sm:text-left truncate w-full">
                <strong className="block text-xs font-bold text-[#0d1f36] dark:text-[#eaf3ff] leading-tight truncate">
                  {item.categoryName.split(' ')[0]}
                </strong>
                <span className="hidden sm:block text-[0.68rem] text-[#5b7188] dark:text-[#7b8ea6] truncate">
                  {item.client}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Case Breakdown */}
      <div className="p-5 rounded-2xl bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/15 dark:border-white/10">
        
        {/* Title & Agent Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#147aa6]/15 dark:border-white/10">
          <div>
            <h3 className="text-base font-bold text-[#0d1f36] dark:text-[#eaf3ff]">
              {activeCase.title}
            </h3>
            <span className="text-xs text-[#5b7188] dark:text-[#7b8ea6]">
              Клиент: {activeCase.client} · Срок запуска: {activeCase.timeline}
            </span>
          </div>
          <span className="self-start sm:self-auto text-[0.72rem] px-2.5 py-1 rounded-full font-semibold bg-[#136f97]/10 dark:bg-[#33a4d4]/15 text-[#136f97] dark:text-[#33a4d4] border border-[#136f97]/20 dark:border-[#33a4d4]/30">
            {activeCase.agentUsed}
          </span>
        </div>

        {/* 4 Dynamic Metric Chips for Active Case */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {activeCase.metrics.map((m, idx) => (
            <motion.div 
              key={`${activeCase.id}-${idx}-${animationCycle}`}
              whileHover={{ scale: 1.04, y: -2 }}
              className="p-3 rounded-xl bg-white dark:bg-[#0e2236] border border-[#147aa6]/15 dark:border-white/10 text-center shadow-xs transition-shadow hover:shadow-md cursor-default"
            >
              <span className="block text-lg sm:text-xl font-black text-[#136f97] dark:text-[#38bdf8]">
                <AnimatedCounter
                  value={m.value}
                  trigger={isInView}
                  duration={1300 + idx * 150}
                />
              </span>
              <span className="text-[0.68rem] text-[#5b7188] dark:text-[#7b8ea6] leading-tight block mt-0.5">
                {m.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Problem vs Solution */}
        <div className="space-y-2.5 text-xs sm:text-[0.82rem] leading-relaxed text-[#3a4d63] dark:text-[#b6c6da] mb-4">
          <div>
            <strong className="text-[#0d1f36] dark:text-[#eaf3ff]">Проблема: </strong>
            {activeCase.problem}
          </div>
          <div>
            <strong className="text-[#0d1f36] dark:text-[#eaf3ff]">Решение: </strong>
            {activeCase.solution}
          </div>
        </div>

        {/* Quote */}
        <div className="p-3 rounded-xl bg-white/70 dark:bg-[#0e2236]/70 border-l-3 border-[#136f97] dark:border-[#33a4d4] text-xs italic text-[#5b7188] dark:text-[#7b8ea6] flex items-start gap-2">
          <Quote className="w-3.5 h-3.5 shrink-0 text-[#136f97] dark:text-[#33a4d4] mt-0.5" />
          <span>{activeCase.quote}</span>
        </div>

      </div>

    </div>
  );
};
