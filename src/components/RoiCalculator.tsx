import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, TrendingUp, Clock, PiggyBank, ArrowRight, ShieldCheck, Download, FileSpreadsheet, Check } from 'lucide-react';
import { RevealText } from './RevealText';
import { TextRevealMask } from './TextRevealMask';
import { BreakEvenChart } from './BreakEvenChart';

interface RoiCalculatorProps {
  onOpenConsultation: (topic?: string) => void;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onOpenConsultation }) => {
  // Calculator inputs
  const [leadsPerMonth, setLeadsPerMonth] = useState<number>(350);
  const [managersCount, setManagersCount] = useState<number>(3);
  const [managerSalary, setManagerSalary] = useState<number>(75000);
  const [averageDeal, setAverageDeal] = useState<number>(50000);
  const [isExported, setIsExported] = useState<boolean>(false);

  // Math calculations
  // Hours saved: each manager spends ~2 hours/day on routine qualifying, copy-pasting, reporting (22 workdays = 44 hours/manager/month)
  const hoursSavedPerMonth = Math.round(managersCount * 44 * 0.75);

  // Hourly cost of manager = salary / 168h + 30% taxes
  const managerHourlyRate = (managerSalary * 1.3) / 168;
  const monthlySalarySaved = Math.round(hoursSavedPerMonth * managerHourlyRate);
  const yearlySalarySaved = monthlySalarySaved * 12;

  // Additional revenue: ~12% more leads preserved due to 15-second response time
  // Converted at typical 10% closing rate
  const preservedLeadsPerMonth = Math.round(leadsPerMonth * 0.14);
  const extraDealsPerMonth = Math.max(1, Math.round(preservedLeadsPerMonth * 0.08));
  const extraMonthlyRevenue = extraDealsPerMonth * averageDeal;
  const extraYearlyRevenue = extraMonthlyRevenue * 12;

  // Payback period for a 60,000 - 90,000 ruble agent:
  const agentCost = 60000;
  const totalMonthlyBenefit = monthlySalarySaved + extraMonthlyRevenue * 0.25; // 25% margin
  const paybackDays = Math.max(7, Math.min(60, Math.round((agentCost / totalMonthlyBenefit) * 30)));
  const netFirstYearProfit = yearlySalarySaved + Math.round(extraYearlyRevenue * 0.25) - agentCost;

  // CSV Export handler
  const handleExportCsv = () => {
    // Generate CSV content with UTF-8 BOM for flawless Excel compatibility
    const rows: string[] = [];

    // Header & metadata
    rows.push('ФИНАНСОВЫЙ РАСЧЁТ ОКУПАЕМОСТИ AI-АГЕНТА (Студия Артёма Успешного)');
    rows.push(`Дата формирования;${new Date().toLocaleDateString('ru-RU')}`);
    rows.push('');

    // Input parameters
    rows.push('ВХОДНЫЕ ПАРАМЕТРЫ БИЗНЕСА;Значение;Ед. измерения');
    rows.push(`Входящих обращений в месяц;${leadsPerMonth};заявок/мес`);
    rows.push(`Сотрудников в отделе продаж;${managersCount};человек`);
    rows.push(`Средний оклад + KPI менеджера;${managerSalary};руб/мес`);
    rows.push(`Средний чек сделки;${averageDeal};руб`);
    rows.push('');

    // Calculated metrics
    rows.push('ИТОГОВЫЕ ПОКАЗАТЕЛИ ЭФФЕКТИВНОСТИ;Значение;Примечание');
    rows.push(`Экономия времени отдела;${hoursSavedPerMonth} ч/мес;~2 часа в день на сотрудника`);
    rows.push(`Снятая рутина в ФОТ (в месяц);${monthlySalarySaved} руб;С учетом налогов и страховых взносов`);
    rows.push(`Снятая рутина в ФОТ (в год);${yearlySalarySaved} руб;Прямая экономия на фонде оплаты труда`);
    rows.push(`Сохраняемые заявки за счет реакции 15 сек;${preservedLeadsPerMonth} заявок/мес;Без потери в ночное время и выходные`);
    rows.push(`Дополнительных закрытых сделок;+${extraDealsPerMonth} сделок/мес;Конверсия в продажу`);
    rows.push(`Дополнительная выручка (в месяц);+${extraMonthlyRevenue} руб;Прирост оборота`);
    rows.push(`Дополнительная выручка (в год);+${extraYearlyRevenue} руб;Суммарный прирост выручки`);
    rows.push(`Разовая стоимость внедрения агента под ключ;${agentCost} руб;Разработка, интеграция с CRM, запуск`);
    rows.push(`Срок полной окупаемости вложений;~${paybackDays} дней;Возврат 100% инвестиций в разработку`);
    rows.push(`Чистый финансовый эффект за 1-й год;+${netFirstYearProfit} руб;Экономия ФОТ + маржинальная прибыль за вычетом агента`);
    rows.push('');

    // 12-month month-by-month projection
    rows.push('ПОМЕСЯЧНАЯ ДИНАМИКА НА 12 МЕСЯЦЕВ');
    rows.push('Месяц;Затраты без агента (руб);Затраты с агентом (руб);Накопленная экономия ФОТ (руб);Накопленная доп. выручка (руб);Чистый фин. результат (руб)');

    const monthlyCostWithoutAgent = Math.round(managersCount * managerSalary * 1.3);
    let cumulativeSalarySaved = 0;
    let cumulativeExtraRevenue = 0;

    for (let m = 1; m <= 12; m++) {
      cumulativeSalarySaved += monthlySalarySaved;
      cumulativeExtraRevenue += extraMonthlyRevenue;
      const costWithAgent = m === 1 ? agentCost : 0;
      const netBenefit = cumulativeSalarySaved + Math.round(cumulativeExtraRevenue * 0.25) - agentCost;

      rows.push(`${m}-й месяц;${monthlyCostWithoutAgent * m};${costWithAgent};${cumulativeSalarySaved};${cumulativeExtraRevenue};+${netBenefit}`);
    }

    rows.push('');
    rows.push('Контакты для запуска пилота:;https://t.me/artem_uspeshnyy;info@uspeshnyy.ru');

    // Add BOM for Russian Excel
    const csvContent = '\uFEFF' + rows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `raschet-roi-ai-agenta-${leadsPerMonth}-leads.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsExported(true);
    setTimeout(() => setIsExported(false), 3000);
  };

  return (
    <section className="py-10 sm:py-16" id="calculator">
      <div className="max-w-[1480px] mx-auto px-5 sm:px-7">
        
        {/* Main Card Container */}
        <div className="bg-white/90 dark:bg-[#0e2236]/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#147aa6]/20 dark:border-white/10 shadow-xl">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#136f97] dark:text-[#38bdf8] bg-[#136f97]/10 dark:bg-[#38bdf8]/15 border border-[#136f97]/20 mb-3">
                <Calculator className="w-3.5 h-3.5" />
                <span>Финансовый эффект</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight mb-3">
                <RevealText text="Калькулятор окупаемости AI-агента" as="span" />
              </h2>
              <TextRevealMask
                text="Подвигайте ползунки под параметры вашего отдела продаж, чтобы оценить реальную экономию времени, денег и срок возврата инвестиций."
                className="text-sm sm:text-base text-[#3a4d63] dark:text-[#b6c6da]"
                delay={0.2}
              />
            </div>

            {/* CSV Export Button in Header */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={handleExportCsv}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                  isExported
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-[#09182a] text-[#136f97] dark:text-[#38bdf8] border-[#147aa6]/25 dark:border-white/10 hover:bg-[#136f97]/10 dark:hover:bg-[#38bdf8]/15 shadow-xs'
                }`}
              >
                {isExported ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Файл .CSV скачан!</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    <span>Экспорт в CSV</span>
                    <Download className="w-3.5 h-3.5 opacity-60" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Sliders (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Slider 1: Leads per month */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/15 dark:border-white/10">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-[#0d1f36] dark:text-[#eaf3ff]">
                    Входящих обращений / заявок в месяц:
                  </span>
                  <span className="text-base font-extrabold text-[#136f97] dark:text-[#38bdf8]">
                    {leadsPerMonth.toLocaleString()} заявок
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2500"
                  step="50"
                  value={leadsPerMonth}
                  onChange={(e) => setLeadsPerMonth(Number(e.target.value))}
                  className="w-full accent-[#136f97] dark:accent-[#38bdf8] cursor-pointer"
                />
                <div className="flex justify-between text-[0.7rem] text-[#5b7188] dark:text-[#7b8ea6] mt-1">
                  <span>50</span>
                  <span>1 000</span>
                  <span>2 500+</span>
                </div>
              </div>

              {/* Slider 2: Managers Count */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/15 dark:border-white/10">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-[#0d1f36] dark:text-[#eaf3ff]">
                    Сотрудников в отделе продаж / операторов:
                  </span>
                  <span className="text-base font-extrabold text-[#136f97] dark:text-[#38bdf8]">
                    {managersCount} {managersCount === 1 ? 'человек' : managersCount < 5 ? 'человека' : 'человек'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={managersCount}
                  onChange={(e) => setManagersCount(Number(e.target.value))}
                  className="w-full accent-[#136f97] dark:accent-[#38bdf8] cursor-pointer"
                />
                <div className="flex justify-between text-[0.7rem] text-[#5b7188] dark:text-[#7b8ea6] mt-1">
                  <span>1</span>
                  <span>5</span>
                  <span>15</span>
                </div>
              </div>

              {/* Slider 3: Manager Salary */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/15 dark:border-white/10">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-[#0d1f36] dark:text-[#eaf3ff]">
                    Средний оклад + KPI менеджера в месяц:
                  </span>
                  <span className="text-base font-extrabold text-[#136f97] dark:text-[#38bdf8]">
                    {managerSalary.toLocaleString()} ₽
                  </span>
                </div>
                <input
                  type="range"
                  min="40000"
                  max="200000"
                  step="5000"
                  value={managerSalary}
                  onChange={(e) => setManagerSalary(Number(e.target.value))}
                  className="w-full accent-[#136f97] dark:accent-[#38bdf8] cursor-pointer"
                />
                <div className="flex justify-between text-[0.7rem] text-[#5b7188] dark:text-[#7b8ea6] mt-1">
                  <span>40 000 ₽</span>
                  <span>100 000 ₽</span>
                  <span>200 000 ₽</span>
                </div>
              </div>

              {/* Slider 4: Average Deal */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/15 dark:border-white/10">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-[#0d1f36] dark:text-[#eaf3ff]">
                    Средний чек сделки / услуги:
                  </span>
                  <span className="text-base font-extrabold text-[#136f97] dark:text-[#38bdf8]">
                    {averageDeal.toLocaleString()} ₽
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="300000"
                  step="5000"
                  value={averageDeal}
                  onChange={(e) => setAverageDeal(Number(e.target.value))}
                  className="w-full accent-[#136f97] dark:accent-[#38bdf8] cursor-pointer"
                />
                <div className="flex justify-between text-[0.7rem] text-[#5b7188] dark:text-[#7b8ea6] mt-1">
                  <span>5 000 ₽</span>
                  <span>100 000 ₽</span>
                  <span>300 000 ₽</span>
                </div>
              </div>

            </div>

            {/* Right Column: Calculated ROI Dashboard (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#136f97]/10 via-[#136f97]/5 to-white/40 dark:from-[#38bdf8]/15 dark:via-[#38bdf8]/5 dark:to-[#0e2236] border-2 border-[#136f97]/30 dark:border-[#38bdf8]/30 shadow-lg flex flex-col justify-between">
              
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#136f97] dark:text-[#38bdf8] block mb-1">
                  Прогноз эффекта для вашего бизнеса
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] mb-6">
                  Окупаемость за ~{paybackDays} дней
                </h3>

                {/* Metric 1: Hours Saved */}
                <motion.div 
                  whileHover={{ scale: 1.02, x: 2 }}
                  className="p-3.5 rounded-xl bg-white dark:bg-[#0e2236] border border-[#147aa6]/15 dark:border-white/10 mb-3 flex items-center justify-between transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#136f97] dark:text-[#38bdf8] flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-[#5b7188] dark:text-[#7b8ea6] block">Экономия времени отдела</span>
                      <strong className="text-sm font-bold text-[#0d1f36] dark:text-[#eaf3ff]">{hoursSavedPerMonth} часов / месяц</strong>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">~2 ч в день/чел</span>
                </motion.div>

                {/* Metric 2: Annual Salary Routine Savings */}
                <motion.div 
                  whileHover={{ scale: 1.02, x: 2 }}
                  className="p-3.5 rounded-xl bg-white dark:bg-[#0e2236] border border-[#147aa6]/15 dark:border-white/10 mb-3 flex items-center justify-between transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <PiggyBank className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-[#5b7188] dark:text-[#7b8ea6] block">Снятая рутина в деньгах</span>
                      <strong className="text-sm font-bold text-[#0d1f36] dark:text-[#eaf3ff]">{yearlySalarySaved.toLocaleString()} ₽ / год</strong>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">ФОТ</span>
                </motion.div>

                {/* Metric 3: Additional Revenue */}
                <motion.div 
                  whileHover={{ scale: 1.02, x: 2 }}
                  className="p-3.5 rounded-xl bg-white dark:bg-[#0e2236] border border-[#147aa6]/15 dark:border-white/10 mb-6 flex items-center justify-between transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-[#5b7188] dark:text-[#7b8ea6] block">Дополнительная выручка</span>
                      <strong className="text-sm font-bold text-[#0d1f36] dark:text-[#eaf3ff]">+{extraYearlyRevenue.toLocaleString()} ₽ / год</strong>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+{extraDealsPerMonth} сделок/мес</span>
                </motion.div>

                {/* Recommendation pill */}
                <div className="p-3 rounded-xl bg-[#136f97]/10 dark:bg-[#38bdf8]/15 border border-[#136f97]/20 text-xs text-[#0d1f36] dark:text-[#eaf3ff] mb-4">
                  <strong className="block font-bold mb-1 text-[#136f97] dark:text-[#38bdf8]">Рекомендация для старта:</strong>
                  {leadsPerMonth > 600 ? 'Связка: Квалификатор заявок + Единое окно переписки' : 'Квалификатор входящих заявок (от 60 000 ₽)'}
                </div>

                {/* Secondary CSV Export Link */}
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="w-full mb-4 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 text-[#5b7188] dark:text-[#7b8ea6] hover:text-[#136f97] dark:hover:text-[#38bdf8] bg-black/5 dark:bg-white/5 hover:bg-[#136f97]/10 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Скачать подробный отчет (.CSV для Excel)</span>
                </button>
              </div>

              {/* Action Button */}
              <motion.button
                onClick={() => onOpenConsultation(`Расчет окупаемости: ${leadsPerMonth} заявок, ${managersCount} чел, окупаемость ~${paybackDays} дней`)}
                whileHover={{ scale: 1.035, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 px-6 rounded-full font-bold text-sm text-white bg-gradient-to-b from-[#157ba4] to-[#136f97] dark:from-[#38bdf8] dark:to-[#0284c7] dark:text-[#04121f] shadow-md hover:shadow-[0_10px_25px_-4px_rgba(19,111,151,0.4)] dark:hover:shadow-[0_10px_25px_-4px_rgba(56,189,248,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Зафиксировать расчет и обсудить пилот</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

            </div>

          </div>

          {/* 12-Month Break-Even Trend Line Chart (Recharts) */}
          <BreakEvenChart
            monthlySalarySaved={monthlySalarySaved}
            agentCost={agentCost}
            paybackDays={paybackDays}
          />

        </div>

      </div>
    </section>
  );
};
