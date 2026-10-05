/**
 * Pure game engine core: exercise generation, answer validation, and
 * gamification state transitions (points, levels, in-a-row celebrations,
 * daily streaks). No DOM access, no localStorage access — fully testable
 * in isolation.
 */

/** @typedef {'scitani' | 'odcitani' | 'porovnavani'} ExerciseType */

/**
 * @typedef {Object} Exercise
 * @property {ExerciseType} type
 * @property {[number, number]} operands
 * @property {number | '<' | '>' | '='} correctAnswer
 */

/**
 * @typedef {Object} EngineState
 * @property {number} inARow - consecutive correct answers within the current session
 * @property {number} roundPoints - points accumulated so far in the current round
 */

/**
 * @typedef {Object} ProfileState
 * @property {string} id
 * @property {string} name
 * @property {string | null} avatar
 * @property {string | null} colorTheme
 * @property {number} totalPoints
 * @property {number} level
 * @property {number} dailyStreak
 * @property {string | null} lastPracticeDate - ISO date string (YYYY-MM-DD)
 */

const POINTS_PER_CORRECT_ANSWER = 10;
const TEN_IN_A_ROW_BONUS = 20;
const POINTS_PER_LEVEL = 100;

/**
 * Creates a fresh engine state for the start of a practice session.
 * @returns {EngineState}
 */
export function createEngineState() {
  return { inARow: 0, roundPoints: 0 };
}

/**
 * Creates a fresh profile state for a brand-new profile.
 * @param {{ id: string, name?: string, avatar?: string | null, colorTheme?: string | null }} params
 * @returns {ProfileState}
 */
export function createProfileState({ id, name = '', avatar = null, colorTheme = null }) {
  return {
    id,
    name,
    avatar,
    colorTheme,
    totalPoints: 0,
    level: 1,
    dailyStreak: 0,
    lastPracticeDate: null,
  };
}

/**
 * Returns a random integer between min and max, inclusive.
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a new exercise of the given type within the given number range.
 * @param {{ type: ExerciseType, range: number }} params
 * @returns {Exercise}
 */
export function generateExercise({ type, range }) {
  if (type === 'scitani') {
    const a = randomInt(0, range);
    const b = randomInt(0, range);
    return { type, operands: [a, b], correctAnswer: a + b };
  }

  if (type === 'odcitani') {
    const x = randomInt(0, range);
    const y = randomInt(0, range);
    const a = Math.max(x, y);
    const b = Math.min(x, y);
    return { type, operands: [a, b], correctAnswer: a - b };
  }

  if (type === 'porovnavani') {
    const a = randomInt(0, range);
    const b = randomInt(0, range);
    const correctAnswer = a < b ? '<' : a > b ? '>' : '=';
    return { type, operands: [a, b], correctAnswer };
  }

  throw new Error(`Unknown exercise type: ${type}`);
}

/**
 * Submits an answer for the given exercise and returns the gamification
 * outcome: whether it was correct, points awarded, any triggered events,
 * and the updated engine state.
 * @param {EngineState} engineState
 * @param {Exercise} exercise
 * @param {number | string} answer
 * @returns {{ correct: boolean, pointsAwarded: number, events: string[], updatedEngineState: EngineState }}
 */
export function submitAnswer(engineState, exercise, answer) {
  const correct = answer === exercise.correctAnswer;
  const events = [];

  if (!correct) {
    return {
      correct: false,
      pointsAwarded: 0,
      events,
      updatedEngineState: {
        ...engineState,
        inARow: 0,
      },
    };
  }

  const inARow = engineState.inARow + 1;
  let pointsAwarded = POINTS_PER_CORRECT_ANSWER;

  if (inARow % 10 === 0) {
    events.push('ten-in-a-row');
    pointsAwarded += TEN_IN_A_ROW_BONUS;
  }

  return {
    correct: true,
    pointsAwarded,
    events,
    updatedEngineState: {
      ...engineState,
      inARow,
      roundPoints: engineState.roundPoints + pointsAwarded,
    },
  };
}

/**
 * Calculates the level for a given total point count.
 * Level 1 starts at 0 points; a new level is reached every 100 points.
 * @param {number} totalPoints
 * @returns {number}
 */
export function calculateLevel(totalPoints) {
  return Math.floor(totalPoints / POINTS_PER_LEVEL) + 1;
}

/**
 * Returns the ISO date string (YYYY-MM-DD) for the day before the given one.
 * @param {string} isoDate
 * @returns {string}
 */
function previousIsoDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

/**
 * Applies the result of a completed round (10 questions) to a profile's
 * persisted state: adds points, recalculates level, and updates the daily
 * streak based on the given "today" date.
 * @param {ProfileState} profile
 * @param {{ roundPoints: number }} roundResult
 * @param {string} todayIsoDate - ISO date string (YYYY-MM-DD) for "today"
 * @returns {ProfileState}
 */
export function completeRound(profile, roundResult, todayIsoDate) {
  const totalPoints = profile.totalPoints + roundResult.roundPoints;
  const level = calculateLevel(totalPoints);

  let dailyStreak;
  if (profile.lastPracticeDate === todayIsoDate) {
    dailyStreak = profile.dailyStreak;
  } else if (profile.lastPracticeDate === previousIsoDate(todayIsoDate)) {
    dailyStreak = profile.dailyStreak + 1;
  } else {
    dailyStreak = 1;
  }

  return {
    ...profile,
    totalPoints,
    level,
    dailyStreak,
    lastPracticeDate: todayIsoDate,
  };
}
