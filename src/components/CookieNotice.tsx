import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

/**
 * Cookie-уведомление и политика обработки персональных данных.
 *
 * Текст политики — тот же, что на uspeshnyy.ru: расхождение формулировок
 * между страницами одного оператора создаёт лишние вопросы.
 *
 * Согласие храним в localStorage: пока человек не закрыл уведомление,
 * оно показывается при каждом заходе.
 */

const STORAGE_KEY = 'uspeshnyy-cookie-ok';

export const CookieNotice: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  useEffect(() => {
    // Показываем не сразу: на первом экране уведомление перекрывает
    // главный призыв и мешает прочесть, о чём страница.
    const t = window.setTimeout(() => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
      } catch {
        // приватный режим или запрет хранилища — показываем как обычно
        setVisible(true);
      }
    }, 1600);
    return () => window.clearTimeout(t);
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // не сохранилось — уведомление появится снова, это не критично
    }
    setVisible(false);
  };

  // Политику можно открыть из любого места страницы — например из футера.
  useEffect(() => {
    const open = () => setPolicyOpen(true);
    document.addEventListener('open-privacy', open);
    return () => document.removeEventListener('open-privacy', open);
  }, []);

  // Esc закрывает политику, фон под ней не прокручивается
  useEffect(() => {
    if (!policyOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPolicyOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [policyOpen]);

  return (
    <>
      {visible && (
        <div
          role="region"
          aria-label="Уведомление об использовании cookie"
          className="fixed bottom-3 left-3 right-3 z-40 mx-auto max-w-2xl rounded-2xl border border-white/15 bg-[#0b1b2b]/95 p-4 shadow-[0_-8px_28px_rgba(6,16,28,.35)] backdrop-blur-xl sm:flex sm:items-center sm:gap-4 lg:bottom-5"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <p className="mb-3 text-[0.82rem] leading-relaxed text-white/80 sm:mb-0 sm:flex-1">
            Сайт использует cookie и обезличенную статистику. Продолжая, вы соглашаетесь с{' '}
            <button
              type="button"
              onClick={() => setPolicyOpen(true)}
              className="underline decoration-white/40 underline-offset-2 transition-colors hover:text-white"
            >
              политикой обработки данных
            </button>
            .
          </p>
          <button
            type="button"
            onClick={accept}
            className="w-full shrink-0 rounded-xl bg-gradient-to-b from-[#46b6e4] to-[#33a4d4] px-5 py-2.5 text-sm font-bold text-[#04121f] transition-transform active:scale-[.97] sm:w-auto"
          >
            Хорошо
          </button>
        </div>
      )}

      {policyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setPolicyOpen(false)}
          role="presentation"
        >
          <div className="absolute inset-0 bg-[#030a14]/70 backdrop-blur-sm" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Политика конфиденциальности"
            onClick={e => e.stopPropagation()}
            className="relative max-h-[85dvh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/40 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0e2236] sm:p-8"
          >
            <button
              type="button"
              onClick={() => setPolicyOpen(false)}
              aria-label="Закрыть"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[#5b7188] transition-colors hover:bg-black/5 dark:text-[#7b8ea6] dark:hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="policy-text pr-8 text-sm leading-relaxed text-[#3a4d63] dark:text-[#b6c6da]">
            <h2>Политика обработки персональных данных</h2>
            <p className="pm-muted">Действует с 5 июля 2026 года</p>
            <h3>1. Оператор</h3>
            <p>Оператор персональных данных — Александр Успешный (сайт uspeshnyy.ru). Связь по вопросам обработки данных: <a href="mailto:aleksandr@uspeshnyy.ru">aleksandr@uspeshnyy.ru</a> или <a href="https://t.me/uspeshnyy" target="_blank" rel="noopener">Telegram</a>.</p>
            <h3>2. Какие данные обрабатываются</h3>
            <ul>
            <li>данные, которые вы указываете в формах сайта: ответы анкеты, имя, ссылка на сайт или соцсеть;</li>
            <li>идентификатор и имя пользователя Telegram — при переходе в бота @uspeshnyybot;</li>
            <li>технические данные: IP-адрес, cookie, обезличенная статистика посещений.</li>
            </ul>
            <h3>3. Цели обработки</h3>
            <ul>
            <li>подготовка персонального разбора (отчёта) по вашим ответам;</li>
            <li>связь с вами по вашему запросу;</li>
            <li>улучшение работы сайта.</li>
            </ul>
            <h3>4. Условия обработки</h3>
            <p>Данные обрабатываются с вашего согласия, выраженного отметкой в форме, и не передаются третьим лицам, за исключением случаев, предусмотренных законодательством РФ. Данные хранятся на защищённых серверах и удаляются по вашему запросу.</p>
            <h3>5. Ваши права</h3>
            <p>Вы можете запросить уточнение, блокирование или удаление своих данных, а также отозвать согласие на обработку — напишите на <a href="mailto:aleksandr@uspeshnyy.ru">aleksandr@uspeshnyy.ru</a> или в <a href="https://t.me/uspeshnyy" target="_blank" rel="noopener">Telegram</a>.</p>
            <h3>6. Cookie</h3>
            <p>Сайт использует cookie и локальное хранилище браузера для корректной работы интерфейса и обезличенной статистики. Вы можете отключить cookie в настройках браузера.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
