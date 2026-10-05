/**
 * Thin adapter around `localStorage` for persisting profile state.
 * Not unit-tested directly (requires a DOM/localStorage environment);
 * kept intentionally minimal so the untested surface stays small.
 */

const STORAGE_KEY_PREFIX = 'mat-pro-deti:profile:';

/**
 * Loads a profile's persisted state from localStorage, or null if none
 * has been saved yet.
 * @param {string} profileId
 * @returns {import('./core/gameEngine.js').ProfileState | null}
 */
export function loadProfileState(profileId) {
  const raw = localStorage.getItem(STORAGE_KEY_PREFIX + profileId);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Saves a profile's state to localStorage.
 * @param {string} profileId
 * @param {import('./core/gameEngine.js').ProfileState} profileState
 */
export function saveProfileState(profileId, profileState) {
  localStorage.setItem(STORAGE_KEY_PREFIX + profileId, JSON.stringify(profileState));
}
