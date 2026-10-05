import { QUESTIONS_PER_ROUND } from '../constants.js';
import { generateExercise, createEngineState, submitAnswer } from '../core/gameEngine.js';
import { triggerCelebration } from './celebration.js';
import { playCorrectSound, playIncorrectSound, playCelebrationSound } from './sound.js';

const FEEDBACK_DELAY_MS = 1500;

/**
 * Renders the practice screen for a single round of QUESTIONS_PER_ROUND
 * exercises of one type/range, then calls onRoundComplete.
 * @param {HTMLElement} container
 * @param {{
 *   type: string,
 *   range: number,
 *   onRoundComplete: (roundResult: { roundPoints: number }) => void
 * }} params
 */
export function renderPracticeScreen(container, { type, range, onRoundComplete }) {
  let engineState = createEngineState();
  let questionIndex = 0;
  let typedAnswer = '';
  let awaitingAdvance = false;

  function nextQuestion() {
    if (questionIndex >= QUESTIONS_PER_ROUND) {
      onRoundComplete({ roundPoints: engineState.roundPoints });
      return;
    }
    typedAnswer = '';
    awaitingAdvance = false;
    const exercise = generateExercise({ type, range });
    renderQuestion(exercise);
  }

  function handleSubmit(exercise, rawAnswer) {
    if (awaitingAdvance) return;
    const answer = type === 'porovnavani' ? rawAnswer : Number(rawAnswer);
    const result = submitAnswer(engineState, exercise, answer);
    engineState = result.updatedEngineState;
    awaitingAdvance = true;

    const feedback = container.querySelector('.feedback');
    if (result.correct) {
      feedback.textContent = 'Správně! 🎉';
      feedback.className = 'feedback correct';
      playCorrectSound();
      if (result.events.includes('ten-in-a-row')) {
        triggerCelebration('🔥 10 za sebou! +20 bodů navíc!');
        playCelebrationSound();
      }
    } else {
      feedback.textContent = `Správná odpověď byla: ${exercise.correctAnswer}`;
      feedback.className = 'feedback incorrect';
      playIncorrectSound();
    }

    questionIndex += 1;
    window.setTimeout(nextQuestion, FEEDBACK_DELAY_MS);
  }

  function renderQuestion(exercise) {
    container.innerHTML = '';

    const progress = document.createElement('div');
    progress.className = 'stats-bar';
    progress.innerHTML = `<span>Otázka ${questionIndex + 1} / ${QUESTIONS_PER_ROUND}</span><span>⭐ ${engineState.roundPoints}</span>`;
    container.appendChild(progress);

    const screen = document.createElement('div');
    screen.className = 'screen';

    const [a, b] = exercise.operands;
    const symbol = type === 'scitani' ? '+' : type === 'odcitani' ? '−' : '?';

    const prompt = document.createElement('div');
    prompt.className = 'exercise-prompt';
    prompt.textContent = `${a} ${symbol} ${b}`;
    screen.appendChild(prompt);

    const feedback = document.createElement('div');
    feedback.className = 'feedback';
    screen.appendChild(feedback);

    if (type === 'porovnavani') {
      const buttonsRow = document.createElement('div');
      buttonsRow.className = 'comparison-buttons';
      for (const symbolChoice of ['<', '>', '=']) {
        const button = document.createElement('button');
        button.textContent = symbolChoice;
        button.addEventListener('click', () => handleSubmit(exercise, symbolChoice));
        buttonsRow.appendChild(button);
      }
      screen.appendChild(buttonsRow);
    } else {
      const answerDisplay = document.createElement('div');
      answerDisplay.className = 'answer-display';
      answerDisplay.textContent = typedAnswer || '\u00A0';
      screen.appendChild(answerDisplay);

      const numpad = document.createElement('div');
      numpad.className = 'numpad';

      const addDigit = (digit) => {
        if (awaitingAdvance) return;
        typedAnswer += digit;
        answerDisplay.textContent = typedAnswer;
      };

      for (const digit of ['1', '2', '3', '4', '5', '6', '7', '8', '9']) {
        const button = document.createElement('button');
        button.textContent = digit;
        button.addEventListener('click', () => addDigit(digit));
        numpad.appendChild(button);
      }

      const backspaceButton = document.createElement('button');
      backspaceButton.textContent = '⌫';
      backspaceButton.addEventListener('click', () => {
        if (awaitingAdvance) return;
        typedAnswer = typedAnswer.slice(0, -1);
        answerDisplay.textContent = typedAnswer || '\u00A0';
      });
      numpad.appendChild(backspaceButton);

      const zeroButton = document.createElement('button');
      zeroButton.textContent = '0';
      zeroButton.addEventListener('click', () => addDigit('0'));
      numpad.appendChild(zeroButton);

      const checkButton = document.createElement('button');
      checkButton.textContent = 'Zkontrolovat';
      checkButton.addEventListener('click', () => {
        if (typedAnswer === '') return;
        handleSubmit(exercise, typedAnswer);
      });
      numpad.appendChild(checkButton);

      screen.appendChild(numpad);
    }

    container.appendChild(screen);
  }

  nextQuestion();
}
