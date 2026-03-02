import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

/**
 * Loads index.html, sets up the DOM, and evaluates the embedded script.
 * Returns an object with all app functions, data constants, and mutable state.
 *
 * Functions close over their original variables, so modifying `app.userAnswers`
 * (an object) directly affects what `calcScore` etc. see. For primitives
 * (`currentIndex`, `reviewMode`), use the provided getter/setter properties.
 */
export function loadApp() {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf-8');

  // Set up DOM with body content (everything between <body> and <script>)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<script[^>]*>/);
  if (!bodyMatch) throw new Error('Could not extract body content from index.html');
  document.body.innerHTML = bodyMatch[1];

  // Extract the embedded script content
  const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/);
  if (!scriptMatch) throw new Error('Could not extract script from index.html');
  const scriptContent = scriptMatch[1];

  // Wrap in IIFE that returns all declarations.
  // Function declarations are hoisted, const/let are block-scoped inside the IIFE.
  // Getters/setters allow tests to read/write primitive state variables.
  const wrappedScript = `(function() {
    ${scriptContent}
    return {
      CANDIDATES, THESES, POSITIONS,
      userAnswers, selectedCandidates,
      calcScore, calcDocumentedCount, isUndocumented, buildDetailHTML, buildComparisonTable,
      buildCompCheckboxes, buildReviewList, renderQuestion,
      castVote, startQuiz, nextQuestion, prevQuestion,
      toggleDoubleWeight, editQuestion, updateNextLabel,
      restartQuiz, showResults, showTab, showSources, toggleMethodology,
      toggleDetail, toggleReview,
      get currentIndex() { return currentIndex; },
      set currentIndex(v) { currentIndex = v; },
      get reviewMode() { return reviewMode; },
      set reviewMode(v) { reviewMode = v; },
      get autoAdvanceTimer() { return autoAdvanceTimer; },
      set autoAdvanceTimer(v) { autoAdvanceTimer = v; }
    };
  })()`;

  return (0, eval)(wrappedScript);
}

/**
 * Resets mutable state to initial values.
 * Call in beforeEach to isolate tests.
 */
export function resetState(app) {
  if (app.autoAdvanceTimer) { clearTimeout(app.autoAdvanceTimer); app.autoAdvanceTimer = null; }
  Object.keys(app.userAnswers).forEach(k => delete app.userAnswers[k]);
  app.currentIndex = 0;
  app.reviewMode = false;
  app.selectedCandidates.clear();
  ['barseghian', 'trautmann', 'vetter'].forEach(id => app.selectedCandidates.add(id));
}
