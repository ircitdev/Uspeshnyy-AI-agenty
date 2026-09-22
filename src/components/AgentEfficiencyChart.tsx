import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  Cell 
} from 'recharts';
import { Clock, DollarSign, TrendingUp, Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react';

export interface AgentMetricData {
  id: string;
  name: string;
  shortName: string;
  timeSavedHours: number; // hours per month
  manualCostPerMonth: number; // rubles per month
  agentPriceNumber: number;
  paybackDays: number;
  tasksAutomated: string;
}

const METRICS_DATA: AgentMetricData[] = [
  {
    id: 'qualifier',
    name: '01 Квалификатор заявок',
    shortName: 'Квалификатор',
    timeSavedHours: 65,
    manualCostPerMonth: 75000,
    agentPriceNumber: 60000,
    paybackDays: 24,
    tasksAutomated: 'Фильтрация спама, квалификация 24/7, заведение сделок в CRM'
  },
  {
    id: 'voice',
    name: '02 Голосовой агент',
    shortName: 'Голосовой AI',
    timeSavedHours: 110,
    manualCostPerMonth: 125000,
    agentPriceNumber: 120000,
    paybackDays: 29,
    tasksAutomated: 'Прием звонков без очередей, бронирование слотов, SMS-подтверждения'
  },
  {
    id: 'consultant',
    name: '03 Консультант-продавец',
    shortName: 'Консультант',
    timeSavedHours: 85,
    manualCostPerMonth: 95000,
    agentPriceNumber: 90000,
    paybackDays: 28,
    tasksAutomated: 'Консультация по базе знаний, расчет сметы, выставление счета'
  },
  {
    id: 'unified_inbox',
    name: '04 Переписка в 1 окне',
    shortName: 'Единое окно',
    timeSavedHours: 50,
    manualCostPerMonth: 60000,
    agentPriceNumber: 60000,
    paybackDays: 30,
    tasksAutomated: 'Склейка WhatsApp/Telegram/сайта, автоответы на типовые вопросы'
  },
  {
    id: 'analyst',
    name: '05 Агент-аналитик',
    shortName: 'Аналитик',
    timeSavedHours: 40,
    manualCostPerMonth: 55000,
    agentPriceNumber: 60000,
    paybackDays: 33,
    tasksAutomated: 'Утренний свод CPL/ROMI из рекламы, CRM и финучета в Telegram'
  }
];

interface AgentEfficiencyChartProps {
  onSelectAgent?: (agentId: string) => void;
}

export const AgentEfficiencyChart: React.FC<AgentEfficiencyChartProps> = ({ onSelectAgent }) => {
  const [activeMetric, setActiveMetric] = useState<'both' | 'time' | 'cost'>('both');
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  // Totals
  const totalHours = METRICS_DATA.reduce((acc, curr) => acc + curr.timeSavedHours, 0);
  const totalCost = METRICS_DATA.reduce((acc, curr) => acc + curr.manualCostPerMonth, 0);
  const avgPayback = Math.round(
    METRICS_DATA.reduce((acc, curr) => acc + curr.paybackDays, 0) / METRICS_DATA.length
  );

  // Custom chart tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: AgentMetricData = payload[0].payload;
      return (
        <div className="bg-[#09182a] text-white p-4 rounded-2xl shadow-2xl border border-white/15 max-w-[300px] text-xs backdrop-blur-md">
          <div className="font-bold text-sm text-[#38bdf8] mb-1.5 flex items-center justify-between">
            <span>{data.name}</span>
          </div>
          <p className="text-[#94a3b8] mb-3 leading-relaxed">
            {data.tasksAutomated}
          </p>
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#94a3b8] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#38bdf8]" />
                Экономия времени:
              </span>
              <strong className="text-white text-sm">
                {data.timeSavedHours} ч/мес
              </strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#94a3b8] flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#34d399]" />
                Ручной труд (ФОТ):
              </span>
              <strong className="text-white text-sm">
                {data.manualCostPerMonth.toLocaleString()} ₽/мес
              </strong>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 text-[0.7rem] text-[#38bdf8]">
              <span>Окупаемость внедрения:</span>
              <span className="font-bold">~{data.paybackDays} дней</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="my-10 bg-white/90 dark:bg-[#0e2236]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#147aa6]/20 dark:border-white/10 shadow-xl">
      
      {/* Header and Toggle Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#136f97] dark:text-[#33a4d4] bg-[#136f97]/10 dark:bg-[#33a4d4]/15 border border-[#136f97]/20 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Оценка отдачи от внедрения (Recharts)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight">
            Экономия времени vs Затраты на ручной труд
          </h3>
          <p className="text-xs sm:text-sm text-[#5b7188] dark:text-[#7b8ea6] mt-1 max-w-2xl">
            Сравнение эффективности каждого из пяти агентов: сколько рабочих часов освобождается у сотрудников каждый месяц и сколько бизнес тратил бы на ручную рутину.
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/15 dark:border-white/10 self-start lg:self-center">
          <button
            onClick={() => setActiveMetric('both')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeMetric === 'both'
                ? 'bg-[#136f97] text-white shadow-xs'
                : 'text-[#5b7188] dark:text-[#7b8ea6] hover:text-[#0d1f36] dark:hover:text-white'
            }`}
          >
            Все показатели
          </button>
          <button
            onClick={() => setActiveMetric('time')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
              activeMetric === 'time'
                ? 'bg-[#136f97] text-white shadow-xs'
                : 'text-[#5b7188] dark:text-[#7b8ea6] hover:text-[#0d1f36] dark:hover:text-white'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Время (ч/мес)</span>
          </button>
          <button
            onClick={() => setActiveMetric('cost')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
              activeMetric === 'cost'
                ? 'bg-[#136f97] text-white shadow-xs'
                : 'text-[#5b7188] dark:text-[#7b8ea6] hover:text-[#0d1f36] dark:hover:text-white'
            }`}
          >
            <DollarSign className="w-3 h-3" />
            <span>ФОТ рутины (₽/мес)</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
        <div className="p-4 rounded-2xl bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/15 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#136f97]/15 dark:bg-[#33a4d4]/15 text-[#136f97] dark:text-[#33a4d4] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[0.72rem] text-[#5b7188] dark:text-[#7b8ea6] block uppercase tracking-wider font-semibold">
              Суммарно экономится
            </span>
            <strong className="text-lg sm:text-xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff]">
              ~{totalHours} часов / мес
            </strong>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/15 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[0.72rem] text-[#5b7188] dark:text-[#7b8ea6] block uppercase tracking-wider font-semibold">
              ФОТ ручной обработки
            </span>
            <strong className="text-lg sm:text-xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff]">
              {totalCost.toLocaleString()} ₽ / мес
            </strong>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/15 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[0.72rem] text-[#5b7188] dark:text-[#7b8ea6] block uppercase tracking-wider font-semibold">
              Средняя окупаемость
            </span>
            <strong className="text-lg sm:text-xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff]">
              ~{avgPayback} дней
            </strong>
          </div>
        </div>
      </div>

      {/* Main Recharts Visualization Canvas */}
      <div className="w-full h-[320px] sm:h-[360px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={METRICS_DATA}
            margin={{ top: 20, right: 20, left: 10, bottom: 25 }}
            onMouseMove={(state: any) => {
              if (state && state.activePayload && state.activePayload[0]) {
                setHoveredAgent(state.activePayload[0].payload.id);
              }
            }}
            onMouseLeave={() => setHoveredAgent(null)}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="currentColor" 
              className="text-black/5 dark:text-white/10" 
            />
            
            <XAxis 
              dataKey="shortName" 
              tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 600 }}
              className="text-[#5b7188] dark:text-[#7b8ea6]"
              axisLine={false}
              tickLine={false}
              dy={10}
            />

            {/* Left Y Axis for Hours */}
            {(activeMetric === 'both' || activeMetric === 'time') && (
              <YAxis 
                yAxisId="time"
                orientation="left"
                tick={{ fill: 'currentColor', fontSize: 11 }}
                className="text-[#136f97] dark:text-[#33a4d4]"
                axisLine={false}
                tickLine={false}
                unit=" ч"
              />
            )}

            {/* Right Y Axis for Cost */}
            {(activeMetric === 'both' || activeMetric === 'cost') && (
              <YAxis 
                yAxisId="cost"
                orientation={activeMetric === 'cost' ? 'left' : 'right'}
                tick={{ fill: 'currentColor', fontSize: 11 }}
                className="text-emerald-600 dark:text-emerald-400"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${Math.round(value / 1000)}k ₽`}
              />
            )}

            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(19, 111, 151, 0.08)' }} />
            
            <Legend 
              verticalAlign="top" 
              align="right"
              wrapperStyle={{ paddingBottom: '16px', fontSize: '12px', fontWeight: 600 }}
            />

            {/* Bars */}
            {(activeMetric === 'both' || activeMetric === 'time') && (
              <Bar
                yAxisId="time"
                dataKey="timeSavedHours"
                name="Сэкономлено времени (часов/мес)"
                fill="#136f97"
                radius={[8, 8, 0, 0]}
                maxBarSize={44}
              >
                {METRICS_DATA.map((entry) => (
                  <Cell 
                    key={`cell-time-${entry.id}`}
                    fill={hoveredAgent === entry.id ? '#0284c7' : '#136f97'}
                    className="transition-colors duration-200 cursor-pointer"
                    onClick={() => onSelectAgent?.(entry.id)}
                  />
                ))}
              </Bar>
            )}

            {(activeMetric === 'both' || activeMetric === 'cost') && (
              <Bar
                yAxisId="cost"
                dataKey="manualCostPerMonth"
                name="ФОТ ручной работы (₽/мес)"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                maxBarSize={44}
              >
                {METRICS_DATA.map((entry) => (
                  <Cell 
                    key={`cell-cost-${entry.id}`}
                    fill={hoveredAgent === entry.id ? '#34d399' : '#059669'}
                    className="transition-colors duration-200 cursor-pointer"
                    onClick={() => onSelectAgent?.(entry.id)}
                  />
                ))}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory Footer note */}
      <div className="mt-4 pt-4 border-t border-[#147aa6]/15 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#5b7188] dark:text-[#7b8ea6]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Расчет основан на медианной ставке сотрудника 450–650 ₽/час и данных реальных внедрений 2025–2026 гг.</span>
        </div>
        <span className="font-semibold text-[#136f97] dark:text-[#33a4d4]">
          * Нажмите на любой столбец для перехода к агенту
        </span>
      </div>

    </div>
  );
};
