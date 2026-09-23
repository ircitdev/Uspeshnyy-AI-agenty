import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Zap, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Flame, 
  FileText,
  BadgeCheck,
  TrendingUp,
  Headphones
} from 'lucide-react';
import { RevealText } from './RevealText';
import { TextRevealMask } from './TextRevealMask';
import { GlowCard } from './GlowCard';

interface PricingSectionProps {
  onOpenConsultation: (planName: string) => void;
}

type BillingMode = 'turnkey' | 'growth';

interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  price: string;
  priceNote: string;
  period: string;
  roiTag?: string;
  desc: string;
  featuresTitle: string;
  features: string[];
  buttonText: string;
  highlightColor?: string;
}

const TURNKEY_PLANS: PricingPlan[] = [
  {
    id: 'audit',
    name: 'Экспресс-разбор процесса',
    badge: 'Бесплатный старт',
    price: '0 ₽',
    priceNote: 'без обязательств',
    period: '30–40 минут созвон',
    roiTag: 'Диагностика за 0 ₽',
    desc: 'Глубокий аудит воронки и диалогов. Честно покажем: нужен ли вам AI-агент или проблему решит регламент в CRM.',
    featuresTitle: 'Что входит в разбор:',
    features: [
      'Анализ точек слива заявок в часы пик',
      'Расчёт потенциального ROI внедрения',
      'Проектирование архитектуры агента',
      'Пошаговая смета и сроки запуска'
    ],
    buttonText: 'Записаться на разбор',
    isPopular: false
  },
  {
    id: 'single',
    name: 'Один агент под ключ',
    badge: 'Хит внедрения • 82% компаний',
    isPopular: true,
    price: 'от 60 000 ₽',
    priceNote: 'разово под ключ',
    period: 'Запуск за 7–14 дней',
    roiTag: 'Окупаемость 14–21 день',
    desc: 'Закрывает самый проблемный участок: мгновенный захват лидов 24/7, ночные диалоги, квалификация или дожим.',
    featuresTitle: 'Включено в разработку:',
    features: [
      'Промпт-инжиниринг и Tone of Voice бренда',
      'RAG-база знаний с нулевыми галлюцинациями',
      'Глубокая связка с CRM / Мессенджерами',
      'Обучение команды и скринкасты работы',
      '1 месяц гарантийного исправления сбоев'
    ],
    buttonText: 'Запустить агента',
    highlightColor: '#136f97'
  },
  {
    id: 'ecosystem',
    name: 'Связка из 3 агентов',
    badge: 'Максимальный эффект',
    price: 'от 150 000 ₽',
    priceNote: 'разово под ключ',
    period: 'Запуск за 3–4 недели',
    roiTag: 'Экономия до 180ч/мес',
    desc: 'Сквозная экосистема: Квалификатор + Консультант первой линии + Аналитик контроля качества в единой базе.',
    featuresTitle: 'Включено в систему:',
    features: [
      'Единый контекст диалога по всем каналам',
      'Автоматическая передача лида между агентами',
      'Дашборд контроля метрик для собственника',
      'Приоритетный SLA реакции поддержки',
      'А/Б тестирование 3 вариантов скриптов'
    ],
    buttonText: 'Обсудить экосистему',
    isPopular: false
  },
  {
    id: 'enterprise',
    name: 'Индивидуальный Enterprise',
    badge: 'Кастомная разработка',
    price: 'Индивидуально',
    priceNote: 'по техзаданию',
    period: 'Сроки по ТЗ',
    roiTag: 'Под закрытый контур',
    desc: 'Для нестандартных B2B-процессов, калькуляторов смет, закрытых ERP-систем (1С/SAP/МойСклад) и on-premise серверов.',
    featuresTitle: 'Специфика разработки:',
    features: [
      'Развертывание в вашем изолированном контуре',
      'Кастомный API-пайплайн под закрытые базы',
      'Расширенный SLA и дежурный инженер 24/7',
      'Полная передача исходного кода и моделей',
      'Выделенный архитектор и проектный менеджер'
    ],
    buttonText: 'Запросить расчет ТЗ',
    isPopular: false
  }
];

