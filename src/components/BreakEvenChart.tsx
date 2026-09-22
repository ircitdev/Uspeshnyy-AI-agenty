import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceDot,
  ReferenceLine
} from 'recharts';
import { TrendingUp, CheckCircle2, DollarSign, Sparkles } from 'lucide-react';

interface BreakEvenChartProps {
  monthlySalarySaved: number;
  agentCost: number;
  monthlyAiMaintenance?: number;
  paybackDays: number;
}

export const BreakEvenChart: React.FC<BreakEvenChartProps> = ({
  monthlySalarySaved,
  agentCost,
  monthlyAiMaintenance = 4000,
  paybackDays
}) => {
  // Generate 12 months data
  const data = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const manualCost = Math.round(month * monthlySalarySaved);
    const aiCost = Math.round(agentCost + month * monthlyAiMaintenance);
    const netSavings = Math.max(0, manualCost - aiCost);

    return {
      month,
      label: `${month} мес`,
      manualCost,
      aiCost,
      netSavings
    };
  });

  // Calculate break-even month
  const monthlyNetGain = Math.max(1, monthlySalarySaved - monthlyAiMaintenance);
  const breakEvenMonthFloat = Math.min(12, Math.max(0.2, agentCost / monthlyNetGain));
  const breakEvenMonth = Math.ceil(breakEvenMonthFloat);

  // Exact coordinates for break-even dot on the chart
  const breakEvenCost = Math.round(agentCost + breakEvenMonthFloat * monthlyAiMaintenance);
  const breakEvenXLabel = `${breakEvenMonth} мес`;

  // 12-month total cumulative savings
  const total12MonthManual = data[11].manualCost;
  const total12MonthAi = data[11].aiCost;
  const total12MonthSavings = total12MonthManual - total12MonthAi;

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentMonth = Number(label.replace(' мес', ''));
      const isProfitable = currentMonth >= breakEvenMonth;

      return (
        <div className="bg-[#09182a] text-white p-3.5 rounded-2xl shadow-2xl border border-white/15 text-xs backdrop-blur-md min-w-[240px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 font-bold">
            <span className="text-white text-sm">{label} (накопительный итог)</span>
            {isProfitable ? (
              <span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                В плюсе
              </span>
            ) : (
              <span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold">
                Период возврата
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-red-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Ручной труд (без AI):
              </span>
              <strong className="text-white font-mono">
                {payload[0]?.value?.toLocaleString()} ₽
              </strong>
            </div>

            <div className="flex items-center justify-between gap-3 text-[#38bdf8]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#136f97] dark:bg-[#38bdf8]" />
                Затраты с AI-агентом:
              </span>
              <strong className="text-white font-mono">
                {payload[1]?.value?.toLocaleString()} ₽
              </strong>
            </div>

            <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-emerald-400">
              <span>Чистая экономия бизнеса:</span>
              <strong className="font-bold text-sm">
                +{(payload[0]?.value - payload[1]?.value).toLocaleString()} ₽
              </strong>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-8 pt-6 border-t border-[#147aa6]/15 dark:border-white/10">
      
      {/* Header and Summary stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold uppercase tracking-wider text-[#136f97] dark:text-[#33a4d4] bg-[#136f97]/10 dark:bg-[#33a4d4]/15 border border-[#136f97]/20 mb-1.5">
            <TrendingUp className="w-3 h-3" />
            <span>Тренд окупаемости (12 месяцев)</span>
          </div>
          <h4 className="text-base sm:text-lg font-extrabold text-[#0d1f36] dark:text-[#eaf3ff]">
            График точки безубыточности: Ручной труд vs AI-агент
          </h4>
        </div>

        {/* Quick Highlights */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <div className="text-xs">
              <span className="text-[#5b7188] dark:text-[#94a3b8] block text-[0.68rem]">Окупаемость:</span>
              <strong className="text-emerald-700 dark:text-emerald-300 font-bold">
                ~{paybackDays} дней (в {breakEvenMonth}-м мес.)
              </strong>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#136f97]/10 dark:bg-[#33a4d4]/15 border border-[#136f97]/25 flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-[#136f97] dark:text-[#33a4d4]" />
            <div className="text-xs">
              <span className="text-[#5b7188] dark:text-[#94a3b8] block text-[0.68rem]">Экономия за 12 мес.:</span>
              <strong className="text-[#136f97] dark:text-[#38bdf8] font-bold">
                +{total12MonthSavings.toLocaleString()} ₽
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[260px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 15, right: 25, left: 10, bottom: 10 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="currentColor" 
              className="text-black/5 dark:text-white/10" 
            />
            
            <XAxis 
              dataKey="label" 
              tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 500 }}
              className="text-[#5b7188] dark:text-[#7b8ea6]"
              axisLine={false}
              tickLine={false}
              dy={5}
            />

            <YAxis 
              tick={{ fill: 'currentColor', fontSize: 11 }}
              className="text-[#5b7188] dark:text-[#7b8ea6]"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${Math.round(value / 1000)}k ₽`}
              dx={-5}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend 
              verticalAlign="top" 
              align="right"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
            />

            {/* Manual Routine Cost Line (Steep slope, accumulating expense) */}
            <Line
              type="monotone"
              dataKey="manualCost"
              name="Ручные затраты без AI (накопительно)"
              stroke="#f43f5e"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#f43f5e' }}
              activeDot={{ r: 6 }}
            />

            {/* AI Cost Line (Initial setup, then flat modest maintenance) */}
            <Line
              type="monotone"
              dataKey="aiCost"
              name="Затраты с AI-агентом (внедрение + сервер)"
              stroke="#0284c7"
              strokeWidth={3}
              dot={{ r: 3, fill: '#0284c7' }}
              activeDot={{ r: 6 }}
            />

            {/* Break-Even Reference Line */}
            <ReferenceLine
              x={breakEvenXLabel}
              stroke="#10b981"
              strokeDasharray="4 4"
              label={{
                value: `Безубыточность (~${paybackDays} дн)`,
                position: 'insideTopLeft',
                fill: '#10b981',
                fontSize: 10,
                fontWeight: 700
              }}
            />

            {/* Break-Even Dot Highlight */}
            <ReferenceDot
              x={breakEvenXLabel}
              y={breakEvenCost}
              r={7}
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory note */}
      <div className="mt-2 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 text-[0.75rem] text-[#5b7188] dark:text-[#7b8ea6]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block shrink-0" />
          <span>
            <strong>Точка безубыточности:</strong> момент, когда сэкономленная рутина полностью перекрывает разовую разработку агента ({agentCost.toLocaleString()} ₽).
          </span>
        </div>
        <span className="text-[#136f97] dark:text-[#33a4d4] font-medium">
          Далее бизнес получает чистую прибыль от автоматизации каждый месяц.
        </span>
      </div>

    </div>
  );
};
