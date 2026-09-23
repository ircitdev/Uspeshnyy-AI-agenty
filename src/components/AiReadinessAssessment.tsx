import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Send, 
  TrendingUp, 
  Database, 
  Clock, 
  BookOpen, 
  Cpu, 
  ShieldCheck, 
  AlertTriangle,
  FileCheck,
  FileDown,
  Loader2
} from 'lucide-react';
import { RevealText } from './RevealText';
import { TextRevealMask } from './TextRevealMask';
import { AiReadinessPdfTemplate } from './AiReadinessPdfTemplate';
import { downloadReadinessPdf, ReadinessPdfData } from '../utils/pdfGenerator';

interface AiReadinessAssessmentProps {
  onOpenConsultation: (topic: string) => void;
}

interface QuestionOption {
  id: string;
  label: string;
  desc?: string;
  points: number;
  pillar: 'crm' | 'knowledge' | 'speed' | 'routine';
}

interface Question {
  id: number;
  category: string;
  title: string;
  hint: string;
  options: QuestionOption[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Инфраструктура',
    title: 'Где ваш бизнес сейчас фиксирует клиентов и входящие заявки?',
    hint: 'Наличие API и единой базы данных определяет скорость развёртывания интеграции.',
    options: [
      {
        id: 'crm_cloud',
        label: 'В облачной CRM с API',
        desc: 'amoCRM, Битрикс24, Planfix, Yclients, RetailCRM и др.',
        points: 20,
        pillar: 'crm',
      },
      {
        id: 'crm_manual',
        label: 'CRM есть, но ведётся нерегулярно',
        desc: 'Часть лидов теряется, менеджеры вносят данные с опозданием.',
        points: 15,
        pillar: 'crm',
      },
      {
        id: 'crm_sheets',
        label: 'Google Таблицы / Excel + общие чаты',
        desc: 'Простая фиксация без сложной воронки и автоматических триггеров.',
        points: 12,
        pillar: 'crm',
      },
      {
        id: 'crm_none',
        label: 'Только личные переписки и мессенджеры',
        desc: 'У каждого менеджера свои чаты, единого реестра клиентов нет.',
        points: 6,
        pillar: 'crm',
      },
    ],
  },
  {
    id: 2,
    category: 'Трафик и объём',
    title: 'Сколько новых входящих диалогов или заявок поступает в месяц?',
    hint: 'Чем выше плотность трафика, тем быстрее окупается автоматизация первой линии.',
    options: [
      {
        id: 'vol_500',
        label: 'Более 500 обращений в месяц',
        desc: 'Высокая нагрузка, много типовых повторяющихся вопросов.',
        points: 20,
        pillar: 'routine',
      },
      {
        id: 'vol_150_500',
        label: 'От 150 до 500 обращений в месяц',
        desc: 'Стабильный поток, в часы пик сотрудники не успевают отвечать сразу.',
        points: 18,
        pillar: 'routine',
      },
      {
        id: 'vol_50_150',
        label: 'От 50 до 150 обращений в месяц',
        desc: 'Контролируемый объём, но рутина отвлекает от сложных продаж.',
        points: 14,
        pillar: 'routine',
      },
      {
        id: 'vol_under_50',
        label: 'Менее 50 обращений в месяц',
        desc: 'Небольшой штучный поток, каждый клиент требует сугубо ручной работы.',
        points: 8,
        pillar: 'routine',
      },
    ],
  },
  {
    id: 3,
    category: 'База знаний',
    title: 'Насколько оцифрованы ваши регламенты, прайсы и частые ответы?',
    hint: 'Агент обучается на вашей документации, прайсах и лучших примерах переписок.',
    options: [
      {
        id: 'kb_structured',
        label: 'Есть структурированная база знаний и FAQ',
        desc: 'Актуальные прайсы, скрипты, регламенты и ответы на частые вопросы.',
        points: 20,
        pillar: 'knowledge',
      },
      {
        id: 'kb_templates',
        label: 'Есть базовые шаблоны сообщений и прайс-листы',
        desc: 'Материалы есть в файлах и переписках, но требуют объединения.',
        points: 15,
        pillar: 'knowledge',
      },
      {
        id: 'kb_heads',
        label: 'Знания в основном в головах ключевых сотрудников',
        desc: 'Новички учатся на лету, стандарты зафиксированы лишь устно.',
        points: 10,
        pillar: 'knowledge',
      },
      {
        id: 'kb_dynamic',
        label: 'Регламентов нет, каждый раз всё индивидуально',
        desc: 'Условия часто меняются, чёткой методологии консультаций нет.',
        points: 5,
        pillar: 'knowledge',
      },
    ],
  },
  {
    id: 4,
    category: 'Скорость первого контакта',
    title: 'Как быстро новый клиент сейчас получает содержательный ответ?',
    hint: 'Первые 10 минут решают судьбу 70% сделок в мессенджерах и на сайтах.',
    options: [
      {
        id: 'speed_slow',
        label: 'Дольше 30 минут (или на следующий рабочий день)',
        desc: 'Вечером, ночью и в выходные входящие лиды простаивают без ответа.',
        points: 20,
        pillar: 'speed',
      },
      {
        id: 'speed_moderate',
        label: 'В течение 10–30 минут в рабочее время',
        desc: 'Клиенты ждут, часть из них успевает уйти к более быстрым конкурентам.',
        points: 17,
        pillar: 'speed',
      },
      {
        id: 'speed_fast',
        label: 'Быстро (2–10 минут), но за счёт перегрузки людей',
        desc: 'Менеджеры вынуждены быть на связи почти круглосуточно.',
        points: 15,
        pillar: 'speed',
      },
      {
        id: 'speed_instant',
        label: 'Мгновенно (простой кнопочный автоответчик)',
        desc: 'Есть шаблонное приветствие, но нет интеллектуального диалога и квалификации.',
        points: 12,
        pillar: 'speed',
      },
    ],
  },
  {
    id: 5,
    category: 'Степень рутины',
    title: 'Какую долю времени сотрудники тратят на стандартные типовые диалоги?',
    hint: 'Цена, адрес, бронирование, расписание, сбор контактов и первичное анкетирование.',
    options: [
      {
        id: 'routine_heavy',
        label: 'Более 60–70% всех диалогов',
        desc: 'Огромное количество одинаковых вопросов отнимает основные ресурсы.',
        points: 20,
        pillar: 'routine',
      },
      {
        id: 'routine_medium',
        label: 'От 35% до 60% времени',
        desc: 'Половина дня уходит на квалификацию и отсев нецелевых заявок.',
        points: 17,
        pillar: 'routine',
      },
      {
        id: 'routine_light',
        label: 'От 20% до 35% времени',
        desc: 'Рутина есть, но много персонализированных нестандартных сделок.',
        points: 13,
        pillar: 'routine',
      },
      {
        id: 'routine_rare',
        label: 'Менее 20% (каждый запрос полностью уникален)',
        desc: 'Сложные экспертные консультации, где нет стандартных паттернов.',
        points: 7,
        pillar: 'routine',
      },
    ],
  },
];

