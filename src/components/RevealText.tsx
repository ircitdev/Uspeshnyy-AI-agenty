import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface RevealTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
  delay?: number;
  duration?: number;
  stagger?: number;
  blur?: boolean;
  once?: boolean;
  /**
   * Появление по буквам вместо слов. Волна по символам читается эффектнее,
   * но на длинной фразе тянется слишком долго, поэтому включается точечно —
   * в hero, где заголовок короткий и держит на себе первый экран.
   */
  byChar?: boolean;
}

/**
 * Появление текста снизу вверх.
 *
 * По умолчанию едут слова — так длинный заголовок отыгрывает за
 * разумное время. С `byChar` едут отдельные буквы: строка наливается
 * слева направо волной.
 *
 * Посимвольный режим сделан на CSS-анимации, а не на motion: в заголовке
 * это десятки узлов сразу, и отдать их композитору дешевле, чем считать
 * каждый кадр в JS. Задержка буквы берётся из её номера через переменную
 * `--index`.
 *
 * Пробелы в обоих режимах остаются обычными текстовыми узлами между
 * обёртками — строка переносится по словам, а не рвётся по буквам.
 */
export const RevealText: React.FC<RevealTextProps> = ({
  text,
  className = '',
  as: Component = 'h2',
  delay = 0.05,
  duration = 0.6,
  stagger = 0.06,
  blur = true,
  once = true,
  byChar = false,
}) => {
  const words = text.split(' ');

  // ── Посимвольный режим ──────────────────────────────────────────────
  const hostRef = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!byChar) return;
    const host = hostRef.current;
    if (!host) return;
    // Заголовок не должен отыграть до того, как читатель до него дошёл.
    const io = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { rootMargin: '-40px' }
    );
    io.observe(host);
    return () => io.disconnect();
  }, [byChar, once]);

  if (byChar) {
    // Нумерация букв сквозная через всю строку — иначе волна
    // перезапускалась бы на каждом слове.
    let charIndex = 0;
    // Буквы едут чаще слов: тот же шаг на символах читался бы как задержка.
    const charStagger = stagger / 2;

    return (
      <Component
        ref={hostRef as React.Ref<never>}
        className={`reveal-text ${shown ? 'is-shown' : ''} ${className}`}
        style={
          {
            '--reveal-duration': `${duration}s`,
            '--reveal-delay': `${delay}s`,
            '--reveal-stagger': `${charStagger}s`,
            '--reveal-blur': blur ? '8px' : '0px',
          } as React.CSSProperties
        }
      >
        {words.map((word, wordIdx) => (
          <React.Fragment key={wordIdx}>
            {wordIdx > 0 && ' '}
            <span className="reveal-word">
              {Array.from(word).map(char => {
                const i = charIndex;
                charIndex += 1;
                return (
                  <span
                    key={i}
                    className="reveal-char"
                    style={{ '--index': i } as React.CSSProperties}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          </React.Fragment>
        ))}
      </Component>
    );
  }

  // ── Пословный режим (прежнее поведение) ─────────────────────────────
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: '100%',
      opacity: 0,
      filter: blur ? 'blur(8px)' : 'none',
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration,
        ease: [0.2, 0.65, 0.3, 0.9] as const,
      },
    },
  };

  const MotionComponent = motion[Component as keyof typeof motion] as any;

  return (
    <MotionComponent
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-40px' }}
      // display:inline вместо flex: flex-контейнер не наследует
      // text-align родителя и ломал переносы — заголовок вставал
      // по одному слову в строку. Слова обёрнуты в inline-block,
      // перенос и выравнивание работают как у обычного текста.
      className={className}
    >
      {words.map((word, index) => (
        <React.Fragment key={index}>
          {index > 0 && ' '}
        <span
          className="inline-block overflow-hidden align-top py-0.5 leading-[1.2]"
        >
          <motion.span
            variants={wordVariants}
            className="inline-block will-change-transform"
          >
            {word}
          </motion.span>
        </span>
        </React.Fragment>
      ))}
    </MotionComponent>
  );
};

export default RevealText;
