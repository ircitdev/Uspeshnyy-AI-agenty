import React, { useState, useEffect } from 'react';
import { Send, Sun, Moon, Monitor, ArrowUpRight, Menu, X } from 'lucide-react';
import { FullScreenMobileNav } from './FullScreenMobileNav';

interface HeaderProps {
  onOpenConsultation: (topic?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenConsultation }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    try {
      let saved = (localStorage.getItem('uspeshnyy-theme') as 'light' | 'dark' | 'auto') || 'light';
      setTheme(saved);
      applyTheme(saved);
    } catch {
      applyTheme('light');
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem('uspeshnyy-theme') === 'auto') {
          document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
          if (e.matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      } catch {}
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  const applyTheme = (mode: 'light' | 'dark' | 'auto') => {
    const root = document.documentElement;
    if (mode === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.dataset.theme = isDark ? 'dark' : 'light';
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else {
      root.dataset.theme = mode;
      if (mode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    try {
      localStorage.setItem('uspeshnyy-theme', newTheme);
    } catch {}
    applyTheme(newTheme);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
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
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      scrolled 
        ? 'bg-[#eef4fa]/90 dark:bg-[#030a14]/90 backdrop-blur-md border-b border-[#147aa6]/15 shadow-sm' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-[1480px] mx-auto px-5 sm:px-7 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <a 
          href="https://uspeshnyy.ru" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2.5 group text-[#0d1f36] dark:text-[#eaf3ff] font-bold text-base tracking-tight transition-transform hover:scale-[1.02]"
        >
          <img 
            src="https://storage.googleapis.com/uspeshnyy-projects/uspeshnyy.ru/pages/common/logo.svg" 
            alt="Успешный" 
            className="w-7 h-auto transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="leading-tight text-[1.05rem]">Успешный</span>
            <small className="hidden sm:block text-[0.66rem] font-medium text-[#5b7188] dark:text-[#7b8ea6] tracking-normal">
              Системный подход к росту
            </small>
          </div>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-5 text-[0.88rem] font-medium text-[#3a4d63] dark:text-[#b6c6da]">
          <a 
            href="#vs" 
            onClick={(e) => scrollToSection(e, '#vs')}
            className="px-2 py-1 rounded-lg hover:text-[#136f97] dark:hover:text-[#33a4d4] hover:bg-[#136f97]/5 dark:hover:bg-[#33a4d4]/10 transition-all"
          >
            Преимущества
          </a>
          <a 
            href="#agents" 
            onClick={(e) => scrollToSection(e, '#agents')}
            className="px-2 py-1 rounded-lg hover:text-[#136f97] dark:hover:text-[#33a4d4] hover:bg-[#136f97]/5 dark:hover:bg-[#33a4d4]/10 transition-all"
          >
            Агенты
          </a>
          <a 
            href="#simulator" 
            onClick={(e) => scrollToSection(e, '#simulator')}
            className="px-2.5 py-1 rounded-lg flex items-center gap-1.5 hover:text-[#136f97] dark:hover:text-[#33a4d4] hover:bg-[#136f97]/5 dark:hover:bg-[#33a4d4]/10 transition-all group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse group-hover:scale-125 transition-transform"></span>
            Симулятор
          </a>
          <a 
            href="#cases" 
            onClick={(e) => scrollToSection(e, '#cases')}
            className="px-2 py-1 rounded-lg hover:text-[#136f97] dark:hover:text-[#33a4d4] hover:bg-[#136f97]/5 dark:hover:bg-[#33a4d4]/10 transition-all"
          >
            Кейсы
          </a>
          <a 
            href="#calculator" 
            onClick={(e) => scrollToSection(e, '#calculator')}
            className="px-2 py-1 rounded-lg hover:text-[#136f97] dark:hover:text-[#33a4d4] hover:bg-[#136f97]/5 dark:hover:bg-[#33a4d4]/10 transition-all"
          >
            Калькулятор
          </a>
          <a 
            href="#readiness" 
            onClick={(e) => scrollToSection(e, '#readiness')}
            className="px-2 py-1 rounded-lg hover:text-[#136f97] dark:hover:text-[#33a4d4] hover:bg-[#136f97]/5 dark:hover:bg-[#33a4d4]/10 transition-all"
          >
            Тест
          </a>
          <a 
            href="#roadmap" 
            onClick={(e) => scrollToSection(e, '#roadmap')}
            className="px-2 py-1 rounded-lg hover:text-[#136f97] dark:hover:text-[#33a4d4] hover:bg-[#136f97]/5 dark:hover:bg-[#33a4d4]/10 transition-all"
          >
            Roadmap
          </a>
          <a 
            href="#price" 
            onClick={(e) => scrollToSection(e, '#price')}
            className="px-2 py-1 rounded-lg hover:text-[#136f97] dark:hover:text-[#33a4d4] hover:bg-[#136f97]/5 dark:hover:bg-[#33a4d4]/10 transition-all"
          >
            Цена
          </a>
          <a 
            href="#faq" 
            onClick={(e) => scrollToSection(e, '#faq')}
            className="px-2 py-1 rounded-lg hover:text-[#136f97] dark:hover:text-[#33a4d4] hover:bg-[#136f97]/5 dark:hover:bg-[#33a4d4]/10 transition-all"
          >
            FAQ
          </a>
        </nav>

        {/* Right actions: Theme + Telegram CTA */}
        <div className="flex items-center gap-3">
          {/* Theme toggler */}
          <div className="flex items-center p-1 rounded-full bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/20 dark:border-white/10 shadow-2xs">
            <button
              onClick={() => handleThemeChange('light')}
              aria-label="Светлая тема"
              title="Светлая тема"
              className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-90 ${
                theme === 'light' 
                  ? 'bg-white text-[#136f97] shadow-xs ring-1 ring-[#136f97]/20' 
                  : 'text-[#5b7188] hover:text-[#0d1f36] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              aria-label="Тёмная тема"
              title="Тёмная тема"
              className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-90 ${
                theme === 'dark' 
                  ? 'bg-[#0e2236] text-[#33a4d4] shadow-xs ring-1 ring-[#33a4d4]/30' 
                  : 'text-[#7b8ea6] hover:text-[#eaf3ff] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleThemeChange('auto')}
              aria-label="Системная тема"
              title="Системная тема (Авто)"
              className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-90 ${
                theme === 'auto' 
                  ? 'bg-white dark:bg-[#0e2236] text-[#136f97] dark:text-[#33a4d4] shadow-xs' 
                  : 'text-[#5b7188] hover:text-[#0d1f36] dark:hover:text-[#eaf3ff] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          {/* Quick CTA */}
          <button
            onClick={() => onOpenConsultation('Разобрать мой процесс')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-[0.88rem] font-bold rounded-full text-white bg-gradient-to-b from-[#157ba4] to-[#136f97] dark:from-[#46b6e4] dark:to-[#33a4d4] dark:text-[#04121f] shadow-md hover:shadow-[0_10px_25px_-5px_rgba(19,111,151,0.4)] dark:hover:shadow-[0_10px_25px_-5px_rgba(51,164,212,0.35)] hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            <span>Обсудить</span>
          </button>

          <a 
            href="https://t.me/uspeshnyy" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Написать в Telegram"
            className="p-2 sm:hidden rounded-full bg-[#136f97] text-white dark:bg-[#33a4d4] dark:text-[#04121f] hover:scale-110 hover:shadow-[0_8px_20px_-4px_rgba(19,111,151,0.4)] transition-all active:scale-90 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </a>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#0d1f36] dark:text-[#eaf3ff] hover:bg-black/5 dark:hover:bg-white/5 hover:scale-105 active:scale-95 transition-all"
            aria-label="Меню"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Fullscreen Mobile Navigation (Immersive 21st style) */}
      <FullScreenMobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        theme={theme}
        onThemeChange={handleThemeChange}
        onOpenConsultation={onOpenConsultation}
      />
    </header>
  );
};
