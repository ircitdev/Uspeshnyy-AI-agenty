import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RevealText } from './RevealText';
import { GlassmorphismCta } from './GlassmorphismCta';
import { 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  Sparkles, 
  FileText, 
  PhoneCall, 
  MessageSquare, 
  BarChart3, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';

interface SmartQuizProps {
  onOpenConsultation: (details: string) => void;
}

const QUIZ_PROBLEMS = [
  {
    id: 'zayavki',
    title: 'Заявки',
    desc: 'Долго отвечаем на формы, много спама и нецелевых',
    icon: FileText,
    recommendedAgent: 'Квалификатор заявок (01)',
    price: 'от 60 000 ₽',
    time: '1–2 недели',
    solutionText: 'Встретит клиента за 15 секунд, задаст 3 квалифицирующих вопроса, отсеет спам и положит готовую карточку с тегами в вашу CRM.',
    effect: 'Менеджеры перестают тратить по 2 часа в день на пустые звонки.'
  },
  {
    id: 'zvonki',
    title: 'Звонки',
    desc: 'Пропускаем звонки вечером, в выходные и в часы пик',
    icon: PhoneCall,
    recommendedAgent: 'Голосовой агент (02)',
    price: 'от 120 000 ₽',
    time: '2–3 недели',
    solutionText: 'Примет звонок в любое время дня и ночи живым голосом, ответит на частые вопросы и запишет клиента на свободный слот в календаре.',
    effect: 'До 35% дополнительных записей из ночного и пикового трафика.'
  },
  {
    id: 'perepiska',
    title: 'Переписка',
    desc: 'Слишком много мессенджеров, сообщения теряются',
    icon: MessageSquare,
    recommendedAgent: 'Единое окно переписки (04)',
    price: 'от 60 000 ₽',
    time: '1–2 недели',
    solutionText: 'Объединит Telegram, WhatsApp, Авито и сайт в один поток. Агент сам ответит на стандартные запросы и сохранит историю в одном месте.',
    effect: 'Ноль забытых клиентов, скорость ответа сокращается до секунд.'
  },
  {
    id: 'otchety',
    title: 'Отчеты',
    desc: 'Рутина со сбором цифр из рекламы, CRM и таблиц',
    icon: BarChart3,
    recommendedAgent: 'Агент-аналитик (05)',
    price: 'от 60 000 ₽',
    time: '1–2 недели',
    solutionText: 'Сам каждое утро заберет данные из рекламных кабинетов и CRM, рассчитает стоимость лида и пришлет краткий отчет собственнику.',
    effect: 'Экономия 3–4 часов в неделю у руководителя, контроль узких мест.'
  },
  {
    id: 'neznayu',
    title: 'Не знаю',
    desc: 'Хочу разобрать процессы и понять, где окупаемость выше',
    icon: HelpCircle,
    recommendedAgent: 'Бесплатный разбор процесса',
    price: 'Бесплатно',
    time: '30–40 минут',
    solutionText: 'Созвонимся в зуме или разберем перепиской в Telegram. Честно скажем, нужен ли вам AI или пока достаточно простой настройки CRM.',
    effect: 'Четкий пошаговый план внедрения без навязывания лишних функций.'
  }
];

export const SmartQuiz: React.FC<SmartQuizProps> = ({ onOpenConsultation }) => {
  const [selectedProblem, setSelectedProblem] = useState<string>('zayavki');

  const currentResult = QUIZ_PROBLEMS.find(p => p.id === selectedProblem) || QUIZ_PROBLEMS[0];

  const handleTelegramPreFilled = () => {
    const text = encodeURIComponent(`Здравствуйте! Прошел тест на сайте: у меня проблема «${currentResult.title}» (${currentResult.desc}). Хочу обсудить внедрение агента.`);
    window.open(`https://t.me/uspeshnyy?text=${text}`, '_blank');
  };

  return (
    <section className="py-10 sm:py-14" id="quiz">
      <div className="max-w-[1480px] mx-auto px-5 sm:px-7">
        
        <div className="bg-white/80 dark:bg-[#0e2236]/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#147aa6]/20 dark:border-white/10 shadow-lg">
          
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight mb-2">
              <RevealText text="Какой агент нужен именно вам?" as="span" />
            </h2>
            <p className="text-sm sm:text-base text-[#3a4d63] dark:text-[#b6c6da]">
              Выберите, что сейчас болит сильнее всего в отделе продаж или сервисе — подскажем подходящее решение и ориентировочные сроки.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: 5 Selectable Problem Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUIZ_PROBLEMS.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedProblem === item.id;

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setSelectedProblem(item.id)}
                    whileHover={{ scale: 1.025, y: -2 }}
                    whileTap={{ scale: 0.975 }}
                    className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#136f97]/15 to-[#136f97]/5 dark:from-[#33a4d4]/20 dark:to-[#33a4d4]/5 border-[#136f97] dark:border-[#33a4d4] shadow-md hover:shadow-[0_10px_22px_-4px_rgba(19,111,151,0.3)] dark:hover:shadow-[0_10px_22px_-4px_rgba(51,164,212,0.3)]'
                        : 'bg-[#f6f9fc] dark:bg-[#09182a] border-[#147aa6]/15 dark:border-white/10 hover:border-[#136f97]/40 hover:shadow-[0_8px_18px_-4px_rgba(19,111,151,0.15)] dark:hover:shadow-[0_8px_18px_-4px_rgba(51,164,212,0.15)] text-[#3a4d63] dark:text-[#b6c6da]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected 
                            ? 'bg-[#136f97] dark:bg-[#33a4d4] text-white dark:text-[#04121f]' 
                            : 'bg-white dark:bg-[#0e2236] text-[#136f97] dark:text-[#33a4d4]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#136f97] dark:bg-[#33a4d4]"></span>
                        )}
                      </div>
                      <strong className="block text-sm font-bold text-[#0d1f36] dark:text-[#eaf3ff] mb-1">
                        {item.title}
                      </strong>
                      <p className="text-xs leading-relaxed text-[#5b7188] dark:text-[#7b8ea6]">
                        {item.desc}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Right Column: Tailored Recommendation Box */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#136f97]/10 to-transparent dark:from-[#33a4d4]/15 border-2 border-[#136f97]/30 dark:border-[#33a4d4]/30 shadow-md relative">
              
              {/* Corner Robot Picture */}
              <img 
                src="https://storage.googleapis.com/uspeshnyy-projects/uspeshnyy.ru/pages/agenty/quiz-light.webp" 
                alt="AI-советник"
                className="absolute top-4 right-4 w-16 h-auto pointer-events-none opacity-80"
              />

              <div className="pr-16 mb-4">
                <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[#136f97] dark:text-[#33a4d4] block mb-1">
                  Похоже, вам лучше всего подойдет:
                </span>
                <h3 className="text-xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff]">
                  {currentResult.recommendedAgent}
                </h3>
              </div>

              {/* Specs Pills */}
              <div className="flex items-center gap-3 mb-4 text-xs font-semibold">
                <span className="px-2.5 py-1 rounded-full bg-[#136f97]/15 dark:bg-[#33a4d4]/20 text-[#136f97] dark:text-[#33a4d4]">
                  Стоимость: {currentResult.price}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[#5b7188] dark:text-[#7b8ea6]">
                  Срок: {currentResult.time}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#0d1f36] dark:text-[#eaf3ff] leading-relaxed mb-4">
                {currentResult.solutionText}
              </p>

              <div className="p-3 rounded-xl bg-white dark:bg-[#0e2236] border border-[#147aa6]/15 dark:border-white/10 text-xs text-[#3a4d63] dark:text-[#b6c6da] mb-6 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Ожидаемый результат:</strong> {currentResult.effect}</span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <GlassmorphismCta
                  onClick={handleTelegramPreFilled}
                  className="w-full"
                  icon={<Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
                >
                  Разобрать мой процесс в Telegram
                </GlassmorphismCta>

                <motion.button
                  onClick={() => onOpenConsultation(`Диагностика: выбрана проблема ${currentResult.title}`)}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2 text-xs font-semibold text-[#5b7188] dark:text-[#7b8ea6] hover:text-[#136f97] dark:hover:text-[#33a4d4] transition-colors cursor-pointer"
                >
                  Или оставить заявку на звонок/аудит
                </motion.button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
