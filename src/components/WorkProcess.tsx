import React from 'react';
import { Users, Code, Rocket, RefreshCw, ArrowRight } from 'lucide-react';

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
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/15 dark:border-white/10 flex flex-col justify-between group hover:border-[#136f97]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-full bg-[#136f97]/10 dark:bg-[#33a4d4]/15 text-[#136f97] dark:text-[#33a4d4] font-extrabold text-xs flex items-center justify-center border border-[#136f97]/25">
                      {step.num}
                    </span>
                    <Icon className="w-4 h-4 text-[#5b7188] dark:text-[#7b8ea6] group-hover:text-[#136f97] dark:group-hover:text-[#33a4d4] transition-colors" />
                  </div>
                  <strong className="block text-sm font-bold text-[#0d1f36] dark:text-[#eaf3ff] mb-1">
                    {step.title}
                  </strong>
                  <p className="text-xs text-[#3a4d63] dark:text-[#b6c6da] leading-relaxed mb-3">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#147aa6]/10 dark:border-white/5 flex items-center justify-between text-[0.7rem] font-semibold text-[#136f97] dark:text-[#33a4d4]">
                  <span>{step.duration}</span>
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
