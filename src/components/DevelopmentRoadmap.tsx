import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Cpu, 
  PlayCircle, 
  Rocket, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  UserCheck, 
  Award,
  Zap,
  Sliders,
  Database,
  BarChart3
} from 'lucide-react';
import { RevealText } from './RevealText';
import { TextRevealMask } from './TextRevealMask';
import { ParticlesBg } from './ParticlesBg';

interface RoadmapStep {
  id: number;
  stageNumber: string;
  duration: string;
  phase: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
  metrics: { label: string; value: string };
  weDo: string[];
  clientNeeds: string[];
  artifact: string;
}

const ROADMAP_STEPS: RoadmapStep[] = [
  {
    id: 1,
    stageNumber: '01',
    duration: '1–3 дня',
    phase: 'Фаза 1: Аудит и архитектура',
    title: 'Анализ текущих процессов и поиск узких мест',
    subtitle: 'Картирование пути клиента и выявление точек потери конверсии',
    description: 'Изучаем существующие регламенты, скрипты продаж, типичные возражения клиентов и транскрипты переписок. Определяем каналы с максимальной окупаемостью от автоматизации.',
    icon: Search,
    accentColor: '#136f97',
    badgeBg: 'bg-[#136f97]/10 dark:bg-[#38bdf8]/15 text-[#136f97] dark:text-[#38bdf8] border-[#136f97]/25 dark:border-[#38bdf8]/30',
    metrics: { label: 'Цель фазы', value: '100% аудит воронки' },
    weDo: [
      'Анализ записей звонков и переписок в WhatsApp/Telegram',
      'Выявление типовых сценариев (FAQ, квалификация, запись, возражения)',
      'Проектирование диалоговой логики и матрицы реакций',
      'Расчёт модели окупаемости (Unit-экономика и ROI)'
    ],
    clientNeeds: [
      '1 онлайн-интервью с РОПом или ведущим оператором (40 мин)',
      'Примеры удачных и провальных диалогов с клиентами'
    ],
    artifact: 'Утверждённый Mindmap диалогового дерева, ТЗ и формализованные KPI пилота'
  },
  {
    id: 2,
    stageNumber: '02',
    duration: '4–7 дней',
    phase: 'Фаза 2: Разработка и интеграции',
    title: 'Сборка ядра агента, RAG-базы и API-шлюзов',
    subtitle: 'Промпт-инженерия, векторная база знаний и подключение к CRM',
    description: 'Настраиваем когнитивное ядро агента на Gemini 2.5 с защитой от галлюцинаций (Guardrails). Загружаем корпоративную базу знаний по продуктам, ценам и правилам компании.',
    icon: Cpu,
    accentColor: '#0ea5e9',
    badgeBg: 'bg-[#0ea5e9]/10 dark:bg-[#0ea5e9]/15 text-[#0ea5e9] dark:text-[#38bdf8] border-[#0ea5e9]/25 dark:border-[#0ea5e9]/30',
    metrics: { label: 'Точность ответов', value: '0% галлюцинаций' },
    weDo: [
      'Формирование системного системного промпта с Tone-of-Voice бренда',
      'Индексация базы знаний в векторное хранилище (RAG-архитектура)',
      'Двусторонняя интеграция с amoCRM / Битрикс24 через Webhooks и REST API',
      'Подключение телефонии, Telegram, WhatsApp Business API'
    ],
    clientNeeds: [
      'Актуальный прайс-лист, каталог услуг или регламенты компании (PDF/Docs)',
      'API-ключ или доступ администратора в тестовую среду CRM'
    ],
    artifact: 'Рабочий прототип агента в изолированной песочнице (Sandbox) для внутренних тестов'
  },
  {
    id: 3,
    stageNumber: '03',
    duration: '8–14 дней',
    phase: 'Фаза 3: Пилотный запуск и сплит',
    title: 'Пилот на реальном трафике и точная калибровка',
    subtitle: 'A/B тестирование на 15–25% входящего потока под контролем инженера',
    description: 'Запускаем агента на ограниченную долю живых клиентов. Проверяем скорость реакции, корректность квалификации и автоматическую передачу эстафеты менеджеру при сложных вопросах.',
    icon: PlayCircle,
    accentColor: '#6366f1',
    badgeBg: 'bg-[#6366f1]/10 dark:bg-[#818cf8]/15 text-[#6366f1] dark:text-[#818cf8] border-[#6366f1]/25 dark:border-[#818cf8]/30',
    metrics: { label: 'Скорость ответа', value: '< 3 секунд 24/7' },
    weDo: [
      'Маршрутизация 15–25% входящего трафика на AI-агента',
      'Ежедневный ручной контроль диалогов и донастройка формулировок',
      'Калибровка бесшовного перевода на живого оператора (human-in-the-loop)',
      'Фиксация первых квалифицированных сделок в воронке'
    ],
    clientNeeds: [
      'Проверка менеджерами корректности заполнения карточек сделок в CRM',
      'Обратная связь по качеству передаваемых лидов'
    ],
    artifact: 'Первые закрытые сделки через агента и аналитический сплит-отчёт с результатами'
  },
  {
    id: 4,
    stageNumber: '04',
    duration: '15–21 день',
    phase: 'Фаза 4: Масштабирование',
    title: 'Полная автоматизация всех каналов 24/7',
    subtitle: 'Перевод 100% входящих обращений на агента и обучение команды',
    description: 'Масштабируем агента на все каналы присутствия компании. Настраиваем синхронизацию со складом, календарями бронирования встреч и внутренней ERP-системой.',
    icon: Rocket,
    accentColor: '#10b981',
    badgeBg: 'bg-[#10b981]/10 dark:bg-[#34d399]/15 text-[#059669] dark:text-[#34d399] border-[#10b981]/25 dark:border-[#34d399]/30',
    metrics: { label: 'Охват обращений', value: '100% без очередей' },
    weDo: [
      'Перевод всего трафика во всех мессенджерах, на сайте и телефонии',
      'Стресс-тестирование на пиковые нагрузки (ночные часы, выходные дни)',
      'Интеграция с календарём Google/Яндекс для автозаписи на встречи/замеры',
      'Обучение менеджеров работе с тегами и статусами агента в CRM'
    ],
    clientNeeds: [
      'Участие менеджеров в 30-минутном инструктаже по работе с AI-лидами',
      'Перераспределение освободившихся операторов на ключевые переговоры'
    ],
    artifact: 'Полнофункциональная автономная система в боевом контуре с гарантийным актом'
  },
  {
    id: 5,
    stageNumber: '05',
    duration: 'Постоянно',
    phase: 'Фаза 5: Оптимизация и рост',
    title: 'Непрерывная оптимизация, дообучение и R&D',
    subtitle: 'Анализ краевых кейсов, реактивация спящей базы и рост конверсии',
    description: 'Агент не застывает на месте: мы постоянно анализируем причины отказов, дообучаем нейросеть новым паттернам, подключаем сценарии допродаж и реактивации старых клиентов.',
    icon: TrendingUp,
    accentColor: '#f59e0b',
    badgeBg: 'bg-[#f59e0b]/10 dark:bg-[#fbbf24]/15 text-[#d97706] dark:text-[#fbbf24] border-[#f59e0b]/25 dark:border-[#fbbf24]/30',
    metrics: { label: 'Прирост конверсии', value: '+20–35% к LTV' },
    weDo: [
      'Еженедельный аудит редких и нестандартных запросов клиентов (Edge cases)',
      'Тестирование новых версий языковых моделей (Gemini Pro/Flash обновления)',
      'Запуск сценариев реактивации клиентов, не купивших 30+ дней назад',
      'Предоставление ежемесячного отчёта с финансовыми показателями ROI'
    ],
    clientNeeds: [
      'Согласование новых сезонных спецпредложений и изменений в каталоге',
      '10 минут в месяц на ознакомление с ежемесячным отчётом'
    ],
    artifact: 'Ежемесячный отчёт по конверсиям, снижению стоимости лида и динамике выручки'
  }
];

