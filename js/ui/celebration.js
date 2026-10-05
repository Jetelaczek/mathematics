/**
 * Shows a short celebratory overlay (card + confetti burst) for moments
 * like a 10-in-a-row streak or a level-up, then hides it automatically.
 * Purely cosmetic — does not affect when/why celebrations are triggered.
 * @param {string} message
 * @param {number} [durationMs]
 */
export function triggerCelebration(message, durationMs = 1400) {
  const overlay = document.getElementById('celebration-overlay');
  if (!overlay) return;

  overlay.innerHTML = '';

  const confettiColors = ['#ffd166', '#06d6a0', '#118ab2', '#ef476f', '#a78bfa'];
  for (let i = 0; i < 18; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = confettiColors[i % confettiColors.length];
    piece.style.animationDelay = `${Math.random() * 0.3}s`;
    overlay.appendChild(piece);
  }

  const card = document.createElement('div');
  card.className = 'celebration-card';
  card.textContent = message;
  overlay.appendChild(card);

  overlay.classList.remove('hidden');
  window.setTimeout(() => {
    overlay.classList.add('hidden');
  }, durationMs);
}
