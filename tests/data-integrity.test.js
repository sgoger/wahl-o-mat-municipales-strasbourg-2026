import { describe, test, expect, beforeAll } from 'vitest';
import { loadApp } from './helpers/load-app.js';

describe('data integrity', () => {
  let CANDIDATES, THESES, POSITIONS;

  beforeAll(() => {
    const app = loadApp();
    CANDIDATES = app.CANDIDATES;
    THESES = app.THESES;
    POSITIONS = app.POSITIONS;
  });

  // -----------------------------------------------------------
  // THESES
  // -----------------------------------------------------------
  describe('THESES', () => {
    test('contains exactly 33 theses', () => {
      expect(THESES).toHaveLength(33);
    });

    test('every thesis has id, category, label, text, and docs', () => {
      THESES.forEach(t => {
        expect(t.id).toBeTruthy();
        expect(t.category).toBeTruthy();
        expect(t.label).toBeTruthy();
        expect(t.text).toBeTruthy();
        expect(Array.isArray(t.docs)).toBe(true);
      });
    });

    test('thesis ids are T1 through T33', () => {
      const ids = THESES.map(t => t.id).sort((a, b) => {
        return parseInt(a.slice(1)) - parseInt(b.slice(1));
      });
      for (let i = 1; i <= 33; i++) {
        expect(ids).toContain(`T${i}`);
      }
    });

    test('thesis labels are sequential', () => {
      THESES.forEach((t, i) => {
        expect(t.label).toBe(`Thèse ${i + 1}`);
      });
    });

    test('every thesis has at least one doc with title and https URL', () => {
      THESES.forEach(t => {
        expect(t.docs.length).toBeGreaterThanOrEqual(1);
        t.docs.forEach(d => {
          expect(d.title).toBeTruthy();
          expect(d.url).toMatch(/^https:\/\//);
        });
      });
    });

    test('every category uses a known theme', () => {
      const knownCategories = [
        '🚋 Mobilité', '🏠 Logement', '🔒 Sécurité', '💰 Finances',
        '🌿 Écologie', '📜 Démocratie', '🌍 Tourisme', '🏗️ Urbanisme',
        '💼 Économie', '⚖️ Social'
      ];
      THESES.forEach(t => {
        expect(knownCategories).toContain(t.category);
      });
    });
  });

  // -----------------------------------------------------------
  // CANDIDATES
  // -----------------------------------------------------------
  describe('CANDIDATES', () => {
    test('contains exactly 6 candidates', () => {
      expect(CANDIDATES).toHaveLength(6);
    });

    test('every candidate has id, name, party, and color', () => {
      CANDIDATES.forEach(c => {
        expect(c.id).toBeTruthy();
        expect(c.name).toBeTruthy();
        expect(c.party).toBeTruthy();
        expect(c.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    test('candidate ids match keys in POSITIONS', () => {
      const positionKeys = Object.keys(POSITIONS);
      CANDIDATES.forEach(c => {
        expect(positionKeys).toContain(c.id);
      });
    });

    test('positions are injected into candidates', () => {
      CANDIDATES.forEach(c => {
        expect(c.positions).toBeDefined();
        expect(typeof c.positions).toBe('object');
      });
    });
  });

  // -----------------------------------------------------------
  // POSITIONS — source verification
  // -----------------------------------------------------------
  describe('POSITIONS', () => {
    test('every position has stance, excerpt, and url', () => {
      Object.entries(POSITIONS).forEach(([candidateId, positions]) => {
        Object.entries(positions).forEach(([thesisId, pos]) => {
          expect(pos.stance, `${candidateId}.${thesisId} missing stance`).toBeTruthy();
          expect(pos.excerpt, `${candidateId}.${thesisId} missing excerpt`).toBeTruthy();
          expect(pos.url, `${candidateId}.${thesisId} missing url`).toBeTruthy();
        });
      });
    });

    test('stance is one of agree, neutral, disagree', () => {
      const validStances = ['agree', 'neutral', 'disagree'];
      Object.entries(POSITIONS).forEach(([candidateId, positions]) => {
        Object.entries(positions).forEach(([thesisId, pos]) => {
          expect(validStances, `${candidateId}.${thesisId} invalid stance: ${pos.stance}`)
            .toContain(pos.stance);
        });
      });
    });

    test('every position url starts with https://', () => {
      Object.entries(POSITIONS).forEach(([candidateId, positions]) => {
        Object.entries(positions).forEach(([thesisId, pos]) => {
          expect(pos.url, `${candidateId}.${thesisId}`).toMatch(/^https:\/\//);
        });
      });
    });

    test('every position excerpt is a non-empty string', () => {
      Object.entries(POSITIONS).forEach(([candidateId, positions]) => {
        Object.entries(positions).forEach(([thesisId, pos]) => {
          expect(typeof pos.excerpt).toBe('string');
          expect(pos.excerpt.length, `${candidateId}.${thesisId} empty excerpt`)
            .toBeGreaterThan(0);
        });
      });
    });

    test('no position references a non-existent thesis id', () => {
      const thesisIds = new Set(THESES.map(t => t.id));
      Object.entries(POSITIONS).forEach(([candidateId, positions]) => {
        Object.keys(positions).forEach(thesisId => {
          expect(thesisIds.has(thesisId),
            `${candidateId} has position for unknown thesis ${thesisId}`).toBe(true);
        });
      });
    });

    test('every candidate has at least 15 documented positions', () => {
      Object.entries(POSITIONS).forEach(([candidateId, positions]) => {
        const count = Object.keys(positions).length;
        expect(count, `${candidateId} only has ${count} positions`)
          .toBeGreaterThanOrEqual(15);
      });
    });
  });
});
