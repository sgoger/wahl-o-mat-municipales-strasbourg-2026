import { describe, test, expect, beforeAll, beforeEach } from 'vitest';
import { loadApp, resetState } from './helpers/load-app.js';

describe('buildDetailHTML', () => {
  let app;

  beforeAll(() => {
    app = loadApp();
  });

  beforeEach(() => {
    resetState(app);
  });

  function getBarseghian() {
    return app.CANDIDATES.find(c => c.id === 'barseghian');
  }

  // -----------------------------------------------------------
  // Source display (Requirement 4a)
  // -----------------------------------------------------------
  describe('source display', () => {
    test('includes excerpt text for answered thesis', () => {
      app.userAnswers.T1 = { vote: 'agree', double: false };
      const html = app.buildDetailHTML(getBarseghian());
      expect(html).toContain('Extension du tramway entre Strasbourg');
    });

    test('includes source URL as a link', () => {
      app.userAnswers.T1 = { vote: 'agree', double: false };
      const html = app.buildDetailHTML(getBarseghian());
      expect(html).toContain(app.POSITIONS.barseghian.T1.url);
    });

    test('source link has target="_blank" and rel="noopener"', () => {
      app.userAnswers.T1 = { vote: 'agree', double: false };
      const html = app.buildDetailHTML(getBarseghian());
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noopener"');
    });

    test('contains "Source" link text', () => {
      app.userAnswers.T1 = { vote: 'agree', double: false };
      const html = app.buildDetailHTML(getBarseghian());
      expect(html).toContain('Source ↗');
    });

    test('shows each answered thesis with its excerpt and source', () => {
      // Answer multiple theses
      app.userAnswers.T1 = { vote: 'agree', double: false };
      app.userAnswers.T7 = { vote: 'agree', double: false };
      const html = app.buildDetailHTML(getBarseghian());

      // T1 source
      expect(html).toContain(app.POSITIONS.barseghian.T1.excerpt);
      expect(html).toContain(app.POSITIONS.barseghian.T1.url);

      // T7 source
      expect(html).toContain(app.POSITIONS.barseghian.T7.excerpt);
      expect(html).toContain(app.POSITIONS.barseghian.T7.url);
    });

    test('all 6 candidates have correct sources in their detail HTML', () => {
      // Answer T1 for every candidate
      app.userAnswers.T1 = { vote: 'agree', double: false };

      app.CANDIDATES.forEach(candidate => {
        const pos = app.POSITIONS[candidate.id]?.T1;
        if (!pos) return;

        const html = app.buildDetailHTML(candidate);
        expect(html, `${candidate.id} missing excerpt`).toContain(pos.excerpt);
        expect(html, `${candidate.id} missing url`).toContain(pos.url);
      });
    });
  });

  // -----------------------------------------------------------
  // Match indicators
  // -----------------------------------------------------------
  describe('match indicators', () => {
    test('shows match icon for agree-agree', () => {
      // barseghian T1 = agree
      app.userAnswers.T1 = { vote: 'agree', double: false };
      const html = app.buildDetailHTML(getBarseghian());
      expect(html).toContain('✅');
    });

    test('shows mismatch icon for agree-disagree', () => {
      // barseghian T11 = disagree, user votes agree
      app.userAnswers.T11 = { vote: 'agree', double: false };
      const html = app.buildDetailHTML(getBarseghian());
      expect(html).toContain('❌');
    });

    test('shows neutral icon for partial match (neutral involved)', () => {
      // barseghian T9 = neutral, user votes agree
      app.userAnswers.T9 = { vote: 'agree', double: false };
      const html = app.buildDetailHTML(getBarseghian());
      expect(html).toContain('🟡');
    });

    test('shows correct stance label', () => {
      app.userAnswers.T1 = { vote: 'agree', double: false };
      const html = app.buildDetailHTML(getBarseghian());
      expect(html).toContain("D'accord");
    });

    test('shows disagree stance label', () => {
      app.userAnswers.T11 = { vote: 'agree', double: false };
      const html = app.buildDetailHTML(getBarseghian());
      // barseghian T11 is disagree
      expect(html).toContain("Pas d'accord");
    });
  });

  // -----------------------------------------------------------
  // Dual stance display (user vs candidate)
  // -----------------------------------------------------------
  describe('dual stance display', () => {
    test('shows "Vous" label for user answer', () => {
      app.userAnswers.T1 = { vote: 'agree', double: false };
      const html = app.buildDetailHTML(getBarseghian());
      expect(html).toContain('Vous');
    });

    test('shows candidate last name as label', () => {
      app.userAnswers.T1 = { vote: 'agree', double: false };
      const html = app.buildDetailHTML(getBarseghian());
      expect(html).toContain('Barseghian');
    });

    test('shows user stance badge with correct class', () => {
      app.userAnswers.T1 = { vote: 'disagree', double: false };
      const html = app.buildDetailHTML(getBarseghian());
      expect(html).toContain('pos-disagree');
      expect(html).toContain("Pas d'accord");
    });

    test('shows both user and candidate stances when they differ', () => {
      // barseghian T1 = agree, user votes disagree
      app.userAnswers.T1 = { vote: 'disagree', double: false };
      const html = app.buildDetailHTML(getBarseghian());
      // User badge: "Pas d'accord", Candidate badge: "D'accord"
      expect(html).toContain("Pas d'accord");
      expect(html).toContain("D'accord");
    });
  });

  // -----------------------------------------------------------
  // Filtering
  // -----------------------------------------------------------
  describe('filtering', () => {
    test('skipped theses are not shown', () => {
      app.userAnswers.T1 = { vote: 'skip', double: false };
      app.userAnswers.T2 = { vote: 'agree', double: false };
      const html = app.buildDetailHTML(getBarseghian());

      // T1 should not appear (skipped)
      expect(html).not.toContain(app.THESES[0].text);
      // T2 should appear (answered)
      expect(html).toContain('Thèse 2');
    });

    test('theses where candidate has no position are not shown', () => {
      // Find a thesis where barseghian has no position
      const allThesisIds = app.THESES.map(t => t.id);
      const barseghianIds = Object.keys(app.POSITIONS.barseghian);
      const missingId = allThesisIds.find(id => !barseghianIds.includes(id));

      if (missingId) {
        app.userAnswers[missingId] = { vote: 'agree', double: false };
        const html = app.buildDetailHTML(getBarseghian());
        const thesis = app.THESES.find(t => t.id === missingId);
        // The thesis text should not appear since candidate has no position
        expect(html).not.toContain(thesis.text);
      }
    });

    test('returns valid HTML container even with no answers', () => {
      const html = app.buildDetailHTML(getBarseghian());
      expect(html).toContain('candidate-positions');
    });
  });
});
