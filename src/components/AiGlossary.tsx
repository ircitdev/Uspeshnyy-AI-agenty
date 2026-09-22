import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Cpu, 
  Bot, 
  Database, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Code, 
  HelpCircle, 
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Layers
} from 'lucide-react';

export interface GlossaryTerm {
  id: string;
  term: string;
  name: string;
  category: 'core' | 'architecture' | 'safety';
  categoryLabel: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  simpleExplanation: string;
  techDefinition: string;
  businessBenefit: string;
  example: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'ai-agent',
    term: 'AI Agent',
    name: 'Автономный ИИ-Агент',
    category: 'core',
    categoryLabel: 'Основа',
    badge: 'Ключевое понятие',
    icon: Bot,
    simpleExplanation: 'Цифровой сотрудник нового поколения. В отличие от кнопочных чат-ботов, он понимает естественную речь, сам планирует шаги и выполняет задачи в ваших программах.',
    techDefinition: 'Автономная программная сущность на базе LLM с памятью контекста, способная рассуждать (Reasoning), принимать решения и вызывать внешние API (Tool Use / Function Calling).',
    businessBenefit: 'Работает 24/7 без отпусков, берет на себя рутину квалификации и дожима, исключает потерю ночных заявок.',
    example: 'Клиент пишет ночью в Telegram: агент квалифицирует бюджет, находит свободное окно в календаре менеджера, бронирует встречу и отправляет ссылку в amoCRM.'
  },
  {
    id: 'rag',
    term: 'RAG',
    name: 'Retrieval-Augmented Generation',
    category: 'architecture',
    categoryLabel: 'Архитектура',
    badge: '100% точность',
    icon: Database,
    simpleExplanation: '«Умная шпаргалка» для нейросети. Прежде чем ответить клиенту, агент мгновенно ищет точные факты в вашей закрытой корпоративной базе знаний.',
    techDefinition: 'Архитектурный паттерн, сочетающий поиск релевантных фрагментов по векторной БД (Retrieval) с генерацией ответа языковой моделью (Generation) строго по найденным источникам.',
    businessBenefit: 'Гарантирует нулевой риск выдумки условий (галлюцинаций) — агент называет только реальные цены, сроки и регламенты вашей компании.',
    example: 'Если клиент спрашивает о гарантии на нестандартную партию, агент цитирует пункт 4.2 вашего договора, не додумывая условия самостоятельно.'
  },
  {
    id: 'llm',
    term: 'LLM',
    name: 'Большая языковая модель',
    category: 'core',
    categoryLabel: 'Основа',
    badge: 'Мозг системы',
    icon: Cpu,
    simpleExplanation: 'Мощнейшая нейросеть (Gemini, Claude, GPT), способная понимать нюансы живого человеческого языка, сарказм, опечатки, голосовые сообщения и сложные контексты.',
    techDefinition: 'Глубокая нейросетевая модель с миллиардами параметров, обученная на колоссальных массивах текстов для предсказания и генерации осмысленного языка.',
    businessBenefit: 'Общается как вежливый эксперт-человек с опытом работы в вашей нише, а не как механический автоответчик с выбором цифр 1-2-3.',
    example: 'Понимает клиента, написавшего сленгом с кучей опечаток: «кароч над 500 штук к птнице со скидосом» — и корректно отвечает по регламенту.'
  },
  {
    id: 'function-calling',
    term: 'Function Calling',
    name: 'Вызов внешних инструментов (Tool Use)',
    category: 'architecture',
    categoryLabel: 'Интеграция',
    badge: 'Руки агента',
    icon: Code,
    simpleExplanation: 'Способность агента не только разговаривать, но и совершать реальные действия: создавать сделки в CRM, выставлять счета и отправлять SMS.',
    techDefinition: 'Механизм, при котором модель формирует валидный JSON с параметрами для вызова функций вашего backend-сервиса (CRM API, ERP, МойСклад, телефония).',
    businessBenefit: 'Автоматизация сквозных процессов: данные не теряются в чатах, а сразу синхронизируются со всеми учетными системами компании.',
    example: 'Во время диалога агент за 0.5 секунды проверяет остаток товара на складе через API 1С и тут же сообщает клиенту точное количество.'
  },
  {
    id: 'hallucinations',
    term: 'Галлюцинации',
    name: 'AI Hallucinations (Ложные факты)',
    category: 'safety',
    categoryLabel: 'Безопасность',
    badge: 'Защита данных',
    icon: ShieldCheck,
    simpleExplanation: 'Эффект, когда неподготовленная нейросеть уверенно выдумывает несуществующие цены или скидки. В нашей разработке этот риск сведен к нулю.',
    techDefinition: 'Генерация моделью семантически правдоподобных, но фактически некорректных утверждений при отсутствии жестких контекстных ограничений.',
    businessBenefit: 'Встроенные контурные фильтры и RAG-валидация запрещают агенту отвечать наугад: при отсутствии точной информации он честно переводит диалог на специалиста.',
    example: 'Если клиент спросит о скидке 90%, агент вежливо откажет согласно правилам или запросит согласование руководителя.'
  },
  {
    id: 'prompt-eng',
    term: 'Промпт & Системный промпт',
    name: 'System Prompt & Guardrails',
    category: 'architecture',
    categoryLabel: 'Настройка',
    badge: 'Регламент',
    icon: Sparkles,
    simpleExplanation: 'Подробнейшая «должностная инструкция» для агента: его роль, цели, запрещенные темы, стиль общения и алгоритм дожима сделки.',
    techDefinition: 'Специальный набор директив высокого приоритета, передаваемый модели для фиксации ролевой модели, логики квалификации и этических ограничений.',
    businessBenefit: 'Агент строго следует вашему Tone of Voice и корпоративным стандартам продаж, не сбиваясь на провокационные вопросы клиентов.',
    example: 'Инструкция четко предписывает: «Всегда обращаться на Вы, выявлять потребность в 3 вопроса, при бюджете от 500 тыс. руб. предлагать VIP-условия».'
  },
  {
    id: 'fallback-sla',
    term: 'Fallback & SLA',
    name: 'Бесшовный перевод на оператора',
    category: 'safety',
    categoryLabel: 'Безопасность',
    badge: 'Надежность',
    icon: Zap,
    simpleExplanation: 'Страховочный трос. Если вопрос слишком нестандартный или клиент просит живого человека, диалог за 2 секунды передается дежурному сотруднику.',
    techDefinition: 'Триггерная логика маршрутизации, передающая контекст диалога в CRM оператору с отправкой пуш-уведомления и сохранением всей истории.',
    businessBenefit: 'Ни один сложный или негативный кейс не теряется: клиент получает помощь без раздражения от повторного пересказа проблемы.',
    example: 'Клиент пишет: «Соедините со старшим бухгалтером по акту сверки». Агент мгновенно переключает ветку диалога и тегает бухгалтера в Telegram.'
  },
  {
    id: 'vector-db',
    term: 'Vector DB',
    name: 'Векторная база данных',
    category: 'architecture',
    categoryLabel: 'Данные',
    badge: 'Поиск по смыслу',
    icon: Layers,
    simpleExplanation: 'Хранилище, где ваши файлы (PDF, регламенты, каталоги) преобразованы в математические смыслы. Находит ответ, даже если клиент спросил совсем другими словами.',
    techDefinition: 'Специализированная СУБД (например, Pinecone, Qdrant, Chroma) для быстрого k-NN поиска эмбеддингов по семантическому сходству (Semantic Search).',
    businessBenefit: 'Моментальный поиск по тысячам страниц документации за 30 миллисекунд без необходимости ручного создания ключевых слов.',
    example: 'Клиент спрашивает: «Как вернуть лаве, если брак?». Векторный поиск безошибочно находит регламент «Порядок возврата денежных средств при дефектах».'
  }
];

