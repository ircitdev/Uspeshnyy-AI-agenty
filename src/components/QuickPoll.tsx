import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart2, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  Clock, 
  Users, 
  TrendingDown, 
  BookOpen, 
  Layers, 
  ArrowRight, 
  RotateCcw,
  ShieldCheck,
  Flame,
  MessageSquare
} from 'lucide-react';
import { RevealText } from './RevealText';
import { GlassmorphismCta } from './GlassmorphismCta';

interface QuickPollProps {
  onOpenConsultation: (details: string) => void;
}

interface ObstacleOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  benchmarkPercent: number;
  votesCount: number;
  recommendedAgent: string;
  estimatedRoi: string;
  solutionApproach: string;
}

const OBSTACLES: ObstacleOption[] = [
  {
    id: 'response_delay',
    title: 'Медленный ответ на лиды и потери в часы пик',
    subtitle: 'Заявки ждут ответа >15 минут, а ночной трафик уходит конкурентам',
    description: 'Менеджеры не справляются с наплывом обращений в пиковые часы и выходные дни. Пока заявка висит без ответа, клиент находит других исполнителей.',
    icon: Clock,
    accentColor: '#136f97',
    benchmarkPercent: 41,
    votesCount: 589,
    recommendedAgent: 'Агент-Квалификатор 24/7 (01)',
    estimatedRoi: 'Рост конверсии первого контакта на +28%',
    solutionApproach: 'Мгновенный перехват диалога за 10 секунд, 3 вопроса квалификации и постановка задачи дежурному менеджеру в CRM.'
  },
  {
    id: 'routine_overload',
    title: 'Менеджеры тонут в рутине и однотипных вопросах',
    subtitle: 'До 60% времени уходит на отправку прайсов, графика и пересказ условий',
    description: 'Квалифицированные специалисты тратят рабочие часы на консультации нецелевых клиентов и банальный FAQ вместо закрытия крупных сделок.',
    icon: Users,
    accentColor: '#0ea5e9',
    benchmarkPercent: 28,
    votesCount: 402,
    recommendedAgent: 'RAG-Агент Первой линии (04)',
    estimatedRoi: 'Освобождение до 25 часов в неделю на одного сотрудника',
    solutionApproach: 'Автономная обработка 80% типовых вопросов из корпоративной базы знаний с гарантией нулевых галлюцинаций.'
  },
  {
    id: 'traffic_leakage',
    title: 'Дорогая реклама (CPA) и низкая конверсия воронки',
    subtitle: 'Лиды приходят в CRM, но «зависают» и теряются без системного дожима',
    description: 'Рекламный бюджет дорожает каждый месяц, а повторные касания делаются бессистемно. Клиенты забывают о предложении и не доходят до оплаты.',
    icon: TrendingDown,
    accentColor: '#6366f1',
    benchmarkPercent: 17,
    votesCount: 244,
    recommendedAgent: 'Агент Умного Дожима & Реактивации (03)',
    estimatedRoi: 'Возврат до 22% «уснувших» заявок в активную стадию сделки',
    solutionApproach: 'Интеллектуальные напоминания с учетом истории диалога, персонализированные спецпредложения и триггерные касания.'
  },
  {
    id: 'knowledge_chaos',
    title: 'Сложно обучать новичков и контролировать регламенты',
    subtitle: 'Текучка операторов, скрипты на бумаге не соблюдаются, знания теряются',
    description: 'Каждый менеджер консультирует по-своему. При увольнении ключевого сотрудника компания теряет уникальный опыт и наработки.',
    icon: BookOpen,
    accentColor: '#10b981',
    benchmarkPercent: 10,
    votesCount: 143,
    recommendedAgent: 'AI-Копилот и База Знаний (05)',
    estimatedRoi: 'Сокращение адаптации новичков с 1 месяца до 4 дней',
    solutionApproach: 'Векторный поиск по всем регламентам компании с подсказками в реальном времени прямо во время диалога с клиентом.'
  },
  {
    id: 'custom_complexity',
    title: 'Сложные нестандартные бизнес-процессы и B2B-сделки',
    subtitle: 'Индивидуальные сметы, длинный цикл сделки или закрытые ERP-системы',
    description: 'Стандартные боты не подходят из-за комплексной логики, многоуровневых согласований, API 1С/МойСклад или специфической номенклатуры.',
    icon: Layers,
    accentColor: '#f59e0b',
    benchmarkPercent: 4,
    votesCount: 58,
    recommendedAgent: 'Кастомный AI-пайплайн под ключ',
    estimatedRoi: 'Индивидуальная окупаемость от 3 месяцев',
    solutionApproach: 'Проектирование персонального микросервиса с интеграцией любых баз данных, калькуляторов стоимости и внешних API.'
  }
];

