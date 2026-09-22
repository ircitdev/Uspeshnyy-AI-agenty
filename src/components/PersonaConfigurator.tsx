import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AgentTone, ToneSetting } from '../types';
import { 
  Briefcase, 
  Smile, 
  Zap, 
  Sliders, 
  Sparkles, 
  Check, 
  Info, 
  Eye, 
  Bot, 
  MessageSquareQuote,
  ChevronRight
} from 'lucide-react';

export const TONE_SETTINGS: ToneSetting[] = [
  {
    id: 'professional',
    name: 'Деловой',
    nameEn: 'Professional',
    badge: 'B2B & Регламенты',
    subtitle: 'Официальный и сдержанный',
    description: 'Строгий, уважительный стиль, академичная вежливость, акцент на регламенты, точность цифр и стандарты компании.',
    traits: {
      formality: 94,
      empathy: 42,
      conciseness: 62
    },
    samplePhrase: '«Здравствуйте! Параметры производственного объекта зафиксированы. Предварительный расчет проектной сметы сформирован в соответствии с техническими стандартами компании. Карточка передана инженеру.»',
    iconName: 'Briefcase'
  },
  {
    id: 'friendly',
    name: 'Дружелюбный',
    nameEn: 'Friendly',
    badge: 'Высокая эмпатия',
    subtitle: 'Теплый и заботливый',
    description: 'Теплый контакт, искренняя забота, открытые поддерживающие вопросы, легкие уместные эмодзи и формирование доверия.',
    traits: {
      formality: 28,
      empathy: 96,
      conciseness: 54
    },
    samplePhrase: '«Здравствуйте! Очень рады помочь 😊 Отличный масштаб объекта в Подольске, с удовольствием возьмем в работу и рассчитаем самую приятную цену! Уже прикрепил к вам нашего лучшего инженера Андрея ✨»',
    iconName: 'Smile'
  },
  {
    id: 'concise',
    name: 'Краткий',
    nameEn: 'Concise',
    badge: 'Экспресс & Суть',
    subtitle: 'Максимальная скорость',
    description: 'Предельная концентрация фактов. Никаких лишних вводных фраз — только сухие цифры, сроки и четкий следующий шаг.',
    traits: {
      formality: 55,
      empathy: 22,
      conciseness: 98
    },
    samplePhrase: '«Принято: 950 м², Подольск. Смета: 820–950 тыс. ₽. Срок монтажа: 10 дней. Заявка №482 передана инженеру. На какой номер отправить PDF?»',
    iconName: 'Zap'
  }
];

interface PersonaConfiguratorProps {
  activeTone: AgentTone;
  onToneChange: (tone: AgentTone) => void;
  agentTitle?: string;
}

