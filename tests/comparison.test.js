import { describe, test, expect, beforeAll, beforeEach } from 'vitest';
import { loadApp, resetState } from './helpers/load-app.js';

describe('buildComparisonTable', () => {
  let app;

  beforeAll(() => {
    app = loadApp();
  });

  beforeEach(() => {
    resetState(app);
  });

  function getTableHTML() {
    app.buildComparisonTable();
    return document.getElementById('comp-table').innerHTML;
  }

  // -----------------------------------------------------------
  // Column headers
  // -----------------------------------------------------------
  test('includes "Vous" column header', () => {
    const html = getTableHTML();
    expect(html).toContain('Vous');
  });

  test('includes column header for each selected candidate', () => {
    const html = getTableHTML();
    // Default selectedCandidates: barseghian, trautmann, vetter
    expect(html).toContain('Barseghian');
    expect(html).toContain('Trautmann');
    expect(html).toContain('Vetter');
  });

  test('does not include unselected candidates', () => {
    const html = getTableHTML();
    // joron, kobryn, jakubowicz are not selected by default
    expect(html).not.toContain('Joron');
    expect(html).not.toContain('Kobryn');
    expect(html).not.toContain('Jakubowicz');
  });

  // -----------------------------------------------------------
  // Stance symbols
  // -----------------------------------------------------------
  test('shows checkmark cell for agree stance', () => {
    const html = getTableHTML();
    expect(html).toContain('cell-agree');
    expect(html).toContain('✓');
  });

  test('shows dash cell for neutral stance', () => {
    const html = getTableHTML();
    expect(html).toContain('cell-neutral');
    // The neutral symbol is an em dash
    expect(html).toContain('—');
  });

  test('shows cross cell for disagree stance', () => {
    const html = getTableHTML();
    expect(html).toContain('cell-disagree');
    expect(html).toContain('✗');
  });

  test('shows question mark for undocumented position', () => {
    // All candidates currently have full coverage, so simulate a gap
    const savedT1 = app.POSITIONS.barseghian.T1;
    delete app.POSITIONS.barseghian.T1;

    const html = getTableHTML();
    expect(html).toContain('cell-unknown');
    expect(html).toContain('?');

    // Restore
    app.POSITIONS.barseghian.T1 = savedT1;
  });

  // -----------------------------------------------------------
  // Thesis rows
  // -----------------------------------------------------------
  test('includes all 33 theses as rows', () => {
    const html = getTableHTML();
    app.THESES.forEach(t => {
      expect(html, `missing thesis: ${t.id}`).toContain(t.text);
    });
  });

  test('includes theme separator rows', () => {
    const html = getTableHTML();
    const categories = [...new Set(app.THESES.map(t => t.category))];
    categories.forEach(cat => {
      expect(html, `missing category: ${cat}`).toContain(cat);
    });
    expect(html).toContain('theme-row');
  });

  // -----------------------------------------------------------
  // Candidate filtering
  // -----------------------------------------------------------
  test('respects selectedCandidates filter', () => {
    // Select only joron
    app.selectedCandidates.clear();
    app.selectedCandidates.add('joron');

    const html = getTableHTML();
    expect(html).toContain('Joron');
    expect(html).not.toContain('Barseghian');
    expect(html).not.toContain('Trautmann');
  });

  test('shows all candidates when all selected', () => {
    app.CANDIDATES.forEach(c => app.selectedCandidates.add(c.id));

    const html = getTableHTML();
    expect(html).toContain('Barseghian');
    expect(html).toContain('Trautmann');
    expect(html).toContain('Vetter');
    expect(html).toContain('Joron');
    expect(html).toContain('Kobryn');
    expect(html).toContain('Jakubowicz');
  });

  // -----------------------------------------------------------
  // Specific stance verification
  // -----------------------------------------------------------
  test('barseghian T1 shows agree (checkmark)', () => {
    app.selectedCandidates.clear();
    app.selectedCandidates.add('barseghian');

    app.buildComparisonTable();
    const table = document.getElementById('comp-table');
    const rows = table.querySelectorAll('tbody tr:not(.theme-row)');

    // T1 is the first non-theme row
    const t1Row = rows[0];
    const cells = t1Row.querySelectorAll('td');
    // Third cell (after thesis text and Vous column) should be barseghian's stance
    const stanceCell = cells[2];
    expect(stanceCell.className).toBe('cell-agree');
    expect(stanceCell.textContent).toBe('✓');
  });

  test('barseghian T11 shows disagree (cross)', () => {
    app.selectedCandidates.clear();
    app.selectedCandidates.add('barseghian');

    app.buildComparisonTable();
    const table = document.getElementById('comp-table');
    const rows = table.querySelectorAll('tbody tr:not(.theme-row)');

    // T11 is the first thesis in the security category
    // Find the row containing T11's text
    const t11Text = app.THESES.find(t => t.id === 'T11').text;
    let t11Row;
    rows.forEach(row => {
      if (row.querySelector('td')?.textContent?.includes('police municipale')) {
        t11Row = row;
      }
    });

    expect(t11Row).toBeTruthy();
    const cells = t11Row.querySelectorAll('td');
    const stanceCell = cells[2];
    expect(stanceCell.className).toBe('cell-disagree');
    expect(stanceCell.textContent).toBe('✗');
  });

  // -----------------------------------------------------------
  // User answers column
  // -----------------------------------------------------------
  test('shows user agree answer as checkmark', () => {
    app.userAnswers.T1 = { vote: 'agree', double: false };

    app.buildComparisonTable();
    const table = document.getElementById('comp-table');
    const rows = table.querySelectorAll('tbody tr:not(.theme-row)');
    const t1Row = rows[0];
    const vousCell = t1Row.querySelectorAll('td')[1];
    expect(vousCell.className).toBe('cell-agree');
    expect(vousCell.textContent).toBe('✓');
  });

  test('shows user disagree answer as cross', () => {
    app.userAnswers.T1 = { vote: 'disagree', double: false };

    app.buildComparisonTable();
    const table = document.getElementById('comp-table');
    const rows = table.querySelectorAll('tbody tr:not(.theme-row)');
    const t1Row = rows[0];
    const vousCell = t1Row.querySelectorAll('td')[1];
    expect(vousCell.className).toBe('cell-disagree');
    expect(vousCell.textContent).toBe('✗');
  });

  test('shows user neutral answer as dash', () => {
    app.userAnswers.T1 = { vote: 'neutral', double: false };

    app.buildComparisonTable();
    const table = document.getElementById('comp-table');
    const rows = table.querySelectorAll('tbody tr:not(.theme-row)');
    const t1Row = rows[0];
    const vousCell = t1Row.querySelectorAll('td')[1];
    expect(vousCell.className).toBe('cell-neutral');
    expect(vousCell.textContent).toBe('—');
  });

  test('shows unknown indicator for skipped questions', () => {
    app.userAnswers.T1 = { vote: 'skip', double: false };

    app.buildComparisonTable();
    const table = document.getElementById('comp-table');
    const rows = table.querySelectorAll('tbody tr:not(.theme-row)');
    const t1Row = rows[0];
    const vousCell = t1Row.querySelectorAll('td')[1];
    expect(vousCell.className).toBe('cell-unknown');
  });

  test('shows unknown indicator for unanswered questions', () => {
    // T1 not in userAnswers at all
    app.buildComparisonTable();
    const table = document.getElementById('comp-table');
    const rows = table.querySelectorAll('tbody tr:not(.theme-row)');
    const t1Row = rows[0];
    const vousCell = t1Row.querySelectorAll('td')[1];
    expect(vousCell.className).toBe('cell-unknown');
  });
});
