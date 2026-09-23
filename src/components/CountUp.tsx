import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  /** Конечное значение, до которого крутим. */
  to: number;
  /** Длительность накрутки в секундах. */
  duration?: number;
  /** Задержка перед стартом в секундах. */
  delay?: number;
  className?: string;
  /** Текст перед числом, например «от». Не анимируется. */
  prefix?: string;
  /** Текст после числа, например «₽». Не анимируется. */
  suffix?: string;
}

/**
 * Накрутка числа от нуля до конечного значения.
 *
 * Считаем на requestAnimationFrame по реальному времени, а не по числу
 * кадров: на 120-герцевом экране счёт по кадрам прошёл бы вдвое быстрее,
 * чем задумано.
 *
 * Замедление к концу (ease-out кубический) — цифры быстро набирают
 * порядок и мягко останавливаются на итоговом значении. Линейная
 * накрутка читается механически.
 *
 * Ширину держим табличными цифрами: у пропорционального шрифта единица
 * уже остальных цифр, и строка дёргалась бы на каждом шаге.
 */
export const CountUp: React.FC<CountUpProps> = ({
  to,
  duration = 1.6,
  delay = 0,
  className = '',
  prefix,
  suffix,
}) => {
  const hostRef = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Человек не должен пропустить накрутку: запускаем, когда число
    // появилось в экране, а не при загрузке страницы.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setValue(to);
      return;
    }

    let raf = 0;
    let timer = 0;

    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      timer = window.setTimeout(() => {
        const startedAt = performance.now();
        const tick = () => {
          const k = Math.min(1, (performance.now() - startedAt) / (duration * 1000));
          // Кубический ease-out: быстрый разгон, мягкая остановка.
          const eased = 1 - Math.pow(1 - k, 3);
          setValue(Math.round(to * eased));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      }, delay * 1000);
    };

    const io = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { rootMargin: '-40px' }
    );
    io.observe(host);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [to, duration, delay]);

  return (
    <span ref={hostRef} className={className}>
      {prefix ? `${prefix} ` : ''}
      {/* Неразрывные пробелы в разрядах: «60 000 ₽» не должно
          переноситься по частям. */}
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        {value.toLocaleString('ru-RU').replace(/\s/g, ' ')}
      </span>
      {suffix ? ` ${suffix}` : ''}
    </span>
  );
};

export default CountUp;
