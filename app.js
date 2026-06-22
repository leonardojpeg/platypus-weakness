(function () {
  'use strict';

  // ========================================
  // LENIS SMOOTH SCROLL (graceful if not loaded)
  // ========================================
  var lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
      wheelMultiplier: 0.8
    });

    function lenisRaf(time) {
      lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);
  }

  // ========================================
  // PAGE LOADER
  // ========================================
  var loader = document.querySelector('.page-loader');
  if (loader) {
    document.body.classList.add('loading');
    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
        initHeroSequence();
      }, 200);
    });
  } else {
    window.addEventListener('DOMContentLoaded', initHeroSequence);
  }

  // ========================================
  // THEME TOGGLE (with View Transition wipe)
  // ========================================
  var themeToggle = document.querySelector('.theme-toggle');
  var saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark');
  }

  // Favicon swap based on theme
  function updateFavicon() {
    var link = document.querySelector('link[rel="icon"]');
    if (!link) return;
    var isDark = document.body.classList.contains('dark');
    var basePath = link.getAttribute('href').replace(/favicon[^/]*\.svg/, '');
    link.href = basePath + (isDark ? 'favicon-moon.svg' : 'favicon-sun.svg');
  }
  updateFavicon();

  if (themeToggle) {
    themeToggle.addEventListener('click', function (e) {
      // Use View Transition API for circular wipe effect
      if (document.startViewTransition) {
        var x = e.clientX || window.innerWidth / 2;
        var y = e.clientY || window.innerHeight / 2;
        var endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );
        document.documentElement.style.setProperty('--wipe-x', x + 'px');
        document.documentElement.style.setProperty('--wipe-y', y + 'px');
        document.documentElement.style.setProperty('--wipe-radius', endRadius + 'px');

        var transition = document.startViewTransition(function () {
          document.body.classList.toggle('dark');
          localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
          updateFavicon();
        });
      } else {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
        updateFavicon();
      }
    });
  }

  // ========================================
  // NAV SCROLL
  // ========================================
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ========================================
  // MOBILE NAV
  // ========================================
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('active');
      toggle.setAttribute('aria-expanded', open);
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ========================================
  // SCROLL PROGRESS BAR
  // ========================================
  var progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var progress = h > 0 ? window.scrollY / h : 0;
      progressBar.style.transform = 'scaleX(' + progress + ')';
    }, { passive: true });
  }

  // ========================================
  // CUSTOM CURSOR — blend mode + context states
  // ========================================
  var cursorDot = document.querySelector('.cursor-dot');
  var cursorRing = document.querySelector('.cursor-ring');
  var isTouchDevice = 'ontouchstart' in window;

  if (cursorDot && cursorRing && !isTouchDevice) {
    var mouseX = 0, mouseY = 0;
    var ringX = 0, ringY = 0;
    var cursorState = 'default';

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Context-aware cursor states
    function setCursorState(state) {
      if (cursorState === state) return;
      document.body.classList.remove('cursor-' + cursorState);
      cursorState = state;
      document.body.classList.add('cursor-' + cursorState);
    }

    // Links and buttons — pill cursor with blend
    var linkTargets = document.querySelectorAll('a, button, .contact-link, .hero-cta');
    linkTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () { setCursorState('link'); });
      el.addEventListener('mouseleave', function () { setCursorState('default'); });
    });

    // Images — spotlight reveal
    var imgTargets = document.querySelectorAll('.hero-image, .badge-frame, .contact-badge');
    imgTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () { setCursorState('spotlight'); });
      el.addEventListener('mouseleave', function () { setCursorState('default'); });
    });

    // Blog entries — text state
    var blogTargets = document.querySelectorAll('.blog-entry, .project-card');
    blogTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () { setCursorState('explore'); });
      el.addEventListener('mouseleave', function () { setCursorState('default'); });
    });

    // Click anywhere on blog entry to navigate
    document.querySelectorAll('.blog-entry').forEach(function (entry) {
      var link = entry.querySelector('h3 a');
      if (link) {
        entry.style.cursor = 'none';
        entry.addEventListener('click', function (e) {
          if (e.target.closest('a')) return; // let actual links work normally
          link.click();
        });
      }
    });

    // Tags
    var tagTargets = document.querySelectorAll('.tag');
    tagTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () { setCursorState('link'); });
      el.addEventListener('mouseleave', function () { setCursorState('default'); });
    });
  }

  // ========================================
  // ANGLERFISH — hovers just left of the © copyright (dark mode easter egg)
  // ========================================
  var anglerfish = document.querySelector('.anglerfish');
  var anglerAnchor = document.querySelector('.site-footer p');
  if (anglerfish && anglerAnchor) {
    var anglerKelp = document.querySelector('.kelp-bottom');
    var kelpDepth = 0; // kelp fades in with the fish when the bottom is reached
    if (anglerKelp) anglerKelp.style.opacity = '0'; // hidden until scrolled to
    var anglerX = window.innerWidth * 0.5;
    var anglerY = window.innerHeight + 200; // start below view, glides up
    var anglerTime = 0;
    var anglerJawOpen = 0; // 0 = closed, 1 = fully open
    var anglerDepth = 0; // starts invisible, fades in slowly
    var anglerPushX = 0, anglerPushY = 0; // impulse from click waves
    var anglerHalfWidth = 88; // ~half the fish's visual width

    var anglerJaw = anglerfish.querySelector('.angler-jaw');

    // Expose a push so the click-wave can shove the fish away
    anglerfish._push = function (fromX, fromY, force) {
      var dxp = anglerX - fromX;
      var dyp = anglerY - fromY;
      var d = Math.sqrt(dxp * dxp + dyp * dyp) || 1;
      anglerPushX += (dxp / d) * force;
      anglerPushY += (dyp / d) * force;
    };

    function animateAngler() {
      anglerTime += 0.02;

      var r = anglerAnchor.getBoundingClientRect();
      var halfW = (anglerfish.offsetWidth || 180) / 2;
      var halfH = (anglerfish.offsetHeight || 130) / 2;
      var isMobile = window.innerWidth <= 600;

      var targetX, targetY;
      if (isMobile) {
        // Tuck fully into the bottom-right corner, clear of the centered copyright
        targetX = window.innerWidth - halfW - 6;
        targetY = window.innerHeight - halfH - 12;
      } else {
        // Anchor just to the LEFT of the "© 2026 …" line, vertically centered
        var gap = 20;
        targetX = Math.max(halfW + 6, r.left - gap - halfW);
        targetY = r.top + r.height / 2;
      }

      // Ease into place (glides up on first reveal, follows on scroll/resize)
      anglerX += (targetX - anglerX) * 0.08;
      anglerY += (targetY - anglerY) * 0.08;

      // Visible in dark mode while the copyright line is on screen
      var visible = r.top < window.innerHeight - 10 && r.bottom > 0;

      // Kelp bed fades in alongside the fish as the footer is reached
      if (anglerKelp) {
        kelpDepth += ((visible ? 0.85 : 0) - kelpDepth) * 0.06;
        anglerKelp.style.opacity = kelpDepth.toFixed(3);
      }

      // Idle jaw — slow, occasional gulp
      var jawTarget = Math.sin(anglerTime * 0.5) > 0.7 ? 1 : 0;
      anglerJawOpen += (jawTarget - anglerJawOpen) * 0.04;
      if (anglerJaw) {
        anglerJaw.style.transform = 'translateY(' + (anglerJawOpen * 4) + 'px)';
      }

      // Very gentle hover so it stays level with the copyright line it floats beside
      var swimY = Math.sin(anglerTime * 0.8) * 1.5 + Math.sin(anglerTime * 1.6) * 0.5;
      var swimRotate = Math.sin(anglerTime * 0.6) * 1 + Math.sin(anglerTime * 1.1) * 0.3;
      var breathScale = 1 + Math.sin(anglerTime * 0.35) * 0.015 + Math.sin(anglerTime * 0.7) * 0.008;

      // Opacity gate
      var depthTarget = visible ? 0.85 + Math.sin(anglerTime * 0.15) * 0.06 : 0;
      anglerDepth += (depthTarget - anglerDepth) * 0.05;
      anglerfish.style.opacity = document.body.classList.contains('dark') ? anglerDepth : '0';

      // Mirror the art so the head/lure faces RIGHT, toward the text
      var scaleX = -breathScale;

      // Apply + decay click-wave push
      anglerPushX *= 0.92;
      anglerPushY *= 0.92;

      anglerfish.style.left = (anglerX + anglerPushX) + 'px';
      anglerfish.style.top = (anglerY + swimY + anglerPushY) + 'px';
      anglerfish.style.transform = 'translate(-50%, -50%) scaleX(' + scaleX + ') scaleY(' + breathScale + ') rotate(' + swimRotate + 'deg)';

      requestAnimationFrame(animateAngler);
    }
    animateAngler();
  }

  // ========================================
  // JELLYFISH — slow wander around the top of the viewport (dark mode)
  // Position only (opacity stays CSS-controlled) so they never vanish.
  // ========================================
  var jellies = [
    { el: document.querySelector('.jellyfish-purple'), x: 0, y: 0, tx: 0, ty: 0, t: Math.random() * 10, repick: 0, speed: 0.0035 },
    { el: document.querySelector('.jellyfish-teal'), x: 0, y: 0, tx: 0, ty: 0, t: Math.random() * 10, repick: 0, speed: 0.0028 }
  ];
  if (jellies[0].el && jellies[1].el && !isTouchDevice) {
    // Roam the upper portion of the viewport (fixed — independent of scroll).
    // Inset well away from the edges so they never hug/bounce off the walls.
    function jellyBounds() {
      return {
        left: window.innerWidth * 0.16,
        top: window.innerHeight * 0.12,
        width: window.innerWidth * 0.6,
        height: window.innerHeight * 0.3
      };
    }

    var jb = jellyBounds();
    jellies.forEach(function (j) {
      j.x = jb.left + Math.random() * jb.width;
      j.y = jb.top + Math.random() * jb.height;
      j.tx = j.x; j.ty = j.y;
    });

    function animateJellies() {
      var b = jellyBounds();
      for (var i = 0; i < jellies.length; i++) {
        var j = jellies[i];
        j.t += 0.02;

        var dxx = j.tx - j.x, dyy = j.ty - j.y;
        var d = Math.sqrt(dxx * dxx + dyy * dyy);
        j.repick--;
        if (d < 40 || j.repick <= 0) {
          j.tx = b.left + Math.random() * b.width;
          j.ty = b.top + Math.random() * b.height;
          j.repick = 240 + Math.floor(Math.random() * 240);
        }
        j.tx = Math.min(b.left + b.width, Math.max(b.left, j.tx));
        j.ty = Math.min(b.top + b.height, Math.max(b.top, j.ty));

        dxx = j.tx - j.x; dyy = j.ty - j.y;
        j.x += dxx * j.speed;
        j.y += dyy * j.speed;

        var bob = Math.sin(j.t) * 3;
        j.el.style.left = j.x + 'px';
        j.el.style.top = (j.y + bob) + 'px';
      }
      requestAnimationFrame(animateJellies);
    }
    animateJellies();
  }

  // ========================================
  // DEEP-SEA CANVAS — marine snow + click ripples
  // ========================================
  var deepSeaCanvas = document.querySelector('.deep-sea-canvas');
  if (deepSeaCanvas) {
    var dsCtx = deepSeaCanvas.getContext('2d');
    var snow = [];
    var ripples = [];
    var snowCount = 0;

    function resizeDeepSea() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      deepSeaCanvas.width = window.innerWidth * dpr;
      deepSeaCanvas.height = window.innerHeight * dpr;
      deepSeaCanvas.style.width = window.innerWidth + 'px';
      deepSeaCanvas.style.height = window.innerHeight + 'px';
      dsCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Scale snow count to viewport area
      snowCount = Math.round((window.innerWidth * window.innerHeight) / 9000);
    }
    resizeDeepSea();
    window.addEventListener('resize', resizeDeepSea);

    // Seed marine snow — tiny drifting particles of varied size/speed/depth
    function seedSnow() {
      snow = [];
      for (var i = 0; i < snowCount; i++) {
        var depth = Math.random(); // 0 = far (small, dim, slow), 1 = near
        snow.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: 0.4 + depth * 1.8,
          vy: 0.08 + depth * 0.35,
          vx: (Math.random() - 0.5) * 0.15,
          drift: Math.random() * Math.PI * 2,
          driftSpeed: 0.005 + Math.random() * 0.01,
          opacity: 0.06 + depth * 0.22
        });
      }
    }
    seedSnow();

    // Ripple on click
    document.addEventListener('click', function (e) {
      ripples.push({ x: e.clientX, y: e.clientY, r: 4, life: 1, hue: 175 + Math.random() * 30 });
    });

    function animateDeepSea() {
      var isDark = document.body.classList.contains('dark');
      dsCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (isDark) {
        // --- Marine snow ---
        for (var i = 0; i < snow.length; i++) {
          var p = snow[i];
          p.drift += p.driftSpeed;
          p.y += p.vy;
          p.x += p.vx + Math.sin(p.drift) * 0.25;
          if (p.y > window.innerHeight + 5) { p.y = -5; p.x = Math.random() * window.innerWidth; }
          if (p.x < -5) p.x = window.innerWidth + 5;
          if (p.x > window.innerWidth + 5) p.x = -5;
          dsCtx.beginPath();
          dsCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          dsCtx.fillStyle = 'rgba(200, 230, 235, ' + p.opacity + ')';
          dsCtx.fill();
        }

        // --- Click ripples ---
        for (var r = ripples.length - 1; r >= 0; r--) {
          var rp = ripples[r];
          rp.r += 3;
          rp.life -= 0.02;
          if (rp.life <= 0) { ripples.splice(r, 1); continue; }
          dsCtx.beginPath();
          dsCtx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
          dsCtx.strokeStyle = 'hsla(' + rp.hue + ', 75%, 70%, ' + (rp.life * 0.4) + ')';
          dsCtx.lineWidth = 1.5;
          dsCtx.stroke();
          // inner ring
          dsCtx.beginPath();
          dsCtx.arc(rp.x, rp.y, rp.r * 0.6, 0, Math.PI * 2);
          dsCtx.strokeStyle = 'hsla(' + rp.hue + ', 75%, 80%, ' + (rp.life * 0.25) + ')';
          dsCtx.lineWidth = 1;
          dsCtx.stroke();
        }
      }
      requestAnimationFrame(animateDeepSea);
    }
    animateDeepSea();
  }

  // ========================================
  // SUBMERGE WASH (plays when entering dark mode)
  // ========================================
  (function () {
    var subEl = document.createElement('div');
    subEl.className = 'submerge-overlay';
    document.body.appendChild(subEl);
    var subWasDark = document.body.classList.contains('dark');
    var subObs = new MutationObserver(function () {
      var isDark = document.body.classList.contains('dark');
      if (isDark && !subWasDark) {
        subEl.style.setProperty('--sub-x', '50%');
        subEl.style.setProperty('--sub-y', '0%');
        subEl.classList.remove('active');
        void subEl.offsetWidth;
        subEl.classList.add('active');
      }
      subWasDark = isDark;
    });
    subObs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  })();

  // ========================================
  // JELLYFISH SCROLL-AWAY (anchored near top, scroll out of view)
  // ========================================
  var jellyEls = document.querySelectorAll('.jellyfish');
  if (jellyEls.length) {
    var applyJellyScroll = function () {
      var sy = window.scrollY || window.pageYOffset || 0;
      for (var ji = 0; ji < jellyEls.length; ji++) {
        jellyEls[ji].style.transform = 'translateY(' + (-sy) + 'px)';
      }
    };
    applyJellyScroll();
    window.addEventListener('scroll', applyJellyScroll, { passive: true });
  }

  // ========================================
  // HERO GLOW (mouse-reactive)
  // ========================================
  var heroSection = document.getElementById('hero');
  var heroGlow = document.querySelector('.hero-glow');
  if (heroSection && heroGlow && !isTouchDevice) {
    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      heroGlow.style.left = (e.clientX - rect.left) + 'px';
      heroGlow.style.top = (e.clientY - rect.top) + 'px';
    });
  }

  // ========================================
  // HERO ENTRY SEQUENCE (split text)
  // ========================================
  function initHeroSequence() {
    var tagline = document.querySelector('.hero-tagline');
    if (tagline && !tagline.dataset.split) {
      var text = tagline.innerHTML;
      var words = text.split(/\s+/);
      tagline.innerHTML = words.map(function (word) {
        return '<span class="word"><span class="word-inner">' + word + '</span></span>';
      }).join('');
      tagline.dataset.split = 'true';

      var wordInners = tagline.querySelectorAll('.word-inner');
      wordInners.forEach(function (w, i) {
        setTimeout(function () {
          w.classList.add('visible');
        }, 200 + i * 80);
      });
    }

    var tags = document.querySelectorAll('.tags-wall .tag');
    tags.forEach(function (tag, i) {
      setTimeout(function () {
        tag.classList.add('visible');
      }, 800 + i * 60);
    });

    var ctas = document.querySelectorAll('.hero-cta');
    ctas.forEach(function (cta, i) {
      setTimeout(function () { cta.classList.add('visible'); }, 1200 + i * 120);
    });

    var heroImg = document.querySelector('.hero-image');
    if (heroImg) {
      setTimeout(function () { heroImg.classList.add('visible'); }, 400);
    }
  }

  // ========================================
  // CONTACT STATEMENT SPLIT TEXT
  // ========================================
  var contactStatement = document.querySelector('.contact-statement');
  if (contactStatement && !contactStatement.dataset.split) {
    var cText = contactStatement.textContent;
    var cWords = cText.split(/\s+/);
    contactStatement.innerHTML = cWords.map(function (word) {
      return '<span class="word"><span class="word-inner">' + word + '</span></span>';
    }).join('');
    contactStatement.dataset.split = 'true';
  }

  // ========================================
  // SCROLL REVEALS (diversified)
  // ========================================
  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    var revealEls = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger, .section-divider'
    );
    revealEls.forEach(function (el) { revealObs.observe(el); });

    // Contact statement word reveal
    if (contactStatement) {
      var csObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var words = e.target.querySelectorAll('.word-inner');
            words.forEach(function (w, i) {
              setTimeout(function () { w.classList.add('visible'); }, i * 60);
            });
            csObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.2 });
      csObs.observe(contactStatement);
    }

    // Scroll-scrubbed impact metric count-up
    var impactTags = document.querySelectorAll('.impact-tag');
    if (impactTags.length) {
      var impactObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('impact-visible');
            impactObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.5 });
      impactTags.forEach(function (tag) { impactObs.observe(tag); });
    }
  }

  // ========================================
  // SCROLL VELOCITY SKEW
  // ========================================
  var lastScrollY = window.scrollY;
  var scrollVelocity = 0;
  var skewTarget = 0;
  var skewCurrent = 0;

  if (!isTouchDevice) {
    window.addEventListener('scroll', function () {
      scrollVelocity = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      skewTarget = Math.max(-2, Math.min(2, scrollVelocity * 0.04));
    }, { passive: true });

    function updateSkew() {
      skewCurrent += (skewTarget - skewCurrent) * 0.08;
      skewTarget *= 0.95; // decay
      document.documentElement.style.setProperty('--scroll-skew', skewCurrent + 'deg');
      requestAnimationFrame(updateSkew);
    }
    updateSkew();
  }

  // ========================================
  // SCROLL-LINKED COLOR TRANSITIONS
  // ========================================
  var colorSections = document.querySelectorAll('[data-palette]');
  if (colorSections.length) {
    var paletteObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio > 0.4) {
          var palette = e.target.dataset.palette;
          document.body.setAttribute('data-active-palette', palette);
        }
      });
    }, { threshold: [0.4, 0.6] });

    colorSections.forEach(function (s) { paletteObs.observe(s); });
  }

  // ========================================
  // PARALLAX ON SCROLL (enhanced depth layers)
  // ========================================
  var heroImage = document.querySelector('.hero-image img');
  if (heroImage && !isTouchDevice) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        var parallax = scrolled * 0.15;
        var scale = 1 + scrolled * 0.0002;
        heroImage.style.transform = 'translateY(' + parallax + 'px) scale(' + scale + ')';
      }
    }, { passive: true });
  }

  // ========================================
  // PROJECT CARD 3D TILT
  // ========================================
  var cards = document.querySelectorAll('.project-card');
  if (!isTouchDevice) {
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var rotateX = (y - rect.height / 2) / (rect.height / 2) * -3;
        var rotateY = (x - rect.width / 2) / (rect.width / 2) * 3;
        card.style.transform = 'translateY(-4px) perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  // ========================================
  // MAGNETIC BUTTONS
  // ========================================
  var magneticEls = document.querySelectorAll('.hero-cta, .contact-link, .theme-toggle');
  if (!isTouchDevice) {
    magneticEls.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * 0.25) + 'px, ' + (y * 0.25) + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  // ========================================
  // PAGE TRANSITIONS (View Transitions API)
  // ========================================
  if (document.startViewTransition) {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var url = a.href;
        document.startViewTransition(function () {
          window.location.href = url;
        });
      });
    });
  }

  // ========================================
  // SMOOTH SCROLL (Lenis handles wheel, this handles anchor clicks)
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target);
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // ========================================
  // OGL NOISE SHADER (replaces particle field — only on pages with canvas + OGL)
  // ========================================
  var noiseCanvas = document.getElementById('hero-noise');
  if (noiseCanvas && !isTouchDevice && typeof ogl !== 'undefined') {
    var Renderer = ogl.Renderer;
    var Program = ogl.Program;
    var Mesh = ogl.Mesh;
    var Triangle = ogl.Triangle;

    var renderer = new Renderer({
      canvas: noiseCanvas,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio, 2)
    });
    var gl = renderer.gl;

    function resizeNoise() {
      renderer.setSize(noiseCanvas.parentElement.offsetWidth, noiseCanvas.parentElement.offsetHeight);
    }
    resizeNoise();
    window.addEventListener('resize', resizeNoise);

    var vertex = /* glsl */ '\n\
      attribute vec2 position;\n\
      attribute vec2 uv;\n\
      varying vec2 vUv;\n\
      void main() {\n\
        vUv = uv;\n\
        gl_Position = vec4(position, 0.0, 1.0);\n\
      }\n\
    ';

    var fragment = /* glsl */ '\n\
      precision highp float;\n\
      varying vec2 vUv;\n\
      uniform float uTime;\n\
      uniform vec2 uMouse;\n\
      uniform vec2 uResolution;\n\
      uniform float uDark;\n\
      \n\
      // Simplex 3D noise\n\
      vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }\n\
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }\n\
      \n\
      float snoise(vec3 v) {\n\
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);\n\
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);\n\
        vec3 i = floor(v + dot(v, C.yyy));\n\
        vec3 x0 = v - i + dot(i, C.xxx);\n\
        vec3 g = step(x0.yzx, x0.xyz);\n\
        vec3 l = 1.0 - g;\n\
        vec3 i1 = min(g.xyz, l.zxy);\n\
        vec3 i2 = max(g.xyz, l.zxy);\n\
        vec3 x1 = x0 - i1 + C.xxx;\n\
        vec3 x2 = x0 - i2 + C.yyy;\n\
        vec3 x3 = x0 - D.yyy;\n\
        i = mod(i, 289.0);\n\
        vec4 p = permute(permute(permute(\n\
          i.z + vec4(0.0, i1.z, i2.z, 1.0))\n\
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))\n\
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));\n\
        float n_ = 1.0/7.0;\n\
        vec3 ns = n_ * D.wyz - D.xzx;\n\
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);\n\
        vec4 x_ = floor(j * ns.z);\n\
        vec4 y_ = floor(j - 7.0 * x_);\n\
        vec4 x = x_ * ns.x + ns.yyyy;\n\
        vec4 y = y_ * ns.x + ns.yyyy;\n\
        vec4 h = 1.0 - abs(x) - abs(y);\n\
        vec4 b0 = vec4(x.xy, y.xy);\n\
        vec4 b1 = vec4(x.zw, y.zw);\n\
        vec4 s0 = floor(b0)*2.0 + 1.0;\n\
        vec4 s1 = floor(b1)*2.0 + 1.0;\n\
        vec4 sh = -step(h, vec4(0.0));\n\
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;\n\
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;\n\
        vec3 p0 = vec3(a0.xy, h.x);\n\
        vec3 p1 = vec3(a0.zw, h.y);\n\
        vec3 p2 = vec3(a1.xy, h.z);\n\
        vec3 p3 = vec3(a1.zw, h.w);\n\
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));\n\
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;\n\
        vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);\n\
        m = m * m;\n\
        return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));\n\
      }\n\
      \n\
      void main() {\n\
        vec2 uv = vUv;\n\
        vec2 mouse = uMouse;\n\
        float t = uTime * 0.15;\n\
        \n\
        // Multi-octave noise\n\
        float n = snoise(vec3(uv * 2.5, t)) * 0.5;\n\
        n += snoise(vec3(uv * 5.0, t * 1.5)) * 0.25;\n\
        n += snoise(vec3(uv * 10.0, t * 2.0)) * 0.125;\n\
        \n\
        // Mouse distortion\n\
        float mouseDist = length(uv - mouse);\n\
        float mouseInfluence = smoothstep(0.4, 0.0, mouseDist) * 0.3;\n\
        n += mouseInfluence * snoise(vec3(uv * 8.0, t * 3.0));\n\
        \n\
        // Color based on theme\n\
        vec3 lightAccent = vec3(0.722, 0.439, 0.231);\n\
        vec3 darkAccent = vec3(0.831, 0.627, 0.353);\n\
        vec3 accent = mix(lightAccent, darkAccent, uDark);\n\
        \n\
        float alpha = smoothstep(-0.2, 0.6, n) * 0.12;\n\
        alpha += mouseInfluence * 0.08;\n\
        \n\
        gl_FragColor = vec4(accent, alpha);\n\
      }\n\
    ';

    var geometry = new Triangle(gl);
    var program = new Program(gl, {
      vertex: vertex,
      fragment: fragment,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: [0.5, 0.5] },
        uResolution: { value: [noiseCanvas.width, noiseCanvas.height] },
        uDark: { value: document.body.classList.contains('dark') ? 1.0 : 0.0 }
      },
      transparent: true,
      depthTest: false,
      depthWrite: false
    });

    var mesh = new Mesh(gl, { geometry: geometry, program: program });

    var noiseMouse = { x: 0.5, y: 0.5 };
    var noiseMouseTarget = { x: 0.5, y: 0.5 };

    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      noiseMouseTarget.x = (e.clientX - rect.left) / rect.width;
      noiseMouseTarget.y = 1.0 - (e.clientY - rect.top) / rect.height;
    });

    function animateNoise(t) {
      requestAnimationFrame(animateNoise);
      // Smooth mouse lerp
      noiseMouse.x += (noiseMouseTarget.x - noiseMouse.x) * 0.05;
      noiseMouse.y += (noiseMouseTarget.y - noiseMouse.y) * 0.05;

      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uMouse.value = [noiseMouse.x, noiseMouse.y];
      program.uniforms.uDark.value = document.body.classList.contains('dark') ? 1.0 : 0.0;
      program.uniforms.uResolution.value = [noiseCanvas.width, noiseCanvas.height];

      renderer.render({ scene: mesh });
    }
    requestAnimationFrame(animateNoise);
  }

  // ========================================
  // SCROLL-LINKED SECTION PARALLAX (depth layers)
  // ========================================
  var sections = document.querySelectorAll('.skew-section');
  if (!isTouchDevice && sections.length) {
    window.addEventListener('scroll', function () {
      sections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        var progress = rect.top / window.innerHeight;
        if (progress > -0.5 && progress < 1.5) {
          section.style.transform = 'translateY(' + (progress * 20) + 'px) skewY(var(--scroll-skew, 0deg))';
        }
      });
    }, { passive: true });
  }

  // ========================================
  // THEMED PARTICLE FIELD (sun/moon shapes)
  // Ambient floating particles on all pages
  // ========================================
  var particleCanvas = document.querySelector('.particle-field');
  if (particleCanvas && !isTouchDevice) {
    var pCtx = particleCanvas.getContext('2d');
    var particles = [];
    var particleCount = 80;
    var pMouse = { x: -999, y: -999 };

    function resizeParticleCanvas() {
      // For fixed/ambient canvas, use viewport. For absolute (in hero), use parent.
      var w = particleCanvas.offsetWidth || window.innerWidth;
      var h = particleCanvas.offsetHeight || window.innerHeight;
      particleCanvas.width = w;
      particleCanvas.height = h;
    }
    resizeParticleCanvas();
    window.addEventListener('resize', resizeParticleCanvas);

    // Determine if this is a full-page ambient canvas
    var isAmbient = particleCanvas.classList.contains('particle-field--ambient');
    var ambientCount = isAmbient ? 100 : particleCount;

    // Create particles with shape variety
    for (var pi = 0; pi < ambientCount; pi++) {
      particles.push({
        x: Math.random() * (particleCanvas.width || 800),
        y: Math.random() * (particleCanvas.height || 600),
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: isAmbient ? (Math.random() * 6 + 2) : (Math.random() * 4 + 2),
        opacity: isAmbient ? (Math.random() * 0.5 + 0.15) : (Math.random() * 0.4 + 0.1),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        shape: Math.random() > 0.8 ? 'crescent' : 'ray',
        phase: Math.random() * Math.PI * 2
      });
    }

    // Track mouse — globally for ambient, on parent for hero
    if (isAmbient) {
      document.addEventListener('mousemove', function (e) {
        pMouse.x = e.clientX;
        pMouse.y = e.clientY;
      });
    } else {
      var pParent = particleCanvas.parentElement;
      if (pParent) {
        pParent.addEventListener('mousemove', function (e) {
          var rect = particleCanvas.getBoundingClientRect();
          pMouse.x = e.clientX - rect.left;
          pMouse.y = e.clientY - rect.top;
        });
        pParent.addEventListener('mouseleave', function () {
          pMouse.x = -999;
          pMouse.y = -999;
        });
      }
    }

    function drawSunRay(ctx, x, y, size, rotation, opacity) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;
      // Diamond/ray shape with 4 points
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.3, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.3, 0);
      ctx.closePath();
      ctx.fill();
      // Small circle at center
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawCrescent(ctx, x, y, size, rotation, opacity) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;
      // Draw crescent using two arcs — outer arc then inner arc reversed
      ctx.beginPath();
      ctx.arc(0, 0, size, 0.3, Math.PI * 2 - 0.3);
      ctx.arc(size * 0.35, -size * 0.1, size * 0.7, Math.PI * 2 - 0.5, 0.5, true);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function animateParticles() {
      pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      var isDark = document.body.classList.contains('dark');
      var accent = isDark ? '212, 160, 90' : '184, 112, 59';

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // Gentle mouse repulsion
        var dx = p.x - pMouse.x;
        var dy = p.y - pMouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          var force = (100 - dist) / 100 * 0.3;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Gentle floating motion
        p.vy += Math.sin(p.phase + Date.now() * 0.001) * 0.002;
        p.vx += Math.cos(p.phase + Date.now() * 0.0008) * 0.001;

        // Burst particles keep more momentum, normal ones damp quickly
        var damping = p.isBurst ? 0.995 : 0.98;
        p.vx *= damping;
        p.vy *= damping;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        // Wrap around viewport
        if (p.x < -10) p.x = particleCanvas.width + 10;
        if (p.x > particleCanvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = particleCanvas.height + 10;
        if (p.y > particleCanvas.height + 10) p.y = -10;

        pCtx.fillStyle = 'rgba(' + accent + ', ' + p.opacity + ')';

        if (p.shape === 'ray') {
          drawSunRay(pCtx, p.x, p.y, p.size, p.rotation, p.opacity);
        } else {
          drawCrescent(pCtx, p.x, p.y, p.size, p.rotation, p.opacity);
        }
      }

      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ========================================
    // DOUBLE-CLICK EASTER EGG — particle burst from hero image
    // ========================================
    if (heroImage) {
      var imgClickCount = 0;
      var imgClickTimer = null;
      heroImage.addEventListener('click', function () {
        imgClickCount++;
        if (imgClickTimer) clearTimeout(imgClickTimer);
        imgClickTimer = setTimeout(function () { imgClickCount = 0; }, 400);
        if (imgClickCount >= 2) {
          imgClickCount = 0;
          // Wobble animation
          heroImage.classList.add('flip-easter-egg');
          heroImage.addEventListener('animationend', function () {
            heroImage.classList.remove('flip-easter-egg');
          }, { once: true });
          // Burst particles from image center — scatter across entire viewport
          var rect = heroImage.getBoundingClientRect();
          var canvasRect = particleCanvas.getBoundingClientRect();
          var cx = rect.left + rect.width / 2 - canvasRect.left;
          var cy = rect.top + rect.height / 2 - canvasRect.top;
          for (var b = 0; b < 30; b++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = Math.random() * 12 + 6;
            particles.push({
              x: cx,
              y: cy,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: Math.random() * 5 + 2,
              opacity: Math.random() * 0.6 + 0.2,
              rotation: Math.random() * Math.PI * 2,
              rotSpeed: (Math.random() - 0.5) * 0.03,
              shape: Math.random() > 0.5 ? 'ray' : 'crescent',
              phase: Math.random() * Math.PI * 2,
              isBurst: true
            });
          }
          // Update count so they're never trimmed
          particleCount = particles.length;

          // Shove the anglerfish away from the burst
          if (anglerfish && anglerfish._push) {
            anglerfish._push(rect.left + rect.width / 2, rect.top + rect.height / 2, 260);
          }
        }
      });
    }
  }

  // ========================================
  // GSAP SCROLL-SCRUBBED COUNT-UP
  // ========================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Sync Lenis with GSAP ScrollTrigger
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    // Count-up numbers in impact tags
    var countEls = document.querySelectorAll('.count-up');
    countEls.forEach(function (el) {
      var parent = el.closest('.impact-tag');
      var target = parent ? parseInt(parent.dataset.count, 10) : 0;
      if (!target) return;

      // HTML holds the real final value (good for crawlers/no-JS). Keep that
      // value in the DOM until the scroll animation actually starts
      // (immediateRender:false) — otherwise the "from:0" state is applied on
      // load and JS-rendering crawlers/AI read "0".
      gsap.fromTo(el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 1.5,
          ease: 'power2.out',
          snap: { innerText: 1 },
          immediateRender: false,
          scrollTrigger: {
            trigger: parent,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Pin writing heading and animate blog entries
    var writingSection = document.getElementById('writing');
    if (writingSection) {
      var blogEntries = writingSection.querySelectorAll('.blog-entry');
      blogEntries.forEach(function (entry, i) {
        gsap.from(entry, {
          opacity: 0,
          x: i % 2 === 0 ? -30 : 30,
          duration: 1,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: entry,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        });

        // Scrub the blog-shape SVG rotation
        var shape = entry.querySelector('.blog-shape');
        if (shape) {
          gsap.fromTo(shape,
            { opacity: 0, rotation: -15, y: '-50%' },
            {
              opacity: 0.7,
              rotation: 0,
              y: '-50%',
              ease: 'none',
              scrollTrigger: {
                trigger: entry,
                start: 'top 75%',
                end: 'top 40%',
                scrub: 1
              }
            }
          );
        }
      });
    }

    // Blog detail page animations (mermaid diagrams, comparison grids, sections)
    var postBody = document.querySelector('.post-body');
    if (postBody) {
      var postSections = postBody.querySelectorAll('h2, .mermaid-wrap, .comparison-grid, .impact-bar');
      postSections.forEach(function (el) {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      });

      // Paragraphs get a subtle fade
      var postParas = postBody.querySelectorAll('p, ul');
      postParas.forEach(function (el) {
        gsap.from(el, {
          opacity: 0,
          y: 15,
          duration: 0.6,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            toggleActions: 'play none none none'
          }
        });
      });
    }
  }

})();
