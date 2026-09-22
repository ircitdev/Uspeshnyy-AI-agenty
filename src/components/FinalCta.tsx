import React from 'react';
import { motion } from 'motion/react';
import { Send, Bot, Check, ArrowRight } from 'lucide-react';
import { RevealText } from './RevealText';
import { TextRevealMask } from './TextRevealMask';

interface FinalCtaProps {
  onOpenConsultation: (topic?: string) => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onOpenConsultation }) => {
  return (
    <section className="py-10 sm:py-16">
      <div className="max-w-[1480px] mx-auto px-5 sm:px-7">
        
        <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#136f97]/15 via-white/90 to-white/95 dark:from-[#33a4d4]/15 dark:via-[#0e2236] dark:to-[#0e2236] border-2 border-[#136f97]/30 dark:border-[#33a4d4]/30 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Illustration */}
            <div className="lg:col-span-4 flex justify-center">
              <motion.img 
                src="https://storage.googleapis.com/uspeshnyy-projects/uspeshnyy.ru/pages/agenty/final-light.webp" 
                alt="AI-агент за ноутбуком"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-[320px] h-auto drop-shadow-xl rounded-2xl"
              />
            </div>

            {/* Content */}
            <div className="lg:col-span-8 flex flex-col items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-[#136f97] dark:text-[#33a4d4] mb-2">
                С чего начать
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight mb-3">
                <RevealText text="Разберём ваш процесс за 30–40 минут" as="span" />
              </h2>
              <TextRevealMask
                text="Напишите в Telegram или оставьте заявку — посмотрим ваши входящие каналы, найдем точки потери клиентов и честно скажем, окупятся ли AI-агенты в вашем случае."
                className="text-sm sm:text-base text-[#3a4d63] dark:text-[#b6c6da] leading-relaxed max-w-2xl mb-6"
                delay={0.2}
              />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-6 w-full sm:w-auto">
                <motion.a 
                  href="https://t.me/uspeshnyy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-b from-[#157ba4] to-[#136f97] dark:from-[#46b6e4] dark:to-[#33a4d4] dark:text-[#04121f] shadow-lg hover:shadow-[0_10px_25px_-5px_rgba(19,111,151,0.4)] dark:hover:shadow-[0_10px_25px_-5px_rgba(51,164,212,0.35)] transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Написать в Telegram лично</span>
                </motion.a>

                <motion.a 
                  href="https://t.me/uspeshnyybot?start=forms-agenty" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm text-[#136f97] dark:text-[#33a4d4] bg-white dark:bg-[#0e2236] border border-[#147aa6]/30 hover:bg-[#136f97]/10 hover:shadow-[0_8px_20px_-4px_rgba(19,111,151,0.2)] dark:hover:shadow-[0_8px_20px_-4px_rgba(51,164,212,0.2)] transition-all cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  <span>Проверить, где теряются заявки (Бот-аудит)</span>
                </motion.a>

                <motion.button
                  onClick={() => onOpenConsultation('Заявка на аудит процесса')}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  className="text-xs font-bold text-[#5b7188] dark:text-[#7b8ea6] hover:text-[#136f97] dark:hover:text-[#33a4d4] text-center sm:text-left underline underline-offset-4 cursor-pointer transition-colors"
                >
                  Или оставить заявку на звонок
                </motion.button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 sm:gap-6 text-xs text-[#5b7188] dark:text-[#7b8ea6] mb-6">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Без скучных презентаций
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Можно прийти без готового ТЗ
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Честный аудит: иногда AI не нужен
                </span>
              </div>

              {/* Handwritten Note Art */}
              <div className="self-end">
                <img 
                  src="https://storage.googleapis.com/uspeshnyy-projects/uspeshnyy.ru/pages/agenty/note-final.webp" 
                  alt="Сначала понимаем задачу. Потом запускаем."
                  className="w-full max-w-[260px] h-auto drop-shadow-sm"
                />
              </div>

            </div>

          </div>

        </div>

        {/* Footer Article Link */}
        <p className="text-center text-xs text-[#5b7188] dark:text-[#7b8ea6] mt-6">
          Кейсы проектов — в{' '}
          <a 
            href="https://blog.uspeshnyy.ru/rubriki/keysy/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#136f97] dark:text-[#33a4d4] underline hover:no-underline font-semibold"
          >
            блоге
          </a>
          . Там же подробно о том,{' '}
          <a 
            href="https://blog.uspeshnyy.ru/blog/agentnye-sistemy-v-prodakshene-chto-rabotaet-bez-cheloveka-a/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#136f97] dark:text-[#33a4d4] underline hover:no-underline font-semibold"
          >
            что агенты реально делают без человека, а что пока миф
          </a>
          .
        </p>

      </div>
    </section>
  );
};
