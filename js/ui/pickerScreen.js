import { EXERCISE_TYPES, NUMBER_RANGES } from '../constants.js';

/**
 * Renders the exercise-type + number-range picker screen, plus a settings
 * icon that re-opens the avatar/color setup screen.
 * @param {HTMLElement} container
 * @param {{
 *   profileState: import('../core/gameEngine.js').ProfileState,
 *   onStart: (selection: { type: string, range: number }) => void,
 *   onOpenSettings: () => void
 * }} params
 */
export function renderPickerScreen(container, { profileState, onStart, onOpenSettings }) {
  container.innerHTML = '';

  const settingsButton = document.createElement('button');
  settingsButton.className = 'settings-icon';
  settingsButton.setAttribute('aria-label', 'Nastavení');
  settingsButton.textContent = '⚙️';
  settingsButton.addEventListener('click', onOpenSettings);
  container.appendChild(settingsButton);

  const heading = document.createElement('h1');
  heading.textContent = `${profileState.avatar || ''} Ahoj, ${profileState.name}!`;
  container.appendChild(heading);

  const stats = document.createElement('div');
  stats.className = 'stats-bar';
  stats.innerHTML = `
    <span>⭐ ${profileState.totalPoints} bodů</span>
    <span>🏅 Úroveň ${profileState.level}</span>
    <span>🔥 ${profileState.dailyStreak} dní</span>
  `;
  container.appendChild(stats);

  const screen = document.createElement('div');
  screen.className = 'screen';

  let selectedType = EXERCISE_TYPES[0].id;
  let selectedRange = NUMBER_RANGES[0];

  const typeHeading = document.createElement('h2');
  typeHeading.textContent = 'Co si procvičíme?';
  screen.appendChild(typeHeading);

  const typeGrid = document.createElement('div');
  typeGrid.className = 'grid';
  for (const exerciseType of EXERCISE_TYPES) {
    const button = document.createElement('button');
    button.textContent = exerciseType.label;
    if (exerciseType.id === selectedType) button.classList.add('selected');
    button.addEventListener('click', () => {
      selectedType = exerciseType.id;
      for (const b of typeGrid.children) b.classList.remove('selected');
      button.classList.add('selected');
    });
    typeGrid.appendChild(button);
  }
  screen.appendChild(typeGrid);

  const rangeHeading = document.createElement('h2');
  rangeHeading.textContent = 'Do kolika?';
  screen.appendChild(rangeHeading);

  const rangeGrid = document.createElement('div');
  rangeGrid.className = 'grid';
  for (const range of NUMBER_RANGES) {
    const button = document.createElement('button');
    button.textContent = `0–${range}`;
    if (range === selectedRange) button.classList.add('selected');
    button.addEventListener('click', () => {
      selectedRange = range;
      for (const b of rangeGrid.children) b.classList.remove('selected');
      button.classList.add('selected');
    });
    rangeGrid.appendChild(button);
  }
  screen.appendChild(rangeGrid);

  const startButton = document.createElement('button');
  startButton.textContent = 'Začít!';
  startButton.addEventListener('click', () => {
    onStart({ type: selectedType, range: selectedRange });
  });
  screen.appendChild(startButton);

  container.appendChild(screen);
}
