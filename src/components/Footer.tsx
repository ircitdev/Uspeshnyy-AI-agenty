import React from 'react';
import { motion } from 'motion/react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#147aa6]/15 dark:border-white/10 py-8 bg-transparent">
      <div className="max-w-[1480px] mx-auto px-5 sm:px-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5b7188] dark:text-[#7b8ea6]">
        
        {/* Brand */}
        <motion.a 
          href="https://uspeshnyy.ru" 
          target="_blank" 
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02, x: 2 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 group text-[#0d1f36] dark:text-[#eaf3ff] font-bold cursor-pointer"
        >
          <img 
            src="https://storage.googleapis.com/uspeshnyy-projects/uspeshnyy.ru/pages/common/logo.svg" 
            alt="Успешный" 
            className="w-6 h-auto transition-transform group-hover:scale-105"
          />
          <span>Успешный <span className="font-normal text-[#5b7188] dark:text-[#7b8ea6]">· Системный подход к росту</span></span>
        </motion.a>

        {/* Center note */}
        <span className="text-center sm:text-left">
          Автоматизация. AI-агенты. Реальные результаты для бизнеса.
        </span>

        {/* Links */}
        <div className="flex items-center gap-3">
          <motion.a 
            href="https://blog.uspeshnyy.ru" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            className="px-2.5 py-1 rounded-lg hover:text-[#136f97] dark:hover:text-[#33a4d4] hover:bg-[#136f97]/10 dark:hover:bg-[#33a4d4]/10 transition-colors cursor-pointer"
          >
            Блог
          </motion.a>
          <motion.a 
            href="https://t.me/uspeshnyy?utm_source=agenty&utm_medium=cta&utm_campaign=ai_agents" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            className="px-2.5 py-1 rounded-lg hover:text-[#136f97] dark:hover:text-[#33a4d4] hover:bg-[#136f97]/10 dark:hover:bg-[#33a4d4]/10 transition-colors cursor-pointer"
          >
            Telegram
          </motion.a>
        </div>

      </div>
    </footer>
  );
};
