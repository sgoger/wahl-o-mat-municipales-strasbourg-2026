import { describe, test, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { loadApp, resetState } from './helpers/load-app.js';

describe('auto-advance on vote', () => {
  let app;

  beforeAll(() => { app = loadApp(); });

  beforeEach(() => {
    vi.useFakeTimers();
    resetState(app);
    app.startQuiz();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('castVote schedules auto-advance after 250ms', () => {
    expect(app.currentIndex).toBe(0);
    app.castVote('agree');
    expect(app.currentIndex).toBe(0);
    vi.advanceTimersByTime(250);
    expect(app.currentIndex).toBe(1);
  });

  test('deselecting a vote does not auto-advance', () => {
    app.userAnswers[app.THESES[0].id] = { vote: 'agree', double: false };
    app.renderQuestion();
    app.castVote('agree');
    vi.advanceTimersByTime(500);
    expect(app.currentIndex).toBe(0);
    expect(app.userAnswers[app.THESES[0].id].vote).toBe('skip');
  });

  test('rapid click on different vote resets timer', () => {
    app.castVote('agree');
    vi.advanceTimersByTime(100);
    app.castVote('disagree');
    vi.advanceTimersByTime(200);
    expect(app.currentIndex).toBe(0);
    vi.advanceTimersByTime(50);
    expect(app.currentIndex).toBe(1);
    expect(app.userAnswers[app.THESES[0].id].vote).toBe('disagree');
  });

  test('rapid double-click on same vote deselects and stays', () => {
    app.castVote('agree');
    vi.advanceTimersByTime(50);
    app.castVote('agree');
    vi.advanceTimersByTime(500);
    expect(app.currentIndex).toBe(0);
    expect(app.userAnswers[app.THESES[0].id].vote).toBe('skip');
  });

  test('no auto-advance in review mode', () => {
    app.reviewMode = true;
    app.castVote('agree');
    vi.advanceTimersByTime(500);
    expect(app.currentIndex).toBe(0);
  });

  test('last question auto-advances to results', () => {
    app.currentIndex = app.THESES.length - 1;
    app.renderQuestion();
    app.castVote('agree');
    vi.advanceTimersByTime(250);
    expect(document.getElementById('screen-quiz').style.display).toBe('none');
    expect(document.getElementById('screen-results').style.display).toBe('block');
  });

  test('prevQuestion cancels pending auto-advance', () => {
    app.currentIndex = 1;
    app.renderQuestion();
    app.castVote('agree');
    vi.advanceTimersByTime(100);
    app.prevQuestion();
    vi.advanceTimersByTime(300);
    expect(app.currentIndex).toBe(0);
  });
});

describe('button label', () => {
  let app;

  beforeAll(() => { app = loadApp(); });

  beforeEach(() => {
    resetState(app);
    app.startQuiz();
  });

  test('btn-next always shows "Passer" (not "Suivant") after vote', () => {
    app.castVote('agree');
    expect(document.getElementById('btn-next').textContent).toBe('Passer');
  });

  test('btn-next shows "Passer" when no vote', () => {
    expect(document.getElementById('btn-next').textContent).toBe('Passer');
  });

  test('btn-next shows "Voir les résultats →" on last question', () => {
    app.currentIndex = app.THESES.length - 1;
    app.renderQuestion();
    expect(document.getElementById('btn-next').textContent).toBe('Voir les résultats →');
  });
});
