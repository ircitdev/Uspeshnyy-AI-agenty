import React from 'react';
import { Users, Code, Rocket, RefreshCw, ArrowRight } from 'lucide-react';


const STEP_THEMES = [
  {
    card: 'from-[#136f97]/12 via-[#38bdf8]/8 to-transparent border-[#136f97]/30 hover:border-[#136f97]/60 dark:from-[#136f97]/25 dark:via-[#38bdf8]/12 dark:border-[#38bdf8]/30',
    badge: 'bg-gradient-to-br from-[#157ba4] to-[#136f97] text-white border-transparent',
    icon: 'text-[#136f97] dark:text-[#38bdf8]',
    meta: 'text-[#136f97] dark:text-[#38bdf8]',
  },
  {
    card: 'from-[#6366f1]/12 via-[#818cf8]/8 to-transparent border-[#6366f1]/30 hover:border-[#6366f1]/60 dark:from-[#6366f1]/25 dark:via-[#818cf8]/12 dark:border-[#818cf8]/30',
    badge: 'bg-gradient-to-br from-[#6366f1] to-[#4f46e5] text-white border-transparent',
    icon: 'text-[#4f46e5] dark:text-[#a5b4fc]',
    meta: 'text-[#4f46e5] dark:text-[#a5b4fc]',
  },
  {
    card: 'from-emerald-500/12 via-emerald-400/8 to-transparent border-emerald-500/30 hover:border-emerald-500/60 dark:from-emerald-500/25 dark:via-emerald-400/12 dark:border-emerald-400/30',
    badge: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-transparent',
    icon: 'text-emerald-700 dark:text-emerald-300',
    meta: 'text-emerald-700 dark:text-emerald-300',
  },
  {
    card: 'from-amber-500/12 via-amber-400/8 to-transparent border-amber-500/30 hover:border-amber-500/60 dark:from-amber-500/25 dark:via-amber-400/12 dark:border-amber-400/30',
    badge: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-transparent',
    icon: 'text-amber-700 dark:text-amber-300',
    meta: 'text-amber-700 dark:text-amber-300',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Разбор процесса',
    desc: 'Смотрим, где теряется время, какие каналы приоритетны и что считать успешным результатом.',
    duration: '30–40 минут',
    cost: 'Бесплатно',
    icon: Users
  },
  {
    num: '02',
    title: 'Пилотный запуск',
    desc: 'Собираем прототип агента на одном изолированном участке и запускаем на реальных входящих обращениях.',
    duration: '1–2 недели',
    cost: 'Фикс-бюджет',
    icon: Code
  },
  {
    num: '03',
    title: 'Полный запуск',
    desc: 'Бесшовно подключаем все CRM, настраиваем права доступа, пишем регламенты и обучаем команду.',
    duration: '1–2 недели',
    cost: 'Под ключ',
    icon: Rocket
  },
  {
    num: '04',
    title: 'Сопровождение',
    desc: 'Мониторинг диалогов, дообучение модели, добавление новых веток и оптимизация конверсии.',
    duration: 'Постоянно',
    cost: 'от 30 000 ₽ / мес',
    icon: RefreshCw
  }
];

export const WorkProcess: React.FC = () => {
  return (
    <div className="bg-white/80 dark:bg-[#0e2236]/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#147aa6]/20 dark:border-white/10 shadow-lg flex flex-col justify-between">
      <div>
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight">
            Как идёт работа
          </h2>
          <p className="text-xs sm:text-sm text-[#5b7188] dark:text-[#7b8ea6] mt-1">
            От первого знакомства до стабильно работающего агента в боевом контуре.
          </p>
        </div>

        {/* 4 Process Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const theme = STEP_THEMES[idx % STEP_THEMES.length];
            return (
              <div
                key={idx}
                className={`relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br border flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme.card}`}
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/20" />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-8 h-8 rounded-full font-extrabold text-xs flex items-center justify-center border shadow-sm ${theme.badge}`}>
                      {step.num}
                    </span>
                    <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${theme.icon}`} />
                  </div>
                  <strong className="block text-sm font-bold text-[#0d1f36] dark:text-[#eaf3ff] mb-1">
                    {step.title}
                  </strong>
                  <p className="text-xs text-[#3a4d63] dark:text-[#b6c6da] leading-relaxed mb-3">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#147aa6]/10 dark:border-white/5 flex items-center justify-between text-[0.7rem] font-semibold text-[#136f97] dark:text-[#33a4d4]">
                  <span className={theme.meta}>{step.duration}</span>
                  <span className="text-[#5b7188] dark:text-[#7b8ea6]">{step.cost}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[#147aa6]/15 dark:border-white/10 text-center">
        <span className="text-xs text-[#5b7188] dark:text-[#7b8ea6]">
          Гарантия: если в ходе пилота агент не показывает окупаемость — не переходим к оплате полной версии.
        </span>
      </div>
    </div>
  );
};
