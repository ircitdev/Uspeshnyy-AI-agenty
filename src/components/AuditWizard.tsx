import React, { useCallback, useEffect, useRef, useState } from 'react';
import { goal } from '../lib/metrika';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Check } from 'lucide-react';

/**
 * Мастер бесплатного разбора — перенос механики с uspeshnyy.ru/#audit.
 * Семь коротких вопросов, затем /api/lead отдаёт токен и диплинк: отчёт
 * человек получает в Telegram за минуту, а не ждёт звонка.
 *
 * Адрес сайта проверяется через /api/sitepeek — «Дальше» открывается
 * только когда сайт реально открылся. Это отсекает опечатки и мусор.
 */

interface Question {
  key: string;
  title: string;
  site?: boolean;
  multi?: boolean;
  opts?: string[];
}

const QUESTIONS: Question[] = [
  { key: 'site', site: true, title: 'Адрес вашего сайта' },
  { key: 'channels', title: 'Откуда сейчас приходят клиенты?', multi: true, opts: ['Соцсети', 'Платная реклама', 'Сарафан и рекомендации', 'SEO / блог', 'Рассылки', 'Стабильного потока нет'] },
  { key: 'content', title: 'Кто делает контент?', opts: ['Я сам(а), вручную', 'Команда или подрядчик', 'Делаем нерегулярно', 'Почти не делаем'] },
  { key: 'leads', title: 'Как обрабатываются заявки?', opts: ['Вручную в переписках', 'В CRM', 'Боты и автоматизация', 'По-разному, хаос'] },
  { key: 'ai', title: 'Используете нейросети в маркетинге?', opts: ['Нет', 'Пробовал(а), не прижилось', 'Регулярно, но точечно', 'Есть выстроенная система'] },
  { key: 'hours', title: 'Сколько часов в неделю уходит на маркетинг руками?', opts: ['До 5', '5–15', '15–30', 'Больше 30'] },
  { key: 'pain', title: 'Что болит сильнее всего?', opts: ['Мало заявок', 'Заявки слишком дорогие', 'Нет времени на маркетинг', 'Всё держится на мне', 'Непонятно, что работает'] },
];

const API = 'https://uspeshnyy.ru';
const siteValid = (v: string) => /^(https?:\/\/)?([\wа-яё\d-]+\.)+[a-zа-яё]{2,}(\/\S*)?$/i.test(v);

type Answers = Record<string, string | string[]>;

