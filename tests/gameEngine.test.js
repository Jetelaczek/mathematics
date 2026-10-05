import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateExercise,
  createEngineState,
  submitAnswer,
  completeRound,
  createProfileState,
  calculateLevel,
} from '../js/core/gameEngine.js';

describe('generateExercise', () => {
  it('generates an addition exercise within the given range', () => {
    const exercise = generateExercise({ type: 'scitani', range: 10 });
    assert.equal(exercise.type, 'scitani');
    assert.ok(exercise.operands.length === 2);
    const [a, b] = exercise.operands;
    assert.ok(a >= 0 && a <= 10);
    assert.ok(b >= 0 && b <= 10);
    assert.equal(exercise.correctAnswer, a + b);
  });

  it('generates a subtraction exercise that never produces a negative result', () => {
    for (let i = 0; i < 200; i++) {
      const exercise = generateExercise({ type: 'odcitani', range: 20 });
      const [a, b] = exercise.operands;
      assert.ok(a >= b, `expected first operand (${a}) >= second operand (${b})`);
      assert.equal(exercise.correctAnswer, a - b);
      assert.ok(exercise.correctAnswer >= 0);
    }
  });

  it('generates a comparison exercise with a valid symbol answer', () => {
    const exercise = generateExercise({ type: 'porovnavani', range: 50 });
    const [a, b] = exercise.operands;
    assert.equal(exercise.type, 'porovnavani');
    if (a < b) assert.equal(exercise.correctAnswer, '<');
    else if (a > b) assert.equal(exercise.correctAnswer, '>');
    else assert.equal(exercise.correctAnswer, '=');
  });

  it('keeps generated operands within the requested range for all types', () => {
    const ranges = [10, 20, 50, 100];
    const types = ['scitani', 'odcitani', 'porovnavani'];
    for (const range of ranges) {
      for (const type of types) {
        const exercise = generateExercise({ type, range });
        for (const operand of exercise.operands) {
          assert.ok(operand >= 0 && operand <= range);
        }
      }
    }
  });
});

describe('submitAnswer', () => {
  it('awards 10 points and increments the in-a-row counter on a correct answer', () => {
    const engineState = createEngineState();
    const exercise = { type: 'scitani', operands: [2, 3], correctAnswer: 5 };
    const result = submitAnswer(engineState, exercise, 5);

    assert.equal(result.correct, true);
    assert.equal(result.pointsAwarded, 10);
    assert.equal(result.updatedEngineState.inARow, 1);
    assert.equal(result.updatedEngineState.roundPoints, 10);
  });

  it('resets the in-a-row counter to 0 on an incorrect answer and awards no points', () => {
    const engineState = { ...createEngineState(), inARow: 4 };
    const exercise = { type: 'scitani', operands: [2, 3], correctAnswer: 5 };
    const result = submitAnswer(engineState, exercise, 99);

    assert.equal(result.correct, false);
    assert.equal(result.pointsAwarded, 0);
    assert.equal(result.updatedEngineState.inARow, 0);
  });

  it('triggers a 10-in-a-row celebration event and +20 bonus on every 10th consecutive correct answer', () => {
    let engineState = createEngineState();
    const exercise = { type: 'scitani', operands: [1, 1], correctAnswer: 2 };
    let lastResult;
    for (let i = 1; i <= 10; i++) {
      lastResult = submitAnswer(engineState, exercise, 2);
      engineState = lastResult.updatedEngineState;
    }
    assert.equal(engineState.inARow, 10);
    assert.ok(lastResult.events.includes('ten-in-a-row'));
    assert.equal(lastResult.pointsAwarded, 30); // 10 base + 20 bonus
  });

  it('triggers the celebration again at 20-in-a-row (repeats every 10 within a session)', () => {
    let engineState = createEngineState();
    const exercise = { type: 'scitani', operands: [1, 1], correctAnswer: 2 };
    let lastResult;
    for (let i = 1; i <= 20; i++) {
      lastResult = submitAnswer(engineState, exercise, 2);
      engineState = lastResult.updatedEngineState;
    }
    assert.equal(engineState.inARow, 20);
    assert.ok(lastResult.events.includes('ten-in-a-row'));
  });

  it('does not trigger the celebration on non-multiples of 10', () => {
    let engineState = createEngineState();
    const exercise = { type: 'scitani', operands: [1, 1], correctAnswer: 2 };
    let lastResult;
    for (let i = 1; i <= 9; i++) {
      lastResult = submitAnswer(engineState, exercise, 2);
      engineState = lastResult.updatedEngineState;
    }
    assert.ok(!lastResult.events.includes('ten-in-a-row'));
  });
});

describe('calculateLevel', () => {
  it('starts at level 1 with 0 points', () => {
    assert.equal(calculateLevel(0), 1);
  });

  it('reaches level 2 at exactly 100 points', () => {
    assert.equal(calculateLevel(100), 2);
  });

  it('stays at level 1 just below 100 points', () => {
    assert.equal(calculateLevel(99), 1);
  });

  it('reaches level 4 at 300 points', () => {
    assert.equal(calculateLevel(300), 4);
  });
});

describe('completeRound', () => {
  it('adds round points to the profile total and recalculates level', () => {
    const profile = createProfileState({ id: 'natalka' });
    const updated = completeRound(profile, { roundPoints: 95 }, '2026-01-01');
    assert.equal(updated.totalPoints, 95);
    assert.equal(updated.level, 1);
  });

  it('emits a level-up when crossing a 100-point threshold', () => {
    const profile = { ...createProfileState({ id: 'natalka' }), totalPoints: 90, level: 1 };
    const updated = completeRound(profile, { roundPoints: 20 }, '2026-01-01');
    assert.equal(updated.totalPoints, 110);
    assert.equal(updated.level, 2);
  });

  it('starts the daily streak at 1 on first-ever practice', () => {
    const profile = createProfileState({ id: 'natalka' });
    const updated = completeRound(profile, { roundPoints: 10 }, '2026-01-01');
    assert.equal(updated.dailyStreak, 1);
    assert.equal(updated.lastPracticeDate, '2026-01-01');
  });

  it('does not change the streak if practicing again on the same day', () => {
    const profile = {
      ...createProfileState({ id: 'natalka' }),
      dailyStreak: 3,
      lastPracticeDate: '2026-01-01',
    };
    const updated = completeRound(profile, { roundPoints: 10 }, '2026-01-01');
    assert.equal(updated.dailyStreak, 3);
  });

  it('increments the streak when practicing on the very next calendar day', () => {
    const profile = {
      ...createProfileState({ id: 'natalka' }),
      dailyStreak: 3,
      lastPracticeDate: '2026-01-01',
    };
    const updated = completeRound(profile, { roundPoints: 10 }, '2026-01-02');
    assert.equal(updated.dailyStreak, 4);
  });

  it('resets the streak to 1 when a day was missed', () => {
    const profile = {
      ...createProfileState({ id: 'natalka' }),
      dailyStreak: 5,
      lastPracticeDate: '2026-01-01',
    };
    const updated = completeRound(profile, { roundPoints: 10 }, '2026-01-05');
    assert.equal(updated.dailyStreak, 1);
  });
});