export const AiReadinessAssessment: React.FC<AiReadinessAssessmentProps> = ({ onOpenConsultation }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [pdfError, setPdfError] = useState<string>('');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, QuestionOption>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfDownloaded, setPdfDownloaded] = useState<boolean>(false);
  const pdfTemplateRef = useRef<HTMLDivElement>(null);

  const totalQuestions = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentStep];

  // Calculate score and insights
  const calculateResult = () => {
    const answersList = Object.values(selectedAnswers);
    if (answersList.length === 0) {
      return { 
        score: 0, 
        level: 'low' as const, 
        pillarScores: { crm: 0, knowledge: 0, roi: 0 } 
      };
    }

    const totalRaw = answersList.reduce((acc, curr) => acc + curr.points, 0);
    // Max raw points = 100, min raw points ~ 32
    const score = Math.min(100, Math.max(25, Math.round(totalRaw)));

    let level: 'high' | 'moderate' | 'low' = 'low';
    if (score >= 78) {
      level = 'high';
    } else if (score >= 52) {
      level = 'moderate';
    } else {
      level = 'low';
    }

    // Pillar estimations
    const crmAns = selectedAnswers[0]?.points || 10;
    const crmPillar = Math.round((crmAns / 20) * 100);

    const kbAns = selectedAnswers[2]?.points || 10;
    const kbPillar = Math.round((kbAns / 20) * 100);

    const speedAns = selectedAnswers[3]?.points || 10;
    const routineAns = selectedAnswers[4]?.points || 10;
    const roiPillar = Math.round(((speedAns + routineAns) / 40) * 100);

    return {
      score,
      level,
      pillarScores: {
        crm: crmPillar,
        knowledge: kbPillar,
        roi: roiPillar,
      },
    };
  };

  const handleSelectOption = (option: QuestionOption) => {
    const updated = { ...selectedAnswers, [currentStep]: option };
    setSelectedAnswers(updated);

    if (currentStep < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 220);
    } else {
      setTimeout(() => {
        setIsCompleted(true);
      }, 250);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  const result = calculateResult();

  // Recommendations based on outcome
  const getRecommendationDetails = () => {
    if (result.level === 'high') {
      return {
        badge: 'Максимальная готовность (Высокий ROI)',
        badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
        title: 'Ваш бизнес идеально готов к развёртыванию AI-агентов',
        summary: 'У вас достаточно входящего трафика и регулярной рутины, чтобы окупить внедрение агента за первые 2–3 недели. Задержки в ответах — ваша главная скрытая потеря конверсии.',
        recommendedAgent: 'Квалификатор заявок 24/7 + Интеграция в CRM',
        nextSteps: [
          'Подключить агента к входящим каналам (Telegram, WhatsApp, чат сайта)',
          'Настроить мгновенную квалификацию лидов и передачу горячих сделок менеджерам',
          'Автоматизировать запись на консультации или приём заявок в нерабочее время',
        ],
      };
    } else if (result.level === 'moderate') {
      return {
        badge: 'Умеренная готовность (Быстрый старт)',
        badgeColor: 'bg-blue-500/15 text-blue-700 dark:text-[#33a4d4] border-blue-500/30',
        title: 'Отличная база для точечной автоматизации',
        summary: 'Внедрение AI-агента даст заметный эффект. Рекомендуется начать с узкого сценария (например, ночной дежурный или фильтрация спама) параллельно с наведением порядка в регламентах.',
        recommendedAgent: 'Ассистент первой линии / Ночной дежурный',
        nextSteps: [
          'Собрать 15–20 самых частых вопросов и типичных ответов менеджеров',
          'Запустить тестовый пилот на 1–2 недели без изменения текущего штата',
          'Проверить точность ответов агента перед масштабированием на все каналы',
        ],
      };
    } else {
      return {
        badge: 'Базовая стадия (Требуется оцифровка)',
        badgeColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
        title: 'Сначала стоит оцифровать ключевые этапы воронки',
        summary: 'Агент эффективнее всего работает там, где есть повторяющиеся сценарии и место фиксации лидов. Мы поможем подготовить процессы к автоматизации без лишних затрат.',
        recommendedAgent: 'Базовый лид-бот + Подготовка базы знаний',
        nextSteps: [
          'Внедрить простую облачную CRM для централизации диалогов',
          'Зафиксировать скрипты квалификации и критерии целевого клиента',
          'Обсудить с нашими архитекторами дорожную карту подготовки',
        ],
      };
    }
  };

  const rec = getRecommendationDetails();

  const pdfData: ReadinessPdfData = {
    score: result.score,
    level: result.level,
    levelBadge: rec.badge,
    title: rec.title,
    summary: rec.summary,
    recommendedAgent: rec.recommendedAgent,
    nextSteps: rec.nextSteps,
    pillarScores: result.pillarScores,
    answers: QUESTIONS.map((q, idx) => ({
      questionTitle: q.title,
      category: q.category,
      selectedOptionLabel: selectedAnswers[idx]?.label || 'Не указано',
      selectedOptionDesc: selectedAnswers[idx]?.desc,
    })),
  };

  const handleDownloadPdf = async () => {
    if (!pdfTemplateRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      const filename = `AI-Readiness-Plan-${result.score}pct-Успешный.pdf`;
      await downloadReadinessPdf(pdfTemplateRef.current, filename);
      setPdfDownloaded(true);
      setTimeout(() => {
        setPdfDownloaded(false);
      }, 4500);
    } catch (err) {
      console.error('PDF: не удалось собрать отчёт', err);
      // Без видимого сообщения человек жмёт кнопку повторно и не понимает,
      // почему файла нет.
      setPdfError('Не удалось собрать PDF. Попробуйте ещё раз или напишите нам в Telegram.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <section className="py-10 sm:py-16" id="readiness">
      <div className="max-w-[1480px] mx-auto px-5 sm:px-7">
        
        {/* Container with modern gradient border & backdrop */}
        <div className="rounded-3xl p-6 sm:p-10 bg-white/85 dark:bg-[#0e2236]/85 backdrop-blur-md border border-[#147aa6]/25 dark:border-white/10 shadow-xl relative overflow-hidden">
          
          {/* Subtle Accent Radial Glow */}
          <div 
            aria-hidden="true" 
            className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#136f97]/15 to-transparent dark:from-[#33a4d4]/15 rounded-full blur-3xl pointer-events-none" 
          />

          {/* Робот-помощник справа от заголовка. На мобильном скрыт:
              там каждый экран на счету, а смысла он не несёт. */}
          <img
            src="https://uspeshnyy.ru/assets/agenty3/readiness-robot.webp"
            alt=""
            aria-hidden="true"
            loading="lazy"
            width={1122}
            height={1402}
            className="robot-float pointer-events-none absolute -top-4 right-2 z-0 hidden h-auto w-40 select-none lg:block xl:w-52"
          />

          {/* Section Header */}
          <div className="max-w-2xl mb-8 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-[#136f97] dark:text-[#33a4d4] bg-[#136f97]/10 dark:bg-[#33a4d4]/15 border border-[#136f97]/25 mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Экспресс-аудит готовности</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight">
              <RevealText text="AI Readiness Assessment: готов ли ваш бизнес?" as="span" />
            </h2>
            <TextRevealMask
              text="Ответьте на 5 быстрых вопросов о вашей текущей воронке — алгоритм рассчитает персональный индекс готовности и покажет ключевые точки роста."
              className="text-sm sm:text-base text-[#3a4d63] dark:text-[#b6c6da] mt-2 leading-relaxed"
              delay={0.15}
            />
          </div>

          {/* Assessment Body */}
          {!isCompleted ? (
            <div className="relative z-10">
              {/* Progress and Step Header */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#147aa6]/15 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#136f97] dark:text-[#33a4d4] uppercase tracking-wider">
                    Вопрос {currentStep + 1} из {totalQuestions}
                  </span>
                  <span className="text-xs text-[#5b7188] dark:text-[#7b8ea6]">
                    • {currentQuestion.category}
                  </span>
                </div>

                {/* Stepper Dots */}
                <div className="flex items-center gap-1.5">
                  {QUESTIONS.map((q, idx) => {
                    const isPassed = idx < currentStep;
                    const isCurrent = idx === currentStep;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          if (selectedAnswers[idx] !== undefined || idx <= currentStep) {
                            setCurrentStep(idx);
                          }
                        }}
                        disabled={selectedAnswers[idx] === undefined && idx > currentStep}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          isCurrent 
                            ? 'w-8 bg-[#136f97] dark:bg-[#33a4d4]' 
                            : isPassed 
                              ? 'w-3 bg-emerald-500/80 hover:bg-emerald-500' 
                              : 'w-2 bg-gray-200 dark:bg-gray-800'
                        }`}
                        title={`Перейти к вопросу ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Animated Question Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#0d1f36] dark:text-[#eaf3ff] mb-1.5 leading-snug">
                      {currentQuestion.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5b7188] dark:text-[#7b8ea6]">
                      {currentQuestion.hint}
                    </p>
                  </div>

                  {/* 4 Options Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {currentQuestion.options.map((opt) => {
                      const isSelected = selectedAnswers[currentStep]?.id === opt.id;
                      return (
                        <motion.button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption(opt)}
                          whileHover={{ scale: 1.025, y: -2 }}
                          whileTap={{ scale: 0.975 }}
                          className={`p-4 sm:p-5 rounded-2xl text-left border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-br from-[#136f97]/15 to-[#136f97]/5 dark:from-[#33a4d4]/20 dark:to-[#33a4d4]/5 border-[#136f97] dark:border-[#33a4d4] shadow-md hover:shadow-[0_8px_20px_-3px_rgba(19,111,151,0.3)] dark:hover:shadow-[0_8px_20px_-3px_rgba(51,164,212,0.3)]'
                              : 'bg-[#f6f9fc] dark:bg-[#09182a] border-[#147aa6]/15 dark:border-white/10 hover:border-[#136f97]/40 hover:bg-[#136f97]/5 dark:hover:bg-[#33a4d4]/5 hover:shadow-[0_6px_16px_-3px_rgba(19,111,151,0.15)] dark:hover:shadow-[0_6px_16px_-3px_rgba(51,164,212,0.15)]'
                          }`}
                        >
                          <div className="flex-1 pr-2">
                            <strong className="block text-sm font-bold text-[#0d1f36] dark:text-[#eaf3ff] mb-1 leading-snug">
                              {opt.label}
                            </strong>
                            {opt.desc && (
                              <p className="text-xs text-[#5b7188] dark:text-[#7b8ea6] leading-relaxed">
                                {opt.desc}
                              </p>
                            )}
                          </div>

                          {/* Indicator Checkbox / Radio */}
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected 
                              ? 'bg-[#136f97] dark:bg-[#33a4d4] text-white dark:text-[#04121f]' 
                              : 'border-2 border-gray-300 dark:border-gray-700'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Back & Skip Buttons */}
              <div className="mt-8 pt-4 border-t border-[#147aa6]/15 dark:border-white/10 flex items-center justify-between">
                <motion.button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  whileHover={currentStep > 0 ? { scale: 1.03, x: -2 } : {}}
                  whileTap={currentStep > 0 ? { scale: 0.97 } : {}}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentStep > 0
                      ? 'text-[#136f97] dark:text-[#33a4d4] hover:bg-[#136f97]/10 cursor-pointer'
                      : 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Назад</span>
                </motion.button>

                <div className="text-xs text-[#5b7188] dark:text-[#7b8ea6]">
                  Выберите вариант, чтобы перейти дальше
                </div>
              </div>
            </div>
          ) : (
            /* Result Dashboard */
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Readiness Dial & Pillars (5 cols) */}
                <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#136f97]/10 via-white/50 to-white/90 dark:from-[#33a4d4]/15 dark:via-[#0e2236]/80 dark:to-[#0e2236] border-2 border-[#136f97]/30 dark:border-[#33a4d4]/30 shadow-lg text-center sm:text-left flex flex-col justify-between">
                  <div>
                    {/* Badge */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-4 ${rec.badgeColor}`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{rec.badge}</span>
                    </div>

                    <div className="flex items-baseline justify-center sm:justify-start gap-3 mb-2">
                      <span className="text-5xl sm:text-6xl font-black text-[#136f97] dark:text-[#33a4d4] tracking-tight">
                        {result.score}%
                      </span>
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5b7188] dark:text-[#7b8ea6]">
                        Индекс готовности
                      </span>
                    </div>

                    <p className="text-xs text-[#5b7188] dark:text-[#7b8ea6] leading-relaxed mb-6">
                      Рассчитан на базе ответов по инфраструктуре, объёму трафика, оцифрованности знаний и скорости первого ответа.
                    </p>

                    {/* 3 Pillar Progress Bars */}
                    <div className="space-y-3.5 pt-4 border-t border-[#147aa6]/15 dark:border-white/10 text-left">
                      {/* Pillar 1 */}
                      <div>
                        <div className="flex justify-between text-xs font-bold text-[#0d1f36] dark:text-[#eaf3ff] mb-1">
                          <span className="flex items-center gap-1.5">
                            <Database className="w-3.5 h-3.5 text-[#136f97] dark:text-[#33a4d4]" />
                            Инфраструктура и CRM
                          </span>
                          <span className="text-[#136f97] dark:text-[#33a4d4]">{result.pillarScores.crm}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${result.pillarScores.crm}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-[#157ba4] to-[#136f97] dark:from-[#46b6e4] dark:to-[#33a4d4] rounded-full"
                          />
                        </div>
                      </div>

                      {/* Pillar 2 */}
                      <div>
                        <div className="flex justify-between text-xs font-bold text-[#0d1f36] dark:text-[#eaf3ff] mb-1">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#136f97] dark:text-[#33a4d4]" />
                            Оцифрованность базы знаний
                          </span>
                          <span className="text-[#136f97] dark:text-[#33a4d4]">{result.pillarScores.knowledge}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${result.pillarScores.knowledge}%` }}
                            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          />
                        </div>
                      </div>

                      {/* Pillar 3 */}
                      <div>
                        <div className="flex justify-between text-xs font-bold text-[#0d1f36] dark:text-[#eaf3ff] mb-1">
                          <span className="flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                            Потенциал ROI и снятия рутины
                          </span>
                          <span className="text-amber-600 dark:text-amber-400">{result.pillarScores.roi}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${result.pillarScores.roi}%` }}
                            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reset test link */}
                  <motion.button
                    type="button"
                    onClick={handleRestart}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center gap-1.5 mt-6 text-xs text-[#5b7188] dark:text-[#7b8ea6] hover:text-[#136f97] dark:hover:text-[#33a4d4] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Пройти тест повторно</span>
                  </motion.button>
                </div>

                {/* Right Column: Tailored Verdict & Next Steps (7 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] mb-3">
                      {rec.title}
                    </h3>
                    <p className="text-sm text-[#3a4d63] dark:text-[#b6c6da] leading-relaxed mb-6">
                      {rec.summary}
                    </p>

                    {/* Recommended Agent Box */}
                    <div className="p-4 rounded-2xl bg-[#136f97]/10 dark:bg-[#33a4d4]/15 border border-[#136f97]/25 mb-6">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="p-1 rounded-md bg-[#136f97] text-white dark:bg-[#33a4d4] dark:text-[#04121f]">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                        <strong className="text-xs font-extrabold uppercase tracking-wider text-[#136f97] dark:text-[#33a4d4]">
                          Рекомендуемый шаг для старта
                        </strong>
                      </div>
                      <div className="text-sm sm:text-base font-bold text-[#0d1f36] dark:text-[#eaf3ff]">
                        {rec.recommendedAgent}
                      </div>
                    </div>

                    {/* Recommended Implementation Checklist */}
                    <div className="space-y-2.5 mb-8">
                      <span className="block text-xs font-bold uppercase tracking-wider text-[#5b7188] dark:text-[#7b8ea6] mb-2">
                        Оптимальный план внедрения:
                      </span>
                      {rec.nextSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#0d1f36] dark:text-[#eaf3ff]">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions & PDF Download */}
                  <div className="space-y-3 pt-5 border-t border-[#147aa6]/15 dark:border-white/10">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      {/* PDF Report Download Button */}
                      <motion.button
                        type="button"
                        onClick={handleDownloadPdf}
                        disabled={isGeneratingPdf}
                        whileHover={{ scale: 1.025, y: -1 }}
                        whileTap={{ scale: 0.975 }}
                        className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm transition-all cursor-pointer shadow-md ${
                          pdfDownloaded
                            ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                            : 'bg-[#136f97] text-white hover:bg-[#0f5c7e] dark:bg-[#33a4d4] dark:text-[#04121f] dark:hover:bg-[#46b6e4] shadow-[0_8px_20px_-4px_rgba(19,111,151,0.35)]'
                        }`}
                      >
                        {isGeneratingPdf ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Формирование PDF-отчета...</span>
                          </>
                        ) : pdfDownloaded ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>План развития сохранен в PDF!</span>
                          </>
                        ) : (
                          <>
                            <FileDown className="w-4 h-4" />
                            <span>Скачать PDF-отчет и план развития</span>
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={() => onOpenConsultation(`Результат аудита готовности: ${result.score}% (${rec.badge})`)}
                        whileHover={{ scale: 1.025, y: -1 }}
                        whileTap={{ scale: 0.975 }}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-b from-[#157ba4] to-[#136f97] dark:from-[#46b6e4] dark:to-[#33a4d4] dark:text-[#04121f] shadow-md hover:shadow-[0_10px_25px_-4px_rgba(19,111,151,0.4)] dark:hover:shadow-[0_10px_25px_-4px_rgba(51,164,212,0.35)] transition-all cursor-pointer"
                      >
                        <span>Зафиксировать аудит</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>

                      <motion.a
                        href={`https://t.me/uspeshnyy?utm_source=agenty&utm_medium=cta&utm_campaign=ai_agents&text=${encodeURIComponent(
                          `Привет! Прошел аудит готовности к AI-агентам на сайте: индекс готовности ${result.score}%. Хочу разобрать процесс внедрения для моего бизнеса.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.025, y: -1 }}
                        whileTap={{ scale: 0.975 }}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full font-bold text-sm text-[#136f97] dark:text-[#33a4d4] bg-white dark:bg-[#0e2236] border border-[#147aa6]/30 hover:bg-[#136f97]/10 hover:shadow-[0_8px_20px_-4px_rgba(19,111,151,0.2)] dark:hover:shadow-[0_8px_20px_-4px_rgba(51,164,212,0.2)] transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>В Telegram</span>
                      </motion.a>
                    </div>

                    <p className="text-[11px] text-[#5b7188] dark:text-[#7b8ea6] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>PDF-отчет формируется мгновенно и содержит анализ CRM, оценку готовности базы знаний и пошаговый план запуска на 30 дней.</span>
                    </p>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

        </div>

        {/* Offscreen Printable Template for html2canvas / jsPDF */}
        <div 
          aria-hidden="true"
          style={{ 
            position: 'fixed', 
            left: '-9999px', 
            top: 0, 
            zIndex: -9999,
            pointerEvents: 'none',
          }}
        >
          <AiReadinessPdfTemplate ref={pdfTemplateRef} data={pdfData} />
        </div>

      </div>
    </section>
  );
};
