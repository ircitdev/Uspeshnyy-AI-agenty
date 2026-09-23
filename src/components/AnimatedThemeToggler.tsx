import React, { useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Переключатель темы с круговым раскрытием из точки нажатия
 * (по мотивам AnimatedThemeToggler, 21st.dev/@arunachalam).
 *
 * Тремя кнопками «светлая / тёмная / авто» шапка была перегружена и на
 * мобильном вытесняла название бренда. Здесь одна кнопка: тап меняет тему,
 * долгое нажатие возвращает системную.
 *
 * View Transitions есть не везде — там, где API нет, тема просто
 * переключается мгновенно, без анимации.
 */

interface AnimatedThemeTogglerProps {
  isDark: boolean;
  onChange: (mode: 'light' | 'dark' | 'auto') => void;
  className?: string;
}

type DocumentWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export const AnimatedThemeToggler: React.FC<AnimatedThemeTogglerProps> = ({
  isDark,
  onChange,
  className = '',
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const longPress = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  const reveal = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;
    const { left, top, width, height } = btn.getBoundingClientRect();
    const cx = left + width / 2;
    const cy = top + height / 2;
    const radius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    );
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${cx}px ${cy}px)`,
          `circle(${radius}px at ${cx}px ${cy}px)`,
        ],
      },
      { duration: 620, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
    );
  }, []);

  const toggle = useCallback(async () => {
    if (longPress.current) {
      longPress.current = false;
      return;
    }
    const next: 'light' | 'dark' = isDark ? 'light' : 'dark';
    const doc = document as DocumentWithVT;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!doc.startViewTransition || reduced) {
      onChange(next);
      return;
    }
    // flushSync: переход снимает снимок сразу после колбэка, поэтому смена
    // темы должна примениться синхронно, а не в следующем рендере React.
    await doc.startViewTransition(() => {
      flushSync(() => onChange(next));
    }).ready;
    reveal();
  }, [isDark, onChange, reveal]);

  const startHold = () => {
    timer.current = window.setTimeout(() => {
      longPress.current = true;
      onChange('auto');
    }, 550);
  };
  const endHold = () => {
    if (timer.current) window.clearTimeout(timer.current);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggle}
      onPointerDown={startHold}
      onPointerUp={endHold}
      onPointerLeave={endHold}
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      title="Сменить тему · удержание — системная"
      className={`relative flex h-9 w-9 items-center justify-center rounded-full border border-[#147aa6]/20 bg-[#f6f9fc] text-[#136f97] transition-colors hover:bg-white dark:border-white/10 dark:bg-[#09182a] dark:text-[#33a4d4] dark:hover:bg-[#0e2236] ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, scale: 0.55, rotate: 25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.55, rotate: -25 }}
            transition={{ duration: 0.28 }}
            className="flex"
          >
            <Sun className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, scale: 0.55, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.55, rotate: 25 }}
            transition={{ duration: 0.28 }}
            className="flex"
          >
            <Moon className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};
