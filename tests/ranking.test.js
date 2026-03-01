import { describe, test, expect, beforeAll, beforeEach } from 'vitest';
import { loadApp, resetState } from './helpers/load-app.js';

describe('ranking order', () => {
  let app;

  beforeAll(() => {
    app = loadApp();
  });

  beforeEach(() => {
    resetState(app);
  });

  /**
   * Helper: compute scores for all candidates and return sorted array.
   */
  function getRanking() {
    return app.CANDIDATES
      .map(c => ({ id: c.id, score: app.calcScore(c.id) }))
      .sort((a, b) => b.score - a.score);
  }

  test('candidates are sorted by descending score', () => {
    // Give answers that produce different scores
    app.userAnswers.T1 = { vote: 'agree', double: false };
    app.userAnswers.T3 = { vote: 'agree', double: false };
    app.userAnswers.T11 = { vote: 'agree', double: false };

    const ranking = getRanking();
    for (let i = 0; i < ranking.length - 1; i++) {
      expect(ranking[i].score).toBeGreaterThanOrEqual(ranking[i + 1].score);
    }
  });

  test('all-skip produces all-zero scores', () => {
    app.THESES.forEach(t => {
      app.userAnswers[t.id] = { vote: 'skip', double: false };
    });

    const ranking = getRanking();
    ranking.forEach(r => {
      expect(r.score).toBe(0);
    });
  });

  test('ecology-focused user ranks ecology-friendly candidates higher', () => {
    // Answer all ecology theses (T18-T21) with agree
    // Barseghian agrees on all ecology, Vetter has neutral/disagree
    ['T18', 'T19', 'T20', 'T21'].forEach(id => {
      app.userAnswers[id] = { vote: 'agree', double: false };
    });

    const ranking = getRanking();
    const barseghianRank = ranking.findIndex(r => r.id === 'barseghian');
    const vetterRank = ranking.findIndex(r => r.id === 'vetter');

    expect(barseghianRank).toBeLessThan(vetterRank);
  });

  test('security-focused user ranks security candidates higher', () => {
    // Answer security theses with agree on stricter security positions
    // T11 (more police), T12 (anti-begging), T13 (sanctions), T14 (surveillance)
    ['T11', 'T12', 'T13', 'T14'].forEach(id => {
      app.userAnswers[id] = { vote: 'agree', double: false };
    });

    const ranking = getRanking();
    const vetterRank = ranking.findIndex(r => r.id === 'vetter');
    const barseghianRank = ranking.findIndex(r => r.id === 'barseghian');

    // Vetter agrees on security theses, Barseghian disagrees
    expect(vetterRank).toBeLessThan(barseghianRank);
  });

  test('double-weighting a thesis changes relative rankings', () => {
    // Set up: T1 (agree) + T11 (agree)
    // Barseghian: T1=agree(match), T11=disagree(mismatch)
    // Vetter: T1=neutral(partial), T11=agree(match)
    app.userAnswers.T1 = { vote: 'agree', double: false };
    app.userAnswers.T11 = { vote: 'agree', double: false };

    const ranking1 = getRanking();
    const barseghian1 = ranking1.find(r => r.id === 'barseghian').score;
    const vetter1 = ranking1.find(r => r.id === 'vetter').score;

    // Now double-weight T1 (where barseghian matches but vetter is neutral)
    app.userAnswers.T1 = { vote: 'agree', double: true };

    const ranking2 = getRanking();
    const barseghian2 = ranking2.find(r => r.id === 'barseghian').score;
    const vetter2 = ranking2.find(r => r.id === 'vetter').score;

    // Barseghian should gain more than Vetter from doubling T1
    const barseghianDelta = barseghian2 - barseghian1;
    const vetterDelta = vetter2 - vetter1;
    expect(barseghianDelta).toBeGreaterThanOrEqual(vetterDelta);
  });

  test('answering all theses the same way as a candidate gives them 100%', () => {
    // Answer everything as barseghian would
    Object.entries(app.POSITIONS.barseghian).forEach(([thesisId, pos]) => {
      app.userAnswers[thesisId] = { vote: pos.stance, double: false };
    });

    const ranking = getRanking();
    const barseghian = ranking.find(r => r.id === 'barseghian');
    expect(barseghian.score).toBe(100);
  });
});