interface DevelopmentRoadmapProps {
  onOpenConsultation: (topic?: string) => void;
}

export const DevelopmentRoadmap: React.FC<DevelopmentRoadmapProps> = ({ onOpenConsultation }) => {
  const [activeStepId, setActiveStepId] = useState<number>(1);
  // На узком экране пять развёрнутых этапов дают ~6000px — раскрываем только первый.
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>(() => {
    const wide = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
    return { 1: true, 2: wide, 3: wide, 4: wide, 5: wide };
  });

  const toggleStepExpand = (id: number) => {
    setExpandedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectStep = (id: number) => {
    setActiveStepId(id);
    setExpandedSteps(prev => ({ ...prev, [id]: true }));
  };

  return (
    <section className="py-12 sm:py-16 relative overflow-hidden" id="roadmap">
      {/* Animated Particles Interactive Background (Dark/Light Optimized) */}
      <ParticlesBg quantity={50} connectDistance={115} className="opacity-75 dark:opacity-85" />

      {/* Subtle Background Glows */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/4 -left-40 w-96 h-96 bg-[#136f97]/10 dark:bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-1/4 -right-40 w-96 h-96 bg-[#0ea5e9]/10 dark:bg-[#818cf8]/10 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="max-w-[1480px] mx-auto px-5 sm:px-7 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#136f97]/10 dark:bg-[#38bdf8]/15 border border-[#136f97]/25 dark:border-[#38bdf8]/30 text-xs font-bold text-[#136f97] dark:text-[#38bdf8] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#136f97] dark:text-[#38bdf8]" />
            <span>Инженерный трек без простоев</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight leading-tight">
            Дорожная карта внедрения: от первого аудита до автономной оптимизации
          </h2>

          <TextRevealMask
            text="Понятный, прогнозируемый 5-этапный путь интеграции AI-агентов в ваш бизнес. Никаких затяжных проектов: первые результаты и проверенные лиды уже в течение двух недель."
            className="text-sm sm:text-base text-[#5b7188] dark:text-[#7b8ea6] mt-3 leading-relaxed"
            delay={0.2}
          />

          {/* Quick Total Time Badge */}
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 dark:bg-[#0e2236]/90 border border-[#147aa6]/20 dark:border-white/10 text-xs text-[#3a4d63] dark:text-[#b6c6da] shadow-xs">
            <Clock className="w-4 h-4 text-[#136f97] dark:text-[#38bdf8]" />
            <span>Время клиента за весь проект: <strong>всего ~2 часа</strong> (интервью + согласование)</span>
          </div>
        </div>

        {/* Interactive Step Navigator on Desktop / Tablet */}
        <div className="mb-10 hidden md:grid grid-cols-5 gap-2.5 p-2 rounded-2xl bg-white/70 dark:bg-[#0e2236]/60 backdrop-blur-md border border-[#147aa6]/15 dark:border-white/10 shadow-xs">
          {ROADMAP_STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = activeStepId === step.id;

            return (
              <motion.button
                key={step.id}
                onClick={() => handleSelectStep(step.id)}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className={`p-3 rounded-xl text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? 'bg-[#136f97] text-white shadow-md transform -translate-y-0.5 hover:shadow-[0_6px_18px_-3px_rgba(19,111,151,0.35)]'
                    : 'bg-transparent text-[#5b7188] dark:text-[#7b8ea6] hover:bg-[#136f97]/5 dark:hover:bg-white/5 hover:text-[#0d1f36] dark:hover:text-[#eaf3ff] hover:shadow-[0_4px_12px_-2px_rgba(19,111,151,0.12)]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={`text-[0.7rem] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-black/5 dark:bg-white/10 text-[#5b7188] dark:text-[#8aa0b7]'
                  }`}>
                    {step.stageNumber}
                  </span>
                  <span className={`text-[0.7rem] font-semibold ${isActive ? 'text-white/90' : 'text-[#136f97] dark:text-[#38bdf8]'}`}>
                    {step.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#136f97] dark:text-[#38bdf8]'}`} />
                  <span className="text-xs font-bold truncate">
                    {step.phase.split(':')[1] || step.title}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Vertical Timeline Structure */}
        <div className="relative">
          {/* Continuous Vertical Timeline Line */}
          <div 
            aria-hidden="true" 
            className="absolute left-4 sm:left-7 lg:left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#136f97] via-[#0ea5e9] to-[#10b981] opacity-40 dark:opacity-50" 
          />

          {/* Roadmap Steps */}
          <div className="space-y-8 sm:space-y-10">
            {ROADMAP_STEPS.map((step) => {
              const Icon = step.icon;
              const isExpanded = !!expandedSteps[step.id];
              const isFocused = activeStepId === step.id;

              return (
                <div 
                  key={step.id} 
                  id={`roadmap-step-${step.id}`}
                  className="relative pl-12 sm:pl-18 lg:pl-20 transition-all duration-300"
                >
                  {/* Timeline Node Marker */}
                  <div 
                    onClick={() => handleSelectStep(step.id)}
                    className={`absolute left-4 sm:left-7 lg:left-8 top-2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-20 ${
                      isFocused
                        ? 'bg-[#136f97] text-white ring-4 ring-[#136f97]/25 dark:ring-[#38bdf8]/40 shadow-lg scale-110'
                        : 'bg-white dark:bg-[#09182a] text-[#136f97] dark:text-[#38bdf8] border-2 border-[#147aa6]/40 dark:border-[#38bdf8]/40 hover:scale-105'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  {/* Step Card with Liquid Glass Effect */}
                  <div 
                    className={`relative overflow-hidden rounded-3xl transition-all duration-300 backdrop-blur-2xl border ${
                      isFocused
                        ? 'bg-gradient-to-br from-white/90 via-white/70 to-white/45 dark:from-[#0c2238]/90 dark:via-[#091a2c]/75 dark:to-[#05111e]/85 border-white dark:border-[#38bdf8]/50 ring-2 ring-[#136f97]/40 dark:ring-[#38bdf8]/40 shadow-[0_20px_45px_-10px_rgba(19,111,151,0.28),_0_0_0_1.5px_rgba(255,255,255,0.85)_inset] dark:shadow-[0_20px_45px_-10px_rgba(51,164,212,0.28),_0_0_0_1px_rgba(56,189,248,0.3)_inset]'
                        : 'bg-gradient-to-br from-white/80 via-white/55 to-white/35 dark:from-[#0c2238]/80 dark:via-[#091a2c]/65 dark:to-[#05111e]/75 border-white/80 dark:border-white/15 hover:border-white dark:hover:border-white/30 shadow-[0_16px_36px_-10px_rgba(19,111,151,0.18),_0_0_0_1px_rgba(255,255,255,0.7)_inset] dark:shadow-[0_16px_36px_-10px_rgba(51,164,212,0.18),_0_0_0_1px_rgba(255,255,255,0.08)_inset]'
                    }`}
                  >
                    {/* Liquid Glass Top Specular Highlight */}
                    <div 
                      aria-hidden="true" 
                      className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white dark:via-white/60 to-transparent z-10" 
                    />

                    {/* Liquid Glass Organic Ambient Light Sheen Blobs */}
                    <div 
                      aria-hidden="true" 
                      className="pointer-events-none absolute -top-16 -right-16 w-60 h-60 rounded-full bg-gradient-to-br from-[#136f97]/15 via-[#38bdf8]/10 to-transparent blur-2xl opacity-75 dark:opacity-40" 
                    />
                    <div 
                      aria-hidden="true" 
                      className="pointer-events-none absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-gradient-to-tr from-[#10b981]/15 via-[#136f97]/10 to-transparent blur-2xl opacity-60 dark:opacity-30" 
                    />

                    {/* Card Header */}
                    <div 
                      onClick={() => toggleStepExpand(step.id)}
                      className="relative z-10 p-5 sm:p-7 cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#147aa6]/15 dark:border-white/10"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                          <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${step.badgeBg}`}>
                            {step.stageNumber} • {step.phase}
                          </span>
                          
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#136f97] dark:text-[#38bdf8] bg-[#136f97]/5 dark:bg-[#38bdf8]/10 px-2.5 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            {step.duration}
                          </span>

                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                            <Award className="w-3 h-3" />
                            {step.metrics.label}: {step.metrics.value}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-black text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight">
                          {step.title}
                        </h3>

                        <p className="text-xs sm:text-sm font-medium text-[#5b7188] dark:text-[#7b8ea6] mt-1">
                          {step.subtitle}
                        </p>
                      </div>

                      {/* Expand Toggle Button */}
                      <button 
                        type="button"
                        aria-label={isExpanded ? 'Свернуть детали' : 'Развернуть детали'}
                        className="self-start sm:self-center shrink-0 w-8 h-8 rounded-full bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/15 dark:border-white/10 flex items-center justify-center text-[#5b7188] dark:text-[#7b8ea6] hover:text-[#136f97] dark:hover:text-[#38bdf8] transition-colors"
                      >
                        <ChevronRight className={`w-4 h-4 transform transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>
                    </div>

                    {/* Expandable Details Body */}
                    {isExpanded && (
                      <div className="relative z-10 p-5 sm:p-7 space-y-6 animate-in fade-in duration-200">
                        {/* Summary description */}
                        <p className="text-xs sm:text-sm text-[#3a4d63] dark:text-[#b6c6da] leading-relaxed">
                          {step.description}
                        </p>

                        {/* Deliverables 2-Column Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Left: What We Do */}
                          <div className="p-4 rounded-2xl bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/15 dark:border-white/10">
                            <div className="flex items-center gap-2 mb-3">
                              <Zap className="w-4 h-4 text-[#136f97] dark:text-[#38bdf8]" />
                              <h4 className="text-xs font-black uppercase tracking-wider text-[#0d1f36] dark:text-[#eaf3ff]">
                                Что делаем мы (Инженерный фронт)
                              </h4>
                            </div>
                            <ul className="space-y-2">
                              {step.weDo.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-[#3a4d63] dark:text-[#b6c6da]">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Right: What Client Needs */}
                          <div className="p-4 rounded-2xl bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/15 dark:border-white/10">
                            <div className="flex items-center gap-2 mb-3">
                              <UserCheck className="w-4 h-4 text-[#136f97] dark:text-[#38bdf8]" />
                              <h4 className="text-xs font-black uppercase tracking-wider text-[#0d1f36] dark:text-[#eaf3ff]">
                                Что нужно от вас (Минимум времени)
                              </h4>
                            </div>
                            <ul className="space-y-2">
                              {step.clientNeeds.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-[#3a4d63] dark:text-[#b6c6da]">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#136f97] dark:bg-[#38bdf8] shrink-0 mt-1.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Tangible Deliverable Banner */}
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#136f97]/10 via-[#0ea5e9]/10 to-transparent dark:from-[#38bdf8]/10 dark:via-[#0ea5e9]/10 border border-[#136f97]/25 dark:border-[#38bdf8]/25 flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 text-[#136f97] dark:text-[#38bdf8] shrink-0" />
                            <div>
                              <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#5b7188] dark:text-[#7b8ea6] block">
                                Итог и артефакт этапа:
                              </span>
                              <span className="text-xs sm:text-sm font-extrabold text-[#0d1f36] dark:text-[#eaf3ff]">
                                {step.artifact}
                              </span>
                            </div>
                          </div>

                          <motion.button
                            type="button"
                            onClick={() => onOpenConsultation(`Обсудить этап: ${step.title}`)}
                            whileHover={{ scale: 1.04, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-white bg-[#136f97] hover:bg-[#116285] dark:bg-[#33a4d4] dark:hover:bg-[#288eb9] dark:text-[#04121f] shadow-xs hover:shadow-[0_4px_12px_-2px_rgba(19,111,151,0.35)] dark:hover:shadow-[0_4px_12px_-2px_rgba(51,164,212,0.35)] transition-all cursor-pointer"
                          >
                            <span>Обсудить этап</span>
                            <ArrowRight className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Roadmap Summary Card */}
        <div className="relative mt-12 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-[#f6f9fc] to-[#eef4fa] dark:from-[#0e2236] dark:via-[#09182a] dark:to-[#050f1c] border border-[#147aa6]/20 dark:border-white/10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Финансовая защита результата</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight">
              Готовы оценить потенциал окупаемости для вашей компании?
            </h3>
            <p className="text-xs sm:text-sm text-[#5b7188] dark:text-[#7b8ea6] mt-2 leading-relaxed">
              На бесплатной 30-минутной сессии пройдёмся по вашей воронке, посчитаем смету и сформируем черновую дорожную карту внедрения под ваши CRM и каналы.
            </p>
          </div>

          {/* Робот между текстом и кнопками: в потоке, а не поверх —
              иначе перекрывал заголовок. */}
          <img
            src="https://uspeshnyy.ru/assets/agenty3/roadmap-robot.webp"
            data-dark="https://uspeshnyy.ru/assets/agenty3/roadmap-robot-dark.webp"
            alt=""
            aria-hidden="true"
            loading="lazy"
            width={1122}
            height={1402}
            className="robot-float hidden lg:block h-auto w-72 xl:w-80 shrink-0 select-none -my-16 -mt-24 drop-shadow-2xl"
          />

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <motion.button
              type="button"
              onClick={() => onOpenConsultation('Дорожная карта внедрения под ключ')}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-extrabold rounded-full text-white bg-gradient-to-b from-[#157ba4] to-[#136f97] dark:from-[#46b6e4] dark:to-[#33a4d4] dark:text-[#04121f] shadow-lg hover:shadow-[0_10px_25px_-5px_rgba(19,111,151,0.4)] dark:hover:shadow-[0_10px_25px_-5px_rgba(51,164,212,0.35)] transition-all cursor-pointer"
            >
              <Rocket className="w-4 h-4" />
              <span>Получить дорожную карту</span>
            </motion.button>
            
            <motion.a
              href="https://t.me/uspeshnyy?utm_source=agenty&utm_medium=cta&utm_campaign=ai_agents"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-full bg-white dark:bg-[#09182a] text-[#136f97] dark:text-[#38bdf8] border border-[#147aa6]/25 dark:border-white/10 hover:bg-[#136f97]/5 dark:hover:bg-white/5 hover:shadow-[0_6px_18px_-3px_rgba(19,111,151,0.18)] dark:hover:shadow-[0_6px_18px_-3px_rgba(51,164,212,0.18)] transition-all cursor-pointer"
            >
              <span>Задать вопрос в Telegram</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>
        </div>

      </div>
    </section>
  );
};
