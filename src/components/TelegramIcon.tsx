import React from 'react';

/**
 * Логотип Telegram. В lucide такого нет — там Send, обычный бумажный
 * самолётик, который читается как «отправить», а не как мессенджер.
 */
export const TelegramIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M21.94 4.3 18.9 19.1c-.23 1.02-.84 1.27-1.7.79l-4.7-3.46-2.27 2.18c-.25.25-.46.46-.94.46l.33-4.78 8.7-7.86c.38-.34-.08-.53-.59-.19L6.98 13.1 2.34 11.6c-1-.32-1.02-1 .21-1.48L20.65 3.1c.84-.31 1.57.19 1.29 1.2Z" />
  </svg>
);
