import React, { forwardRef } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Database, 
  BookOpen, 
  ShieldCheck, 
  Cpu
} from 'lucide-react';
import { ReadinessPdfData } from '../utils/pdfGenerator';

interface AiReadinessPdfTemplateProps {
  data: ReadinessPdfData;
}

export const AiReadinessPdfTemplate = forwardRef<HTMLDivElement, AiReadinessPdfTemplateProps>(
  ({ data }, ref) => {
    const today = new Date().toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const reportId = `AIR-${Math.floor(100000 + Math.random() * 900000)}`;

    return (
      <div
        ref={ref}
        style={{
          width: '794px',
          fontFamily: "'Onest', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          backgroundColor: '#ffffff',
          color: '#0d1f36',
          boxSizing: 'border-box',
        }}
        className="p-8 text-[#0d1f36] bg-white leading-normal"
      >
        {/* Top Header / Branding */}
        <div className="flex items-center justify-between pb-5 border-b-2 border-[#136f97]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#136f97] text-white flex items-center justify-center font-black text-xl shadow-sm">
              У
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-[#0d1f36] uppercase">
                УСПЕШНЫЙ <span className="text-[#136f97]">•</span> AI-АГЕНТЫ
              </div>
              <div className="text-[11px] text-[#5b7188] font-medium">
                Персональный экспресс-аудит и дорожная карта интеграции
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#136f97]/10 text-[#136f97] border border-[#136f97]/25 mb-0.5">
              ОТЧЕТ {reportId}
            </div>
            <div className="text-[11px] text-[#5b7188] font-medium">
              Дата: {today}
            </div>
          </div>
        </div>

        {/* Hero Score & Status Banner */}
        <div className="mt-6 p-6 rounded-2xl bg-[#f0f6fc] border border-[#136f97]/20 flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mb-2 bg-[#136f97]/10 text-[#136f97] border border-[#136f97]/25">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{data.levelBadge}</span>
            </div>
            <h1 className="text-xl font-black text-[#0d1f36] leading-tight mb-2">
              {data.title}
            </h1>
            <p className="text-xs text-[#3a4d63] leading-relaxed">
              {data.summary}
            </p>
          </div>

          {/* Big Score Circle */}
          <div className="w-32 h-32 rounded-2xl bg-white border-2 border-[#136f97]/30 shadow-md flex flex-col items-center justify-center shrink-0 text-center p-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#5b7188]">
              Индекс готовности
            </span>
            <span className="text-4xl font-black text-[#136f97] leading-none my-1">
              {data.score}%
            </span>
            <span className="text-[10px] font-semibold text-emerald-600">
              {data.score >= 70 ? 'Высокий ROI' : data.score >= 45 ? 'Быстрый старт' : 'Нужна оцифровка'}
            </span>
          </div>
        </div>

        {/* 3 Pillars Breakdown */}
        <div className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5b7188] mb-3 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#136f97]" />
            Оценка готовности по ключевым направлениям
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {/* Pillar 1 */}
            <div className="p-3.5 rounded-xl bg-[#f8fbfe] border border-gray-200">
              <div className="flex items-center justify-between text-xs font-bold text-[#0d1f36] mb-1.5">
                <span className="flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-[#136f97]" />
                  Инфраструктура & CRM
                </span>
                <span className="text-[#136f97] font-black">{data.pillarScores.crm}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden mb-2">
                <div 
                  className="h-full bg-[#136f97] rounded-full" 
                  style={{ width: `${data.pillarScores.crm}%` }} 
                />
              </div>
              <p className="text-[10px] text-[#5b7188] leading-tight">
                {data.pillarScores.crm >= 70 
                  ? 'Отличная база с API для прямой интеграции'
                  : 'Рекомендуется подключение облачной CRM'}
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-3.5 rounded-xl bg-[#f8fbfe] border border-gray-200">
              <div className="flex items-center justify-between text-xs font-bold text-[#0d1f36] mb-1.5">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  База знаний
                </span>
                <span className="text-emerald-700 font-black">{data.pillarScores.knowledge}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden mb-2">
                <div 
                  className="h-full bg-emerald-600 rounded-full" 
                  style={{ width: `${data.pillarScores.knowledge}%` }} 
                />
              </div>
              <p className="text-[10px] text-[#5b7188] leading-tight">
                {data.pillarScores.knowledge >= 70 
                  ? 'Регламенты готовы к оцифровке в векторную память'
                  : 'Требуется фиксация 15–20 частых вопросов'}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-3.5 rounded-xl bg-[#f8fbfe] border border-gray-200">
              <div className="flex items-center justify-between text-xs font-bold text-[#0d1f36] mb-1.5">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                  Потенциал ROI
                </span>
                <span className="text-amber-600 font-black">{data.pillarScores.roi}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden mb-2">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${data.pillarScores.roi}%` }} 
                />
              </div>
              <p className="text-[10px] text-[#5b7188] leading-tight">
                {data.pillarScores.roi >= 70 
                  ? 'Высокая окупаемость за счет снятия рутины'
                  : 'Умеренная нагрузка, оптимален точечный ассистент'}
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Starter Agent */}
        <div className="mt-5 p-4 rounded-xl bg-[#136f97]/10 border border-[#136f97]/30 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#136f97] text-white flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#136f97]">
              Рекомендуемый первый агент для быстрого запуска (Quick-Win):
            </div>
            <div className="text-sm font-bold text-[#0d1f36] mt-0.5">
              {data.recommendedAgent}
            </div>
            <div className="text-[11px] text-[#3a4d63] mt-1 leading-snug">
              Позволяет автоматизировать первичное касание за 5–7 рабочих дней, отфильтровать нецелевой спам и гарантировать ответ каждому клиенту менее чем за 30 секунд.
            </div>
          </div>
        </div>

        {/* Recommended Next Steps / Roadmap */}
        <div className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5b7188] mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#136f97]" />
            Персонализированный план развития и внедрения (Roadmap 30 дней)
          </h2>

          <div className="grid grid-cols-2 gap-2.5">
            {data.nextSteps.map((step, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white border border-gray-200 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <span className="text-xs font-semibold text-[#0d1f36] leading-snug block">
                    {step}
                  </span>
                  <span className="text-[10px] text-[#5b7188] mt-0.5 block">
                    {idx === 0 ? 'Срок: 2–4 дня' : idx === 1 ? 'Срок: 5–8 дней' : 'Срок: 9–14 дней'}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Added 4th standardized pillar step for completeness */}
            <div className="p-3 rounded-xl bg-white border border-gray-200 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                {data.nextSteps.length + 1}
              </span>
              <div>
                <span className="text-xs font-semibold text-[#0d1f36] leading-snug block">
                  Тестовый запуск с контролем точности (Human-in-the-loop)
                </span>
                <span className="text-[10px] text-[#5b7188] mt-0.5 block">
                  Срок: 15–20 дней • Проверка точности 98%+
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Inputs Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5b7188] mb-2.5">
            Исходные параметры диагностики (Ваши ответы)
          </h2>
          <div className="grid grid-cols-1 gap-1.5 text-[11px]">
            {data.answers.map((ans, idx) => (
              <div key={idx} className="flex items-center justify-between py-1 border-b border-gray-100 text-xs">
                <span className="text-[#5b7188] flex items-center gap-1.5 max-w-[55%] truncate">
                  <span className="font-bold text-[#0d1f36]">{idx + 1}.</span> {ans.questionTitle}
                </span>
                <span className="font-bold text-[#0d1f36] text-right truncate max-w-[42%]">
                  {ans.selectedOptionLabel}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Footer */}
        <div className="mt-6 pt-4 border-t-2 border-[#136f97]/20 flex items-center justify-between text-[11px] text-[#5b7188]">
          <div>
            <div className="font-bold text-[#0d1f36]">
              Команда инженеров AI-агентов • Успешный
            </div>
            <div>
              Сайт: uspeshnyy.ru • Telegram: @uspeshnyy
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium text-[#136f97]">
              Зафиксируйте бесплатную сессию разбора архитектуры
            </div>
            <div className="text-[10px]">
              Документ сформирован автоматически и защищен от фальсификации
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AiReadinessPdfTemplate.displayName = 'AiReadinessPdfTemplate';