const GROWTH_PLANS: PricingPlan[] = [
  {
    id: 'support-basic',
    name: 'Базовый мониторинг',
    badge: 'Поддержка стабильности',
    price: 'от 25 000 ₽',
    priceNote: 'в месяц',
    period: 'Ежемесячно',
    roiTag: 'Реакция за 2 часа',
    desc: 'Контроль бесперебойной работы запущенного агента, регулярная калибровка промптов и обновление прайсов.',
    featuresTitle: 'В тариф входит:',
    features: [
      'Ежедневный мониторинг доступности API',
      'Добавление новых услуг/товаров в базу (до 5 раз/мес)',
      'Устранение непредвиденных сбоев за 2 часа',
      'Ежемесячный отчет по конверсии диалогов'
    ],
    buttonText: 'Выбрать поддержку',
    isPopular: false
  },
  {
    id: 'support-growth',
    name: 'Growth & Оптимизация',
    badge: 'Хит сопровождения',
    isPopular: true,
    price: 'от 45 000 ₽',
    priceNote: 'в месяц',
    period: 'Ежемесячно',
    roiTag: 'Постоянный рост конверсии',
    desc: 'Непрерывное развитие системы: поиск слабых мест в диалогах, А/Б тесты реплик дожима и расширение сценариев.',
    featuresTitle: 'В тариф входит:',
    features: [
      'Аудит 100% нестандартных диалогов еженедельно',
      'Регулярное дообучение RAG-базы по новым вопросам',
      'А/Б сплит-тесты триггерных фраз для роста чека',
      'Приоритетный канал в Telegram со старшим архитектором',
      'Подключение 1 нового канала связи в квартал'
    ],
    buttonText: 'Подключить Growth',
    highlightColor: '#136f97'
  },
  {
    id: 'support-dedicated',
    name: 'Выделенный AI-отдел',
    badge: 'Максимальный приоритет',
    price: 'от 90 000 ₽',
    priceNote: 'в месяц',
    period: 'Ежемесячно',
    roiTag: 'Заменяет штат AI-инженеров',
    desc: 'Аутсорсинг всей AI-инфраструктуры компании: создание неограниченных мини-агентов, парсинг данных и микросервисы.',
    featuresTitle: 'В тариф входит:',
    features: [
      'Неограниченное число доработок логики агентов',
      'Персональный Lead AI-Engineer и DevOps на проекте',
      'Еженедельные стратегические созвоны с собственником',
      'Разработка микросервисов автоматизации под ключ',
      'Гарантированный SLA реакции до 15 минут'
    ],
    buttonText: 'Обсудить выделенный отдел',
    isPopular: false
  }
];

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenConsultation }) => {
  const [billingMode, setBillingMode] = useState<BillingMode>('turnkey');

  const currentPlans = billingMode === 'turnkey' ? TURNKEY_PLANS : GROWTH_PLANS;

  return (
    <section className="py-12 sm:py-20 relative" id="price">
      <div className="max-w-[1480px] mx-auto px-5 sm:px-7">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#136f97]/10 dark:bg-[#38bdf8]/15 border border-[#136f97]/25 dark:border-[#38bdf8]/30 text-xs font-bold text-[#136f97] dark:text-[#38bdf8] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Прозрачная фиксированная смета</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight mb-4">
            <RevealText text="Стоимость внедрения и условия" as="span" />
          </h2>

          <TextRevealMask
            text="Фиксированная стоимость разработки в договоре без скрытых платежей. Вы получаете готового цифрового сотрудника, работающего в вашей CRM."
            className="text-sm sm:text-base text-[#5b7188] dark:text-[#7b8ea6] leading-relaxed"
            delay={0.15}
          />

          {/* Format / Billing Mode Toggle (PrebuiltUI style) */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-[#f0f6fa] dark:bg-[#09182a] border border-[#147aa6]/20 dark:border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => setBillingMode('turnkey')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                billingMode === 'turnkey'
                  ? 'bg-white dark:bg-[#0e2236] text-[#136f97] dark:text-[#38bdf8] shadow-md'
                  : 'text-[#5b7188] dark:text-[#7b8ea6] hover:text-[#0d1f36] dark:hover:text-[#eaf3ff]'
              }`}
            >
              <span>Внедрение под ключ (Разово)</span>
            </button>

            <button
              type="button"
              onClick={() => setBillingMode('growth')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                billingMode === 'growth'
                  ? 'bg-white dark:bg-[#0e2236] text-[#136f97] dark:text-[#38bdf8] shadow-md'
                  : 'text-[#5b7188] dark:text-[#7b8ea6] hover:text-[#0d1f36] dark:hover:text-[#eaf3ff]'
              }`}
            >
              <span>Сопровождение & SLA (В месяц)</span>
              <span className="hidden sm:inline text-[0.68rem] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/25">
                По желанию
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid with GlowCard Effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={billingMode}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className={`grid grid-cols-1 md:grid-cols-2 ${
              billingMode === 'turnkey' ? 'lg:grid-cols-4' : 'lg:grid-cols-3 max-w-5xl mx-auto'
            } gap-6 mb-10 items-stretch`}
          >
            {currentPlans.map((plan) => (
              <GlowCard
                key={plan.id}
                isPopular={plan.isPopular}
                className={`flex flex-col justify-between p-6 sm:p-7 border backdrop-blur-xl ${
                  plan.isPopular
                    ? 'bg-gradient-to-b from-white via-white to-[#f0f8fd] dark:from-[#0d2238] dark:via-[#0b1c2e] dark:to-[#071320] border-[#136f97] dark:border-[#38bdf8] shadow-[0_20px_45px_-10px_rgba(19,111,151,0.25)] dark:shadow-[0_20px_45px_-10px_rgba(56,189,248,0.25)] ring-2 ring-[#136f97]/25 dark:ring-[#38bdf8]/35'
                    : 'bg-white/75 dark:bg-[#0e2236]/75 border-[#147aa6]/20 dark:border-white/10 shadow-sm hover:shadow-lg'
                }`}
              >
                <div>
                  {/* Top Tier Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.68rem] font-black tracking-wide uppercase ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-[#136f97] to-[#0ea5e9] text-white shadow-xs'
                        : 'bg-black/5 dark:bg-white/10 text-[#5b7188] dark:text-[#7b8ea6]'
                    }`}>
                      {plan.isPopular && <Sparkles className="w-3 h-3" />}
                      <span>{plan.badge}</span>
                    </span>

                    {plan.roiTag && (
                      <span className="text-[0.65rem] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        {plan.roiTag}
                      </span>
                    )}
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-lg sm:text-xl font-black text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight mb-2">
                    {plan.name}
                  </h3>

                  {/* Price Tag */}
                  <div className="mb-3 pb-3 border-b border-[#147aa6]/15 dark:border-white/10">
                    {/* Подпись с новой строки: рядом с ценой она переносилась
                        по словам и ломала выравнивание карточек. */}
                    <div>
                      <span className="block text-2xl sm:text-3xl font-black text-[#136f97] dark:text-[#38bdf8] tracking-tight">
                        {plan.price}
                      </span>
                      <span className="block text-xs font-semibold text-[#5b7188] dark:text-[#7b8ea6] mt-0.5">
                        {plan.priceNote}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[0.72rem] font-semibold text-[#5b7188] dark:text-[#7b8ea6] mt-1">
                      <Clock className="w-3 h-3 text-[#136f97] dark:text-[#38bdf8]" />
                      <span>{plan.period}</span>
                    </div>
                  </div>

                  {/* Plan Description */}
                  <p className="text-xs text-[#3a4d63] dark:text-[#b6c6da] leading-relaxed mb-5">
                    {plan.desc}
                  </p>

                  {/* Features List */}
                  <div className="mb-6 space-y-2.5">
                    <span className="block text-[0.7rem] uppercase tracking-wider font-extrabold text-[#5b7188] dark:text-[#7b8ea6]">
                      {plan.featuresTitle}
                    </span>
                    <ul className="space-y-2">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#0d1f36] dark:text-[#eaf3ff]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action CTA Button */}
                <motion.button
                  type="button"
                  onClick={() => onOpenConsultation(`Тариф: ${plan.name} (${plan.price})`)}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-3 px-4 rounded-full text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    plan.isPopular
                      ? 'text-white bg-gradient-to-r from-[#136f97] via-[#157ba4] to-[#0ea5e9] dark:from-[#38bdf8] dark:to-[#0284c7] dark:text-[#04121f] shadow-md hover:shadow-xl'
                      : 'bg-white dark:bg-[#09182a] text-[#136f97] dark:text-[#38bdf8] border border-[#147aa6]/25 dark:border-[#38bdf8]/30 hover:bg-[#136f97]/10'
                  }`}
                >
                  <span>{plan.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </GlowCard>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* 3 Trust & Guarantee Pillars (PrebuiltUI style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          
          <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-[#0d2137] via-[#0a1a2c] to-[#07131f] border border-white/10 shadow-[0_10px_30px_-12px_rgba(6,16,28,.6)] flex items-start gap-3">
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <div className="w-8 h-8 rounded-xl bg-emerald-400/15 text-emerald-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#eaf3ff] mb-0.5">
                Финансовая гарантия KPI
              </h4>
              <p className="text-[0.72rem] text-[#a8bdd4] leading-relaxed">
                Фиксируем целевые показатели в договоре. Если агент не выполняет SLA — дорабатываем за свой счет.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-[#0d2137] via-[#0a1a2c] to-[#07131f] border border-white/10 shadow-[0_10px_30px_-12px_rgba(6,16,28,.6)] flex items-start gap-3">
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <div className="w-8 h-8 rounded-xl bg-[#38bdf8]/15 text-[#7dd3fc] flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#eaf3ff] mb-0.5">
                Токены без скрытых наценок
              </h4>
              <p className="text-[0.72rem] text-[#a8bdd4] leading-relaxed">
                Оплата LLM напрямую провайдеру (Claude, GPT, Gemini). В среднем всего от 500 до 2 500 ₽/мес.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-[#0d2137] via-[#0a1a2c] to-[#07131f] border border-white/10 shadow-[0_10px_30px_-12px_rgba(6,16,28,.6)] flex items-start gap-3">
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <div className="w-8 h-8 rounded-xl bg-[#818cf8]/15 text-[#a5b4fc] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#eaf3ff] mb-0.5">
                NDA и безопасность данных
              </h4>
              <p className="text-[0.72rem] text-[#a8bdd4] leading-relaxed">
                Подписываем соглашение о неразглашении. Ваши базы знаний и клиентские данные никогда не попадут наружу.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