const TOTAL_VOTES_SEED = 1436;

export const QuickPoll: React.FC<QuickPollProps> = ({ onOpenConsultation }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [userComment, setUserComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Restore state from localStorage if user previously participated
  useEffect(() => {
    try {
      const saved = localStorage.getItem('uspeshnyy-quick-poll-selected');
      const savedComment = localStorage.getItem('uspeshnyy-quick-poll-comment');
      if (saved) {
        setSelectedId(saved);
        setHasVoted(true);
      }
      if (savedComment) {
        setUserComment(savedComment);
      }
    } catch {}
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setHasVoted(true);
    try {
      localStorage.setItem('uspeshnyy-quick-poll-selected', id);
    } catch {}
  };

  const handleReset = () => {
    setSelectedId(null);
    setHasVoted(false);
    setUserComment('');
    try {
      localStorage.removeItem('uspeshnyy-quick-poll-selected');
      localStorage.removeItem('uspeshnyy-quick-poll-comment');
    } catch {}
  };

  const selectedObstacle = OBSTACLES.find(o => o.id === selectedId) || null;

  const handleBookConsultation = () => {
    if (!selectedObstacle) return;
    setIsSubmitting(true);
    try {
      if (userComment) {
        localStorage.setItem('uspeshnyy-quick-poll-comment', userComment);
      }
    } catch {}

    const topic = `Экспресс-опрос: главное препятствие «${selectedObstacle.title}»${
      userComment ? ` (Комментарий: ${userComment})` : ''
    }. Рекомендован: ${selectedObstacle.recommendedAgent}`;
    
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenConsultation(topic);
    }, 150);
  };

  const handleTelegramShare = () => {
    if (!selectedObstacle) return;
    const text = encodeURIComponent(
      `Здравствуйте! Прошел экспресс-опрос на сайте: наше главное узкое горлышко — «${selectedObstacle.title}»${
        userComment ? `. Детали: ${userComment}` : ''
      }. Хочу узнать, как решить это с помощью ${selectedObstacle.recommendedAgent}.`
    );
    window.open(`https://t.me/uspeshnyy?text=${text}`, '_blank');
  };

  return (
    <section className="py-10 sm:py-14 relative" id="poll">
      <div className="max-w-[1480px] mx-auto px-5 sm:px-7">
        
        {/* Main Card with Liquid Glass Effect */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 transition-all duration-300 backdrop-blur-2xl bg-gradient-to-br from-white/85 via-white/60 to-white/40 dark:from-[#0c2238]/85 dark:via-[#091a2c]/70 dark:to-[#05111e]/80 border border-white/80 dark:border-white/15 shadow-[0_20px_45px_-10px_rgba(19,111,151,0.2),_0_0_0_1px_rgba(255,255,255,0.7)_inset] dark:shadow-[0_20px_45px_-10px_rgba(51,164,212,0.2),_0_0_0_1px_rgba(255,255,255,0.1)_inset]">
          
          {/* Top Specular Reflection */}
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white dark:via-white/60 to-transparent z-10" 
          />

          {/* Organic Ambient Glass Blobs */}
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-br from-[#136f97]/15 via-[#38bdf8]/10 to-transparent blur-3xl opacity-70 dark:opacity-40" 
          />
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-tl from-emerald-500/15 via-[#136f97]/10 to-transparent blur-3xl opacity-60 dark:opacity-35" 
          />

          {/* Робот-помощник. На мобильном скрыт — там дорог каждый экран. */}
          <img
            src="https://uspeshnyy.ru/assets/agenty3/poll-robot.webp"
            data-dark="https://uspeshnyy.ru/assets/agenty3/poll-robot-dark.webp"
            alt=""
            aria-hidden="true"
            loading="lazy"
            width={1122}
            height={1402}
            className="robot-float-slow robot-float pointer-events-none absolute right-0 top-20 z-0 hidden h-auto w-[460px] max-w-[42%] select-none lg:block xl:w-[540px]"
          />

          {/* Header */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#136f97]/10 dark:bg-[#38bdf8]/15 border border-[#136f97]/25 dark:border-[#38bdf8]/30 text-xs font-bold text-[#136f97] dark:text-[#38bdf8] mb-3">
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Экспресс-опрос предпринимателей</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[0.68rem] text-emerald-600 dark:text-emerald-400 font-semibold">1 436+ голосов</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight leading-tight">
                <RevealText text="Какое узкое горлышко тормозит рост вашего бизнеса прямо сейчас?" as="span" />
              </h2>

              <p className="text-sm sm:text-base text-[#5b7188] dark:text-[#7b8ea6] mt-2 leading-relaxed">
                Выберите один ключевой фактор. Мы мгновенно сопоставим вашу ситуацию со статистикой других компаний и покажем проверенный сценарий решения.
              </p>
            </div>

            {hasVoted && (
              <button
                onClick={handleReset}
                className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#5b7188] dark:text-[#7b8ea6] hover:text-[#136f97] dark:hover:text-[#38bdf8] bg-white/70 dark:bg-[#0e2236]/70 border border-[#147aa6]/20 dark:border-white/10 shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Изменить ответ</span>
              </button>
            )}
          </div>

          {/* Poll Layout: 2 Columns when voted, Full Grid before voting */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Poll Options */}
            <div className={`${hasVoted ? 'lg:col-span-7' : 'lg:col-span-8'} space-y-3`}>
              {OBSTACLES.map((obstacle) => {
                const Icon = obstacle.icon;
                const isSelected = selectedId === obstacle.id;

                return (
                  <motion.div
                    key={obstacle.id}
                    layout
                    whileHover={{ scale: 1.015, y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => handleSelect(obstacle.id)}
                    className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all duration-200 select-none ${
                      isSelected
                        ? 'bg-white dark:bg-[#0e2236] border-[#136f97] dark:border-[#38bdf8] ring-2 ring-[#136f97]/25 dark:ring-[#38bdf8]/35 shadow-lg'
                        : 'bg-white/65 dark:bg-[#0e2236]/60 border-[#147aa6]/15 dark:border-white/10 hover:border-[#136f97]/30 hover:bg-white/90 dark:hover:bg-[#0e2236]/80 shadow-xs'
                    }`}
                  >
                    {/* Top Row: Icon + Title + Selected Indicator */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#136f97] text-white dark:bg-[#38bdf8] dark:text-[#04121f] shadow-xs'
                            : 'bg-[#136f97]/10 dark:bg-[#38bdf8]/15 text-[#136f97] dark:text-[#38bdf8]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight">
                            {obstacle.title}
                          </h4>
                          <p className="text-xs text-[#5b7188] dark:text-[#7b8ea6] mt-0.5">
                            {obstacle.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {hasVoted && (
                          <span className="text-xs sm:text-sm font-black text-[#136f97] dark:text-[#38bdf8]">
                            {obstacle.benchmarkPercent}%
                          </span>
                        )}
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#136f97] border-[#136f97] dark:bg-[#38bdf8] dark:border-[#38bdf8] text-white dark:text-[#04121f]'
                            : 'border-[#147aa6]/30 dark:border-white/20 bg-transparent'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>

                    {/* Animated Benchmark Progress Bar when voted */}
                    {hasVoted && (
                      <div className="mt-3 pt-3 border-t border-[#147aa6]/10 dark:border-white/5">
                        <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${obstacle.benchmarkPercent}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#136f97] to-[#38bdf8]'
                                : 'bg-[#136f97]/40 dark:bg-[#38bdf8]/40'
                            }`}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1 text-[0.68rem] text-[#5b7188] dark:text-[#7b8ea6]">
                          <span>{obstacle.votesCount} руководителей выбрали этот пункт</span>
                          {isSelected && (
                            <span className="font-bold text-[#136f97] dark:text-[#38bdf8]">Ваш выбор</span>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Right Column: Tailored Consultation Insights & Direct Action */}
            {hasVoted && selectedObstacle && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
                className="lg:col-span-5 relative"
              >
                <div className="sticky top-24 rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-white via-[#f6f9fc] to-[#eef4fa] dark:from-[#0c2238] dark:via-[#09182a] dark:to-[#05111e] border-2 border-[#136f97]/30 dark:border-[#38bdf8]/40 shadow-xl space-y-5">
                  
                  {/* Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#136f97]/15 dark:bg-[#38bdf8]/20 text-[#136f97] dark:text-[#38bdf8] text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Персональный разбор</span>
                    </div>

                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      Решение проверено
                    </span>
                  </div>

                  {/* Diagnosis summary */}
                  <div>
                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#5b7188] dark:text-[#7b8ea6] block mb-1">
                      Выявленная точка роста:
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-[#0d1f36] dark:text-[#eaf3ff] leading-snug">
                      {selectedObstacle.title}
                    </h3>
                  </div>

                  {/* Recommendation Card */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#0e2236] border border-[#147aa6]/15 dark:border-white/10 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#5b7188] dark:text-[#7b8ea6]">Рекомендуемый агент:</span>
                      <span className="text-[#136f97] dark:text-[#38bdf8] font-black">
                        {selectedObstacle.recommendedAgent}
                      </span>
                    </div>

                    <p className="text-xs text-[#3a4d63] dark:text-[#b6c6da] leading-relaxed">
                      {selectedObstacle.solutionApproach}
                    </p>

                    <div className="pt-2 border-t border-[#147aa6]/10 dark:border-white/5 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>{selectedObstacle.estimatedRoi}</span>
                    </div>
                  </div>

                  {/* Optional user detail note */}
                  <div>
                    <label className="block text-xs font-bold text-[#0d1f36] dark:text-[#eaf3ff] mb-1.5">
                      Уточните ваш контекст (необязательно):
                    </label>
                    <input
                      type="text"
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      placeholder="Например: amoCRM, 4 менеджера, оптовая торговля..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#0e2236] border border-[#147aa6]/20 dark:border-white/15 text-[#0d1f36] dark:text-[#eaf3ff] placeholder-[#5b7188]/60 focus:outline-none focus:ring-2 focus:ring-[#136f97] dark:focus:ring-[#38bdf8]"
                    />
                  </div>

                  {/* Actions */}
                  <div className="space-y-2.5 pt-1">
                    <GlassmorphismCta
                      onClick={handleBookConsultation}
                      className="w-full justify-center"
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      {isSubmitting ? 'Подготовка диалога...' : 'Обсудить решение на консультации'}
                    </GlassmorphismCta>

                    <motion.button
                      type="button"
                      onClick={handleTelegramShare}
                      whileHover={{ scale: 1.025, y: -1 }}
                      whileTap={{ scale: 0.975 }}
                      className="w-full py-2.5 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 bg-[#136f97]/10 hover:bg-[#136f97]/20 text-[#136f97] dark:bg-[#38bdf8]/15 dark:hover:bg-[#38bdf8]/25 dark:text-[#38bdf8] border border-[#136f97]/20 dark:border-[#38bdf8]/30 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Обсудить в Telegram с архитектором</span>
                    </motion.button>
                  </div>

                  <p className="text-[0.7rem] text-center text-[#5b7188] dark:text-[#7b8ea6]">
                    Бесплатный 30-минутный созвон • Расчёт сметы и roadmap без навязывания
                  </p>

                </div>
              </motion.div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
