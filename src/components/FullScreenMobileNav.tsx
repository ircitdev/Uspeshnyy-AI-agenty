import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowUpRight, 
  Send, 
  Sun, 
  Moon, 
  Monitor, 
  Sparkles, 
  Bot, 
  CheckCircle2, 
  PhoneCall,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface FullScreenMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark' | 'auto';
  onThemeChange: (theme: 'light' | 'dark' | 'auto') => void;
  onOpenConsultation: (topic?: string) => void;
}

interface NavItem {
  id: string;
  num: string;
  label: string;
  href: string;
  tag?: string;
  isAccent?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'vs', num: '01', label: 'Преимущества', href: '#vs' },
  { id: 'agents', num: '02', label: 'Агенты', href: '#agents', tag: '5 моделей' },
  { id: 'simulator', num: '03', label: 'Симулятор', href: '#simulator', tag: 'Live Demo', isAccent: true },
  { id: 'cases', num: '04', label: 'Кейсы', href: '#cases', tag: '+48% выручки' },
  { id: 'calculator', num: '05', label: 'Калькулятор', href: '#calculator', tag: 'ROI' },
  { id: 'readiness', num: '06', label: 'Тест', href: '#readiness', tag: '2 мин' },
  { id: 'roadmap', num: '07', label: 'Roadmap', href: '#roadmap' },
  { id: 'price', num: '08', label: 'Цена', href: '#price', tag: 'от 60k' },
  { id: 'faq', num: '09', label: 'FAQ', href: '#faq' },
];

export const FullScreenMobileNav: React.FC<FullScreenMobileNavProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  onOpenConsultation,
}) => {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 75;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      try {
        window.history.pushState(null, '', href);
      } catch {}
    }
  };

  const handleCtaClick = () => {
    onClose();
    onOpenConsultation('Мобильное меню: Запрос на разбор');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Навигационное меню"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[#eef4fa]/98 dark:bg-[#030913]/98 backdrop-blur-3xl overflow-y-auto"
        >
          {/* Ambient organic background glows */}
          <div 
            aria-hidden="true" 
            className="pointer-events-none fixed top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-[#136f97]/20 via-[#38bdf8]/15 to-transparent blur-3xl opacity-75 dark:opacity-40" 
          />
          <div 
            aria-hidden="true" 
            className="pointer-events-none fixed bottom-0 left-0 w-96 h-96 rounded-full bg-gradient-to-tr from-[#10b981]/20 via-[#136f97]/15 to-transparent blur-3xl opacity-60 dark:opacity-30" 
          />

          {/* Top Bar Header */}
          <div className="relative z-10 sticky top-0 px-6 py-4 flex items-center justify-between border-b border-[#147aa6]/15 dark:border-white/10 bg-[#eef4fa]/80 dark:bg-[#030913]/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#136f97] to-[#0ea5e9] flex items-center justify-center text-white font-black text-sm shadow-sm">
                AI
              </div>
              <div>
                <span className="font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] text-base tracking-tight block">
                  Успешный
                </span>
                <span className="text-[0.65rem] font-semibold text-[#136f97] dark:text-[#38bdf8] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Инженерный хаб
                </span>
              </div>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 dark:bg-[#0e2236]/80 border border-[#147aa6]/20 dark:border-white/10 text-[#0d1f36] dark:text-[#eaf3ff] shadow-sm cursor-pointer"
              aria-label="Закрыть меню"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Scrollable Navigation List */}
          <div className="relative z-10 flex-1 px-6 py-6 flex flex-col justify-between">
            <nav className="space-y-1">
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.035, duration: 0.25 }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={`group flex items-center justify-between py-3 px-3.5 rounded-2xl transition-all duration-200 ${
                      item.isAccent
                        ? 'bg-[#136f97]/10 dark:bg-[#38bdf8]/15 border border-[#136f97]/25 dark:border-[#38bdf8]/30 shadow-xs'
                        : 'hover:bg-white/60 dark:hover:bg-white/5 active:scale-98'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-xs font-mono font-bold text-[#5b7188] dark:text-[#7b8ea6]">
                        {item.num}
                      </span>
                      <span className={`text-lg sm:text-xl font-black tracking-tight transition-colors ${
                        item.isAccent 
                          ? 'text-[#136f97] dark:text-[#38bdf8]' 
                          : 'text-[#0d1f36] dark:text-[#eaf3ff] group-hover:text-[#136f97] dark:group-hover:text-[#38bdf8]'
                      }`}>
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.tag && (
                        <span className={`text-[0.68rem] font-bold px-2 py-0.5 rounded-full ${
                          item.isAccent
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 flex items-center gap-1'
                            : 'bg-black/5 dark:bg-white/10 text-[#5b7188] dark:text-[#7b8ea6]'
                        }`}>
                          {item.isAccent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                          {item.tag}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-[#5b7188] group-hover:text-[#136f97] dark:group-hover:text-[#38bdf8] group-hover:translate-x-1 transition-all" />
                    </div>
                  </a>
                </motion.div>
              ))}
            </nav>

            {/* Bottom Actions & Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="mt-8 pt-6 border-t border-[#147aa6]/15 dark:border-white/10 space-y-4"
            >
              {/* Main CTA button */}
              <button
                type="button"
                onClick={handleCtaClick}
                className="w-full py-3.5 px-6 rounded-full font-black text-sm tracking-wide text-white bg-gradient-to-r from-[#136f97] via-[#157ba4] to-[#0ea5e9] dark:from-[#38bdf8] dark:to-[#0284c7] dark:text-[#04121f] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
              >
                <span>Обсудить проект</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {/* Secondary Telegram action */}
              <a
                href="https://t.me/uspeshnyy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-full font-bold text-xs flex items-center justify-center gap-2 bg-white/70 dark:bg-[#0e2236]/70 border border-[#147aa6]/20 dark:border-white/15 text-[#136f97] dark:text-[#38bdf8] shadow-xs hover:scale-101 active:scale-98 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Написать архитектору в Telegram</span>
              </a>

              {/* Theme Selector */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/50 dark:bg-[#09182a]/50 border border-[#147aa6]/15 dark:border-white/10">
                <span className="text-xs font-bold text-[#5b7188] dark:text-[#7b8ea6]">
                  Оформление:
                </span>
                
                <div className="flex items-center gap-1 p-1 rounded-xl bg-white/80 dark:bg-[#0e2236] border border-[#147aa6]/20 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => onThemeChange('light')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-[#136f97] text-white shadow-xs'
                        : 'text-[#5b7188] hover:text-[#0d1f36] dark:text-[#7b8ea6]'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Светлая</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onThemeChange('dark')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#38bdf8] text-[#04121f] shadow-xs'
                        : 'text-[#5b7188] hover:text-[#0d1f36] dark:text-[#7b8ea6]'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Тёмная</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onThemeChange('auto')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      theme === 'auto'
                        ? 'bg-[#136f97]/15 text-[#136f97] dark:text-[#38bdf8]'
                        : 'text-[#5b7188] hover:text-[#0d1f36] dark:text-[#7b8ea6]'
                    }`}
                    title="Автоматически"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Service guarantee note */}
              <div className="flex items-center justify-center gap-2 text-[0.7rem] text-[#5b7188] dark:text-[#7b8ea6]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>NDA до первого звонка • Финансовая гарантия KPI</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
