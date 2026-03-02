import { describe, test, expect, beforeAll } from 'vitest';
import { loadApp } from './helpers/load-app.js';

describe('smoke test', () => {
  let app;

  beforeAll(() => {
    app = loadApp();
  });

  test('loads CANDIDATES with 6 entries', () => {
    expect(app.CANDIDATES).toHaveLength(6);
  });

  test('loads THESES with 33 entries', () => {
    expect(app.THESES).toHaveLength(33);
  });

  test('loads POSITIONS for all 6 candidates', () => {
    expect(Object.keys(app.POSITIONS)).toHaveLength(6);
  });

  test('calcScore is a function', () => {
    expect(typeof app.calcScore).toBe('function');
  });

  test('calcScore returns 0 with no user answers', () => {
    expect(app.calcScore('barseghian')).toBe(0);
  });

  test('methodology section exists in the DOM', () => {
    const section = document.getElementById('methodology-section');
    expect(section).not.toBeNull();
  });

  test('methodology toggle button exists in the DOM', () => {
    const btn = document.getElementById('methodology-toggle-btn');
    expect(btn).not.toBeNull();
  });

  test('toggleMethodology is a function', () => {
    expect(typeof app.toggleMethodology).toBe('function');
  });
});
