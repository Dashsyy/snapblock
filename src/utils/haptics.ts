/**
 * Haptic feedback utility using the browser's Vibration API.
 * Patterns:
 * - light: 10ms (pickup/hover)
 * - success: 50ms (snap/button)
 * - double: [50, 30, 50] (level complete)
 * - error: [100, 50, 100] (wrong answer)
 */
export const haptic = {
  light: () => {
    if ('vibrate' in navigator) navigator.vibrate(10);
  },
  success: () => {
    if ('vibrate' in navigator) navigator.vibrate(50);
  },
  double: () => {
    if ('vibrate' in navigator) navigator.vibrate([50, 30, 50]);
  },
  error: () => {
    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
  }
};
