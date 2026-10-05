import { PROFILES } from './constants.js';
import { createProfileState, completeRound } from './core/gameEngine.js';
import { loadProfileState, saveProfileState } from './storage.js';
import { renderProfileScreen } from './ui/profileScreen.js';
import { renderSetupScreen } from './ui/setupScreen.js';
import { renderPickerScreen } from './ui/pickerScreen.js';
import { renderPracticeScreen } from './ui/practiceScreen.js';
import { renderSummaryScreen } from './ui/summaryScreen.js';

const app = document.getElementById('app');

/**
 * Returns today's date as a local (not UTC) ISO date string (YYYY-MM-DD),
 * so the daily streak lines up with the child's own calendar day.
 * @returns {string}
 */
function todayLocalIsoDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function loadOrCreateProfile(profileId) {
  const profileMeta = PROFILES.find((p) => p.id === profileId);
  const existing = loadProfileState(profileId);
  if (existing) return existing;
  return createProfileState({ id: profileId, name: profileMeta.name });
}

function showProfilePicker() {
  renderProfileScreen(app, {
    onSelect: (profileId) => {
      const profileState = loadOrCreateProfile(profileId);
      document.body.setAttribute('data-theme', profileState.colorTheme || 'green');
      if (!profileState.avatar || !profileState.colorTheme) {
        showSetup(profileState, (updated) => showPicker(updated));
      } else {
        showPicker(profileState);
      }
    },
  });
}

function showSetup(profileState, onDone) {
  renderSetupScreen(app, {
    profileState,
    onComplete: ({ avatar, colorTheme }) => {
      const updated = { ...profileState, avatar, colorTheme };
      saveProfileState(updated.id, updated);
      document.body.setAttribute('data-theme', updated.colorTheme);
      onDone(updated);
    },
  });
}

function startRound(profileState, { type, range }) {
  renderPracticeScreen(app, {
    type,
    range,
    onRoundComplete: ({ roundPoints }) => {
      const levelBefore = profileState.level;
      const updatedProfile = completeRound(profileState, { roundPoints }, todayLocalIsoDate());
      saveProfileState(updatedProfile.id, updatedProfile);
      profileState = updatedProfile;
      renderSummaryScreen(app, {
        profileState,
        roundPoints,
        leveledUp: updatedProfile.level > levelBefore,
        onPlayAgain: () => startRound(profileState, { type, range }),
        onChangeTypeRange: () => showPicker(profileState),
        onBackToProfiles: () => showProfilePicker(),
      });
    },
  });
}

function showPicker(profileState) {
  document.body.setAttribute('data-theme', profileState.colorTheme || 'green');
  renderPickerScreen(app, {
    profileState,
    onStart: ({ type, range }) => startRound(profileState, { type, range }),
    onOpenSettings: () => showSetup(profileState, (updated) => showPicker(updated)),
  });
}

showProfilePicker();
