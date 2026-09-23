/**
 * Отправка цели в Яндекс.Метрику. Счётчик может не успеть загрузиться
 * или быть заблокирован, поэтому вызов всегда защищён проверкой.
 */
export function goal(name: string, params?: Record<string, unknown>) {
  try {
    const w = window as unknown as {
      ym?: (id: number, action: string, target: string, p?: Record<string, unknown>) => void;
    };
    if (typeof w.ym === 'function') w.ym(29659030, 'reachGoal', name, params);
  } catch {
    // Метрика недоступна — молча пропускаем, это не должно ломать интерфейс.
  }
}