export const AiGlossary: React.FC = () => {
  const [selectedTermId, setSelectedTermId] = useState<string>('ai-agent');
  const [hoveredTermId, setHoveredTermId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'architecture' | 'safety'>('all');

  const activeTerm = GLOSSARY_TERMS.find(t => t.id === (hoveredTermId || selectedTermId)) || GLOSSARY_TERMS[0];

  const filteredTerms = GLOSSARY_TERMS.filter(term => {
    if (activeCategory === 'all') return true;
    return term.category === activeCategory;
  });

  return (
    <div className="mt-8 pt-8 border-t border-[#147aa6]/15 dark:border-white/10">
      
      {/* Glossary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#136f97]/10 dark:bg-[#38bdf8]/15 text-[#136f97] dark:text-[#38bdf8] text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Интерактивный AI-глоссарий для бизнеса</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight">
            Сложные технологии — простыми словами
          </h3>
          <p className="text-xs text-[#5b7188] dark:text-[#7b8ea6] mt-0.5">
            Наведите курсор или нажмите на любой термин, чтобы узнать, как он работает и какую выгоду приносит бизнесу
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto bg-[#f6f9fc] dark:bg-[#09182a] p-1 rounded-xl border border-[#147aa6]/15 dark:border-white/10">
          {[
            { id: 'all', label: 'Все' },
            { id: 'core', label: 'Основа' },
            { id: 'architecture', label: 'Архитектура' },
            { id: 'safety', label: 'Безопасность' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[0.7rem] font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-white dark:bg-[#0e2236] text-[#136f97] dark:text-[#38bdf8] shadow-xs'
                  : 'text-[#5b7188] dark:text-[#7b8ea6] hover:text-[#0d1f36] dark:hover:text-[#eaf3ff]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Term Chips Grid (Left) */}
        <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-2 gap-2.5">
          {filteredTerms.map((term) => {
            const Icon = term.icon;
            const isSelected = activeTerm.id === term.id;

            return (
              <motion.button
                key={term.id}
                type="button"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedTermId(term.id);
                  setHoveredTermId(term.id);
                }}
                onMouseEnter={() => setHoveredTermId(term.id)}
                onMouseLeave={() => setHoveredTermId(null)}
                className={`text-left p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden select-none ${
                  isSelected
                    ? 'bg-gradient-to-br from-white to-[#f0f7fb] dark:from-[#0c2238] dark:to-[#091a2c] border-[#136f97] dark:border-[#38bdf8] shadow-md ring-2 ring-[#136f97]/20 dark:ring-[#38bdf8]/30'
                    : 'bg-white/70 dark:bg-[#0e2236]/60 border-[#147aa6]/15 dark:border-white/10 hover:border-[#136f97]/40 hover:bg-white dark:hover:bg-[#0e2236]'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5 mb-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-[#136f97] text-white dark:bg-[#38bdf8] dark:text-[#04121f]'
                      : 'bg-[#136f97]/10 dark:bg-[#38bdf8]/15 text-[#136f97] dark:text-[#38bdf8]'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-[0.62rem] font-bold px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-[#136f97]/15 dark:bg-[#38bdf8]/20 text-[#136f97] dark:text-[#38bdf8]'
                      : 'bg-black/5 dark:bg-white/5 text-[#5b7188] dark:text-[#7b8ea6]'
                  }`}>
                    {term.categoryLabel}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs sm:text-sm font-black text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight">
                      {term.term}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#136f97] dark:bg-[#38bdf8] animate-pulse" />
                    )}
                  </div>
                  <p className="text-[0.68rem] text-[#5b7188] dark:text-[#7b8ea6] line-clamp-1 mt-0.5">
                    {term.name}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Detailed Spotlight Card (Right) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTerm.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-white via-[#f8fbfe] to-[#eef6fc] dark:from-[#0a1e33] dark:via-[#09182a] dark:to-[#061220] border-2 border-[#136f97]/30 dark:border-[#38bdf8]/40 shadow-xl"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-[#147aa6]/15 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#136f97] to-[#0ea5e9] text-white flex items-center justify-center shadow-xs shrink-0">
                    <activeTerm.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg sm:text-xl font-black text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight">
                        {activeTerm.term}
                      </h4>
                      <span className="text-[0.68rem] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {activeTerm.badge}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#136f97] dark:text-[#38bdf8]">
                      {activeTerm.name}
                    </p>
                  </div>
                </div>

                <div className="text-[0.65rem] uppercase tracking-wider font-extrabold text-[#5b7188] dark:text-[#7b8ea6] bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md">
                  {activeTerm.categoryLabel}
                </div>
              </div>

              {/* 3 Core Explanation Blocks */}
              <div className="space-y-3.5">
                
                {/* 1. Simple explanation */}
                <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#0e2236]/80 border border-[#147aa6]/15 dark:border-white/10 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#136f97] dark:text-[#38bdf8] mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Простыми словами:</span>
                  </div>
                  <p className="text-xs sm:text-[0.82rem] text-[#0d1f36] dark:text-[#eaf3ff] font-medium leading-relaxed">
                    {activeTerm.simpleExplanation}
                  </p>
                </div>

                {/* 2. Business Benefit */}
                <div className="p-3.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Выгода для бизнеса:</span>
                  </div>
                  <p className="text-xs text-[#3a4d63] dark:text-[#b6c6da] leading-relaxed">
                    {activeTerm.businessBenefit}
                  </p>
                </div>

                {/* 3. Real Example */}
                <div className="p-3 rounded-xl bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/10 dark:border-white/5 text-xs">
                  <span className="font-bold text-[#5b7188] dark:text-[#7b8ea6] block mb-0.5">
                    Пример на практике:
                  </span>
                  <p className="text-[#3a4d63] dark:text-[#b6c6da] italic leading-relaxed">
                    «{activeTerm.example}»
                  </p>
                </div>

              </div>

              {/* Technical Definition (Collapsible or Footnote) */}
              <div className="mt-3.5 pt-3 border-t border-[#147aa6]/10 dark:border-white/5 flex items-start gap-2 text-[0.7rem] text-[#5b7188] dark:text-[#7b8ea6]">
                <Code className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#136f97] dark:text-[#38bdf8]" />
                <p className="leading-normal">
                  <span className="font-semibold text-[#0d1f36] dark:text-[#eaf3ff]">Техническое определение: </span>
                  {activeTerm.techDefinition}
                </p>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};
