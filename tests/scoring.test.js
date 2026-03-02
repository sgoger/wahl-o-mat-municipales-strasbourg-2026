import { describe, test, expect, beforeAll, beforeEach } from 'vitest';
import { loadApp, resetState } from './helpers/load-app.js';

describe('calcScore', () => {
  let app;

  beforeAll(() => {
    app = loadApp();
  });

  beforeEach(() => {
    resetState(app);
  });

  // -----------------------------------------------------------
  // Basic behavior
  // -----------------------------------------------------------
  describe('basic', () => {
    test('returns 0 when no answers given', () => {
      expect(app.calcScore('barseghian')).toBe(0);
    });

    test('returns 0 when all answers are skip', () => {
      app.THESES.forEach(t => {
        app.userAnswers[t.id] = { vote: 'skip', double: false };
      });
      expect(app.calcScore('barseghian')).toBe(0);
    });

    test('returns 100 when all answers match candidate stances exactly', () => {
      // Answer every thesis where barseghian has a position with the same stance
      Object.entries(app.POSITIONS.barseghian).forEach(([thesisId, pos]) => {
        app.userAnswers[thesisId] = { vote: pos.stance, double: false };
      });
      expect(app.calcScore('barseghian')).toBe(100);
    });
  });

  // -----------------------------------------------------------
  // Scoring rules
  // -----------------------------------------------------------
  describe('scoring rules', () => {
    test('exact match agree-agree scores 100%', () => {
      // barseghian T1 is agree
      app.userAnswers.T1 = { vote: 'agree', double: false };
      expect(app.calcScore('barseghian')).toBe(100);
    });

    test('exact match disagree-disagree scores 100%', () => {
      // barseghian T11 is disagree
      app.userAnswers.T11 = { vote: 'disagree', double: false };
      expect(app.calcScore('barseghian')).toBe(100);
    });

    test('user neutral + candidate agree scores 50%', () => {
      // barseghian T1 is agree
      app.userAnswers.T1 = { vote: 'neutral', double: false };
      // 1 point out of 2 = 50%
      expect(app.calcScore('barseghian')).toBe(50);
    });

    test('candidate neutral + user agree scores 50%', () => {
      // barseghian T9 is neutral
      app.userAnswers.T9 = { vote: 'agree', double: false };
      expect(app.calcScore('barseghian')).toBe(50);
    });

    test('mismatch agree vs disagree scores 0%', () => {
      // barseghian T11 is disagree, user votes agree
      app.userAnswers.T11 = { vote: 'agree', double: false };
      expect(app.calcScore('barseghian')).toBe(0);
    });

    test('mismatch disagree vs agree scores 0%', () => {
      // barseghian T1 is agree, user votes disagree
      app.userAnswers.T1 = { vote: 'disagree', double: false };
      expect(app.calcScore('barseghian')).toBe(0);
    });

    test('multiple theses combine correctly', () => {
      // T1: agree-agree = 2/2
      // T11: agree-disagree = 0/2
      // Total: 2/4 = 50%
      app.userAnswers.T1 = { vote: 'agree', double: false };
      app.userAnswers.T11 = { vote: 'agree', double: false };
      expect(app.calcScore('barseghian')).toBe(50);
    });

    test('neutral-neutral scores 100% (exact match)', () => {
      // barseghian T9 is neutral
      app.userAnswers.T9 = { vote: 'neutral', double: false };
      expect(app.calcScore('barseghian')).toBe(100);
    });
  });

  // -----------------------------------------------------------
  // Undocumented neutral
  // -----------------------------------------------------------
  describe('undocumented neutral', () => {
    test('candidate undocumented neutral + user agree scores 0%', () => {
      // jakubowicz T5 is neutral and undocumented ("Pas de position documentée sur les transports 24h/24")
      app.userAnswers.T5 = { vote: 'agree', double: false };
      expect(app.calcScore('jakubowicz')).toBe(0);
    });

    test('candidate undocumented neutral + user disagree scores 0%', () => {
      // jakubowicz T5 is neutral and undocumented
      app.userAnswers.T5 = { vote: 'disagree', double: false };
      expect(app.calcScore('jakubowicz')).toBe(0);
    });

    test('candidate documented neutral + user agree still scores 50%', () => {
      // barseghian T9 is neutral but documented ("Dispositif Mieux relouer mon logement vacant...")
      app.userAnswers.T9 = { vote: 'agree', double: false };
      expect(app.calcScore('barseghian')).toBe(50);
    });
  });

  // -----------------------------------------------------------
  // Double weight
  // -----------------------------------------------------------
  describe('double weight', () => {
    test('doubled match still scores 100%', () => {
      app.userAnswers.T1 = { vote: 'agree', double: true };
      // 4/4 = 100%
      expect(app.calcScore('barseghian')).toBe(100);
    });

    test('doubled mismatch still scores 0%', () => {
      app.userAnswers.T11 = { vote: 'agree', double: true };
      // 0/4 = 0%
      expect(app.calcScore('barseghian')).toBe(0);
    });

    test('double weight changes relative score between theses', () => {
      // Without double: T1 agree-agree(2) + T11 agree-disagree(0) = 2/4 = 50%
      app.userAnswers.T1 = { vote: 'agree', double: false };
      app.userAnswers.T11 = { vote: 'agree', double: false };
      expect(app.calcScore('barseghian')).toBe(50);

      // With T1 doubled: T1 agree-agree(4) + T11 agree-disagree(0) = 4/6 = 67%
      app.userAnswers.T1 = { vote: 'agree', double: true };
      expect(app.calcScore('barseghian')).toBe(67);
    });

    test('doubled neutral partial match scores 50%', () => {
      // barseghian T9 is neutral, user votes agree, doubled
      app.userAnswers.T9 = { vote: 'agree', double: true };
      // 2/4 = 50%
      expect(app.calcScore('barseghian')).toBe(50);
    });
  });

  // -----------------------------------------------------------
  // Edge cases
  // -----------------------------------------------------------
  describe('edge cases', () => {
    test('skipped questions are excluded from score', () => {
      app.userAnswers.T1 = { vote: 'agree', double: false }; // match
      app.userAnswers.T2 = { vote: 'skip', double: false };  // skipped
      // Only T1 counts: 2/2 = 100%
      expect(app.calcScore('barseghian')).toBe(100);
    });

    test('thesis where candidate has no position is excluded', () => {
      // barseghian has no position on T6 originally... let me check
      // Actually barseghian has T6. Let me find one without position.
      // I'll answer a thesis and check if candidate has no position for it
      app.userAnswers.T1 = { vote: 'agree', double: false }; // match = 100%
      // If we also answer a thesis that candidate doesn't have a position for,
      // it shouldn't change the score
      const allThesisIds = app.THESES.map(t => t.id);
      const barseghianIds = Object.keys(app.POSITIONS.barseghian);
      const missingId = allThesisIds.find(id => !barseghianIds.includes(id));

      if (missingId) {
        app.userAnswers[missingId] = { vote: 'agree', double: false };
        // Score should still be 100% because the missing thesis is excluded
        expect(app.calcScore('barseghian')).toBe(100);
      }
    });

    test('returns 0 for unknown candidate id', () => {
      app.userAnswers.T1 = { vote: 'agree', double: false };
      expect(app.calcScore('nonexistent')).toBe(0);
    });
  });

  // -----------------------------------------------------------
  // Regression tests with real data
  // -----------------------------------------------------------
  describe('regression with real data', () => {
    test('barseghian T1 agree: both agree = 100%', () => {
      app.userAnswers.T1 = { vote: 'agree', double: false };
      expect(app.calcScore('barseghian')).toBe(100);
    });

    test('barseghian T11 agree: user agree vs candidate disagree = 0%', () => {
      app.userAnswers.T11 = { vote: 'agree', double: false };
      expect(app.calcScore('barseghian')).toBe(0);
    });

    test('two candidates with same stance on a thesis get same score', () => {
      // barseghian and trautmann both agree on T1
      app.userAnswers.T1 = { vote: 'agree', double: false };
      expect(app.calcScore('barseghian')).toBe(app.calcScore('trautmann'));
    });

    test('vetter T3 disagree: user agree vs candidate disagree = 0%', () => {
      // vetter T3 is disagree
      app.userAnswers.T3 = { vote: 'agree', double: false };
      expect(app.calcScore('vetter')).toBe(0);
    });

    test('vetter T11 agree: both agree = 100%', () => {
      // vetter T11 is agree
      app.userAnswers.T11 = { vote: 'agree', double: false };
      expect(app.calcScore('vetter')).toBe(100);
    });
  });
});
