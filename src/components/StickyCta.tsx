import React, { useEffect, useState } from 'react';

interface StickyCtaProps {
  onOpenConsultation: () => void;
}

/**
 * Узкая панель внизу экрана. Страница длиной под сорок экранов: решение
 * созревает в середине, а кнопки рядом нет — приходится листать до конца.
 * Появляется после первого экрана, прячется у футера, чтобы не перекрывать его.
 */
export const StickyCta: React.FC<StickyCtaProps> = ({ onOpenConsultation }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const y = window.scrollY;
      const nearBottom =
        y + window.innerHeight > document.documentElement.scrollHeight - 900;
      setVisible(y > window.innerHeight * 0.9 && !nearBottom);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 z-40 transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      // inset-x-0 растягивал панель по документу (646px при экране 390)
      // и давал странице горизонтальную прокрутку. Ширину задаём явно.
      style={{ width: '100vw', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-hidden={!visible}
    >
      {/* Жидкое стекло: сквозь панель просвечивает страница, сверху блик
          кромки, под стеклом — тёплое пятно у кнопки. */}
      <div className="relative isolate mx-3 mb-3 overflow-hidden rounded-2xl border border-white/20 bg-[#0b1b2b]/60 p-2.5 shadow-[0_-10px_34px_rgba(6,16,28,.4)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/12 dark:bg-[#081422]/55">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-12 -z-10 h-40 w-40 rounded-full bg-gradient-to-br from-[#38bdf8]/35 via-[#136f97]/20 to-transparent blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/12 to-transparent"
        />
        <div className="relative flex items-center gap-2.5">
          <p className="min-w-0 flex-1 pl-1.5 text-[0.8125rem] leading-snug text-white/75">
            Разберём ваш процесс бесплатно
          </p>
          <button
            type="button"
            onClick={onOpenConsultation}
            tabIndex={visible ? 0 : -1}
            className="no-tap-pad shrink-0 rounded-xl bg-gradient-to-r from-[#136f97] to-[#38bdf8] px-5 py-3 text-[0.875rem] font-semibold text-white shadow-lg transition-transform active:scale-[.97]"
          >
            Обсудить задачу
          </button>
        </div>
      </div>
    </div>
  );
};
