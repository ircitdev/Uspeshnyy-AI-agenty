import React from 'react';
import { motion } from 'motion/react';
import { Send, Bot, Check, ArrowRight } from 'lucide-react';
import { RevealText } from './RevealText';
import { TextRevealMask } from './TextRevealMask';

interface FinalCtaProps {
  onOpenConsultation: (topic?: string) => void;
  onOpenContactForm?: (topic?: string) => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onOpenConsultation, onOpenContactForm }) => {
  return (
    <section className="py-10 sm:py-16">
      <div className="max-w-[1480px] mx-auto px-5 sm:px-7">
        
        <div className="rounded-3xl p-6 pb-0 sm:p-10 sm:pb-0 bg-gradient-to-br from-[#136f97]/15 via-white/90 to-white/95 dark:from-[#33a4d4]/15 dark:via-[#0e2236] dark:to-[#0e2236] border-2 border-[#136f97]/30 dark:border-[#33a4d4]/30 shadow-2xl relative overflow-hidden">
          
          {/* items-stretch вместо items-center: иллюстрация стоит на нижней
              границе блока, а не висит по центру колонки. */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Illustration */}
            {/* На мобильном фото внизу блока и прижато к нижней кромке,
                поверх него ложится рукописная подпись. */}
            <div className="order-2 lg:order-1 lg:col-span-4 relative flex justify-center items-end self-end overflow-hidden -mb-6 sm:-mb-10 lg:mb-0">
              {/* Всплывают снизу: сначала фигуры, следом надпись за ними. */}
              <motion.img
                src="https://uspeshnyy.ru/assets/agenty3/start-robot2.webp"
                data-dark="https://uspeshnyy.ru/assets/agenty3/start-robot2-dark.webp"
                alt="AI-агент"
                loading="lazy"
                width={1200}
                height={1200}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 block w-full max-w-[510px] h-auto select-none align-bottom drop-shadow-xl"
              />
              <motion.img
                src="https://storage.googleapis.com/uspeshnyy-projects/uspeshnyy.ru/pages/agenty/note-final.webp"
                alt="Сначала понимаем задачу. Потом запускаем."
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 0.9, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ x: '-50%' }}
                className="lg:hidden pointer-events-none absolute z-0 bottom-[84%] left-1/2 w-[96%] max-w-[390px]"
              />
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2 lg:col-span-8 flex flex-col items-start pb-6 sm:pb-10">
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
                  <span>Написать в TG</span>
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
                  <span>Узнать, где теряются заявки</span>
                </motion.a>

                <motion.button
                  onClick={() => (onOpenContactForm || onOpenConsultation)('Заявка на аудит процесса')}
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

              {/* Рукописная подпись. На мобильном её показывает блок с фото
                  (наложением), здесь она нужна только на десктопе. */}
              <div className="hidden lg:block self-end">
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
