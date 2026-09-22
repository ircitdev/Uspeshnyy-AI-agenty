import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  User, 
  Check, 
  CheckCheck, 
  Copy, 
  RotateCcw, 
  ThumbsUp, 
  ThumbsDown, 
  Briefcase, 
  Smile, 
  Zap, 
  FastForward,
  Sparkles
} from 'lucide-react';
import { AgentTone } from '../types';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'agent' | 'system';
  text: string;
  time: string;
  tone?: AgentTone;
  senderName?: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface ChatMessagesProps {
  messages: ChatMessageItem[];
  isProcessing?: boolean;
  activeTone?: AgentTone;
  agentName?: string;
  callerName?: string;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  typingDuration?: number;
  showReplay?: boolean;
  onRateMessage?: (id: string, rating: 'up' | 'down') => void;
  ratedMessages?: Record<string, 'up' | 'down'>;
  feedbackToastId?: string | null;
  className?: string;
}

/**
 * Animated ChatMessages component inspired by 21st.dev/@nexus-ui/components/chat-messages
 * Features:
 * - Spring-physics conversation bubble entries
 * - 3-dot bouncing typing indicator
 * - Sequential conversation autoplay mode
 * - Replay & fast-forward controls
 * - Feedback reactions (thumbs up/down)
 * - Copy-to-clipboard micro-interactions
 * - Tone badge metadata & read-receipt status
 */