export const PersonaConfigurator: React.FC<PersonaConfiguratorProps> = ({
  activeTone,
  onToneChange,
  agentTitle
}) => {
  const [showAllComparison, setShowAllComparison] = useState(false);

  const currentSetting = TONE_SETTINGS.find(t => t.id === activeTone) || TONE_SETTINGS[0];

  const getToneIcon = (id: AgentTone) => {
    switch (id) {
      case 'professional':
        return <Briefcase className="w-4 h-4" />;
      case 'friendly':
        return <Smile className="w-4 h-4" />;
      case 'concise':
        return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-4 sm:p-6 mb-6 transition-all duration-300 backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/50 to-white/30 dark:from-[#0c2238]/85 dark:via-[#091a2c]/65 dark:to-[#05111e]/75 border border-white/80 dark:border-white/15 shadow-[0_16px_36px_-10px_rgba(19,111,151,0.2),_0_0_0_1px_rgba(255,255,255,0.7)_inset] dark:shadow-[0_16px_36px_-10px_rgba(51,164,212,0.2),_0_0_0_1px_rgba(255,255,255,0.1)_inset]">
      
      {/* Liquid Glass Top Specular Highlight */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white dark:via-white/50 to-transparent" 
      />

      {/* Liquid Glass Organic Ambient Light Sheen Blobs */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-br from-[#136f97]/20 via-[#33a4d4]/15 to-transparent blur-3xl opacity-70 dark:opacity-50" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-gradient-to-tl from-teal-400/20 via-[#136f97]/15 to-transparent blur-3xl opacity-60 dark:opacity-40" 
      />

      {/* Top Header of Persona Configurator */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-4 border-b border-[#147aa6]/15 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#136f97]/20 to-[#33a4d4]/20 text-[#136f97] dark:text-[#33a4d4] flex items-center justify-center shrink-0 shadow-xs border border-white/40 dark:border-white/10 backdrop-blur-md">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight">
                Конфигуратор тональности (Persona Configurator)
              </h4>
              <span className="text-[0.65rem] px-2 py-0.5 rounded-full font-bold bg-[#136f97]/15 dark:bg-[#33a4d4]/20 text-[#136f97] dark:text-[#33a4d4] border border-[#136f97]/30 backdrop-blur-xs flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Liquid Glass Engine</span>
              </span>
            </div>
            <p className="text-[0.72rem] text-[#5b7188] dark:text-[#7b8ea6]">
              Переключайте стиль общения — агент мгновенно перестроит ответы в чате
            </p>
          </div>
        </div>

        {/* Quick Toggle for Side-by-Side Comparison */}
        <motion.button
          onClick={() => setShowAllComparison(!showAllComparison)}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className={`self-start sm:self-auto text-xs px-3.5 py-1.5 rounded-full font-semibold flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md ${
            showAllComparison
              ? 'bg-[#136f97] text-white dark:bg-[#33a4d4] dark:text-[#04121f] shadow-xs hover:shadow-[0_4px_12px_-2px_rgba(19,111,151,0.3)]'
              : 'bg-white/60 dark:bg-white/5 text-[#136f97] dark:text-[#33a4d4] border border-white/60 dark:border-white/15 hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-[0_4px_12px_-2px_rgba(19,111,151,0.18)]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{showAllComparison ? 'Скрыть сравнение 3 стилей' : 'Сравнить все 3 стиля'}</span>
        </motion.button>
      </div>

      {/* 3 Tone Selector Cards Grid with Liquid Glass styling */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {TONE_SETTINGS.map((tone) => {
          const isSelected = activeTone === tone.id;
          return (
            <motion.button
              key={tone.id}
              onClick={() => onToneChange(tone.id)}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden backdrop-blur-xl ${
                isSelected
                  ? 'bg-gradient-to-br from-[#136f97]/25 via-white/90 to-white/70 dark:from-[#33a4d4]/30 dark:via-[#0e2236]/90 dark:to-[#091a2c]/85 border-2 border-[#136f97] dark:border-[#33a4d4] shadow-[0_10px_25px_-5px_rgba(19,111,151,0.35)] dark:shadow-[0_10px_25px_-5px_rgba(51,164,212,0.3)] ring-2 ring-[#136f97]/20 dark:ring-[#33a4d4]/20'
                  : 'bg-white/50 dark:bg-white/5 border-white/60 dark:border-white/10 hover:border-[#136f97]/40 dark:hover:border-[#33a4d4]/40 hover:bg-white/75 dark:hover:bg-white/10 hover:shadow-[0_8px_20px_-4px_rgba(19,111,151,0.15)] dark:hover:shadow-[0_8px_20px_-4px_rgba(51,164,212,0.15)] text-[#3a4d63] dark:text-[#b6c6da]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#136f97] dark:bg-[#33a4d4] text-white dark:text-[#04121f] flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`p-1.5 rounded-xl ${
                    isSelected
                      ? 'bg-[#136f97] dark:bg-[#33a4d4] text-white dark:text-[#04121f]'
                      : 'bg-white/80 dark:bg-[#0e2236]/80 text-[#5b7188] dark:text-[#7b8ea6] border border-white/60 dark:border-white/10 shadow-2xs'
                  }`}>
                    {getToneIcon(tone.id)}
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-[#0d1f36] dark:text-[#eaf3ff] leading-none">
                      {tone.name}
                    </h5>
                    <span className="text-[0.66rem] text-[#5b7188] dark:text-[#7b8ea6]">
                      {tone.badge}
                    </span>
                  </div>
                </div>

                <p className="text-[0.73rem] text-[#3a4d63] dark:text-[#b6c6da] leading-tight line-clamp-2 mt-1">
                  {tone.description}
                </p>
              </div>

              {/* Trait Indicators Mini Preview */}
              <div className="mt-3 pt-2.5 border-t border-[#147aa6]/15 dark:border-white/10 space-y-1">
                <div className="flex justify-between items-center text-[0.65rem] text-[#5b7188] dark:text-[#7b8ea6]">
                  <span>Эмпатия:</span>
                  <span className="font-semibold text-[#0d1f36] dark:text-[#eaf3ff]">{tone.traits.empathy}%</span>
                </div>
                <div className="w-full h-1 rounded-full bg-gray-200/80 dark:bg-gray-700/80 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-[#136f97] dark:bg-[#33a4d4]" 
                    style={{ width: `${tone.traits.empathy}%` }} 
                  />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Dynamic Style Radar / Traits & Real-time Live Preview */}
      <div className="relative z-10">
      <AnimatePresence mode="wait">
        {!showAllComparison ? (
          <motion.div
            key={activeTone}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="p-3.5 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-white/70 via-white/50 to-white/40 dark:from-[#0e2236]/80 dark:via-[#0a1a2b]/70 dark:to-[#071424]/80 border border-white/70 dark:border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm"
          >
            {/* Traits Gauges */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#136f97] dark:text-[#33a4d4]">
                <Bot className="w-4 h-4" />
                <span>Характеристики стиля «{currentSetting.name}»:</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-[0.7rem]">
                <div className="p-2 rounded-lg bg-white/80 dark:bg-[#0e2236]/80 border border-[#147aa6]/15">
                  <div className="flex justify-between text-[#5b7188] dark:text-[#7b8ea6] mb-1">
                    <span>Формальность:</span>
                    <strong className="text-[#0d1f36] dark:text-[#eaf3ff]">{currentSetting.traits.formality}%</strong>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-600 dark:bg-blue-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${currentSetting.traits.formality}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-white/80 dark:bg-[#0e2236]/80 border border-[#147aa6]/15">
                  <div className="flex justify-between text-[#5b7188] dark:text-[#7b8ea6] mb-1">
                    <span>Эмпатия:</span>
                    <strong className="text-[#0d1f36] dark:text-[#eaf3ff]">{currentSetting.traits.empathy}%</strong>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-600 dark:bg-emerald-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${currentSetting.traits.empathy}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-white/80 dark:bg-[#0e2236]/80 border border-[#147aa6]/15">
                  <div className="flex justify-between text-[#5b7188] dark:text-[#7b8ea6] mb-1">
                    <span>Лаконичность:</span>
                    <strong className="text-[#0d1f36] dark:text-[#eaf3ff]">{currentSetting.traits.conciseness}%</strong>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <motion.div 
                      className="h-full bg-amber-600 dark:bg-amber-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${currentSetting.traits.conciseness}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview Phrase */}
            <div className="flex-1 p-3 rounded-xl bg-white dark:bg-[#0e2236] border border-[#147aa6]/20 shadow-xs">
              <div className="flex items-center justify-between text-[0.68rem] text-[#5b7188] dark:text-[#7b8ea6] mb-1.5">
                <span className="font-semibold text-[#136f97] dark:text-[#33a4d4] flex items-center gap-1">
                  <MessageSquareQuote className="w-3.5 h-3.5" />
                  Пример формулировки ({currentSetting.name}):
                </span>
                <span className="text-[0.65rem] italic">Вопрос: «Сколько стоит монтаж 950 м²?»</span>
              </div>
              <p className="text-xs text-[#0d1f36] dark:text-[#eaf3ff] italic leading-relaxed">
                {currentSetting.samplePhrase}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="comparison-view"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="p-4 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-sm"
          >
            {/* Side-by-Side Comparison of all 3 Tones with Liquid Glass Styling */}
            <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-[#0d1f36] dark:text-[#eaf3ff] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#136f97] dark:text-[#33a4d4]" />
                  Как один и тот же ответ меняется в зависимости от выбранного тона:
                </span>
                <span className="text-[0.7rem] text-[#5b7188] dark:text-[#7b8ea6]">
                  Нажмите на стиль для активации
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {TONE_SETTINGS.map(tone => {
                  const isSelected = activeTone === tone.id;
                  return (
                    <motion.button
                      key={tone.id}
                      onClick={() => onToneChange(tone.id)}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-xl border text-xs text-left cursor-pointer transition-all backdrop-blur-md ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#136f97]/20 via-white to-white/80 dark:from-[#33a4d4]/25 dark:via-[#0e2236] dark:to-[#0e2236] border-[#136f97] dark:border-[#33a4d4] shadow-md hover:shadow-[0_8px_18px_-3px_rgba(19,111,151,0.25)] dark:hover:shadow-[0_8px_18px_-3px_rgba(51,164,212,0.25)]'
                          : 'bg-white/60 dark:bg-white/5 border-white/60 dark:border-white/10 hover:border-[#147aa6]/30 opacity-85 hover:opacity-100 hover:shadow-[0_6px_14px_-2px_rgba(19,111,151,0.15)] dark:hover:shadow-[0_6px_14px_-2px_rgba(51,164,212,0.15)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`font-bold flex items-center gap-1 ${
                          isSelected ? 'text-[#136f97] dark:text-[#33a4d4]' : 'text-[#0d1f36] dark:text-[#eaf3ff]'
                        }`}>
                          {getToneIcon(tone.id)}
                          {tone.name}
                        </span>
                        {isSelected && (
                          <span className="text-[0.62rem] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                            Активен
                          </span>
                        )}
                      </div>
                      <p className="text-[0.72rem] text-[#3a4d63] dark:text-[#b6c6da] italic leading-relaxed">
                        {tone.samplePhrase}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
