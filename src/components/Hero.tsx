import React, { useState } from 'react';
import { ArrowRight, Play, Zap, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { GlassmorphismCta } from './GlassmorphismCta';
import { RevealText } from './RevealText';
import { TextRevealMask } from './TextRevealMask';
import { ParticleDrift } from './ParticleDrift';

interface HeroProps {
  onOpenConsultation: (topic?: string) => void;
  onScrollToSimulator: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenConsultation, onScrollToSimulator }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 overflow-hidden">
      {/* Meng To Particle Drift Animated Background (Light & Dark theme aware) */}
      <ParticleDrift />

      <div className="max-w-[1480px] mx-auto px-5 sm:px-7 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col z-10">
            {/* Kicker Tag */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full text-[0.72rem] font-bold tracking-wider uppercase text-[#136f97] dark:text-[#33a4d4] bg-[#136f97]/10 dark:bg-[#33a4d4]/15 border border-[#136f97]/25 mb-5">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Автоматизация · AI · Реальные результаты</span>
            </div>

            {/* Main Title with RevealText animation */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] leading-[1.06] tracking-tight mb-4">
              <RevealText 
                text="AI-агенты для бизнеса" 
                as="span" 
                className="text-3xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-[#0d1f36] dark:text-[#eaf3ff]" 
              />
              <span className="block mt-2">
                <RevealText 
                  text="от 60 000 ₽" 
                  as="span" 
                  delay={0.25}
                  className="text-2xl sm:text-4xl text-[#136f97] dark:text-[#33a4d4] font-bold" 
                />
              </span>
            </h1>

            {/* Lead description with TextRevealMask */}
            <div className="mb-8 max-w-[48ch]">
              <TextRevealMask
                text="Отдайте AI повторяющиеся задачи: заявки, звонки, переписку и отчеты. Агенты работают в ваших системах, принимают решения по вашим регламентам и доводят клиента до результата."
                className="text-base sm:text-lg text-[#3a4d63] dark:text-[#b6c6da] leading-relaxed"
                delay={0.3}
              />
            </div>

            {/* Action Buttons: Sequentially appears after robot entrance */}
            <motion.div 
              initial={{ opacity: 0, y: 22, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <GlassmorphismCta
                  onClick={() => onOpenConsultation('Аудит процессов и подбор агента')}
                >
                  Разобрать мой процесс
                </GlassmorphismCta>
              </motion.div>

              <motion.button
                onClick={onScrollToSimulator}
                whileHover={{ scale: 1.035, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-[0.95rem] text-[#136f97] dark:text-[#33a4d4] bg-white/80 dark:bg-[#0e2236]/80 border border-[#147aa6]/25 dark:border-[#33a4d4]/30 hover:bg-[#136f97]/10 hover:border-[#136f97]/40 shadow-xs hover:shadow-[0_10px_25px_-5px_rgba(19,111,151,0.25)] dark:hover:shadow-[0_10px_25px_-5px_rgba(51,164,212,0.2)] transition-all cursor-pointer group"
              >
                <Play className="w-4 h-4 fill-current text-[#136f97] dark:text-[#33a4d4] group-hover:scale-110 transition-transform" />
                <span>Протестировать вживую</span>
              </motion.button>
            </motion.div>

            {/* Key Business Facts: Staggered entrance after buttons and robot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#147aa6]/15 dark:border-white/10">
              <motion.div 
                initial={{ opacity: 0, y: 24, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: 1.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="flex items-center gap-3 p-3 rounded-2xl transition-all hover:bg-black/[0.03] dark:hover:bg-white/[0.03] border border-transparent hover:border-[#147aa6]/20 shadow-2xs hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-[#136f97]/10 dark:bg-[#33a4d4]/15 flex items-center justify-center text-[#136f97] dark:text-[#33a4d4] shadow-2xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-xs sm:text-[0.84rem]">
                  <strong className="block text-[#0d1f36] dark:text-[#eaf3ff] font-bold leading-tight">Запуск</strong>
                  <span className="text-[#5b7188] dark:text-[#7b8ea6]">от 1–2 недель</span>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 24, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: 1.72, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="flex items-center gap-3 p-3 rounded-2xl transition-all hover:bg-black/[0.03] dark:hover:bg-white/[0.03] border border-transparent hover:border-[#147aa6]/20 shadow-2xs hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-[#136f97]/10 dark:bg-[#33a4d4]/15 flex items-center justify-center text-[#136f97] dark:text-[#33a4d4] shadow-2xs">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-xs sm:text-[0.84rem]">
                  <strong className="block text-[#0d1f36] dark:text-[#eaf3ff] font-bold leading-tight">От 60 000 ₽</strong>
                  <span className="text-[#5b7188] dark:text-[#7b8ea6]">за готового агента</span>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 24, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: 1.89, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="flex items-center gap-3 p-3 rounded-2xl transition-all hover:bg-black/[0.03] dark:hover:bg-white/[0.03] border border-transparent hover:border-[#147aa6]/20 shadow-2xs hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-[#136f97]/10 dark:bg-[#33a4d4]/15 flex items-center justify-center text-[#136f97] dark:text-[#33a4d4] shadow-2xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-xs sm:text-[0.84rem]">
                  <strong className="block text-[#0d1f36] dark:text-[#eaf3ff] font-bold leading-tight">Интеграция</strong>
                  <span className="text-[#5b7188] dark:text-[#7b8ea6]">в ваши CRM и чаты</span>
                </div>
              </motion.div>
            </div>

          </div>

          {/* Right Column: Dynamic Parallax Robot & System Composition */}
          <div 
            className="lg:col-span-6 xl:col-span-6 relative aspect-square sm:aspect-[4/3] lg:aspect-square flex items-center justify-center select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Ambient Back Glow with subtle breathing */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ 
                opacity: [0.35, 0.7, 0.35],
                scale: [0.95, 1.05, 0.95]
              }}
              transition={{
                opacity: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 },
                scale: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }
              }}
              className="absolute inset-0 bg-radial from-[#136f97]/25 dark:from-[#33a4d4]/30 via-transparent to-transparent blur-3xl pointer-events-none"
            />

            {/* Layer 1: Services orbit card (floating top-left, reveals after robot) */}
            <div 
              className="absolute left-[2%] top-[12%] w-[42%] max-w-[210px] z-10 pointer-events-none"
              style={{
                transform: `translate3d(${mousePos.x * -16}px, ${mousePos.y * -12}px, 0)`,
                transition: 'transform 0.3s ease-out'
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.72, x: -35, y: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{ duration: 0.75, delay: 0.65, ease: [0.2, 0.9, 0.3, 1] }}
              >
                {/* Continuous Smooth Levitation */}
                <motion.div
                  animate={{ 
                    y: [-7, 8, -7],
                    rotate: [-1.2, 1.2, -1.2]
                  }}
                  transition={{ 
                    duration: 5.6, 
                    repeat: Infinity, 
                    ease: 'easeInOut'
                  }}
                >
                  <img 
                    src="https://storage.googleapis.com/uspeshnyy-projects/uspeshnyy.ru/pages/agenty/hx-services.webp" 
                    alt="Сервисы и CRM"
                    className="w-full h-auto drop-shadow-xl"
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Layer 2: Task card (floating right, reveals after window 1) */}
            <div 
              className="absolute right-[2%] top-[30%] w-[44%] max-w-[230px] z-10 pointer-events-none"
              style={{
                transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 16}px, 0)`,
                transition: 'transform 0.3s ease-out'
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.72, x: 35, y: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{ duration: 0.75, delay: 0.88, ease: [0.2, 0.9, 0.3, 1] }}
              >
                {/* Continuous Smooth Levitation */}
                <motion.div
                  animate={{ 
                    y: [8, -7, 8],
                    rotate: [1, -1, 1]
                  }}
                  transition={{ 
                    duration: 5.0, 
                    repeat: Infinity, 
                    ease: 'easeInOut'
                  }}
                >
                  <img 
                    src="https://storage.googleapis.com/uspeshnyy-projects/uspeshnyy.ru/pages/agenty/hx-task.webp" 
                    alt="Карточка задачи"
                    className="w-full h-auto drop-shadow-xl"
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Layer 3: Central Robot (Reveals first in sequence) */}
            <div 
              className="relative w-[70%] max-w-[380px] z-20 pointer-events-none"
              style={{
                transform: `translate3d(${mousePos.x * 10}px, ${mousePos.y * 8}px, 0)`,
                transition: 'transform 0.3s ease-out'
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.76, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Continuous Smooth Levitation */}
                <motion.div
                  animate={{ 
                    y: [-9, 9, -9],
                    rotate: [-0.6, 0.6, -0.6]
                  }}
                  transition={{ 
                    duration: 4.8, 
                    repeat: Infinity, 
                    ease: 'easeInOut'
                  }}
                >
                  <img 
                    src="https://storage.googleapis.com/uspeshnyy-projects/uspeshnyy.ru/pages/agenty/hx-bot.webp" 
                    alt="AI-агент Успешный"
                    className="w-full h-auto drop-shadow-2xl"
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Layer 4: Handwritten Remark ("Больше возможностей для вашего бизнеса", reveals after windows) */}
            <div 
              className="absolute left-[6%] bottom-[4%] w-[52%] max-w-[280px] z-30 pointer-events-none"
              style={{
                transform: `translate3d(${mousePos.x * -24}px, ${mousePos.y * -18}px, 0)`,
                transition: 'transform 0.3s ease-out'
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 25, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.75, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Continuous Smooth Levitation */}
                <motion.div
                  animate={{ 
                    y: [-5, 6, -5],
                    rotate: [-0.8, 0.8, -0.8]
                  }}
                  transition={{ 
                    duration: 4.4, 
                    repeat: Infinity, 
                    ease: 'easeInOut'
                  }}
                >
                  <img 
                    src="https://storage.googleapis.com/uspeshnyy-projects/uspeshnyy.ru/pages/agenty/hx-note.webp" 
                    alt="Больше возможностей для вашего бизнеса"
                    className="w-full h-auto drop-shadow-md"
                  />
                </motion.div>
              </motion.div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