export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isProcessing = false,
  activeTone = 'professional',
  agentName = 'AI-агент',
  callerName,
  autoPlay = true,
  autoPlayDelay = 650,
  typingDuration = 700,
  showReplay = true,
  onRateMessage,
  ratedMessages = {},
  feedbackToastId = null,
  className = ''
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(autoPlay ? 1 : messages.length);
  const [isTypingInternal, setIsTypingInternal] = useState<boolean>(false);
  const [replayKey, setReplayKey] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef<number>(messages.length);
  const initialFirstMsgIdRef = useRef<string>(messages[0]?.id || '');

  // Handle sequential autoplay entrance and dynamic message additions
  useEffect(() => {
    // If first message ID changed (different preset or tone reset), reset replayKey
    if (messages[0]?.id !== initialFirstMsgIdRef.current) {
      initialFirstMsgIdRef.current = messages[0]?.id || '';
      prevMessagesLengthRef.current = messages.length;
      if (autoPlay) {
        setVisibleCount(1);
      } else {
        setVisibleCount(messages.length);
      }
    } else if (messages.length > prevMessagesLengthRef.current) {
      // New messages were dynamically appended by user or agent response
      prevMessagesLengthRef.current = messages.length;
      setVisibleCount(messages.length);
      setIsTypingInternal(false);
      return;
    }

    if (!autoPlay) {
      setVisibleCount(messages.length);
      setIsTypingInternal(false);
      return;
    }

    // Run autoplay sequence from start
    setVisibleCount(1);
    let currentIdx = 1;
    let timeoutId: NodeJS.Timeout;

    const playNext = () => {
      if (currentIdx >= messages.length) {
        setIsTypingInternal(false);
        return;
      }

      const nextMsg = messages[currentIdx];
      if (nextMsg?.role === 'agent') {
        setIsTypingInternal(true);
        timeoutId = setTimeout(() => {
          setIsTypingInternal(false);
          currentIdx += 1;
          setVisibleCount(currentIdx);
          timeoutId = setTimeout(playNext, autoPlayDelay);
        }, typingDuration);
      } else {
        setIsTypingInternal(false);
        currentIdx += 1;
        setVisibleCount(currentIdx);
        timeoutId = setTimeout(playNext, autoPlayDelay);
      }
    };

    timeoutId = setTimeout(playNext, 450);

    return () => {
      clearTimeout(timeoutId);
      setIsTypingInternal(false);
    };
  }, [messages[0]?.id, replayKey, autoPlay, autoPlayDelay, typingDuration]);

  // Keep visibleCount in sync when messages length changes externally
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      prevMessagesLengthRef.current = messages.length;
      setVisibleCount(messages.length);
    }
  }, [messages.length]);

  // Smooth scroll to bottom on new messages or typing state change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [visibleCount, isProcessing, isTypingInternal]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReplay = () => {
    setReplayKey(prev => prev + 1);
  };

  const handleFastForward = () => {
    setVisibleCount(messages.length);
    setIsTypingInternal(false);
  };

  const getToneBadge = (tone?: AgentTone) => {
    const selectedTone = tone || activeTone;
    switch (selectedTone) {
      case 'professional':
        return (
          <span className="inline-flex items-center gap-1 text-[0.62rem] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <Briefcase className="w-2.5 h-2.5" />
            <span>Деловой стиль</span>
          </span>
        );
      case 'friendly':
        return (
          <span className="inline-flex items-center gap-1 text-[0.62rem] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <Smile className="w-2.5 h-2.5" />
            <span>Дружелюбный</span>
          </span>
        );
      case 'concise':
        return (
          <span className="inline-flex items-center gap-1 text-[0.62rem] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Zap className="w-2.5 h-2.5" />
            <span>Краткий</span>
          </span>
        );
      default:
        return null;
    }
  };

  const displayedMessages = messages.slice(0, visibleCount);
  const isSequenceFinished = visibleCount >= messages.length && !isTypingInternal;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Top Controls: Replay & Status */}
      {showReplay && (
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#147aa6]/15 dark:border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-[#5b7188] dark:text-[#7b8ea6]">
              <Sparkles className="w-3.5 h-3.5 text-[#136f97] dark:text-[#33a4d4]" />
              <span>Сценарий диалога:</span>
            </span>
            <span className="font-semibold text-[#0d1f36] dark:text-[#eaf3ff] text-xs">
              {displayedMessages.length} из {messages.length} сообщений
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {!isSequenceFinished && (
              <motion.button
                type="button"
                onClick={handleFastForward}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[0.7rem] font-medium text-[#5b7188] dark:text-[#7b8ea6] hover:text-[#0d1f36] dark:hover:text-[#eaf3ff] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                title="Показать все сообщения сразу"
              >
                <FastForward className="w-3 h-3" />
                <span>Все сразу</span>
              </motion.button>
            )}

            <motion.button
              type="button"
              onClick={handleReplay}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[0.72rem] font-semibold text-[#136f97] dark:text-[#33a4d4] bg-[#136f97]/10 dark:bg-[#33a4d4]/15 hover:bg-[#136f97]/20 border border-[#136f97]/25 transition-all cursor-pointer shadow-2xs"
              title="Воспроизвести диалог с анимацией заново"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Воспроизвести заново</span>
            </motion.button>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 space-y-3.5 overflow-y-auto max-h-[320px] pr-1.5 pb-2 scrollbar-thin"
      >
        <AnimatePresence initial={false}>
          {displayedMessages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const msgId = msg.id || `msg-${index}`;
            const isRated = ratedMessages[msgId];

            return (
              <motion.div
                key={msgId}
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 26,
                  mass: 0.8
                }}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} group`}
              >
                {/* Agent Avatar */}
                {!isUser && (
                  <div className="relative shrink-0 self-end mb-1">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#136f97] to-[#33a4d4] p-[1.5px] shadow-sm">
                      <div className="w-full h-full rounded-full bg-white dark:bg-[#09182a] flex items-center justify-center">
                        <Bot className="w-4 h-4 text-[#136f97] dark:text-[#33a4d4]" />
                      </div>
                    </div>
                    {/* Active pulse */}
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#09182a]" />
                  </div>
                )}

                {/* Message Bubble + Meta */}
                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[86%] sm:max-w-[82%]`}>
                  {/* Sender Name if applicable */}
                  <span className="text-[0.68rem] text-[#5b7188] dark:text-[#7b8ea6] px-1 mb-1 font-medium">
                    {isUser ? (callerName || 'Вы (Клиент)') : agentName}
                  </span>

                  {/* Main Bubble */}
                  <div
                    className={`relative p-3.5 text-xs sm:text-[0.84rem] leading-relaxed shadow-xs transition-shadow ${
                      isUser
                        ? 'bg-gradient-to-br from-[#157ba4] to-[#136f97] dark:from-[#38a6d4] dark:to-[#1f79a2] text-white dark:text-[#04121f] rounded-2xl rounded-br-xs shadow-[0_4px_14px_-2px_rgba(19,111,151,0.28)]'
                        : 'bg-white dark:bg-[#09182a] text-[#0d1f36] dark:text-[#eaf3ff] border border-[#147aa6]/20 dark:border-white/10 rounded-2xl rounded-bl-xs shadow-sm hover:shadow-md'
                    }`}
                  >
                    {/* Agent Tone Tag */}
                    {!isUser && (
                      <div className="mb-2 flex items-center justify-between gap-2">
                        {getToneBadge(msg.tone)}
                        
                        {/* Copy button */}
                        <motion.button
                          type="button"
                          onClick={() => handleCopy(msgId, msg.text)}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-[#5b7188] dark:text-[#7b8ea6] cursor-pointer"
                          title="Скопировать ответ"
                        >
                          {copiedId === msgId ? (
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </motion.button>
                      </div>
                    )}

                    {/* Message Body */}
                    <div className="whitespace-pre-line font-normal">{msg.text}</div>

                    {/* Agent Feedback Row (Thumbs up/down) */}
                    {!isUser && onRateMessage && (
                      <div className="mt-2.5 pt-2 border-t border-[#147aa6]/15 dark:border-white/10 flex items-center flex-wrap gap-2 text-[0.64rem]">
                        <span className="text-[#5b7188] dark:text-[#7b8ea6]">Оценить ответ:</span>
                        <div className="flex items-center gap-1">
                          <motion.button
                            type="button"
                            onClick={() => onRateMessage(msgId, 'up')}
                            whileHover={{ scale: 1.2, y: -1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-1 rounded-md transition-colors cursor-pointer ${
                              isRated === 'up'
                                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/15'
                                : 'text-[#5b7188] dark:text-[#7b8ea6] hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10'
                            }`}
                            title="Отличный ответ"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={() => onRateMessage(msgId, 'down')}
                            whileHover={{ scale: 1.2, y: -1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-1 rounded-md transition-colors cursor-pointer ${
                              isRated === 'down'
                                ? 'text-rose-600 dark:text-rose-400 bg-rose-500/15'
                                : 'text-[#5b7188] dark:text-[#7b8ea6] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10'
                            }`}
                            title="Требует доработки"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>

                        {/* Animated Feedback Toast */}
                        <AnimatePresence>
                          {feedbackToastId === msgId && (
                            <motion.span
                              initial={{ opacity: 0, x: -4, scale: 0.92 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.92 }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/25"
                            >
                              <Check className="w-3 h-3" />
                              <span>Спасибо за оценку!</span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  {/* Timestamp and Delivery Status */}
                  <div className={`flex items-center gap-1 mt-1 px-1 text-[0.65rem] text-[#5b7188] dark:text-[#7b8ea6]`}>
                    <span>{msg.time}</span>
                    {isUser && (
                      <span className="text-[#136f97] dark:text-[#33a4d4]" title="Доставлено в CRM">
                        <CheckCheck className="w-3 h-3 inline" />
                      </span>
                    )}
                  </div>
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="shrink-0 self-end mb-1">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#136f97]/15 dark:bg-[#33a4d4]/20 border border-[#136f97]/30 flex items-center justify-center text-[#136f97] dark:text-[#33a4d4]">
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing Indicator Bubble: Sequential / Dynamic */}
        <AnimatePresence>
          {(isTypingInternal || isProcessing) && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.94, transition: { duration: 0.18 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              className="flex gap-2.5 items-end"
            >
              {/* Agent Avatar for typing */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#136f97] to-[#33a4d4] p-[1.5px] shadow-sm shrink-0">
                <div className="w-full h-full rounded-full bg-white dark:bg-[#09182a] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#136f97] dark:text-[#33a4d4]" />
                </div>
              </div>

              {/* Bouncing Dots Card */}
              <div className="bg-white dark:bg-[#09182a] border border-[#147aa6]/20 dark:border-white/10 rounded-2xl rounded-bl-xs p-3.5 shadow-sm flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-1 py-0.5">
                  <motion.span
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 0.65,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0
                    }}
                    className="w-2 h-2 rounded-full bg-[#136f97] dark:bg-[#33a4d4]"
                  />
                  <motion.span
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 0.65,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.18
                    }}
                    className="w-2 h-2 rounded-full bg-[#136f97] dark:bg-[#33a4d4]"
                  />
                  <motion.span
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 0.65,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.36
                    }}
                    className="w-2 h-2 rounded-full bg-[#136f97] dark:bg-[#33a4d4]"
                  />
                </div>
                <span className="text-[0.72rem] text-[#5b7188] dark:text-[#7b8ea6] italic pr-1">
                  {agentName} генерирует ответ...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
