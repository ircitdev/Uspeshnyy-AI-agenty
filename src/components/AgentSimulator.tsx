import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RevealText } from './RevealText';
import { TextRevealMask } from './TextRevealMask';
import { AetherRibbonMesh } from './AetherRibbonMesh';
import { PersonaConfigurator } from './PersonaConfigurator';
import { ChatMessages, ChatMessageItem } from './ChatMessages';
import { AgentTone } from '../types';
import { 
  Filter, 
  PhoneCall, 
  ShoppingCart, 
  MessageSquare, 
  BarChart3, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Database, 
  Volume2, 
  Calendar, 
  Check, 
  AlertCircle,
  Briefcase,
  Smile,
  Zap,
  Sliders,
  ArrowRight,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface AgentSimulatorProps {
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  onOpenConsultation: (topic?: string) => void;
}

export const AgentSimulator: React.FC<AgentSimulatorProps> = ({
  selectedAgentId,
  onSelectAgent,
  onOpenConsultation
}) => {
  // Input query state for custom testing
  // Одна вкладка — один диалог: по этому ключу реплики склеиваются в админке.
  const sessionId = React.useMemo(
    () => Math.random().toString(36).slice(2) + Date.now().toString(36),
    []
  );
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent'; text: string; time: string; tone?: AgentTone }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  // Демо-агент недоступен: показываем это явно, иначе человек
  // решит, что так агент и работает.
  const [isDegraded, setIsDegraded] = useState(false);
  const [activeTone, setActiveTone] = useState<AgentTone>('professional');
  const [ratedMessages, setRatedMessages] = useState<Record<string, 'up' | 'down'>>({});
  const [feedbackToastId, setFeedbackToastId] = useState<string | null>(null);

  const handleRateMessage = (id: string, rating: 'up' | 'down') => {
    setRatedMessages(prev => ({ ...prev, [id]: rating }));
    setFeedbackToastId(id);
    setTimeout(() => {
      setFeedbackToastId(prev => (prev === id ? null : prev));
    }, 2500);
  };

  // Preset data for each agent, tailored to activeTone

// Сценарии для шуточного тона «Быдло»: грубо и дерзко, без мата.
// Вынесены таблицей — в тройном тернаре они бы утопили читаемость.
const STREET_DIALOGUES: Record<string, Array<{ role: 'user' | 'agent'; text: string; time: string }>> = {
  voice: [
    { role: 'user', text: 'Здравствуйте! Хотела бы записаться на чистку лица и консультацию к косметологу на этой неделе.', time: '14:21:02' },
    { role: 'agent', text: 'О, здорово. На этой неделе Смирнова и Левина пашут. Тебе когда — вечером после работы или в субботу отсыпаться не будешь?', time: '14:21:05' },
    { role: 'user', text: 'Лучше в пятницу после 18:00, если есть время.', time: '14:21:12' },
    { role: 'agent', text: 'Пятница, полседьмого, Смирнова. Полтора часа — и будешь как новенькая. Записываю или ещё думать будешь?', time: '14:21:16' },
  ],
  consultant: [
    { role: 'user', text: 'Здравствуйте! Подскажите, какой у вас есть комплект для загородного дома?', time: '11:04:31' },
    { role: 'agent', text: 'Ну смотри, для дома есть три варианта. Дешёвый — фигня, через год замучаешься. Средний — норм. Дорогой — на всю жизнь. Тебе какой?', time: '11:04:35' },
    { role: 'user', text: 'Давайте средний, но чтобы хватило надолго.', time: '11:04:48' },
    { role: 'agent', text: 'Правильно мыслишь. Средний и берут все нормальные люди. Скидываю спеку — глянешь, там ценник без всякого хера сверху.', time: '11:04:52' },
  ],
  unified_inbox: [
    { role: 'user', text: 'Добрый день! Писал вам вчера в WhatsApp, но так и не получил ответ.', time: '09:12:07' },
    { role: 'agent', text: 'Ага, вижу твоё сообщение. Вчера там кто-то прошляпил, бывает. Сейчас разрулю сам, больше не потеряется.', time: '09:12:10' },
    { role: 'user', text: 'Хорошо. Мне нужен счёт на оплату.', time: '09:12:19' },
    { role: 'agent', text: 'Без проблем. Счёт сделаю и кину прямо сюда, чтоб ты по десяти чатам не бегал. Всё в одном месте теперь.', time: '09:12:23' },
  ],
  analyst: [
    { role: 'user', text: 'Покажи, что вчера было по заявкам.', time: '08:00:04' },
    { role: 'agent', text: 'Держи. Заявок 34, это на треть больше позавчерашнего. Но реклама в одном канале жрёт бюджет и ни хрена не приносит.', time: '08:00:06' },
    { role: 'user', text: 'Что именно проседает?', time: '08:00:15' },
    { role: 'agent', text: 'Да вторая кампания и проседает, там цена заявки конская. Выруби её, и деньги перестанут утекать в никуда.', time: '08:00:18' },
  ],
  qualifier: [
    { role: 'user', text: 'Здравствуйте! Нужен монтаж системы вентиляции на производство, площадь около 950 кв.м. В Подольске. Сколько выйдет?', time: '16:40:12' },
    { role: 'agent', text: 'О, наконец нормальный заказ, а не мелочь всякая. 950 квадратов — это по-взрослому. Потолки высокие? И проект есть или с нуля рисовать?', time: '16:40:15' },
    { role: 'user', text: 'Потолки 5 метров, проекта нет, планируем запускаться в следующем месяце.', time: '16:40:41' },
    { role: 'agent', text: 'Понял, без проекта — значит с нуля. Ценник 820–950 тысяч, и хрен где дешевле найдёшь за такое качество. Инженера тебе скину, он всё разрулит.', time: '16:40:45' },
  ],
};

  const getAgentPreset = (id: string, tone: AgentTone) => {
    switch (id) {
      case 'voice':
        return {
          title: 'Голосовой агент записи и первичных консультаций',
          subtitle: 'Принимает входящие звонки за 0.8 сек, ведет диалог без робо-пауз и бронирует время в CRM',
          audioActive: true,
          callerName: '+7 (926) 841-**-** (Пациент)',
          defaultDialogue: tone === 'street' ? STREET_DIALOGUES[id] : tone === 'friendly' ? [
            { role: 'user' as const, text: 'Здравствуйте! Хотела бы записаться на чистку лица и консультацию к косметологу на этой неделе.', time: '14:21:02' },
            { role: 'agent' as const, text: 'Здравствуйте! Будем очень рады вас видеть ✨ На этой неделе принимают наши замечательные доктора — Смирнова и Левина. Когда вам комфортнее заглянуть: в будни после работы или спокойно в субботу?', time: '14:21:05' },
            { role: 'user' as const, text: 'Лучше в пятницу после 18:00, если есть время.', time: '14:21:12' },
            { role: 'agent' as const, text: 'Супер! В пятницу в 18:30 у доктора Смирновой идеальное окошко. За полтора часа сделаем и бережную чистку, и подберем домашний уход. Записываю вас? 😊', time: '14:21:16' }
          ] : tone === 'concise' ? [
            { role: 'user' as const, text: 'Здравствуйте! Хотела бы записаться на чистку лица и консультацию к косметологу на этой неделе.', time: '14:21:02' },
            { role: 'agent' as const, text: 'Здравствуйте. На этой неделе принимают доктора Смирнова и Левина. Будни или суббота?', time: '14:21:05' },
            { role: 'user' as const, text: 'Лучше в пятницу после 18:00, если есть время.', time: '14:21:12' },
            { role: 'agent' as const, text: 'Пятница, 18:30, доктор Смирнова. Длительность: 80 минут. Бронируем слот?', time: '14:21:16' }
          ] : [
            { role: 'user' as const, text: 'Здравствуйте! Хотела бы записаться на чистку лица и консультацию к косметологу на этой неделе.', time: '14:21:02' },
            { role: 'agent' as const, text: 'Здравствуйте! С удовольствием запишу вас на прием. В нашей клинике на этой неделе принимают доктор Смирнова и доктор Левина. В какой день вам удобнее — в будни после окончания рабочего дня или в субботу?', time: '14:21:05' },
            { role: 'user' as const, text: 'Лучше в пятницу после 18:00, если есть время.', time: '14:21:12' },
            { role: 'agent' as const, text: 'Отлично! На эту пятницу у доктора Смирновой открыто окно в 18:30. Комплексная чистка и врачебная консультация займут 1 час 20 минут. Бронируем данный слот на ваше имя?', time: '14:21:16' }
          ],
          crmPreview: {
            system: 'YClients / Bitrix24',
            status: 'Запись создана',
            color: 'emerald',
            fields: {
              'Услуга': 'Комплексная чистка + консультация',
              'Специалист': 'Смирнова Е. В.',
              'Время': 'Пятница, 18:30',
              'Длительность': '80 мин',
              'Стиль ответа': tone === 'professional' ? 'Деловой (B2B)' : tone === 'friendly' ? 'Дружелюбный (B2C)' : 'Краткий (Экспресс)',
              'Статус SMS': 'Отправлено с гео-меткой'
            }
          },
          quickChips: [
            '«У меня острая боль, есть дежурный врач?»',
            '«Сколько стоит первый прием?»',
            '«Перенесите запись с пятницы на понедельник»'
          ]
        };

      case 'consultant':
        return {
          title: 'Консультант-продавец по базе знаний (RAG)',
          subtitle: 'Знает все характеристики, регламенты и цены, отвечает без фантазий и готовит расчет',
          callerName: 'Посетитель сайта (Сессия #4819)',
          defaultDialogue: tone === 'street' ? STREET_DIALOGUES[id] : tone === 'friendly' ? [
            { role: 'user' as const, text: 'Подскажите, чем отличается тариф "Бизнес" от "Корпоративного" и есть ли интеграция с 1С?', time: '11:04' },
            { role: 'agent' as const, text: 'Добрый день! С радостью подскажу вам разницу 😊 "Бизнес" — для небольших команд до 10 человек, а "Корпоративный" — для растущего бизнеса с филиалами и бесшовной связкой с 1C:ERP. Сколько рабочих мест вам нужно?', time: '11:04' },
            { role: 'user' as const, text: 'У нас 18 менеджеров в двух городах.', time: '11:05' },
            { role: 'agent' as const, text: 'Тогда вам идеально подойдет "Корпоративный"! А еще сейчас действует приятная годовая скидка 20% — выйдет 76 800 ₽ вместо 96 000 ₽, плюс мы бесплатно поможем перенести все данные. Хотите посмотреть наглядный PDF со сравнением?', time: '11:05' }
          ] : tone === 'concise' ? [
            { role: 'user' as const, text: 'Подскажите, чем отличается тариф "Бизнес" от "Корпоративного" и есть ли интеграция с 1С?', time: '11:04' },
            { role: 'agent' as const, text: 'Бизнес: до 10 мест, базовый API. Корпоративный: без лимитов филиалов, выделенный сервер, синхронизация с 1C:ERP. Сколько рабочих мест нужно?', time: '11:04' },
            { role: 'user' as const, text: 'У нас 18 менеджеров в двух городах.', time: '11:05' },
            { role: 'agent' as const, text: 'Рекомендую Корпоративный. Стоимость на год со скидкой 20%: 76 800 ₽ (вместо 96 000 ₽). Миграция 1С бесплатно. Отправить КП?', time: '11:05' }
          ] : [
            { role: 'user' as const, text: 'Подскажите, чем отличается тариф "Бизнес" от "Корпоративного" и есть ли интеграция с 1С?', time: '11:04' },
            { role: 'agent' as const, text: 'Добрый день! Главное отличие: в тарифе "Бизнес" до 10 рабочих мест и стандартный API, а в "Корпоративном" — неограниченное число филиалов, выделенный сервер и прямая синхронизация с 1C:ERP / УТ в реальном времени. Сколько пользователей планируете подключить?', time: '11:04' },
            { role: 'user' as const, text: 'У нас 18 менеджеров в двух городах.', time: '11:05' },
            { role: 'agent' as const, text: 'В соответствии с вашими требованиями оптимален "Корпоративный". При оплате за год действует скидка 20%: 76 800 ₽ вместо 96 000 ₽, плюс бесплатный перенос базы. Направить спецификацию договора?', time: '11:05' }
          ],
          crmPreview: {
            system: 'AmoCRM Воронка Продаж',
            status: 'Выставление счета',
            color: 'blue',
            fields: {
              'Продукт': 'Корпоративный тариф (18 мест)',
              'Интеграция': '1C:Предприятие (требуется)',
              'Сумма сделки': '76 800 ₽ (скидка 20%)',
              'Стиль ответа': tone === 'professional' ? 'Деловой (B2B)' : tone === 'friendly' ? 'Дружелюбный (B2C)' : 'Краткий (Экспресс)',
              'Следующий шаг': 'Отправить КП и счет'
            }
          },
          quickChips: [
            '«Какой минимальный срок внедрения?»',
            '«Работаете ли вы с НДС для юрлиц?»',
            '«Рассчитайте стоимость на 50 человек»'
          ]
        };

      case 'unified_inbox':
        return {
          title: 'Единое окно переписки и маршрутизации',
          subtitle: 'Склеивает диалоги из Telegram, WhatsApp, Авито и сайта в единый профиль клиента',
          callerName: 'Клиент: ООО «Вектор-Снаб»',
          defaultDialogue: tone === 'street' ? STREET_DIALOGUES[id] : tone === 'friendly' ? [
            { role: 'user' as const, text: '[WhatsApp] Добрый день, мы оставляли заявку на Авито на партию подшипников SKF. Есть ли в наличии?', time: '09:15' },
            { role: 'agent' as const, text: 'Роман, добрый день! Рады снова видеть вас на связи 👍 Да, вчерашнюю заявку с Авито видим: 140 штук. На нашем складе как раз в наличии 210 позиций. Резервируем для вас?', time: '09:15' },
            { role: 'user' as const, text: '[Telegram] Да, счет пришлите сюда в телеграм, пожалуйста.', time: '09:18' },
            { role: 'agent' as const, text: 'Привязал этот Telegram к вашей карточке — теперь все диалоги в одном окне! Счетик №314-В уже отправлен в чат. Бронь держим 3 дня ✨', time: '09:18' }
          ] : tone === 'concise' ? [
            { role: 'user' as const, text: '[WhatsApp] Добрый день, мы оставляли заявку на Авито на партию подшипников SKF. Есть ли в наличии?', time: '09:15' },
            { role: 'agent' as const, text: 'Роман, заявка с Авито найдена: SKF, 140 шт. На складе в наличии: 210 шт. Резервируем?', time: '09:15' },
            { role: 'user' as const, text: '[Telegram] Да, счет пришлите сюда в телеграм, пожалуйста.', time: '09:18' },
            { role: 'agent' as const, text: 'Telegram привязан. Счет №314-В отправлен в чат. Бронь: 3 рабочих дня.', time: '09:18' }
          ] : [
            { role: 'user' as const, text: '[WhatsApp] Добрый день, мы оставляли заявку на Авито на партию подшипников SKF. Есть ли в наличии?', time: '09:15' },
            { role: 'agent' as const, text: 'Здравствуйте, Роман! Да, вижу вашу заявку с Авито на 140 штук. На центральном складе доступно 210 позиций. Резервируем партию за вами?', time: '09:15' },
            { role: 'user' as const, text: '[Telegram] Да, счет пришлите сюда в телеграм, пожалуйста.', time: '09:18' },
            { role: 'agent' as const, text: 'Привязал этот Telegram к вашей карточке. Счет №314-В сформирован и отправлен в чат. Срок бронирования — 3 рабочих дня.', time: '09:18' }
          ],
          crmPreview: {
            system: 'Омниканальный Hub',
            status: 'Клиент идентифицирован',
            color: 'purple',
            fields: {
              'Каналы': 'WhatsApp + Telegram + Авито',
              'Связанный профиль': 'Роман (Закупки ООО Вектор)',
              'Товар': 'Подшипники SKF (140 шт)',
              'Стиль ответа': tone === 'professional' ? 'Деловой (B2B)' : tone === 'friendly' ? 'Дружелюбный (B2C)' : 'Краткий (Экспресс)',
              'Скорость ответа': '12 сек'
            }
          },
          quickChips: [
            '«Уточните статус доставки заказа 819»',
            '«Поменяйте адрес доставки на ул. Ленина»',
            '«Свяжите со старшим инженером»'
          ]
        };

      case 'analyst':
        return {
          title: 'Агент-аналитик и аудит показателей',
          subtitle: 'Каждое утро сводит рекламу, CRM и финучет в ясную управленческую записку',
          callerName: 'Утренний дайджест собственника',
          defaultDialogue: tone === 'street' ? STREET_DIALOGUES[id] : tone === 'friendly' ? [
            { role: 'agent' as const, text: '📊 Доброе утро, Михаил! Отличные новости по продажам за вчера:\n• Лидов получили 42 (на 18% выше плана! 🔥)\n• Бюджет сэкономили: 18 400 ₽ (CPL всего 438 ₽)\n• Закрыли 6 отличных сделок на 385 000 ₽\n\n⚠️ Обратите внимание: Алексей вчера отвечал в среднем 46 минут, из-за чего часть клиентов остыла.', time: '08:30' },
            { role: 'user' as const, text: 'Какой канал рекламы вчера сработал лучше всего?', time: '08:32' },
            { role: 'agent' as const, text: 'Яндекс.Директ вчера просто зажег! 🚀 Принес 24 горячих лида всего по 310 ₽ с конверсией 68%. А вот в VK аукцион перегрет — рекомендую перераспределить 5 000 ₽ в Директ!', time: '08:32' }
          ] : tone === 'concise' ? [
            { role: 'agent' as const, text: '📊 Сводка за сутки:\n• Лиды: 42 (+18% к плану)\n• Расход: 18 400 ₽ (CPL 438 ₽)\n• Выручка: 385 000 ₽ (6 сделок)\n\n⚠️ Риск: менеджер Алексей (ответ 46м, конверсия 7%).', time: '08:30' },
            { role: 'user' as const, text: 'Какой канал рекламы вчера сработал лучше всего?', time: '08:32' },
            { role: 'agent' as const, text: 'Лидер — Яндекс.Директ: 24 лида по 310 ₽, CR 68%. VK перегрет. Решение: перенести 5 000 ₽ в Директ.', time: '08:32' }
          ] : [
            { role: 'agent' as const, text: '📊 Доброе утро, Михаил. Сводка за прошедшие сутки:\n• Лидов получено: 42 (на 18% выше плана)\n• Расход на рекламу: 18 400 ₽ (CPL = 438 ₽, норма 500 ₽)\n• Закрытых сделок: 6 на сумму 385 000 ₽\n\n⚠️ Обратите внимание: конверсия менеджера Алексея снизилась до 7% из-за задержек первого ответа (среднее время 46 минут).', time: '08:30' },
            { role: 'user' as const, text: 'Какой канал рекламы вчера сработал лучше всего?', time: '08:32' },
            { role: 'agent' as const, text: 'Наибольшую отдачу дал Яндекс.Директ (Мастер кампаний "вентиляция склада"): 24 лида по 310 ₽ с конверсией в квалифицированную заявку 68%. VK Реклама перегрета — рекомендую перераспределить 5 000 ₽ в Директ.', time: '08:32' }
          ],
          crmPreview: {
            system: 'Авто-отчет в Telegram',
            status: 'Аномалий: 1 обнаружена',
            color: 'amber',
            fields: {
              'Выручка за сутки': '385 000 ₽',
              'ROMI рекламы': '294%',
              'Стиль отчета': tone === 'professional' ? 'Деловой (B2B)' : tone === 'friendly' ? 'Дружелюбный (B2C)' : 'Краткий (Экспресс)',
              'Рекомендация': 'Включить автоквалификатор в его воронке'
            }
          },
          quickChips: [
            '«Сколько денег потрачено на рекламу за неделю?»',
            '«Кто из менеджеров лидирует по выручке?»',
            '«Какой средний чек в этом месяце?»'
          ]
        };

      case 'qualifier':
      default:
        return {
          title: 'Квалификатор входящих заявок',
          subtitle: 'Отсекает нецелевых, выясняет потребности за 3 вопроса и мгновенно создает сделку в CRM',
          callerName: 'Заявка с сайта (Форма на главной)',
          defaultDialogue: tone === 'street' ? STREET_DIALOGUES[id] : tone === 'friendly' ? [
            { role: 'user' as const, text: 'Здравствуйте! Нужен монтаж системы вентиляции на производство, площадь около 950 кв.м. В Подольске. Сколько выйдет?', time: '16:40' },
            { role: 'agent' as const, text: 'Здравствуйте! Отличный масштаб объекта, с радостью рассчитаем проект для вашего производства в Подольске 😊 Мы как раз специализируемся на таких площадях от 300 м². Подскажите: высота потолков выше 4.5 метров? И проект уже готов или посчитаем с нуля?', time: '16:40' },
            { role: 'user' as const, text: 'Потолки 5 метров, проекта нет, планируем запуститься в следующем месяце.', time: '16:41' },
            { role: 'agent' as const, text: 'Понял задачу, сделаем все на высшем уровне! 👍 Предварительная смета под ключ на 950 м² — 820 000 – 950 000 ₽, монтаж займет всего 10 дней. Я уже завел сделку в CRM и подключил нашего ведущего инженера Андрея. На какой номер в WhatsApp или Telegram вам удобнее получить расчет?', time: '16:41' }
          ] : tone === 'concise' ? [
            { role: 'user' as const, text: 'Здравствуйте! Нужен монтаж системы вентиляции на производство, площадь около 950 кв.м. В Подольске. Сколько выйдет?', time: '16:40' },
            { role: 'agent' as const, text: 'Принято: производство, 950 м², Подольск. Два вопроса: высота потолка больше 4.5м? Проект готов или расчет с нуля?', time: '16:40' },
            { role: 'user' as const, text: 'Потолки 5 метров, проекта нет, планируем запуститься в следующем месяце.', time: '16:41' },
            { role: 'agent' as const, text: 'Смета под ключ: 820 000 – 950 000 ₽. Срок монтажа: 10 дней. Карточка в CRM создана, инженер Андрей назначен. На какой номер отправить расчет?', time: '16:41' }
          ] : [
            { role: 'user' as const, text: 'Здравствуйте! Нужен монтаж системы вентиляции на производство, площадь около 950 кв.м. В Подольске. Сколько выйдет?', time: '16:40' },
            { role: 'agent' as const, text: 'Здравствуйте! Принято к рассмотрению. Мы специализируемся на объектах от 300 м². Для точной оценки проектной сметы уточните: высота потолков выше 4.5 метров, и имеется ли готовый проект или расчет с нуля?', time: '16:40' },
            { role: 'user' as const, text: 'Потолки 5 метров, проекта нет, планируем запуститься в следующем месяце.', time: '16:41' },
            { role: 'agent' as const, text: 'Понял задачу! Предварительная смета под ключ на 950 м² составит 820 000 – 950 000 ₽. Срок монтажа — 10 дней. Я уже создал карточку в нашей системе и назначил ведущего инженера Андрея. На какой номер вам удобно получить проектный расчет?', time: '16:41' }
          ],
          crmPreview: {
            system: 'AmoCRM Lead Card',
            status: 'Лид квалифицирован (94/100)',
            color: 'emerald',
            fields: {
              'Объект': 'Производство, 950 м²',
              'Город': 'Подольск (МО)',
              'Высота потолков': '5 метров',
              'Срок запуска': 'Следующий месяц',
              'Стиль ответа': tone === 'professional' ? 'Деловой (B2B)' : tone === 'friendly' ? 'Дружелюбный (B2C)' : 'Краткий (Экспресс)',
              'Приоритет': '🔥 Высокий (Горячий ЛПР)'
            }
          },
          quickChips: [
            '«Нужен мелкий ремонт кондиционера в квартире» (Нецелевой)',
            '«Монтаж вентиляции в ресторан 400 м², бюджет 600к»',
            '«Хотим пригласить на тендер по климату»'
          ]
        };
    }
  };

  const currentPreset = getAgentPreset(selectedAgentId, activeTone);

  // Send message simulation matching the activeTone
  // Заготовленные ответы — запасной вариант, если модель недоступна.
  const fallbackReply = (): string => {
    const byAgent: Record<string, Record<AgentTone, string>> = {
      qualifier: {
        friendly: 'Записал все детали! Лид уже в CRM с пометкой «Проверен AI-агентом» 🎉 Инженер уже подключается!',
        concise: 'Данные записаны. Лид в CRM. Инженер уведомлен.',
        professional: 'Параметры зафиксированы. Карточка контрагента в CRM верифицирована. Передано ведущему инженеру.',
        street: 'Записал, не переживай. Заявка в CRM, инженер наберёт — с ним и разбирайся.',
      },
      voice: {
        friendly: 'Все отлично услышал и забронировал! 📱 SMS-подтверждение уже летит к вам на телефон!',
        concise: 'Голос транскрибирован. Слот забронирован. SMS отправлено.',
        professional: 'Голосовое сообщение распознано и зарегистрировано. Слот забронирован в системе расписания.',
        street: 'Да понял я, записал. Эсэмэска придёт, не потеряй.',
      },
      consultant: {
        friendly: 'Уже посчитал вам самую выгодную цену с учетом объема! Сейчас прикреплю расчет 📄',
        concise: 'Расчет готов. Спецификация сформирована.',
        professional: 'Расчет сформирован с соблюдением ценовой политики компании. Спецификация подготовлена.',
        street: 'Посчитал. Ценник нормальный, дешевле только даром. Сейчас скину, глянешь.',
      },
      unified_inbox: {
        friendly: 'Связал все ваши мессенджеры в один уютный диалог — ничего не потеряется! ✨',
        concise: 'Каналы синхронизированы. История сохранена.',
        professional: 'Сообщение синхронизировано в омниканальном профиле. История переписки обновлена.',
        street: 'Стащил всю переписку в одну кучу. Теперь ничего не потеряется, как раньше.',
      },
      analyst: {
        friendly: 'Проверил метрики — динамика отличная! Цифры сходятся, держим темп 📈',
        concise: 'Метрика в норме. Расхождений нет.',
        professional: 'Показатель верифицирован по массиву данных за 24 часа. Отклонения в пределах допустимой нормы.',
        street: 'Глянул цифры — всё ровно, без косяков.',
      },
    };
    const generic: Record<AgentTone, string> = {
      friendly: 'С удовольствием зафиксировал ваш вопрос и уже передал коллегам! ✨',
      concise: 'Принято. Статус: обновлено.',
      professional: 'Принял ваш запрос. Проверяю базу знаний и обновляю статус сделки в CRM.',
      street: 'Принял. Передал кому надо, отпишутся.',
    };
    return byAgent[selectedAgentId]?.[activeTone] || generic[activeTone];
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user' as const, text: query, time: now() }]);
    setInputText('');
    setIsProcessing(true);

    // Живой ответ модели идёт через бота: ключ Gemini нельзя держать в браузере.
    let reply = '';
    let degraded = false;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 12000);
      const res = await fetch('https://uspeshnyy.ru/api/sim/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: query,
          agent: selectedAgentId,
          tone: activeTone,
          session: sessionId,
        }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const data = await res.json();
      if (data && typeof data.reply === 'string') reply = data.reply.trim();
    } catch {
      // сеть, таймаут или лимит — уходим на заготовку, но скажем об этом
      degraded = true;
    }
    if (!reply) {
      degraded = true;
      reply = fallbackReply();
    }
    setIsDegraded(degraded);

    setMessages(prev => [
      ...prev,
      { role: 'agent' as const, text: reply, time: now(), tone: activeTone }
    ]);
    setIsProcessing(false);
  };

  const getToneBadge = (tone: AgentTone) => {
    switch (tone) {
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
            <span>Дружелюбный стиль</span>
          </span>
        );
      case 'concise':
        return (
          <span className="inline-flex items-center gap-1 text-[0.62rem] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Zap className="w-2.5 h-2.5" />
            <span>Краткий стиль</span>
          </span>
        );
    }
  };

  return (
    <section className="relative overflow-hidden py-10 sm:py-16 bg-[#f6f9fc]/60 dark:bg-[#09182a]/70 border-y border-[#147aa6]/15 dark:border-white/10" id="simulator">
      {/* Daiwiik Harihar Aether Ribbon Mesh Background (Light & Dark theme aware) */}
      <AetherRibbonMesh className="opacity-80 dark:opacity-90" />

      <div className="max-w-[1480px] mx-auto px-5 sm:px-7 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#136f97] dark:text-[#33a4d4] bg-[#136f97]/10 dark:bg-[#33a4d4]/15 border border-[#136f97]/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Интерактивный симулятор</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] tracking-tight">
            <RevealText text="Протестируйте работу агентов прямо сейчас" as="span" />
          </h2>
          <TextRevealMask
            text="Выберите одного из 5 агентов ниже, настройте тональность общения (Persona Configurator) или задайте свой вопрос — и посмотрите, как меняются формулировки и карточка в CRM."
            className="text-sm sm:text-base text-[#3a4d63] dark:text-[#b6c6da] mt-2"
            delay={0.2}
          />
        </div>

        {/* Agent Selector Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {[
            { id: 'qualifier', label: '01 Квалификатор', icon: Filter },
            { id: 'voice', label: '02 Голосовой агент', icon: PhoneCall },
            { id: 'consultant', label: '03 Консультант', icon: ShoppingCart },
            { id: 'unified_inbox', label: '04 Единое окно', icon: MessageSquare },
            { id: 'analyst', label: '05 Аналитик', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            const active = selectedAgentId === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => {
                  onSelectAgent(tab.id);
                  setMessages([]);
                }}
                whileHover={{ scale: 1.035, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  active 
                    ? 'bg-[#136f97] dark:bg-[#33a4d4] text-white dark:text-[#04121f] shadow-md scale-102 hover:shadow-[0_8px_20px_-4px_rgba(19,111,151,0.4)] dark:hover:shadow-[0_8px_20px_-4px_rgba(51,164,212,0.35)]' 
                    : 'bg-white dark:bg-[#0e2236] text-[#5b7188] dark:text-[#7b8ea6] hover:text-[#0d1f36] dark:hover:text-[#eaf3ff] border border-[#147aa6]/15 hover:shadow-[0_4px_12px_-2px_rgba(19,111,151,0.15)] dark:hover:shadow-[0_4px_12px_-2px_rgba(51,164,212,0.15)]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Persona Configurator Sub-component */}
        <PersonaConfigurator
          activeTone={activeTone}
          onToneChange={(tone) => setActiveTone(tone)}
          agentTitle={currentPreset.title}
        />

        {/* Simulator Interactive Cockpit */}
        <div className="relative isolate rounded-3xl border border-white/50 dark:border-white/12 bg-white/60 dark:bg-[#0e2236]/55 shadow-[0_18px_50px_-18px_rgba(13,31,54,.3)] backdrop-blur-2xl backdrop-saturate-150 overflow-hidden">
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/25" />
          <span aria-hidden="true" className="pointer-events-none absolute -top-24 -right-16 -z-10 h-72 w-72 rounded-full bg-gradient-to-br from-[#38bdf8]/25 via-[#136f97]/15 to-transparent blur-3xl" />
          
          {/* Cockpit Top Bar */}
          <div className="px-6 py-4 bg-[#f6f9fc] dark:bg-[#09182a] border-b border-[#147aa6]/15 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#0d1f36] dark:text-[#eaf3ff] flex flex-wrap items-center gap-2">
                <span>{currentPreset.title}</span>
                <span className="inline-flex items-center gap-1 text-[0.7rem] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Active Agent Node
                </span>
                <span className="inline-flex items-center gap-1 text-[0.7rem] px-2.5 py-0.5 rounded-full font-bold bg-[#136f97]/10 dark:bg-[#33a4d4]/15 text-[#136f97] dark:text-[#33a4d4] border border-[#136f97]/20">
                  {activeTone === 'professional' && <Briefcase className="w-3 h-3" />}
                  {activeTone === 'friendly' && <Smile className="w-3 h-3" />}
                  {activeTone === 'concise' && <Zap className="w-3 h-3" />}
                  <span>Тон: {activeTone === 'professional' ? 'Деловой' : activeTone === 'friendly' ? 'Дружелюбный' : 'Краткий'}</span>
                </span>
              </h3>
              <p className="text-xs text-[#5b7188] dark:text-[#7b8ea6]">
                {currentPreset.subtitle}
              </p>
            </div>

            <motion.button
              onClick={() => onOpenConsultation(`Внедрить агента: ${currentPreset.title}`)}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="self-start sm:self-auto px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-b from-[#157ba4] to-[#136f97] dark:from-[#46b6e4] dark:to-[#33a4d4] dark:text-[#04121f] shadow-xs hover:shadow-[0_6px_18px_-3px_rgba(19,111,151,0.4)] dark:hover:shadow-[0_6px_18px_-3px_rgba(51,164,212,0.35)] transition-all cursor-pointer"
            >
              Запустить у себя
            </motion.button>
          </div>

          {/* Two-Column Working Area: Live Dialogue + CRM Internal View */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Live Chat Interface (7 cols) */}
            <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#147aa6]/15 dark:border-white/10 min-h-[420px]">
              
              {isDegraded && (
                <div
                  role="status"
                  className="mb-3 flex items-start gap-2 rounded-xl border border-amber-300/60 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  <span aria-hidden="true">⚠</span>
                  <span>
                    Демо-агент сейчас недоступен — показываем ответ из записи.
                    В работе агент отвечает на живые вопросы.
                  </span>
                </div>
              )}

              {/* Dialogue Header */}
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 pb-3 mb-3 border-b border-gray-100 dark:border-gray-800 text-xs">
                <span className="text-[#5b7188] dark:text-[#7b8ea6] flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 min-w-0">
                  <span className="whitespace-nowrap">Собеседник:</span>
                  <strong className="text-[#0d1f36] dark:text-[#eaf3ff]">{currentPreset.callerName}</strong>
                </span>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-flex">{getToneBadge(activeTone)}</span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    ~0.8 сек
                  </span>
                </div>
              </div>

              {/* Animated Chat Messages Component (21st.dev/@nexus-ui/components/chat-messages) */}
              <div className="flex-1 mb-4 min-h-[310px]">
                <ChatMessages
                  key={`${selectedAgentId}-${activeTone}`}
                  messages={[
                    ...currentPreset.defaultDialogue.map((msg, i) => ({
                      id: `def-${activeTone}-${i}`,
                      role: msg.role as 'user' | 'agent',
                      text: msg.text,
                      time: msg.time,
                      tone: msg.role === 'agent' ? activeTone : undefined,
                      senderName: msg.role === 'user' ? currentPreset.callerName : currentPreset.title,
                      status: 'read' as const
                    })),
                    ...messages.map((msg, idx) => ({
                      id: `dyn-${idx}`,
                      role: msg.role as 'user' | 'agent',
                      text: msg.text,
                      time: msg.time,
                      tone: msg.tone || (msg.role === 'agent' ? activeTone : undefined),
                      senderName: msg.role === 'user' ? 'Вы (клиент)' : currentPreset.title,
                      status: 'delivered' as const
                    }))
                  ]}
                  isProcessing={isProcessing}
                  activeTone={activeTone}
                  agentName={currentPreset.title}
                  callerName={currentPreset.callerName}
                  autoPlay={true}
                  autoPlayDelay={550}
                  typingDuration={650}
                  showReplay={true}
                  onRateMessage={handleRateMessage}
                  ratedMessages={ratedMessages}
                  feedbackToastId={feedbackToastId}
                />
              </div>

              {/* Interactive Quick-Test Prompt Chips */}
              <div className="mb-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className="block text-[0.7rem] font-bold text-[#5b7188] dark:text-[#7b8ea6] mb-1.5 uppercase tracking-wider">
                  Быстрый тест: нажмите фразу для проверки
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentPreset.quickChips.map((chip, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleSendMessage(chip)}
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      className="text-[0.72rem] px-2.5 py-1 rounded-lg bg-[#eef4fa] dark:bg-[#09182a] hover:bg-[#136f97]/15 dark:hover:bg-[#33a4d4]/20 text-[#136f97] dark:text-[#33a4d4] border border-[#147aa6]/20 hover:border-[#147aa6]/40 hover:shadow-[0_4px_10px_-2px_rgba(19,111,151,0.2)] dark:hover:shadow-[0_4px_10px_-2px_rgba(51,164,212,0.2)] transition-all text-left cursor-pointer"
                    >
                      {chip}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Chat Input Field */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Напишите вопрос (агент ответит в стиле «${activeTone === 'professional' ? 'Деловой' : activeTone === 'friendly' ? 'Дружелюбный' : 'Краткий'}»)...`}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[#f6f9fc] dark:bg-[#09182a] border border-[#147aa6]/20 dark:border-white/10 text-[#0d1f36] dark:text-[#eaf3ff] focus:outline-hidden focus:border-[#136f97] dark:focus:border-[#33a4d4]"
                />
                <motion.button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isProcessing}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className="p-2.5 rounded-xl bg-[#136f97] dark:bg-[#33a4d4] text-white dark:text-[#04121f] disabled:opacity-40 hover:shadow-[0_6px_16px_-2px_rgba(19,111,151,0.4)] dark:hover:shadow-[0_6px_16px_-2px_rgba(51,164,212,0.35)] transition-all cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Отправить сообщение"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>

            </div>

            {/* Right Column: Live CRM / Backend Feed View (5 cols) */}
            <div className="lg:col-span-5 p-5 sm:p-6 bg-[#f6f9fc]/50 dark:bg-[#09182a]/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#147aa6]/15 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#136f97] dark:text-[#33a4d4]" />
                    <span className="text-xs font-bold text-[#0d1f36] dark:text-[#eaf3ff]">
                      {currentPreset.crmPreview.system}
                    </span>
                  </div>
                  <span className="text-[0.7rem] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {currentPreset.crmPreview.status}
                  </span>
                </div>

                {/* Structured Fields Extracted by AI */}
                <div className="space-y-2.5 mb-6">
                  <div className="text-[0.72rem] font-bold uppercase tracking-wider text-[#5b7188] dark:text-[#7b8ea6] mb-2">
                    Автоматически распознано и сохранено:
                  </div>

                  {Object.entries(currentPreset.crmPreview.fields).map(([key, val], idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#0e2236] border border-[#147aa6]/15 dark:border-white/10 flex items-start justify-between gap-3 text-xs"
                    >
                      <span className="text-[#5b7188] dark:text-[#7b8ea6] font-medium">{key}:</span>
                      <strong className="text-[#0d1f36] dark:text-[#eaf3ff] text-right font-semibold">{val}</strong>
                    </div>
                  ))}
                </div>

                {/* Autonomous System Actions Performed */}
                <div className="p-3 rounded-xl bg-[#136f97]/10 dark:bg-[#33a4d4]/10 border border-[#136f97]/20 text-xs space-y-1.5">
                  <div className="font-bold text-[#136f97] dark:text-[#33a4d4] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Фоновые действия агента</span>
                  </div>
                  <p className="text-[0.76rem] text-[#3a4d63] dark:text-[#b6c6da] leading-tight">
                    • Запись проверена на дубли в базе<br />
                    • Применен профиль коммуникации: «{activeTone === 'professional' ? 'Деловой' : activeTone === 'friendly' ? 'Дружелюбный' : 'Краткий'}»<br />
                    • Клиенту отправлено сервисное подтверждение
                  </p>
                </div>
              </div>

              {/* Bottom Callout */}
              <div className="mt-6 pt-4 border-t border-[#147aa6]/15 dark:border-white/10 text-center">
                <p className="text-xs text-[#5b7188] dark:text-[#7b8ea6] mb-2">
                  Хотите настроить персону и регламенты агента под ваш бренд?
                </p>
                <motion.button
                  onClick={() => onOpenConsultation(`Демо и пилот агента: ${currentPreset.title} (стиль ${activeTone})`)}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#136f97] dark:text-[#33a4d4] bg-[#136f97]/10 dark:bg-[#33a4d4]/15 hover:bg-[#136f97]/20 hover:shadow-[0_4px_12px_-2px_rgba(19,111,151,0.2)] dark:hover:shadow-[0_4px_12px_-2px_rgba(51,164,212,0.2)] transition-all cursor-pointer"
                >
                  <span>Заказать бесплатный пилот на 1–2 недели</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
