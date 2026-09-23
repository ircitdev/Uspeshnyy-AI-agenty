import React, { useState } from 'react';
import { Bot, Sparkles, CheckCircle2, AlertTriangle, Layers, Database, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { RevealText } from './RevealText';
import { TextRevealMask } from './TextRevealMask';

const COMPARISON_SCENARIOS = [
  {
    id: 'typos',
    tabName: 'Сленг и опечатки',
    userInput: 'здарова, скока стоит монтаж вентеляцыи на складе 450кв м в подольске?',
    botOutput: {
      text: 'Извините, команда не распознана. Пожалуйста, выберите пункт меню или напишите "Оператор".',
      status: 'Тупик сценария',
      time: '1 сек',
      failed: true
    },
    agentOutput: {
      text: 'Добрый день! Монтаж приточно-вытяжной вентиляции на склад 450 м² в Подольске "под ключ" ориентировочно от 380 000 ₽. Срок монтажа — 5–7 рабочих дней. Какая высота потолков и есть ли проект?',
      status: 'Лид распознан · Карточка создана в CRM (Подольск, 450 м²)',
      time: '3 сек',
      failed: false
    }
  },
  {
    id: 'reschedule',
    tabName: 'Перенос записи',
    userInput: 'Не успеваю в четверг на 15:00, перенесите пожалуйста на субботу после 16:00',
    botOutput: {
      text: 'Для отмены или изменения записи позвоните администратору по номеру +7 (495) ...',
      status: 'Сброс на человека',
      time: '1 сек',
      failed: true
    },
    agentOutput: {
      text: 'Понял вас! Проверил график: в эту субботу есть свободные окна в 16:30 и 18:00. Какое время забронировать? Запись на четверг уже освободил.',
      status: 'Проверил YClients / Календарь · Обновил запись',
      time: '2 сек',
      failed: false
    }
  },
  {
    id: 'discount',
    tabName: 'Торг и гибкость',
    userInput: 'У меня бюджет 120 000 ₽, но готов оплатить сегодня 100% на расчетный счет. Договоримся?',
    botOutput: {
      text: 'Стоимость услуг фиксирована согласно прайс-листу. Ознакомьтесь на сайте.',
      status: 'Потерянный клиент',
      time: '1 сек',
      failed: true
    },
    agentOutput: {
      text: 'Отличное предложение! При 100% предоплате сегодня согласуем комплектацию "Стандарт" под ваш лимит в 120 000 ₽ (с оптимизацией стартовой выгрузки). Пришлите реквизиты компании — сформирую счет со скидкой.',
      status: 'Оценил выгоду · Перевел сделку на этап "Выставление счета"',
      time: '4 сек',
      failed: false
    }
  }
];

export const BotVsAgent: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState(0);
  const current = COMPARISON_SCENARIOS[activeScenario];

  return (
    <section className="py-10 sm:py-14" id="vs">
      <div className="max-w-[1480px] mx-auto px-5 sm:px-7">
        
        {/* Секция в жидком стекле: размытие подложки, блик по верхней кромке
            и два цветных пятна под стеклом — сквозь него видно топографию hero
            и фон страницы, а не плоская заливка. */}
        <div className="relative isolate overflow-hidden rounded-3xl border border-white/40 dark:border-white/10 bg-white/55 dark:bg-[#0e2236]/45 p-6 sm:p-10 shadow-[0_20px_60px_-20px_rgba(13,31,54,.28)] backdrop-blur-2xl backdrop-saturate-150">
          {/* Преломление: светлые пятна под стеклом */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-16 -z-10 h-72 w-72 rounded-full bg-gradient-to-br from-[#38bdf8]/35 via-[#136f97]/20 to-transparent blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -right-10 -z-10 h-72 w-72 rounded-full bg-gradient-to-tr from-[#10b981]/25 via-[#136f97]/15 to-transparent blur-3xl"
          />
          {/* Зеркальный блик по верхней кромке — кромка стекла, а не рамка */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/30"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/50 via-transparent to-transparent dark:from-white/[0.07]"
          />
          
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight mb-3">
              <RevealText text="Чем агент отличается от обычного бота" as="span" />
            </h2>
            <TextRevealMask
              text="Обычный бот строго идет по кнопкам и ломается при любой нестандартной фразе. AI-агент понимает цель собеседника, работает с вашей базой данных и самостоятельно выполняет действия."
              className="text-base sm:text-lg text-[#3a4d63] dark:text-[#b6c6da] leading-relaxed"
              delay={0.2}
            />
          </div>

          {/* Core Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
            
            {/* Left: Classic Bot */}
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="md:col-span-5 rounded-2xl p-6 bg-white/50 dark:bg-[#09182a]/45 backdrop-blur-xl border border-white/50 dark:border-white/10 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0d1f36] dark:text-[#eaf3ff]">Обычный кнопочный бот</h3>
                    <span className="text-xs text-rose-500 font-semibold">Линейный сценарий</span>
                  </div>
                </div>

                <ul className="space-y-3 text-sm text-[#3a4d63] dark:text-[#b6c6da] mb-6">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</span>
                    <span>Отвечает только по зашитым кнопкам и точным ключевым словам</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</span>
                    <span>Не понимает контекст, голосовые сообщения и сложные вопросы</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</span>
                    <span>Не может сам посмотреть наличие на складе или свободное время</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</span>
                    <span>При малейшей ошибке скидывает диалог на перегруженного менеджера</span>
                  </li>
                </ul>
              </div>

              {/* Sad bot comic illustration */}
              <div className="pt-4 border-t border-[#147aa6]/15 dark:border-white/10 flex items-end gap-3.5">
                <img 
                  src="https://storage.googleapis.com/uspeshnyy-projects/uspeshnyy.ru/pages/agenty/bot-sad.webp" 
                  alt="Обычный бот не понял"
                  className="w-16 h-auto shrink-0"
                />
                <div className="bg-white dark:bg-[#0e2236] p-3 rounded-2xl rounded-bl-xs border border-gray-200 dark:border-gray-800 text-xs text-[#5b7188] dark:text-[#7b8ea6] italic shadow-xs">
                  «Команда не распознана. Уточните, пожалуйста, или напишите 1...»
                </div>
              </div>
            </motion.div>

            {/* Center: Real AI Agent */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="md:col-span-4 rounded-2xl p-6 bg-gradient-to-b from-[#136f97]/15 via-[#136f97]/5 to-white/30 dark:from-[#33a4d4]/20 dark:via-[#33a4d4]/8 dark:to-white/[0.03] backdrop-blur-xl border-2 border-[#136f97]/35 dark:border-[#33a4d4]/35 flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#136f97] dark:bg-[#33a4d4] text-white dark:text-[#04121f] flex items-center justify-center shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#136f97] dark:text-[#33a4d4]">Интеллектуальный AI-агент</h3>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Работа на результат</span>
                  </div>
                </div>

                <ul className="space-y-3 text-sm text-[#0d1f36] dark:text-[#eaf3ff] mb-6">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Понимает разговорный язык, жаргон, длинные голосовые и опечатки</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Использует базу знаний компании (RAG): регламенты, прайсы, остатки</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Автоматически создает сделки в CRM, ставит задачи и шлет счета</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Доводит 80% рутинных обращений до логического конца без участия людей</span>
                  </li>
                </ul>
              </div>

              {/* Smart bot comic illustration */}
              <div className="pt-4 border-t border-[#136f97]/25 flex items-end gap-3.5">
                <img 
                  src="https://storage.googleapis.com/uspeshnyy-projects/uspeshnyy.ru/pages/agenty/bot-ok.webp" 
                  alt="Умный агент решил задачу"
                  className="w-16 h-auto shrink-0"
                />
                <div className="bg-white dark:bg-[#0e2236] p-3 rounded-2xl rounded-bl-xs border border-emerald-500/30 text-xs text-[#0d1f36] dark:text-[#eaf3ff] font-medium shadow-xs">
                  «Проверил в CRM, нашел клиента и создал бронь на четверг 14:00 ✓»
                </div>
              </div>
            </motion.div>

            {/* Right: What the Agent Can Do */}
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="md:col-span-3 rounded-2xl p-6 bg-[#f6f9fc] dark:bg-[#09182a]/70 border border-[#147aa6]/15 dark:border-white/10 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#136f97] dark:text-[#33a4d4] mb-4">
                  Автономные действия
                </h4>
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#136f97]/10 dark:bg-[#33a4d4]/15 flex items-center justify-center text-[#136f97] dark:text-[#33a4d4] shrink-0">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-xs text-[#0d1f36] dark:text-[#eaf3ff] font-bold">Сбор и поиск данных</strong>
                      <p className="text-[0.78rem] text-[#5b7188] dark:text-[#7b8ea6]">Ищет в CRM, 1C, каталогах и таблицах</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#136f97]/10 dark:bg-[#33a4d4]/15 flex items-center justify-center text-[#136f97] dark:text-[#33a4d4] shrink-0">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-xs text-[#0d1f36] dark:text-[#eaf3ff] font-bold">Логика и правила</strong>
                      <p className="text-[0.78rem] text-[#5b7188] dark:text-[#7b8ea6]">Принимает решения строго по вашим инструкциям</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#136f97]/10 dark:bg-[#33a4d4]/15 flex items-center justify-center text-[#136f97] dark:text-[#33a4d4] shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-xs text-[#0d1f36] dark:text-[#eaf3ff] font-bold">Интеграции</strong>
                      <p className="text-[0.78rem] text-[#5b7188] dark:text-[#7b8ea6]">Отправляет SMS, пуши, ссылки на оплату</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#136f97]/10 dark:bg-[#33a4d4]/15 flex items-center justify-center text-[#136f97] dark:text-[#33a4d4] shrink-0">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-xs text-[#0d1f36] dark:text-[#eaf3ff] font-bold">Умный эскалейшн</strong>
                      <p className="text-[0.78rem] text-[#5b7188] dark:text-[#7b8ea6]">Зовет человека только в спорных ситуациях</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hand-written remark */}
              <div className="mt-5 pt-3 border-t border-[#147aa6]/15 dark:border-white/10">
                <img 
                  src="https://storage.googleapis.com/uspeshnyy-projects/uspeshnyy.ru/pages/agenty/note-vs.webp" 
                  alt="Агент — это не просто ответы. Это результат."
                  className="w-full h-auto max-w-[220px] mx-auto"
                />
              </div>
            </motion.div>

          </div>

          {/* Interactive Live Comparison Playground */}
          <div className="p-5 sm:p-7 rounded-2xl bg-[#eef4fa]/60 dark:bg-[#030a14]/60 border border-[#147aa6]/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#136f97] dark:text-[#33a4d4]">
                  Интерактивное сравнение
                </span>
                <h4 className="text-base sm:text-lg font-bold text-[#0d1f36] dark:text-[#eaf3ff]">
                  Посмотрите реакцию на реальный запрос клиента:
                </h4>
              </div>

              {/* Scenario Switcher Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {COMPARISON_SCENARIOS.map((sc, idx) => (
                  <motion.button
                    key={sc.id}
                    onClick={() => setActiveScenario(idx)}
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      activeScenario === idx
                        ? 'bg-[#136f97] dark:bg-[#33a4d4] text-white dark:text-[#04121f] shadow-md hover:shadow-[0_6px_18px_-3px_rgba(19,111,151,0.35)] dark:hover:shadow-[0_6px_18px_-3px_rgba(51,164,212,0.35)]'
                        : 'bg-white dark:bg-[#0e2236] text-[#5b7188] dark:text-[#7b8ea6] hover:text-[#0d1f36] dark:hover:text-white border border-[#147aa6]/15 hover:shadow-[0_4px_12px_-2px_rgba(19,111,151,0.15)] dark:hover:shadow-[0_4px_12px_-2px_rgba(51,164,212,0.15)]'
                    }`}
                  >
                    {sc.tabName}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input Message Box */}
            <div className="mb-4 p-3.5 rounded-xl bg-white dark:bg-[#0e2236] border border-[#147aa6]/20 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold shrink-0">
                Кл
              </div>
              <div>
                <div className="text-[0.7rem] font-semibold text-[#5b7188] dark:text-[#7b8ea6]">Входящее сообщение клиента:</div>
                <p className="text-sm font-medium text-[#0d1f36] dark:text-[#eaf3ff]">
                  "{current.userInput}"
                </p>
              </div>
            </div>

            {/* Side-by-side Response Simulation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Bot response */}
              <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">Обычный бот</span>
                  </div>
                  <span className="self-start sm:self-auto text-[0.7rem] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-semibold">
                    {current.botOutput.status}
                  </span>
                </div>
                <p className="text-xs sm:text-[0.84rem] text-[#3a4d63] dark:text-[#b6c6da] mb-3 italic">
                  "{current.botOutput.text}"
                </p>
                <div className="text-[0.72rem] text-rose-600 dark:text-rose-400 font-medium">
                  Итог: клиент раздражен, уходит к конкурентам или ждет менеджера 2 часа.
                </div>
              </div>

              {/* Agent response */}
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-300/50 dark:border-emerald-800/40 shadow-xs">
                {/* На мобильном имя и статус в колонку: длинная строка статуса
                    рядом с подписью сжимала её в две-три строки. */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">AI-агент Успешный</span>
                  </div>
                  <span className="self-start sm:self-auto text-[0.7rem] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold">
                    {current.agentOutput.status}
                  </span>
                </div>
                <p className="text-xs sm:text-[0.84rem] text-[#0d1f36] dark:text-[#eaf3ff] mb-3 font-medium">
                  "{current.agentOutput.text}"
                </p>
                <div className="text-[0.72rem] text-emerald-700 dark:text-emerald-400 font-medium">
                  Итог: мгновенный контакт, данные в CRM, клиент готов к сделке.
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
