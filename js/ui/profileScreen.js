import { PROFILES } from '../constants.js';

/**
 * Renders the profile picker screen (3 avatars incl. Demo).
 * @param {HTMLElement} container
 * @param {{ onSelect: (profileId: string) => void }} params
 */
export function renderProfileScreen(container, { onSelect }) {
  container.innerHTML = '';

  const heading = document.createElement('h1');
  heading.textContent = 'Kdo si bude hrát?';
  container.appendChild(heading);

  const screen = document.createElement('div');
  screen.className = 'screen';

  const grid = document.createElement('div');
  grid.className = 'grid';

  for (const profile of PROFILES) {
    const button = document.createElement('button');
    button.className = 'profile-button';
    button.setAttribute('data-profile-id', profile.id);
    button.innerHTML = `<span>👤</span><span>${profile.name}</span>`;
    button.addEventListener('click', () => onSelect(profile.id));
    grid.appendChild(button);
  }

  screen.appendChild(grid);
  container.appendChild(screen);
}
