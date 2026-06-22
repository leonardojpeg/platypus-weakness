// ============================================================
// Ambient deep-sea scene injector (index page).
// The full decorative SVG scene lives here instead of index.html
// so the static document stays lean for crawlers / machine readers.
// Purely visual, dark-mode only, aria-hidden. Must load BEFORE app.js
// so app.js querySelectors (.deep-sea-canvas, .jellyfish-*, .anglerfish,
// .kelp, .biolume) resolve against these injected nodes.
// ============================================================
(function () {
  if (document.querySelector('.deep-sea-bg')) return;
  var html = `
  <!-- ============================================
       DEEP-SEA AMBIENT SCENE (dark mode only)
       ============================================ -->
  <!-- Moody water gradient backdrop (sits behind content) -->
  <div class="deep-sea-bg" aria-hidden="true">
    <div class="deep-sea-water"></div>
  </div>

  <!-- Ambient creatures overlay (drifts above content like the anglerfish) -->
  <div class="deep-sea" aria-hidden="true">
    <!-- Marine snow + bioluminescent wake (JS canvas) -->
    <canvas class="deep-sea-canvas"></canvas>

    <!-- Kelp bed — horizontal fringe rooted across the bottom edge -->
    <svg class="kelp kelp-bottom" viewBox="0 0 1440 240" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kelpGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#06120f" stop-opacity="0.97"/>
          <stop offset="55%" stop-color="#0c2019" stop-opacity="0.82"/>
          <stop offset="100%" stop-color="#143028" stop-opacity="0.3"/>
        </linearGradient>
        <linearGradient id="kelpBlade" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0e261d" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#1e4a3a" stop-opacity="0.35"/>
        </linearGradient>
      </defs>
      <g class="kelp-strand kelp-strand-a"><path d="M40 240 C32 190 48 150 40 96" stroke="url(#kelpGrad)" stroke-width="5" fill="none" stroke-linecap="round"/></g>
      <g class="kelp-strand kelp-strand-b"><path d="M120 240 C130 185 112 140 122 64" stroke="url(#kelpGrad)" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M122 150 C146 138 158 108 156 76 C148 110 132 138 116 150 Z" fill="url(#kelpBlade)"/><path d="M122 96 C144 86 154 60 152 34 C146 62 132 84 118 94 Z" fill="url(#kelpBlade)"/></g>
      <g class="kelp-strand kelp-strand-c"><path d="M190 240 C184 195 196 155 188 118" stroke="url(#kelpGrad)" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.6"/></g>
      <g class="kelp-strand kelp-strand-d"><path d="M280 240 C288 188 272 148 282 86" stroke="url(#kelpGrad)" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M282 160 C304 148 314 120 312 90 C304 122 290 148 276 160 Z" fill="url(#kelpBlade)" opacity="0.85"/></g>
      <g class="kelp-strand kelp-strand-e"><path d="M360 240 C354 196 366 156 358 120" stroke="url(#kelpGrad)" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.6"/></g>
      <g class="kelp-strand kelp-strand-f"><path d="M450 240 C460 180 442 134 454 58" stroke="url(#kelpGrad)" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M454 150 C430 138 418 108 420 76 C428 110 444 138 460 150 Z" fill="url(#kelpBlade)"/><path d="M454 92 C476 82 486 56 484 30 C478 58 464 80 450 90 Z" fill="url(#kelpBlade)"/></g>
      <g class="kelp-strand kelp-strand-a"><path d="M540 240 C534 192 546 152 540 104" stroke="url(#kelpGrad)" stroke-width="5" fill="none" stroke-linecap="round"/></g>
      <g class="kelp-strand kelp-strand-b"><path d="M630 240 C640 186 622 142 632 90" stroke="url(#kelpGrad)" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M632 158 C610 146 598 118 600 88 C608 120 622 146 638 158 Z" fill="url(#kelpBlade)" opacity="0.85"/></g>
      <g class="kelp-strand kelp-strand-c"><path d="M710 240 C704 196 716 158 708 126" stroke="url(#kelpGrad)" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.6"/></g>
      <g class="kelp-strand kelp-strand-d"><path d="M800 240 C810 182 792 138 804 66" stroke="url(#kelpGrad)" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M804 150 C828 138 840 108 838 76 C830 110 814 138 798 150 Z" fill="url(#kelpBlade)"/></g>
      <g class="kelp-strand kelp-strand-e"><path d="M890 240 C884 194 896 154 888 112" stroke="url(#kelpGrad)" stroke-width="5" fill="none" stroke-linecap="round"/></g>
      <g class="kelp-strand kelp-strand-f"><path d="M980 240 C990 184 972 140 982 88" stroke="url(#kelpGrad)" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M982 156 C1004 144 1014 116 1012 86 C1004 118 990 144 976 156 Z" fill="url(#kelpBlade)" opacity="0.85"/></g>
      <g class="kelp-strand kelp-strand-a"><path d="M1060 240 C1054 196 1066 156 1058 122" stroke="url(#kelpGrad)" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.6"/></g>
      <g class="kelp-strand kelp-strand-b"><path d="M1150 240 C1160 180 1142 132 1154 58" stroke="url(#kelpGrad)" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M1154 150 C1130 138 1118 108 1120 76 C1128 110 1144 138 1160 150 Z" fill="url(#kelpBlade)"/><path d="M1154 92 C1176 82 1186 56 1184 30 C1178 58 1164 80 1150 90 Z" fill="url(#kelpBlade)"/></g>
      <g class="kelp-strand kelp-strand-c"><path d="M1240 240 C1234 195 1246 155 1238 116" stroke="url(#kelpGrad)" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.6"/></g>
      <g class="kelp-strand kelp-strand-d"><path d="M1330 240 C1340 186 1322 142 1332 84" stroke="url(#kelpGrad)" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M1332 158 C1310 146 1298 118 1300 88 C1308 120 1322 146 1338 158 Z" fill="url(#kelpBlade)" opacity="0.85"/></g>
      <g class="kelp-strand kelp-strand-e"><path d="M1410 240 C1404 196 1416 156 1408 118" stroke="url(#kelpGrad)" stroke-width="5" fill="none" stroke-linecap="round"/></g>
    </svg>

    <!-- Six bioluminescent organisms drifting in unique orbits -->
    <span class="biolume biolume-1"></span>
    <span class="biolume biolume-2"></span>
    <span class="biolume biolume-3"></span>
    <span class="biolume biolume-4"></span>
    <span class="biolume biolume-5"></span>
    <span class="biolume biolume-6"></span>

    <!-- Jellyfish — pink (translucent, glassy) -->
    <div class="jellyfish jellyfish-purple">
      <svg viewBox="0 0 140 330" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="jellyPinkOuter" cx="50%" cy="38%" r="62%">
            <stop offset="0%" stop-color="#ffd6f0" stop-opacity="0.22"/>
            <stop offset="55%" stop-color="#e87fc4" stop-opacity="0.16"/>
            <stop offset="100%" stop-color="#9a3f8e" stop-opacity="0.02"/>
          </radialGradient>
          <radialGradient id="jellyPinkInner" cx="50%" cy="42%" r="56%">
            <stop offset="0%" stop-color="#ffe0f2" stop-opacity="0.42"/>
            <stop offset="55%" stop-color="#f098cf" stop-opacity="0.24"/>
            <stop offset="100%" stop-color="#c45fa0" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="jellyPinkCore" cx="50%" cy="48%" r="50%">
            <stop offset="0%" stop-color="#fff2fb" stop-opacity="0.7"/>
            <stop offset="55%" stop-color="#ffc4e8" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="#f098cf" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="jellyPinkTent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ffc4e8" stop-opacity="0.6"/>
            <stop offset="45%" stop-color="#e87fc4" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#c45fa0" stop-opacity="0"/>
          </linearGradient>
          <filter id="jellyGlowP" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="jellySoftP" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.7"/>
          </filter>
          <filter id="jellyArmBlurP" x="-50%" y="-30%" width="200%" height="160%">
            <feGaussianBlur stdDeviation="1.1"/>
          </filter>
        </defs>

        <!-- Fine hair-like tentacles fading into the water -->
        <g class="jelly-tendrils" filter="url(#jellySoftP)">
          <path d="M28 88 C22 150 30 214 24 286 C22 312 26 322 25 330" stroke="url(#jellyPinkTent)" stroke-width="0.5" fill="none"/>
          <path d="M36 94 C32 156 38 216 34 290 C32 314 36 324 35 330" stroke="url(#jellyPinkTent)" stroke-width="0.55" fill="none"/>
          <path d="M44 98 C41 160 47 220 42 292 C40 316 44 326 43 330" stroke="url(#jellyPinkTent)" stroke-width="0.6" fill="none"/>
          <path d="M52 101 C50 162 55 222 50 294 C48 318 52 327 51 330" stroke="url(#jellyPinkTent)" stroke-width="0.65" fill="none"/>
          <path d="M60 103 C59 164 63 224 59 296 C57 318 61 328 60 330" stroke="url(#jellyPinkTent)" stroke-width="0.7" fill="none"/>
          <path d="M70 104 C70 166 68 226 70 298 C71 320 69 329 70 330" stroke="url(#jellyPinkTent)" stroke-width="0.75" fill="none"/>
          <path d="M80 103 C81 164 77 224 81 296 C83 318 79 328 80 330" stroke="url(#jellyPinkTent)" stroke-width="0.7" fill="none"/>
          <path d="M88 101 C90 162 85 222 90 294 C92 318 88 327 89 330" stroke="url(#jellyPinkTent)" stroke-width="0.65" fill="none"/>
          <path d="M96 98 C99 160 93 220 98 292 C100 316 96 326 97 330" stroke="url(#jellyPinkTent)" stroke-width="0.6" fill="none"/>
          <path d="M104 94 C108 156 102 216 106 290 C108 314 104 324 105 330" stroke="url(#jellyPinkTent)" stroke-width="0.55" fill="none"/>
          <path d="M112 88 C118 150 110 214 116 286 C118 312 114 322 115 330" stroke="url(#jellyPinkTent)" stroke-width="0.5" fill="none"/>
        </g>

        <!-- Flowing translucent oral arms -->
        <g class="jelly-arms" filter="url(#jellyArmBlurP)">
          <path d="M56 96 C48 128 58 158 50 196 C46 216 52 230 49 244" stroke="#f0a8d8" stroke-width="3" fill="none" opacity="0.28" stroke-linecap="round"/>
          <path d="M66 100 C63 134 57 166 64 206 C67 226 62 240 64 252" stroke="#ffc4e8" stroke-width="3.6" fill="none" opacity="0.32" stroke-linecap="round"/>
          <path d="M74 100 C77 134 83 166 76 206 C73 226 78 240 76 252" stroke="#ffc4e8" stroke-width="3.6" fill="none" opacity="0.32" stroke-linecap="round"/>
          <path d="M84 96 C92 128 82 158 90 196 C94 216 88 230 91 244" stroke="#f0a8d8" stroke-width="3" fill="none" opacity="0.28" stroke-linecap="round"/>
        </g>

        <!-- Glassy bell -->
        <g class="jelly-bell">
          <!-- Outer gelatinous dome (very faint, soft) -->
          <path d="M14 94 C14 50 40 22 70 22 C100 22 126 50 126 94 C124 100 119 100 114 95 C108 101 100 100 96 95 C90 101 82 100 78 95 C74 101 66 101 62 95 C58 100 50 101 44 95 C40 100 32 101 26 95 C21 100 16 99 14 94 Z" fill="url(#jellyPinkOuter)" filter="url(#jellySoftP)"/>
          <!-- Inner translucent dome -->
          <path d="M26 92 C26 56 44 32 70 32 C96 32 114 56 114 92 C112 97 107 97 103 93 C97 98 90 98 86 93 C80 98 74 98 70 93 C66 98 58 98 54 93 C50 97 43 97 37 93 C33 97 28 97 26 92 Z" fill="url(#jellyPinkInner)" filter="url(#jellySoftP)"/>
          <!-- Subsurface core glow -->
          <ellipse cx="70" cy="64" rx="26" ry="22" fill="url(#jellyPinkCore)"/>
          <!-- Delicate gonad rings -->
          <path d="M56 56 C52 68 58 78 66 75" stroke="#ffe0f2" stroke-width="0.9" fill="none" opacity="0.32"/>
          <path d="M84 56 C88 68 82 78 74 75" stroke="#ffe0f2" stroke-width="0.9" fill="none" opacity="0.32"/>
          <path d="M64 48 C60 58 64 66 71 64" stroke="#ffe0f2" stroke-width="0.7" fill="none" opacity="0.26"/>
          <path d="M78 48 C82 58 78 66 71 64" stroke="#ffe0f2" stroke-width="0.7" fill="none" opacity="0.26"/>
          <!-- Radial canals -->
          <path d="M70 34 L70 92" stroke="#ffd0ee" stroke-width="0.45" opacity="0.3"/>
          <path d="M52 38 C52 60 50 80 48 92" stroke="#ffd0ee" stroke-width="0.4" opacity="0.24"/>
          <path d="M88 38 C88 60 90 80 92 92" stroke="#ffd0ee" stroke-width="0.4" opacity="0.24"/>
          <!-- Bright rim crescent (light catching the bell margin) -->
          <path d="M18 86 C22 52 46 26 70 26 C94 26 118 52 122 86" stroke="#fff2fb" stroke-width="1" fill="none" opacity="0.5" filter="url(#jellyGlowP)"/>
          <!-- Apex sheen -->
          <ellipse cx="60" cy="44" rx="8" ry="5" fill="#fff2fb" opacity="0.2"/>
        </g>
      </svg>
    </div>

    <!-- Jellyfish — teal (translucent, glassy) -->
    <div class="jellyfish jellyfish-teal">
      <svg viewBox="0 0 130 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="jellyTealOuter" cx="50%" cy="38%" r="62%">
            <stop offset="0%" stop-color="#d6fff5" stop-opacity="0.2"/>
            <stop offset="55%" stop-color="#3fd6c0" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#1e6a64" stop-opacity="0.02"/>
          </radialGradient>
          <radialGradient id="jellyTealInner" cx="50%" cy="42%" r="56%">
            <stop offset="0%" stop-color="#e0fff7" stop-opacity="0.4"/>
            <stop offset="55%" stop-color="#6fe6d4" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="#2aa89a" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="jellyTealCore" cx="50%" cy="48%" r="50%">
            <stop offset="0%" stop-color="#f2fffb" stop-opacity="0.68"/>
            <stop offset="55%" stop-color="#aef5e8" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#6fe6d4" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="jellyTealTent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#aef5e8" stop-opacity="0.58"/>
            <stop offset="45%" stop-color="#3fd6c0" stop-opacity="0.24"/>
            <stop offset="100%" stop-color="#2aa89a" stop-opacity="0"/>
          </linearGradient>
          <filter id="jellyGlowT" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="1.8" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="jellySoftT" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.6"/>
          </filter>
          <filter id="jellyArmBlurT" x="-50%" y="-30%" width="200%" height="160%">
            <feGaussianBlur stdDeviation="1"/>
          </filter>
        </defs>

        <!-- Fine hair-like tentacles -->
        <g class="jelly-tendrils" filter="url(#jellySoftT)">
          <path d="M24 78 C19 136 26 196 21 262 C19 284 23 294 22 300" stroke="url(#jellyTealTent)" stroke-width="0.45" fill="none"/>
          <path d="M32 84 C28 142 34 200 30 266 C28 286 32 296 31 300" stroke="url(#jellyTealTent)" stroke-width="0.5" fill="none"/>
          <path d="M40 88 C37 146 43 204 38 268 C36 288 40 297 39 300" stroke="url(#jellyTealTent)" stroke-width="0.55" fill="none"/>
          <path d="M48 91 C46 148 51 206 46 270 C44 290 48 298 47 300" stroke="url(#jellyTealTent)" stroke-width="0.6" fill="none"/>
          <path d="M56 93 C55 150 59 208 55 272 C53 290 57 298 56 300" stroke="url(#jellyTealTent)" stroke-width="0.65" fill="none"/>
          <path d="M65 94 C65 152 63 210 65 274 C66 292 64 299 65 300" stroke="url(#jellyTealTent)" stroke-width="0.7" fill="none"/>
          <path d="M74 93 C75 150 71 208 75 272 C77 290 73 298 74 300" stroke="url(#jellyTealTent)" stroke-width="0.65" fill="none"/>
          <path d="M82 91 C84 148 79 206 84 270 C86 290 82 298 83 300" stroke="url(#jellyTealTent)" stroke-width="0.6" fill="none"/>
          <path d="M90 88 C93 146 87 204 92 268 C94 288 90 297 91 300" stroke="url(#jellyTealTent)" stroke-width="0.55" fill="none"/>
          <path d="M98 84 C102 142 96 200 100 266 C102 286 98 296 99 300" stroke="url(#jellyTealTent)" stroke-width="0.5" fill="none"/>
          <path d="M106 78 C111 136 104 196 109 262 C111 284 107 294 108 300" stroke="url(#jellyTealTent)" stroke-width="0.45" fill="none"/>
        </g>

        <!-- Flowing translucent oral arms -->
        <g class="jelly-arms" filter="url(#jellyArmBlurT)">
          <path d="M52 84 C44 114 54 142 46 178 C42 198 48 212 45 226" stroke="#8fe6d6" stroke-width="2.7" fill="none" opacity="0.26" stroke-linecap="round"/>
          <path d="M61 88 C58 120 52 150 59 188 C62 208 57 222 59 234" stroke="#aef5e8" stroke-width="3.3" fill="none" opacity="0.3" stroke-linecap="round"/>
          <path d="M69 88 C72 120 78 150 71 188 C68 208 73 222 71 234" stroke="#aef5e8" stroke-width="3.3" fill="none" opacity="0.3" stroke-linecap="round"/>
          <path d="M78 84 C86 114 76 142 84 178 C88 198 82 212 85 226" stroke="#8fe6d6" stroke-width="2.7" fill="none" opacity="0.26" stroke-linecap="round"/>
        </g>

        <!-- Glassy bell -->
        <g class="jelly-bell">
          <path d="M13 80 C13 40 38 16 65 16 C92 16 117 40 117 80 C115 86 110 86 106 81 C100 87 92 86 88 81 C82 87 75 86 71 81 C67 87 59 87 55 81 C51 86 43 87 37 81 C33 86 25 87 19 81 C15 86 11 85 13 80 Z" fill="url(#jellyTealOuter)" filter="url(#jellySoftT)"/>
          <path d="M24 78 C24 44 41 22 65 22 C89 22 106 44 106 78 C104 83 99 83 95 79 C89 84 82 84 78 79 C72 84 66 84 65 79 C61 84 53 84 49 79 C45 83 38 83 35 79 C31 83 26 83 24 78 Z" fill="url(#jellyTealInner)" filter="url(#jellySoftT)"/>
          <ellipse cx="65" cy="56" rx="24" ry="20" fill="url(#jellyTealCore)"/>
          <!-- Gonad rings -->
          <path d="M52 48 C48 60 54 70 62 67" stroke="#e0fff7" stroke-width="0.85" fill="none" opacity="0.32"/>
          <path d="M78 48 C82 60 76 70 68 67" stroke="#e0fff7" stroke-width="0.85" fill="none" opacity="0.32"/>
          <path d="M59 40 C55 50 59 58 66 56" stroke="#e0fff7" stroke-width="0.65" fill="none" opacity="0.26"/>
          <path d="M71 40 C75 50 71 58 64 56" stroke="#e0fff7" stroke-width="0.65" fill="none" opacity="0.26"/>
          <!-- Radial canals -->
          <path d="M65 26 L65 80" stroke="#c0ffee" stroke-width="0.4" opacity="0.3"/>
          <path d="M48 30 C48 52 46 70 44 80" stroke="#c0ffee" stroke-width="0.35" opacity="0.24"/>
          <path d="M82 30 C82 52 84 70 86 80" stroke="#c0ffee" stroke-width="0.35" opacity="0.24"/>
          <!-- Bright rim crescent -->
          <path d="M16 74 C20 42 42 20 65 20 C88 20 110 42 114 74" stroke="#f2fffb" stroke-width="0.95" fill="none" opacity="0.5" filter="url(#jellyGlowT)"/>
          <!-- Apex sheen -->
          <ellipse cx="55" cy="36" rx="7" ry="4.5" fill="#f2fffb" opacity="0.2"/>
        </g>
      </svg>
    </div>
  </div>
  <!-- /deep-sea -->

  <!-- Hidden deep-sea easter egg (dark mode only) -->
  <div class="anglerfish" aria-hidden="true">
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="anglerBodyGrad" cx="42%" cy="38%" r="58%">
          <stop offset="0%" stop-color="#2d2926"/>
          <stop offset="35%" stop-color="#1f1c19"/>
          <stop offset="70%" stop-color="#141210"/>
          <stop offset="100%" stop-color="#090807"/>
        </radialGradient>
        <radialGradient id="anglerBellyGrad" cx="50%" cy="80%" r="50%">
          <stop offset="0%" stop-color="#2a2622"/>
          <stop offset="100%" stop-color="#141210" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="lureGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fffde8" stop-opacity="1"/>
          <stop offset="20%" stop-color="#fef3b5" stop-opacity="0.9"/>
          <stop offset="45%" stop-color="#d4a84a" stop-opacity="0.5"/>
          <stop offset="70%" stop-color="#8b6914" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#5a4010" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="photophoreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#7ec8e3" stop-opacity="0.9"/>
          <stop offset="50%" stop-color="#4a9ab5" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#2a6680" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="finMembraneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1a1816" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="#0d0c0b" stop-opacity="0.3"/>
        </linearGradient>
        <filter id="anglerSkin" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" seed="3"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="lureIntenseGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- === LURE ASSEMBLY === -->
      <circle cx="72" cy="20" r="28" fill="url(#lureGlow)" class="angler-lure-outer" opacity="0.6"/>
      <circle cx="72" cy="20" r="16" fill="#d4a05a" opacity="0.15" class="angler-lure-mid"/>
      <ellipse cx="72" cy="20" rx="6" ry="5" fill="#f5e6a3" opacity="0.9" filter="url(#lureIntenseGlow)" class="angler-lure-bulb"/>
      <ellipse cx="71" cy="19" rx="3.5" ry="3" fill="#fffef5" class="angler-lure-bulb"/>
      <!-- Esca filaments -->
      <path d="M68 17 C66 14 67 12 69 13" stroke="#d4a05a" stroke-width="0.4" fill="none" opacity="0.5"/>
      <path d="M76 17 C78 14 77 12 75 13" stroke="#d4a05a" stroke-width="0.4" fill="none" opacity="0.5"/>
      <path d="M72 15 C72 12 73 10 72 11" stroke="#d4a05a" stroke-width="0.3" fill="none" opacity="0.4"/>

      <!-- Illicium (stalk) - segmented -->
      <path d="M95 62 C92 52 86 40 80 30 C77 25 74 22 72 20" stroke="#4a4540" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <path d="M92 55 C91 53 90 51 89 49" stroke="#5a5550" stroke-width="0.4" fill="none" opacity="0.4"/>
      <path d="M87 44 C86 42 85 40 84 38" stroke="#5a5550" stroke-width="0.4" fill="none" opacity="0.3"/>
      <path d="M81 33 C80 31 79 29 78 27" stroke="#5a5550" stroke-width="0.3" fill="none" opacity="0.3"/>

      <!-- === BODY === -->
      <path d="M70 100 C55 85 55 65 75 58 C90 52 118 48 148 55 C175 62 188 80 186 100 C184 118 168 132 145 135 C122 137 98 133 82 125 C65 117 58 108 70 100 Z" 
            fill="url(#anglerBodyGrad)" filter="url(#anglerSkin)"/>
      <ellipse cx="125" cy="120" rx="35" ry="12" fill="url(#anglerBellyGrad)" opacity="0.4"/>
      <path d="M70 100 C55 85 55 65 75 58 C90 52 118 48 148 55 C175 62 188 80 186 100 C184 118 168 132 145 135 C122 137 98 133 82 125 C65 117 58 108 70 100 Z" 
            fill="none" stroke="#3a3632" stroke-width="0.6" opacity="0.7"/>

      <!-- Body texture - wrinkles, scale patches, nodules -->
      <path d="M88 64 C95 62 105 61 112 62" stroke="#252220" stroke-width="0.5" fill="none" opacity="0.6"/>
      <path d="M120 56 C130 55 140 56 148 59" stroke="#252220" stroke-width="0.5" fill="none" opacity="0.5"/>
      <path d="M160 68 C165 74 168 82 166 90" stroke="#252220" stroke-width="0.4" fill="none" opacity="0.4"/>
      <path d="M78 112 C86 116 98 118 110 117" stroke="#252220" stroke-width="0.4" fill="none" opacity="0.5"/>
      <path d="M130 128 C140 126 148 122 154 118" stroke="#252220" stroke-width="0.4" fill="none" opacity="0.4"/>
      <path d="M95 72 C100 70 106 70 110 72" stroke="#1e1c1a" stroke-width="0.3" fill="none" opacity="0.5"/>
      <path d="M145 70 C150 72 154 76 155 80" stroke="#1e1c1a" stroke-width="0.3" fill="none" opacity="0.4"/>
      <!-- Scale patches -->
      <path d="M115 68 C117 67 119 67 120 68 C119 69 117 69 115 68" fill="#1e1c1a" opacity="0.3"/>
      <path d="M130 65 C132 64 134 64 135 65 C134 66 132 66 130 65" fill="#1e1c1a" opacity="0.25"/>
      <path d="M140 75 C142 74 144 74 145 75 C144 76 142 76 140 75" fill="#1e1c1a" opacity="0.3"/>
      <path d="M110 105 C112 104 114 104 115 105 C114 106 112 106 110 105" fill="#1e1c1a" opacity="0.25"/>
      <path d="M150 95 C152 94 154 94 155 95 C154 96 152 96 150 95" fill="#1e1c1a" opacity="0.2"/>
      <!-- Nodules -->
      <circle cx="112" cy="66" r="1.8" fill="#201e1c" opacity="0.5"/>
      <circle cx="140" cy="63" r="1.2" fill="#201e1c" opacity="0.4"/>
      <circle cx="162" cy="78" r="2" fill="#201e1c" opacity="0.4"/>
      <circle cx="100" cy="115" r="1.4" fill="#201e1c" opacity="0.5"/>
      <circle cx="152" cy="120" r="1.1" fill="#201e1c" opacity="0.3"/>
      <circle cx="88" cy="95" r="1" fill="#201e1c" opacity="0.4"/>

      <!-- === BIOLUMINESCENT PHOTOPHORES === -->
      <circle cx="100" cy="88" r="1.2" fill="#7ec8e3" opacity="0.6" filter="url(#softGlow)" class="angler-photophore"/>
      <circle cx="115" cy="84" r="1" fill="#7ec8e3" opacity="0.5" filter="url(#softGlow)" class="angler-photophore"/>
      <circle cx="130" cy="82" r="1.3" fill="#7ec8e3" opacity="0.55" filter="url(#softGlow)" class="angler-photophore"/>
      <circle cx="145" cy="85" r="0.9" fill="#7ec8e3" opacity="0.45" filter="url(#softGlow)" class="angler-photophore"/>
      <circle cx="158" cy="90" r="1.1" fill="#7ec8e3" opacity="0.5" filter="url(#softGlow)" class="angler-photophore"/>
      <circle cx="108" cy="112" r="0.8" fill="#5ab8d4" opacity="0.4" filter="url(#softGlow)" class="angler-photophore"/>
      <circle cx="125" cy="118" r="1" fill="#5ab8d4" opacity="0.35" filter="url(#softGlow)" class="angler-photophore"/>
      <circle cx="140" cy="115" r="0.7" fill="#5ab8d4" opacity="0.3" filter="url(#softGlow)" class="angler-photophore"/>

      <!-- === GILL SLITS === -->
      <path d="M92 92 C93 96 93 100 92 104" stroke="#1a1816" stroke-width="0.8" fill="none" opacity="0.7" class="angler-gill"/>
      <path d="M96 91 C97 95 97 99 96 103" stroke="#1a1816" stroke-width="0.6" fill="none" opacity="0.5" class="angler-gill"/>
      <path d="M100 90 C101 94 101 98 100 101" stroke="#1a1816" stroke-width="0.5" fill="none" opacity="0.4" class="angler-gill"/>

      <!-- Dorsal fin spines with membrane -->
      <path d="M93 58 C90 50 94 43 97 46 C99 49 96 55 95 58" stroke="#3a3530" stroke-width="0.7" fill="url(#finMembraneGrad)"/>
      <path d="M107 54 C105 45 109 39 112 42 C114 46 111 51 109 54" stroke="#3a3530" stroke-width="0.7" fill="url(#finMembraneGrad)"/>
      <path d="M122 52 C121 44 125 39 128 42 C129 45 127 49 125 52" stroke="#3a3530" stroke-width="0.6" fill="url(#finMembraneGrad)"/>
      <path d="M136 53 C136 46 139 42 141 44 C142 47 140 51 138 53" stroke="#3a3530" stroke-width="0.5" fill="url(#finMembraneGrad)" opacity="0.8"/>
      <!-- Spine webbing -->
      <path d="M95 56 C100 52 104 52 109 53" stroke="#2a2623" stroke-width="0.3" fill="none" opacity="0.3"/>
      <path d="M109 53 C115 50 119 50 125 51" stroke="#2a2623" stroke-width="0.3" fill="none" opacity="0.25"/>

      <!-- Tail fin - ragged -->
      <path d="M183 92 C190 80 200 75 204 82 C206 87 202 91 196 93 C202 95 207 100 205 107 C202 113 192 111 185 103 C188 108 190 114 187 117 C184 119 180 115 179 109" 
            fill="url(#finMembraneGrad)" stroke="#2d2a26" stroke-width="0.6" opacity="0.85"/>
      <path d="M184 86 L198 79" stroke="#2a2623" stroke-width="0.4" opacity="0.5"/>
      <path d="M185 93 L200 91" stroke="#2a2623" stroke-width="0.4" opacity="0.5"/>
      <path d="M184 100 L198 104" stroke="#2a2623" stroke-width="0.4" opacity="0.5"/>
      <path d="M183 107 L192 112" stroke="#2a2623" stroke-width="0.3" opacity="0.4"/>
      <path d="M203 83 C205 81 206 83 204 84" stroke="#2d2a26" stroke-width="0.3" fill="none" opacity="0.5"/>
      <path d="M205 105 C207 103 208 105 206 106" stroke="#2d2a26" stroke-width="0.3" fill="none" opacity="0.4"/>

      <!-- Pectoral fin - translucent membrane -->
      <path d="M148 115 C156 124 160 136 155 141 C149 144 142 136 138 126 C135 120 138 115 148 115 Z" 
            fill="url(#finMembraneGrad)" stroke="#2d2a26" stroke-width="0.5" opacity="0.8"/>
      <path d="M147 117 L154 132" stroke="#2a2623" stroke-width="0.3" opacity="0.5"/>
      <path d="M144 119 L150 135" stroke="#2a2623" stroke-width="0.3" opacity="0.4"/>
      <path d="M141 121 L146 134" stroke="#2a2623" stroke-width="0.3" opacity="0.4"/>

      <!-- Ventral fin -->
      <path d="M112 130 C118 140 116 146 111 144 C107 142 108 136 112 130 Z" 
            fill="url(#finMembraneGrad)" stroke="#2d2a26" stroke-width="0.4" opacity="0.7"/>
      <path d="M112 131 L114 140" stroke="#2a2623" stroke-width="0.25" opacity="0.4"/>
      <!-- Anal fin -->
      <path d="M155 130 C158 137 156 141 153 139 C151 137 152 133 155 130 Z" 
            fill="url(#finMembraneGrad)" stroke="#2d2a26" stroke-width="0.4" opacity="0.6"/>

      <!-- === EYE - small, deep-set === -->
      <circle cx="84" cy="84" r="10" fill="#070605" opacity="0.5"/>
      <circle cx="84" cy="84" r="8" fill="#0a0908"/>
      <circle cx="84" cy="84" r="6.5" fill="#121110"/>
      <circle cx="84" cy="84" r="5" fill="none" stroke="#4a3a1a" stroke-width="1.8" opacity="0.8"/>
      <circle cx="84" cy="84" r="4" fill="none" stroke="#3d2f15" stroke-width="0.4" opacity="0.5"/>
      <circle cx="84" cy="84" r="3.2" fill="#030302"/>
      <circle cx="82" cy="81" r="2" fill="#d4a05a" opacity="0.5" class="angler-eye-reflect"/>
      <circle cx="86" cy="86" r="0.8" fill="#d4a05a" opacity="0.25"/>
      <path d="M76 80 C79 77 86 76 92 79" stroke="#2a2623" stroke-width="0.5" fill="none" opacity="0.6"/>

      <!-- === JAW - massive underbite === -->
      <path d="M62 102 C57 105 53 112 55 118 C58 124 68 128 82 127 C96 126 108 122 118 117 C124 114 125 108 120 103" 
            stroke="#3a3632" stroke-width="0.8" fill="#0f0e0d" class="angler-jaw"/>
      <path d="M58 110 C65 115 78 120 95 119 C108 118 118 113 122 108" 
            stroke="#222019" stroke-width="0.5" fill="none" opacity="0.5"/>
      <path d="M60 106 C62 108 65 110 68 111" stroke="#222019" stroke-width="0.3" fill="none" opacity="0.4"/>

      <!-- === TEETH - varied, translucent, needle-like === -->
      <!-- Upper teeth -->
      <path d="M68 100 L65 110 L71 101" fill="#4a4640" stroke="#5a5550" stroke-width="0.3" opacity="0.9"/>
      <path d="M75 98 L71 112 L78 99" fill="#504b45" stroke="#5a5550" stroke-width="0.3" opacity="0.95"/>
      <path d="M82 97 L79 113 L85 98" fill="#4a4640" stroke="#5a5550" stroke-width="0.3" opacity="0.9"/>
      <path d="M89 97 L87 110 L92 98" fill="#4a4640" stroke="#5a5550" stroke-width="0.3" opacity="0.85"/>
      <path d="M96 98 L94 108 L99 99" fill="#4a4640" stroke="#5a5550" stroke-width="0.3" opacity="0.8"/>
      <path d="M103 99 L101 108 L106 100" fill="#3d3a36" stroke="#5a5550" stroke-width="0.3" opacity="0.75"/>
      <path d="M110 100 L109 107 L113 101" fill="#3d3a36" stroke="#5a5550" stroke-width="0.3" opacity="0.7"/>
      <path d="M116 101 L115 106 L118 102" fill="#353230" stroke="#5a5550" stroke-width="0.3" opacity="0.6"/>
      <!-- Lower teeth -->
      <path d="M63 113 L66 103 L68 112" fill="#4a4640" stroke="#5a5550" stroke-width="0.3" opacity="0.85"/>
      <path d="M72 117 L75 105 L77 116" fill="#504b45" stroke="#5a5550" stroke-width="0.3" opacity="0.9"/>
      <path d="M82 119 L85 106 L87 118" fill="#4a4640" stroke="#5a5550" stroke-width="0.3" opacity="0.9"/>
      <path d="M92 118 L94 107 L96 117" fill="#4a4640" stroke="#5a5550" stroke-width="0.3" opacity="0.85"/>
      <path d="M102 116 L104 107 L106 115" fill="#3d3a36" stroke="#5a5550" stroke-width="0.3" opacity="0.8"/>
      <path d="M111 113 L112 106 L114 112" fill="#353230" stroke="#5a5550" stroke-width="0.3" opacity="0.7"/>
      <!-- Oversized fangs -->
      <path d="M72 99 L68 116 L75 100" fill="#5a5550" stroke="#6a6560" stroke-width="0.4" opacity="0.8"/>
      <path d="M88 97 L84 117 L91 98" fill="#5a5550" stroke="#6a6560" stroke-width="0.4" opacity="0.8"/>
      <path d="M78 120 L82 102 L84 119" fill="#5a5550" stroke="#6a6560" stroke-width="0.4" opacity="0.75"/>

      <!-- === BARBELS (sensory whiskers) === -->
      <path d="M70 128 C66 136 64 145 67 150" stroke="#3a3530" stroke-width="0.5" fill="none" opacity="0.5" class="angler-barbel"/>
      <circle cx="67" cy="151" r="1.2" fill="#7ec8e3" opacity="0.3" filter="url(#softGlow)" class="angler-photophore"/>
      <path d="M80 127 C78 133 77 140 79 143" stroke="#3a3530" stroke-width="0.4" fill="none" opacity="0.4" class="angler-barbel"/>
      <circle cx="79" cy="144" r="0.8" fill="#7ec8e3" opacity="0.25" filter="url(#softGlow)" class="angler-photophore"/>

      <!-- Light rays from lure -->
      <line x1="72" y1="20" x2="60" y2="5" stroke="#d4a05a" stroke-width="0.5" opacity="0.25" class="angler-ray"/>
      <line x1="72" y1="20" x2="84" y2="3" stroke="#d4a05a" stroke-width="0.5" opacity="0.25" class="angler-ray"/>
      <line x1="72" y1="20" x2="54" y2="14" stroke="#d4a05a" stroke-width="0.4" opacity="0.2" class="angler-ray"/>
      <line x1="72" y1="20" x2="90" y2="11" stroke="#d4a05a" stroke-width="0.4" opacity="0.2" class="angler-ray"/>
      <line x1="72" y1="20" x2="65" y2="1" stroke="#d4a05a" stroke-width="0.3" opacity="0.15" class="angler-ray"/>
      <line x1="72" y1="20" x2="79" y2="0" stroke="#d4a05a" stroke-width="0.3" opacity="0.15" class="angler-ray"/>
      <line x1="72" y1="20" x2="50" y2="8" stroke="#d4a05a" stroke-width="0.25" opacity="0.1" class="angler-ray"/>
      <line x1="72" y1="20" x2="94" y2="6" stroke="#d4a05a" stroke-width="0.25" opacity="0.1" class="angler-ray"/>

      <!-- Prey particles drawn to light -->
      <circle cx="58" cy="8" r="0.7" fill="#d4a05a" opacity="0.35" class="angler-particle angler-particle-1"/>
      <circle cx="88" cy="5" r="0.5" fill="#d4a05a" opacity="0.3" class="angler-particle angler-particle-2"/>
      <circle cx="48" cy="15" r="0.4" fill="#c49a3c" opacity="0.2" class="angler-particle angler-particle-3"/>
      <circle cx="95" cy="14" r="0.6" fill="#d4a05a" opacity="0.25" class="angler-particle angler-particle-4"/>
      <circle cx="65" cy="2" r="0.3" fill="#e8c86a" opacity="0.2" class="angler-particle angler-particle-5"/>

      <!-- Marine snow (ambient deep-sea particles) -->
      <circle cx="20" cy="60" r="0.4" fill="#4a4640" opacity="0.15" class="angler-snow"/>
      <circle cx="240" cy="40" r="0.3" fill="#4a4640" opacity="0.12" class="angler-snow"/>
      <circle cx="45" cy="150" r="0.35" fill="#4a4640" opacity="0.1" class="angler-snow"/>
      <circle cx="220" cy="160" r="0.4" fill="#4a4640" opacity="0.12" class="angler-snow"/>
      <circle cx="130" cy="170" r="0.3" fill="#4a4640" opacity="0.08" class="angler-snow"/>
    </svg>
  </div>
`;
  var frag = document.createElement('div');
  frag.innerHTML = html;
  while (frag.firstChild) document.body.appendChild(frag.firstChild);
})();
