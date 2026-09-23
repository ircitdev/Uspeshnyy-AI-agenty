import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Появление блоков и элементов при прокрутке на GSAP ScrollTrigger.
 *
 * Раньше это делал самодельный IntersectionObserver с CSS-переходами: он не
 * умел каскад внутри группы, спорил с transform от motion и оставлял элементы
 * невидимыми, когда браузер душил таймеры в фоновой вкладке. ScrollTrigger.batch
 * собирает вошедшие в экран элементы в пачки и анимирует их одной лентой.
 *
 * Разметку компонентов не трогаем: цели берём селекторами, как и прежде.
 */

// Крупные блоки — плавный подъём; мелочь внутри — короткий каскад.
const BLOCK_TARGETS = [
  'section > div > div[class*="rounded-3xl"]',
  'section h2',
].join(',');

const ITEM_TARGETS = [
  '.grid > div',
  'ul > li',
  'section h3',
].join(',');

type Cleanup = () => void;

function animate(selector: string, opts: { y: number; stagger: number; duration: number }): Cleanup {
  const seen = new WeakSet<Element>();
  const collect = () =>
    gsap.utils.toArray<HTMLElement>(selector).filter(el => {
      if (seen.has(el)) return false;
      // Шапку, модалки и прелоадер не трогаем: они живут своей жизнью.
      if (el.closest('header, [role="dialog"], #loader')) return false;
      // Элемент, который уже анимирует motion, пропускаем — два transform
      // складывались и выносили блок за край экрана.
      if (el.style.transform || el.style.opacity) return false;
      seen.add(el);
      return true;
    });

  const triggers: ScrollTrigger[] = [];

  const run = () => {
    const els = collect();
    if (!els.length) return;
    gsap.set(els, { opacity: 0, y: opts.y });
    const batched = ScrollTrigger.batch(els, {
      start: 'top 92%',
      once: true,
      onEnter: batch =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: opts.duration,
          stagger: opts.stagger,
          ease: 'power3.out',
          overwrite: true,
          // will-change снимаем сразу после анимации: слой композитора
          // нужен только на время движения.
          onComplete: () => gsap.set(batch, { clearProps: 'willChange' }),
        }),
    });
    triggers.push(...batched);
  };

  run();
  // Ленивые секции и раскрытые карточки появляются позже — подхватываем их.
  const rescan = window.setInterval(run, 1500);

  return () => {
    window.clearInterval(rescan);
    triggers.forEach(t => t.kill());
  };
}

export function useScrollAnimations(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    // Уважаем системную настройку: без движения просто ничего не прячем.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const stopBlocks = animate(BLOCK_TARGETS, { y: 26, stagger: 0.08, duration: 0.7 });
      const stopItems = animate(ITEM_TARGETS, { y: 16, stagger: 0.06, duration: 0.55 });
      return () => {
        stopBlocks();
        stopItems();
      };
    });

    return () => ctx.revert();
  }, [enabled]);
}

/**
 * Тёмные варианты картинок. У элемента с data-dark подменяем src по теме:
 * так одна разметка обслуживает обе темы без дублирования блоков.
 */
export function useThemedImages() {
  useEffect(() => {
    const swap = () => {
      const dark =
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark';
      document.querySelectorAll<HTMLImageElement>('img[data-dark]').forEach(img => {
        const darkSrc = img.dataset.dark;
        if (!darkSrc) return;
        if (!img.dataset.light) img.dataset.light = img.src;
        const next = dark ? darkSrc : img.dataset.light;
        if (next && img.src !== next) img.src = next;
      });
    };
    swap();
    const mo = new MutationObserver(swap);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    // Ленивые секции появляются позже — подхватываем их картинки.
    const rescan = window.setInterval(swap, 1500);
    return () => {
      mo.disconnect();
      window.clearInterval(rescan);
    };
  }, []);
}
