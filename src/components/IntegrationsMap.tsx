import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INTEGRATIONS_LIST } from '../data/agentsData';
import { RevealText } from './RevealText';
import { TextRevealMask } from './TextRevealMask';
import { 
  Database, 
  Layers, 
  Send, 
  MessageSquare, 
  PhoneCall, 
  Calendar, 
  FileSpreadsheet, 
  Table, 
  Globe, 
  TrendingUp, 
  Cpu, 
  ArrowRight 
} from 'lucide-react';

export const IntegrationsMap: React.FC = () => {
  const [activeIntegration, setActiveIntegration] = useState<string>('AmoCRM');

  const getIntegrationDetails = (name: string) => {
    switch (name) {
      case 'AmoCRM':
        return 'Автоматически создает сделки, заполняет кастомные поля (бюджет, площадь, город), ставит теги и задачи менеджерам. Обновляет этапы воронки при оплате.';
      case 'Bitrix24':
        return 'Создает лиды, прикрепляет транскрипцию звонка, назначает ответственного по правилам очередей и передает диалог во внутренний чат Битрикс24.';
      case 'Telegram':
        return 'Мгновенный ответ в боте или группе, отправка файлов, опросников, документов и уведомлений руководству о важных событиях.';
      case 'WhatsApp Business':
        return 'Официальный WhatsApp Business API (WABA) или связка через агрегатор: рассылка напоминаний, диалог без блокировок, отправка счетов.';
      case 'Mango Office':
        return 'Подключение к виртуальной АТС: перехват звонка в нерабочее время, распределение на дежурного, запись и распознавание речи.';
      case 'YClients':
        return 'Проверка свободных окон у мастеров или врачей, онлайн-запись в журнал клиники/салона, автоматическая отмена и перенос слотов.';
      case 'МойСклад / 1C':
        return 'Запрос остатков товаров в реальном времени, проверка актуальных цен, резервирование позиций и создание заказов покупателя.';
      case 'Google Sheets':
        return 'Мгновенная выгрузка лидов в удобную сводную таблицу для маркетологов и руководства с автоматическим расчетом конверсий.';
      default:
        return 'Бесшовная интеграция через вебхуки и защищенный REST API с сохранением всех логов и авторизацией.';
    }
  };

  return (
    <section className="py-10 sm:py-14">
      <div className="max-w-[1480px] mx-auto px-5 sm:px-7">
        
        <div className="bg-white/80 dark:bg-[#0e2236]/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#147aa6]/20 dark:border-white/10 shadow-lg">
          
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#136f97] dark:text-[#33a4d4] block mb-2">
              Совместимость
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight mb-2">
              <RevealText text="Работает с вашими сервисами и базами данных" as="span" />
            </h2>
            <TextRevealMask
              text="Агенту не нужно менять ваш привычный софт. Он встраивается в уже работающие каналы и CRM."
              className="text-xs sm:text-sm text-[#3a4d63] dark:text-[#b6c6da]"
              delay={0.2}
            />
          </div>

          {/* Interactive Integration Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
            {INTEGRATIONS_LIST.map((item) => {
              const isSelected = activeIntegration === item.name;
              return (
                <motion.button
                  key={item.name}
                  onClick={() => setActiveIntegration(item.name)}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#136f97]/15 dark:bg-[#33a4d4]/20 border-[#136f97] dark:border-[#33a4d4] shadow-xs'
                      : 'bg-[#f6f9fc] dark:bg-[#09182a] border-[#147aa6]/15 hover:border-[#136f97]/40 text-[#3a4d63] dark:text-[#b6c6da]'
                  }`}
                >
                  <strong className="text-xs sm:text-sm font-bold text-[#0d1f36] dark:text-[#eaf3ff]">
                    {item.name}
                  </strong>
                  <span className="text-[0.68rem] text-[#5b7188] dark:text-[#7b8ea6]">
                    {item.category}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Selected Integration Info Banner */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIntegration}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#136f97]/10 to-transparent dark:from-[#33a4d4]/15 border border-[#136f97]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#136f97] dark:bg-[#33a4d4] text-white dark:text-[#04121f] flex items-center justify-center shrink-0 shadow-xs">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#136f97] dark:text-[#33a4d4] block">
                    Сценарий работы с {activeIntegration}:
                  </span>
                  <p className="text-xs sm:text-sm text-[#0d1f36] dark:text-[#eaf3ff] leading-relaxed">
                    {getIntegrationDetails(activeIntegration)}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                ✓ Готовый коннектор
              </span>
            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
};
