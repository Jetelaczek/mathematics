import { AVATARS, COLOR_THEMES } from '../constants.js';

/**
 * Renders the first-use (or settings-triggered) avatar + color theme
 * picker screen.
 * @param {HTMLElement} container
 * @param {{
 *   profileState: import('../core/gameEngine.js').ProfileState,
 *   onComplete: (selection: { avatar: string, colorTheme: string }) => void
 * }} params
 */
export function renderSetupScreen(container, { profileState, onComplete }) {
  container.innerHTML = '';

  let selectedAvatar = profileState.avatar || AVATARS[0];
  let selectedColorTheme = profileState.colorTheme || COLOR_THEMES[0].id;

  const heading = document.createElement('h1');
  heading.textContent = 'Vyber si avatara a barvu';
  container.appendChild(heading);

  const screen = document.createElement('div');
  screen.className = 'screen';

  const avatarHeading = document.createElement('h2');
  avatarHeading.textContent = 'Avatar';
  screen.appendChild(avatarHeading);

  const avatarGrid = document.createElement('div');
  avatarGrid.className = 'grid avatars';

  for (const avatar of AVATARS) {
    const button = document.createElement('button');
    button.className = 'avatar-button';
    button.textContent = avatar;
    if (avatar === selectedAvatar) button.classList.add('selected');
    button.addEventListener('click', () => {
      selectedAvatar = avatar;
      for (const b of avatarGrid.children) b.classList.remove('selected');
      button.classList.add('selected');
    });
    avatarGrid.appendChild(button);
  }
  screen.appendChild(avatarGrid);

  const colorHeading = document.createElement('h2');
  colorHeading.textContent = 'Barva';
  screen.appendChild(colorHeading);

  const colorRow = document.createElement('div');
  colorRow.className = 'comparison-buttons';

  for (const theme of COLOR_THEMES) {
    const swatch = document.createElement('button');
    swatch.className = `color-swatch ${theme.id}`;
    swatch.setAttribute('aria-label', theme.label);
    if (theme.id === selectedColorTheme) swatch.classList.add('selected');
    swatch.addEventListener('click', () => {
      selectedColorTheme = theme.id;
      document.body.setAttribute('data-theme', theme.id);
      for (const s of colorRow.children) s.classList.remove('selected');
      swatch.classList.add('selected');
    });
    colorRow.appendChild(swatch);
  }
  screen.appendChild(colorRow);

  const confirmButton = document.createElement('button');
  confirmButton.textContent = 'Hotovo';
  confirmButton.addEventListener('click', () => {
    onComplete({ avatar: selectedAvatar, colorTheme: selectedColorTheme });
  });
  screen.appendChild(confirmButton);

  container.appendChild(screen);
}
