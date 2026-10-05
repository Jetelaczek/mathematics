/**
 * Renders the round summary screen: points earned this round, streak
 * status, and navigation options.
 * @param {HTMLElement} container
 * @param {{
 *   profileState: import('../core/gameEngine.js').ProfileState,
 *   roundPoints: number,
 *   leveledUp: boolean,
 *   onPlayAgain: () => void,
 *   onChangeTypeRange: () => void,
 *   onBackToProfiles: () => void
 * }} params
 */
export function renderSummaryScreen(container, {
  profileState,
  roundPoints,
  leveledUp,
  onPlayAgain,
  onChangeTypeRange,
  onBackToProfiles,
}) {
  container.innerHTML = '';

  const heading = document.createElement('h1');
  heading.textContent = 'Kolo dokončeno!';
  container.appendChild(heading);

  const screen = document.createElement('div');
  screen.className = 'screen';

  const summary = document.createElement('div');
  summary.className = 'stats-bar';
  summary.innerHTML = `
    <span>⭐ +${roundPoints} bodů</span>
    <span>🏅 Úroveň ${profileState.level}</span>
    <span>🔥 ${profileState.dailyStreak} dní</span>
  `;
  screen.appendChild(summary);

  if (leveledUp) {
    const levelUpMessage = document.createElement('p');
    levelUpMessage.textContent = `🎉 Nová úroveň: ${profileState.level}!`;
    screen.appendChild(levelUpMessage);
  }

  const playAgainButton = document.createElement('button');
  playAgainButton.textContent = 'Hrát znovu';
  playAgainButton.addEventListener('click', onPlayAgain);
  screen.appendChild(playAgainButton);

  const changeButton = document.createElement('button');
  changeButton.textContent = 'Změnit cvičení';
  changeButton.addEventListener('click', onChangeTypeRange);
  screen.appendChild(changeButton);

  const backButton = document.createElement('button');
  backButton.textContent = 'Zpět na profily';
  backButton.addEventListener('click', onBackToProfiles);
  screen.appendChild(backButton);

  container.appendChild(screen);
}
