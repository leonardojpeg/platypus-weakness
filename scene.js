// ============================================================
// Ambient deep-sea backdrop (index page).
// Subtle, professional: a moody water gradient + drifting marine snow
// (canvas, handled in app.js) and a few faint bioluminescent motes.
// No creatures. Dark-mode only, aria-hidden, purely decorative.
// Must load BEFORE app.js so its querySelectors resolve.
// ============================================================
(function () {
  if (document.querySelector('.deep-sea-bg')) return;

  var html = `
  <!-- Moody water gradient backdrop (sits behind content) -->
  <div class="deep-sea-bg" aria-hidden="true">
    <div class="deep-sea-water"></div>
  </div>

  <!-- Marine snow canvas + faint ambient motes -->
  <div class="deep-sea" aria-hidden="true">
    <canvas class="deep-sea-canvas"></canvas>
    <span class="biolume biolume-1"></span>
    <span class="biolume biolume-2"></span>
    <span class="biolume biolume-3"></span>
    <span class="biolume biolume-4"></span>
    <span class="biolume biolume-5"></span>
    <span class="biolume biolume-6"></span>
  </div>
  `;

  var frag = document.createElement('div');
  frag.innerHTML = html;
  while (frag.firstChild) document.body.appendChild(frag.firstChild);
})();
