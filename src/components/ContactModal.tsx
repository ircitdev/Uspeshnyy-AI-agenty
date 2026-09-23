import React, { useState } from 'react';
import { goal } from '../lib/metrika';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, Phone, Building2, User, FileText } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  defaultTopic = 'Разбор процесса и подбор AI-агента'
}) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState(defaultTopic);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  // Заявка уходит боту в Telegram. Раньше обработчик только показывал
  // экран успеха — заявки не доходили никуда, а человек ждал звонка.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setError('');
    setSending(true);
    try {
      const res = await fetch('https://uspeshnyy.ru/api/site/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, contact, company, message,
          page: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error || 'Не удалось отправить заявку.');
        return;
      }
      goal('lead_submit');
      setSubmitted(true);
    } catch {
      setError('Нет связи с сервером. Напишите нам в Telegram — ответим сразу.');
    } finally {
      setSending(false);
    }
  };

  // Модалку переиспользуют из 11 точек входа: при закрытии возвращаем
  // её в исходное состояние, иначе следующий открывший видит чужой успех.
  const handleClose = () => {
    onClose();
    window.setTimeout(() => {
      setSubmitted(false);
      setError('');
    }, 250);
  };

  const handleOpenTelegramDirect = () => {
    // Контакт добавляем в текст: человек мог указать телефон, а писать
    // с другого аккаунта — без этой строки связь с заявкой терялась.
    const contactLine = contact ? `
Контакт: ${contact}` : '';
    const text = encodeURIComponent(
      `Здравствуйте! Хочу разобрать процесс внедрения AI-агента.
Имя: ${name || 'Клиент'}${contactLine}
Компания/Сфера: ${company || 'Не указано'}
Задача: ${message}`
    );
    window.open(`https://t.me/uspeshnyy?utm_source=agenty&utm_medium=cta&utm_campaign=ai_agents&text=${text}`, '_blank');
    handleClose();
  };

  return (
    // AnimatePresence держит узел до конца ухода — без него модалка
    // исчезала мгновенно, анимировалось только появление.
    <AnimatePresence>
      {isOpen && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={handleClose}
      role="presentation"
    >
      
      <motion.div 
        className="bg-white dark:bg-[#0e2236] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#147aa6]/25 dark:border-white/15 shadow-2xl relative"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <motion.button
          onClick={handleClose}
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 p-2 rounded-full text-[#5b7188] hover:text-[#0d1f36] dark:text-[#7b8ea6] dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </motion.button>

        {!submitted ? (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#136f97] dark:text-[#33a4d4] block mb-1">
                Экспресс-разбор
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight">
                Обсудить задачу или заказать аудит
              </h3>
              <p className="text-xs text-[#5b7188] dark:text-[#7b8ea6] mt-1">
                За 30 минут созвона или в переписке найдем узкие места и предложим решение.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#0d1f36] dark:text-[#eaf3ff] mb-1">
                  Ваше имя:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5b7188]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Александр"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs sm:text-sm bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/20 text-[#0d1f36] dark:text-[#eaf3ff] focus:outline-hidden focus:border-[#136f97]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0d1f36] dark:text-[#eaf3ff] mb-1">
                  Telegram или телефон:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5b7188]" />
                  {/* Поле принимает и @username, и телефон, поэтому type="tel"
                      не подходит. Минимальную проверку даёт pattern: пять
                      символов и хотя бы одна цифра или собака. */}
                  <input
                    type="text"
                    required
                    inputMode="text"
                    autoComplete="tel"
                    pattern="(?=.*[0-9@]).{5,}"
                    title="Укажите @username в Telegram или номер телефона"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="@username или +7 (999) 000-00-00"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs sm:text-sm bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/20 text-[#0d1f36] dark:text-[#eaf3ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#136f97] focus:border-[#136f97]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0d1f36] dark:text-[#eaf3ff] mb-1">
                  Сфера бизнеса / Компания:
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5b7188]" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Услуги B2B, монтаж, клиника, опт..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs sm:text-sm bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/20 text-[#0d1f36] dark:text-[#eaf3ff] focus:outline-hidden focus:border-[#136f97]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0d1f36] dark:text-[#eaf3ff] mb-1">
                  Какая задача или вопрос:
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs sm:text-sm bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/20 text-[#0d1f36] dark:text-[#eaf3ff] focus:outline-hidden focus:border-[#136f97]"
                />
              </div>

              <div className="pt-2 space-y-2">
                {error && (
                  <p
                    role="alert"
                    className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300/70 dark:border-rose-800/60 px-3 py-2 text-xs text-rose-700 dark:text-rose-300"
                  >
                    {error}{' '}
                    <a
                      href="https://t.me/uspeshnyy?utm_source=agenty&utm_medium=cta&utm_campaign=ai_agents"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline"
                    >
                      Написать в Telegram
                    </a>
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={sending ? undefined : { scale: 1.025, y: -1 }}
                  whileTap={sending ? undefined : { scale: 0.975 }}
                  className="w-full py-3 px-4 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-b from-[#157ba4] to-[#136f97] dark:from-[#46b6e4] dark:to-[#33a4d4] dark:text-[#04121f] shadow-md hover:shadow-[0_10px_25px_-5px_rgba(19,111,151,0.4)] dark:hover:shadow-[0_10px_25px_-5px_rgba(51,164,212,0.35)] transition-all cursor-pointer disabled:cursor-wait disabled:opacity-70"
                >
                  {sending ? 'Отправляем…' : 'Отправить заявку'}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleOpenTelegramDirect}
                  whileHover={{ scale: 1.025, y: -1 }}
                  whileTap={{ scale: 0.975 }}
                  className="w-full py-2.5 px-4 rounded-full font-bold text-xs text-[#136f97] dark:text-[#33a4d4] bg-[#136f97]/10 dark:bg-[#33a4d4]/15 hover:bg-[#136f97]/20 hover:shadow-[0_6px_16px_-2px_rgba(19,111,151,0.2)] dark:hover:shadow-[0_6px_16px_-2px_rgba(51,164,212,0.2)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Или сразу написать в Telegram</span>
                </motion.button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] mb-2">
              Заявка успешно принята!
            </h4>
            <p className="text-xs sm:text-sm text-[#5b7188] dark:text-[#7b8ea6] leading-relaxed mb-6">
              Мы свяжемся с вами в течение рабочего часа по указанным контактам.
            </p>
            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="px-6 py-2 rounded-full font-bold text-xs bg-[#136f97] dark:bg-[#33a4d4] text-white dark:text-[#04121f] shadow-md hover:shadow-[0_8px_20px_-3px_rgba(19,111,151,0.35)] transition-all cursor-pointer"
            >
              Закрыть окно
            </motion.button>
          </div>
        )}

      </motion.div>

    </motion.div>
      )}
    </AnimatePresence>
  );
};