interface AuditWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditWizard: React.FC<AuditWizardProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [siteInput, setSiteInput] = useState('');
  const [peek, setPeek] = useState<{ state: 'idle' | 'loading' | 'ok' | 'block'; text: string }>({ state: 'idle', text: '' });
  // Контакт обязателен: если человек не дойдёт до бота, связаться с ним
  // будет нечем — отчёт останется лежать готовым и никому не нужным.
  const [contact, setContact] = useState('');
  const [agree, setAgree] = useState(false);
  // Согласие на рассылку — отдельное и не предотмеченное:
  // объединять его с согласием на обработку данных нельзя.
  const [marketing, setMarketing] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ bot: string; token: string } | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const peekFor = useRef('');

  const total = QUESTIONS.length + 1;
  const progress = Math.round((step / total) * 100);

  const reset = useCallback(() => {
    setStep(0);
    setAnswers({});
    setSiteInput('');
    setPeek({ state: 'idle', text: '' });
    setContact('');
    setAgree(false);
    setMarketing(false);
    setError('');
    setDone(null);
    peekFor.current = '';
  }, []);

  const close = useCallback(() => {
    onClose();
    window.setTimeout(reset, 280);
  }, [onClose, reset]);

  // Esc закрывает, фон под модалкой не прокручивается
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

  // Читаем сайт и показываем, что нашли. Пока не ответил — «Дальше» закрыт.
  useEffect(() => {
    const v = siteInput.trim();
    if (!siteValid(v)) {
      setPeek({ state: 'idle', text: '' });
      peekFor.current = '';
      return;
    }
    const t = window.setTimeout(async () => {
      if (peekFor.current === v) return;
      peekFor.current = v;
      setPeek({ state: 'loading', text: 'Смотрю сайт…' });
      try {
        const r = await fetch(API + '/api/sitepeek', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: v }),
        });
        const d = await r.json();
        if (peekFor.current !== v) return;
        if (d && d.ok === false) {
          setPeek({ state: 'block', text: d.error || 'Сайт не открылся — проверьте адрес' });
          return;
        }
        const bits = [d?.title, d?.about].filter(Boolean).join(' · ');
        setAnswers(a => ({ ...a, about: d?.about || '', region: d?.region || '' }));
        setPeek({ state: 'ok', text: bits || 'Сайт открылся' });
      } catch {
        if (peekFor.current !== v) return;
        // сеть могла моргнуть — не держим человека, пускаем дальше
        setPeek({ state: 'ok', text: 'Сайт принят' });
      }
    }, 600);
    return () => window.clearTimeout(t);
  }, [siteInput]);

  const submit = async () => {
    if (sending) return;
    setError('');
    setSending(true);
    try {
      const r = await fetch(API + '/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // niche эндпоинт требует обязательно; ниша определяется по сайту
          // на стороне бота, поэтому ставим значение по умолчанию —
          // так же, как это делает форма на главной.
          answers: { niche: 'Другое', ...answers, website: siteInput.trim(), contact: contact.trim() },
          variant: 'agenty3',
          marketing,
          company: honeypot.current?.value || '',
        }),
      });
      const d = await r.json();
      if (!d.ok || !d.bot) throw new Error(d.error || 'no token');
      setDone({ bot: d.bot, token: d.token });
      goal('audit_submit');
      const w = window as unknown as { ym?: (id: number, a: string, g: string) => void };
      if (typeof w.ym === 'function') w.ym(29659030, 'reachGoal', 'audit_submit');
    } catch {
      setError('Не удалось отправить. Напишите нам в Telegram — разберём вручную.');
    } finally {
      setSending(false);
    }
  };

  const q = QUESTIONS[step];
  const picked = (key: string) => {
    const v = answers[key];
    return Array.isArray(v) ? v : v ? [v] : [];
  };

  const choose = (key: string, value: string, multi?: boolean) => {
    if (multi) {
      const list = picked(key);
      const next = list.includes(value) ? list.filter(x => x !== value) : [...list, value];
      setAnswers(a => ({ ...a, [key]: next }));
      return;
    }
    setAnswers(a => ({ ...a, [key]: value }));
    window.setTimeout(() => setStep(s => s + 1), 220);
  };

  const optionClass = (active: boolean) =>
    'w-full text-left rounded-2xl border px-4 py-3 text-sm transition-all ' + (
      active
        ? 'border-[#136f97] bg-[#136f97]/10 text-[#0d1f36] dark:border-[#38bdf8] dark:bg-[#38bdf8]/15 dark:text-[#eaf3ff] font-semibold'
        : 'border-[#147aa6]/20 bg-white/70 text-[#3a4d63] hover:border-[#136f97]/50 hover:bg-white dark:border-white/10 dark:bg-[#09182a]/60 dark:text-[#b6c6da] dark:hover:border-[#38bdf8]/40'
    );

  const primaryBtn = 'inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#157ba4] to-[#136f97] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 dark:from-[#46b6e4] dark:to-[#33a4d4] dark:text-[#04121f]';
  const backBtn = 'text-sm text-[#5b7188] transition-colors hover:text-[#0d1f36] dark:text-[#7b8ea6] dark:hover:text-[#eaf3ff]';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030a14]/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.18 } }}
          transition={{ duration: 0.25 }}
          onClick={close}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Бесплатный разбор"
            className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/40 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#0e2236]/95 sm:p-8"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97, transition: { duration: 0.18 } }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Закрыть"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[#5b7188] transition-colors hover:bg-black/5 dark:text-[#7b8ea6] dark:hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>

            {!done && (
              <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-[#147aa6]/15 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#136f97] to-[#38bdf8] transition-all duration-300"
                  style={{ width: progress + '%' }}
                />
              </div>
            )}

            {done ? (
              <div className="py-2 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff]">Ответы приняты</h3>
                <p className="mx-auto mb-5 max-w-sm text-sm text-[#3a4d63] dark:text-[#b6c6da]">
                  Отчёт уже собирается и будет ждать вас в Telegram — обычно это меньше минуты.
                  Там же можно задать вопросы.
                </p>
                <a href={done.bot} target="_blank" rel="noopener noreferrer" className={primaryBtn} onClick={() => goal('audit_bot_open')}>
                  Получить отчёт в Telegram
                  <ArrowRight className="h-4 w-4" />
                </a>
                <div className="mt-5 flex flex-col items-center gap-2">
                  <img
                    src={API + '/api/qr?t=' + encodeURIComponent(done.token)}
                    alt="QR-код: открыть бота в Telegram"
                    width={124}
                    height={124}
                    loading="lazy"
                    className="rounded-xl"
                  />
                  <span className="text-[0.72rem] leading-snug text-[#5b7188] dark:text-[#7b8ea6]">
                    С компьютера? Наведите камеру телефона —<br />отчёт откроется в Telegram.
                  </span>
                </div>
              </div>
            ) : step < QUESTIONS.length ? (
              <div>
                <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-wider text-[#136f97] dark:text-[#38bdf8]">
                  Бесплатно · 2 минуты
                </p>
                <h3 className="mb-4 text-lg font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] sm:text-xl">
                  {q.title}
                </h3>

                {q.site ? (
                  <div>
                    <p className="mb-3 text-sm text-[#3a4d63] dark:text-[#b6c6da]">
                      С него и начнём: открою сайт и сам пойму, чем вы занимаетесь.
                    </p>
                    <input
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      placeholder="site.ru"
                      value={siteInput}
                      autoFocus
                      onChange={e => setSiteInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && peek.state === 'ok') setStep(1); }}
                      className="w-full rounded-2xl border border-[#147aa6]/25 bg-[#f6f9fc] px-4 py-3 text-sm text-[#0d1f36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#136f97] dark:border-white/10 dark:bg-[#09182a] dark:text-[#eaf3ff]"
                    />
                    {siteInput.trim().length > 3 && !siteValid(siteInput.trim()) && (
                      <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">
                        Нужен адрес сайта, например site.ru
                      </p>
                    )}
                    {peek.state !== 'idle' && (
                      <p className={'mt-2 text-xs ' + (
                        peek.state === 'block'
                          ? 'text-rose-600 dark:text-rose-400'
                          : peek.state === 'loading'
                            ? 'text-[#5b7188] dark:text-[#7b8ea6]'
                            : 'text-emerald-700 dark:text-emerald-400'
                      )}>
                        {peek.text}
                      </p>
                    )}
                    <div className="mt-5 flex justify-end">
                      <button
                        type="button"
                        disabled={peek.state !== 'ok'}
                        onClick={() => setStep(1)}
                        className={primaryBtn}
                      >
                        Дальше
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-2">
                      {q.opts!.map(o => (
                        <button
                          key={o}
                          type="button"
                          onClick={() => choose(q.key, o, q.multi)}
                          className={optionClass(picked(q.key).includes(o))}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} className={backBtn}>
                        Назад
                      </button>
                      {q.multi ? (
                        <button
                          type="button"
                          disabled={!picked(q.key).length}
                          onClick={() => setStep(s => s + 1)}
                          className={primaryBtn}
                        >
                          Дальше
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-sm text-[#5b7188] dark:text-[#7b8ea6]">
                          {step + 1} / {total}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="mb-3 text-lg font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] sm:text-xl">
                  Почти готово
                </h3>
                {siteInput && (
                  <p className="mb-4 text-sm text-[#3a4d63] dark:text-[#b6c6da]">
                    <b className="text-[#0d1f36] dark:text-[#eaf3ff]">{siteInput.trim()}</b>
                    {answers.about ? ' · ' + answers.about : ''}
                  </p>
                )}
                <label className="mb-4 block">
                  <span className="mb-1.5 block text-sm font-medium text-[#0d1f36] dark:text-[#eaf3ff]">
                    Telegram или телефон
                  </span>
                  <input
                    type="text"
                    required
                    inputMode="text"
                    autoComplete="tel"
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    placeholder="@username или +7 (999) 000-00-00"
                    className="w-full rounded-2xl border border-[#147aa6]/25 bg-[#f6f9fc] px-4 py-3 text-sm text-[#0d1f36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#136f97] dark:border-white/10 dark:bg-[#09182a] dark:text-[#eaf3ff]"
                  />
                  <span className="mt-1.5 block text-xs text-[#5b7188] dark:text-[#7b8ea6]">
                    Пришлём разбор, если не дойдёте до бота.
                  </span>
                </label>

                {/* Ловушка для ботов: человек это поле не видит */}
                <input
                  ref={honeypot}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[5000px]"
                />
                <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[#3a4d63] dark:text-[#b6c6da]">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={e => setAgree(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#136f97]"
                  />
                  <span>
                    Согласен(-на) на{' '}
                    {/* Открываем модалку, а не уводим со страницы: человек
                        посреди заполнения формы не должен её терять. */}
                    <button
                      type="button"
                      onClick={() => document.dispatchEvent(new Event('open-privacy'))}
                      className="underline"
                    >
                      обработку персональных данных
                    </button>
                  </span>
                </label>

                <label className="mt-2.5 flex cursor-pointer items-start gap-2.5 text-sm text-[#3a4d63] dark:text-[#b6c6da]">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={e => setMarketing(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#136f97]"
                  />
                  <span>
                    Согласен(-на) получать письма о новых разборах и кейсах.
                    Отписаться можно в любой момент.
                  </span>
                </label>

                {error && (
                  <p role="alert" className="mt-4 rounded-xl border border-rose-300/70 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300">
                    {error}{' '}
                    <a href="https://t.me/uspeshnyy" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                      Написать в Telegram
                    </a>
                  </p>
                )}

                <div className="mt-5 flex items-center justify-between">
                  <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} className={backBtn}>
                    Назад
                  </button>
                  <button type="button" disabled={!agree || sending || contact.trim().length < 5} onClick={submit} className={primaryBtn}>
                    {sending ? 'Отправляю…' : 'Получить отчёт'}
                    {!sending && <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
