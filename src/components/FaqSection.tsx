import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQ_DATA } from '../data/agentsData';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';
import { RevealText } from './RevealText';
import { TextRevealMask } from './TextRevealMask';
import { AiGlossary } from './AiGlossary';

export const FaqSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaq = FAQ_DATA.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAccordion = (idx: number) => {
    setOpenIndex(prev => prev === idx ? null : idx);
  };

  return (
    <div className="bg-white/80 dark:bg-[#0e2236]/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#147aa6]/20 dark:border-white/10 shadow-lg" id="faq">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight">
            <RevealText text="Частые вопросы" as="span" />
          </h2>
          <TextRevealMask
            text="О безопасности, регламентах и работе моделей."
            className="text-xs sm:text-sm text-[#5b7188] dark:text-[#7b8ea6] mt-0.5"
            delay={0.2}
          />
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5b7188] dark:text-[#7b8ea6]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по вопросам..."
            className="w-full pl-8 pr-3 py-1.5 rounded-full text-xs bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/20 text-[#0d1f36] dark:text-[#eaf3ff] focus:outline-hidden focus:border-[#136f97]"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-2.5">
        {filteredFaq.length > 0 ? (
          filteredFaq.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/15 dark:border-white/10 overflow-hidden transition-all hover:border-[#136f97]/30 hover:shadow-[0_4px_14px_-2px_rgba(19,111,151,0.1)] dark:hover:shadow-[0_4px_14px_-2px_rgba(51,164,212,0.1)]"
              >
                <motion.button
                  onClick={() => toggleAccordion(idx)}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#0d1f36] dark:text-[#eaf3ff] hover:text-[#136f97] dark:hover:text-[#33a4d4] transition-colors cursor-pointer"
                >
                  <span className="leading-snug">{item.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 shrink-0 text-[#136f97] dark:text-[#33a4d4]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 shrink-0 text-[#5b7188] dark:text-[#7b8ea6]" />
                  )}
                </motion.button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 text-xs text-[#3a4d63] dark:text-[#b6c6da] leading-relaxed border-t border-[#147aa6]/10 dark:border-white/5 pt-2">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-xs text-[#5b7188] dark:text-[#7b8ea6]">
            По запросу «{searchQuery}» ничего не найдено. Напишите нам в Telegram — ответим лично за пару минут!
          </div>
        )}
      </div>

      {/* Interactive AI Glossary Component */}
      <AiGlossary />

    </div>
  );
};
