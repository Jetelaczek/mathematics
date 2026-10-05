/**
 * Shows a short celebratory overlay message (e.g. for a level-up or a
 * 10-in-a-row streak), then hides it automatically.
 * @param {string} message
 * @param {number} [durationMs]
 */
export function triggerCelebration(message, durationMs = 1200) {
  const overlay = document.getElementById('celebration-overlay');
  if (!overlay) return;
  overlay.textContent = message;
  overlay.classList.remove('hidden');
  window.setTimeout(() => {
    overlay.classList.add('hidden');
  }, durationMs);
}
