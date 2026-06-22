// ============================================================
// Shared "normal sea" ambient backdrop for secondary pages (/blog/).
// Injects only the moody water gradient + drifting marine snow —
// no creatures (jellyfish / anglerfish / kelp). Styling is in app.css;
// the marine-snow canvas loop lives in app.js.
// Must load BEFORE app.js so its querySelectors find these nodes.
// ============================================================
(function () {
  // Don't double-inject (e.g. on a page that already has the full scene).
  if (document.querySelector('.deep-sea-bg')) return;

  var html = `
  <!-- Moody water gradient backdrop (behind content) -->
  <div class="deep-sea-bg" aria-hidden="true">
    <div class="deep-sea-water"></div>
  </div>

  <!-- Marine snow canvas (ambient particles + click ripples) -->
  <div class="deep-sea" aria-hidden="true">
    <canvas class="deep-sea-canvas"></canvas>
  </div>
  `;

  var frag = document.createElement('div');
  frag.innerHTML = html;
  while (frag.firstChild) document.body.appendChild(frag.firstChild);
})();
