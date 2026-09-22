import React, { useState } from 'react';
import { motion } from 'motion/react';
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleOpenTelegramDirect = () => {
    const text = encodeURIComponent(
      `Здравствуйте! Хочу разобрать процесс внедрения AI-агента.\nИмя: ${name || 'Клиент'}\nКомпания/Сфера: ${company || 'Не указано'}\nЗадача: ${message}`
    );
    window.open(`https://t.me/uspeshnyy?text=${text}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
      
      <div 
        className="bg-white dark:bg-[#0e2236] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#147aa6]/25 dark:border-white/15 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <motion.button
          onClick={onClose}
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
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="@username или +7 (999) 000-00-00"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs sm:text-sm bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/20 text-[#0d1f36] dark:text-[#eaf3ff] focus:outline-hidden focus:border-[#136f97]"
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
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.025, y: -1 }}
                  whileTap={{ scale: 0.975 }}
                  className="w-full py-3 px-4 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-b from-[#157ba4] to-[#136f97] dark:from-[#46b6e4] dark:to-[#33a4d4] dark:text-[#04121f] shadow-md hover:shadow-[0_10px_25px_-5px_rgba(19,111,151,0.4)] dark:hover:shadow-[0_10px_25px_-5px_rgba(51,164,212,0.35)] transition-all cursor-pointer"
                >
                  Отправить заявку
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
              onClick={onClose}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="px-6 py-2 rounded-full font-bold text-xs bg-[#136f97] dark:bg-[#33a4d4] text-white dark:text-[#04121f] shadow-md hover:shadow-[0_8px_20px_-3px_rgba(19,111,151,0.35)] transition-all cursor-pointer"
            >
              Закрыть окно
            </motion.button>
          </div>
        )}

      </div>

    </div>
  );
};
