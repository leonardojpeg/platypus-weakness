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
  // ANGLERFISH CURSOR FOLLOW (dark mode easter egg)
  // ========================================
  var anglerfish = document.querySelector('.anglerfish');
  if (anglerfish && !isTouchDevice) {
    // Start from where the hero image is (emerges from the portal)
    var heroImgRect = document.querySelector('.hero-image');
    var anglerStartX = heroImgRect ? heroImgRect.getBoundingClientRect().left + heroImgRect.getBoundingClientRect().width / 2 : window.innerWidth * 0.7;
    var anglerStartY = heroImgRect ? heroImgRect.getBoundingClientRect().top + heroImgRect.getBoundingClientRect().height / 2 : window.innerHeight * 0.5;
    var anglerX = anglerStartX;
    var anglerY = anglerStartY;
    var anglerTargetX = anglerX;
    var anglerTargetY = anglerY;
    var anglerFlipped = false;
    var anglerTime = 0;
    var anglerSpeed = 0;
    var anglerLastMoveTime = Date.now();
    var anglerJawOpen = 0; // 0 = closed, 1 = fully open
    var anglerDepth = 0; // starts invisible, fades in slowly

    // Get jaw element for animation
    var anglerJaw = anglerfish.querySelector('.angler-jaw');

    document.addEventListener('mousemove', function (e) {
      anglerTargetX = e.clientX;
      anglerTargetY = e.clientY;
      anglerLastMoveTime = Date.now();
    });

    function animateAngler() {
      var prevX = anglerX;
      var prevY = anglerY;

      // Distance to target (cursor)
      var distX = anglerTargetX - anglerX;
      var distY = anglerTargetY - anglerY;
      var dist = Math.sqrt(distX * distX + distY * distY);

      // Variable speed - predatory behavior:
      // Far away: moderate pursuit | Mid-range: cautious stalk | Close: drift alongside
      var lerpSpeed;
      if (dist > 400) lerpSpeed = 0.006;
      else if (dist > 200) lerpSpeed = 0.01;
      else if (dist > 80) lerpSpeed = 0.005;
      else lerpSpeed = 0.003;

      anglerX += distX * lerpSpeed;
      anglerY += distY * lerpSpeed;
      anglerTime += 0.02;

      // Movement speed
      var dx = anglerX - prevX;
      var dy = anglerY - prevY;
      anglerSpeed = Math.sqrt(dx * dx + dy * dy);

      // Idle detection
      var timeSinceMove = Date.now() - anglerLastMoveTime;
      var isIdle = timeSinceMove > 2500;
      var idleFactor = Math.min(1, timeSinceMove / 5000); // ramps up over 5s

      // Jaw opens when approaching cursor (dist < 120)
      var jawTarget = dist < 120 ? Math.min(1, (120 - dist) / 80) : 0;
      anglerJawOpen += (jawTarget - anglerJawOpen) * 0.04;
      if (anglerJaw) {
        var jawOffset = anglerJawOpen * 4;
        anglerJaw.style.transform = 'translateY(' + jawOffset + 'px)';
      }

      // Swimming undulation — multi-frequency for organic feel
      var swimBase = Math.sin(anglerTime * 0.8) * (isIdle ? 7 : 3);
      var swimSecondary = Math.sin(anglerTime * 1.6) * (isIdle ? 3 : 1);
      var swimTertiary = Math.sin(anglerTime * 2.4) * 0.5;
      var swimY = swimBase + swimSecondary + swimTertiary;

      // Body rotation - follows path with organic lag
      var swimRotate = Math.sin(anglerTime * 0.6) * (isIdle ? 4 : 2);
      swimRotate += Math.sin(anglerTime * 1.1) * (isIdle ? 1.5 : 0.7);
      // Add slight tilt toward movement direction
      var moveTilt = Math.atan2(dy, Math.abs(dx) + 0.01) * (180 / Math.PI) * 0.08;
      swimRotate += moveTilt;

      // Breathing scale — slower, more subtle
      var breathScale = 1 + Math.sin(anglerTime * 0.35) * 0.015 + Math.sin(anglerTime * 0.7) * 0.008;

      // Depth-based opacity (simulates swimming in/out of darkness)
      var depthTarget = 0.75 + Math.sin(anglerTime * 0.15) * 0.1;
      if (isIdle) depthTarget -= idleFactor * 0.15; // fades into darkness when idle
      anglerDepth += (depthTarget - anglerDepth) * 0.01;
      anglerfish.style.opacity = document.body.classList.contains('dark') ? anglerDepth : '0';

      // Flip to face cursor direction (with wide hysteresis)
      if (dx < -0.5) anglerFlipped = false;
      if (dx > 0.5) anglerFlipped = true;

      var scaleX = anglerFlipped ? breathScale : -breathScale;

      anglerfish.style.left = anglerX + 'px';
      anglerfish.style.top = (anglerY + swimY) + 'px';
      anglerfish.style.transform = 'translate(-50%, -50%) scaleX(' + scaleX + ') scaleY(' + breathScale + ') rotate(' + swimRotate + 'deg)';

      requestAnimationFrame(animateAngler);
    }
    animateAngler();
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

    var cta = document.querySelector('.hero-cta');
    if (cta) {
      setTimeout(function () { cta.classList.add('visible'); }, 1200);
    }

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

      gsap.to(el, {
        innerText: target,
        duration: 1.5,
        ease: 'power2.out',
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: parent,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
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

  // ========================================
  // HERO IMAGE DISPLACEMENT / DEEP-SEA SHADER
  // ========================================
  var dispCanvas = document.getElementById('hero-displacement');
  var heroImg = document.querySelector('.hero-image img');
  if (dispCanvas && heroImg && !isTouchDevice && typeof ogl !== 'undefined') {
    function initDisplacement() {
      var parent = dispCanvas.parentElement;
      var dRenderer = new ogl.Renderer({
        canvas: dispCanvas,
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio, 2)
      });
      var dGl = dRenderer.gl;

      function resizeDisp() {
        dRenderer.setSize(parent.offsetWidth, parent.offsetHeight);
      }
      resizeDisp();
      window.addEventListener('resize', resizeDisp);

      var dVertex = '\n\
        attribute vec2 position;\n\
        attribute vec2 uv;\n\
        varying vec2 vUv;\n\
        void main() {\n\
          vUv = uv;\n\
          gl_Position = vec4(position, 0.0, 1.0);\n\
        }\n\
      ';

      // Shader that works as subtle overlay in light mode
      // and as full deep-sea scene in dark mode
      var dFragment = '\n\
        precision highp float;\n\
        varying vec2 vUv;\n\
        uniform float uTime;\n\
        uniform vec2 uMouse;\n\
        uniform float uScroll;\n\
        uniform float uDark;\n\
        \n\
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}\n\
        float snoise2(vec2 v){\n\
          const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);\n\
          vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);\n\
          vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);\n\
          vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.0);\n\
          vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));\n\
          vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);\n\
          m=m*m;m=m*m;\n\
          vec3 x2=2.0*fract(p*C.www)-1.0;vec3 h=abs(x2)-0.5;\n\
          vec3 ox=floor(x2+0.5);vec3 a0=x2-ox;\n\
          m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);\n\
          vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;\n\
          return 130.0*dot(m,g);\n\
        }\n\
        \n\
        void main(){\n\
          vec2 uv=vUv;\n\
          float t=uTime*0.3;\n\
          float mouseDist=length(uv-uMouse);\n\
          \n\
          if(uDark<0.5){\n\
            // Light mode: subtle displacement overlay\n\
            float mouseWave=smoothstep(0.5,0.0,mouseDist)*0.02;\n\
            float n=snoise2(uv*3.0+t)*0.008;\n\
            n+=mouseWave*sin(t*5.0+mouseDist*20.0);\n\
            n+=uScroll*0.003*snoise2(uv*5.0);\n\
            float edge=smoothstep(0.0,0.15,min(min(uv.x,1.0-uv.x),min(uv.y,1.0-uv.y)));\n\
            float alpha=abs(n)*8.0*edge;\n\
            gl_FragColor=vec4(1.0,1.0,1.0,clamp(alpha,0.0,0.25));\n\
          } else {\n\
            // Dark mode: deep-sea ecosystem\n\
            vec3 deepBlue=vec3(0.03,0.06,0.14);\n\
            vec3 midBlue=vec3(0.06,0.12,0.22);\n\
            \n\
            // Water gradient\n\
            vec3 bg=mix(midBlue,deepBlue,uv.y*0.8+snoise2(uv*1.5+t*0.05)*0.06);\n\
            \n\
            // Volumetric light rays from above\n\
            float ray1=smoothstep(0.3,0.0,abs(uv.x-0.3-sin(t*0.2)*0.05))*(1.0-uv.y)*0.15;\n\
            float ray2=smoothstep(0.25,0.0,abs(uv.x-0.7+cos(t*0.15)*0.04))*(1.0-uv.y)*0.12;\n\
            bg+=vec3(0.1,0.2,0.35)*(ray1+ray2);\n\
            \n\
            // Light caustics from above\n\
            float caustic1=snoise2(uv*5.0+vec2(t*0.4,t*0.25));\n\
            float caustic2=snoise2(uv*7.0+vec2(-t*0.35,t*0.5));\n\
            float caustics=max(0.0,caustic1*caustic2)*0.5*(1.0-uv.y);\n\
            bg+=vec3(0.08,0.18,0.28)*caustics;\n\
            \n\
            // Jellyfish (larger, brighter)\n\
            vec2 jelly1Pos=vec2(0.25+sin(t*0.3)*0.1,0.35+cos(t*0.4)*0.12);\n\
            float jelly1=smoothstep(0.08,0.0,length((uv-jelly1Pos)*vec2(1.0,1.4)));\n\
            float jelly1Trail=smoothstep(0.025,0.0,abs(uv.x-jelly1Pos.x))*smoothstep(jelly1Pos.y,jelly1Pos.y+0.18,uv.y)*0.6;\n\
            bg+=vec3(0.6,0.3,1.0)*jelly1*0.8;\n\
            bg+=vec3(0.4,0.2,0.8)*jelly1Trail*0.4;\n\
            \n\
            vec2 jelly2Pos=vec2(0.72+cos(t*0.25)*0.08,0.5+sin(t*0.35)*0.1);\n\
            float jelly2=smoothstep(0.06,0.0,length((uv-jelly2Pos)*vec2(1.0,1.3)));\n\
            bg+=vec3(0.2,0.8,0.9)*jelly2*0.7;\n\
            \n\
            // Bioluminescent organisms (bright!)\n\
            float glow1=smoothstep(0.04,0.0,length(uv-vec2(0.15+sin(t*0.6)*0.12,0.6+cos(t*0.4)*0.1)));\n\
            float glow2=smoothstep(0.03,0.0,length(uv-vec2(0.6+cos(t*0.35)*0.14,0.25+sin(t*0.7)*0.08)));\n\
            float glow3=smoothstep(0.025,0.0,length(uv-vec2(0.85+sin(t*0.8)*0.06,0.7+cos(t*0.55)*0.05)));\n\
            float glow4=smoothstep(0.035,0.0,length(uv-vec2(0.4+cos(t*0.45)*0.09,0.8+sin(t*0.9)*0.04)));\n\
            float glow5=smoothstep(0.02,0.0,length(uv-vec2(0.55+sin(t*1.1)*0.05,0.15+cos(t*0.5)*0.07)));\n\
            float glow6=smoothstep(0.02,0.0,length(uv-vec2(0.9+cos(t*0.6)*0.04,0.4+sin(t*0.85)*0.06)));\n\
            \n\
            vec3 lureGold=vec3(1.0,0.75,0.35);\n\
            vec3 biolum=vec3(0.3,0.85,1.0);\n\
            vec3 biolumWarm=vec3(0.9,0.6,0.2);\n\
            bg+=lureGold*glow1*1.2;\n\
            bg+=biolum*glow2*1.0;\n\
            bg+=biolum*glow3*0.8;\n\
            bg+=biolumWarm*glow4*0.7;\n\
            bg+=lureGold*glow5*0.6;\n\
            bg+=biolum*glow6*0.5;\n\
            \n\
            // Kelp silhouettes at edges\n\
            float kelp1=smoothstep(0.025,0.0,abs(uv.x-0.05-sin(uv.y*8.0+t*0.8)*0.02))*smoothstep(0.3,0.8,uv.y);\n\
            float kelp2=smoothstep(0.02,0.0,abs(uv.x-0.95+sin(uv.y*6.0+t*0.6)*0.015))*smoothstep(0.4,0.9,uv.y);\n\
            bg=mix(bg,deepBlue*0.3,kelp1*0.7);\n\
            bg=mix(bg,deepBlue*0.3,kelp2*0.6);\n\
            \n\
            // Mouse interaction — bright bioluminescent wake\n\
            float mouseGlow=smoothstep(0.3,0.0,mouseDist)*0.5;\n\
            float mouseRipple=sin(mouseDist*25.0-t*3.0)*smoothstep(0.35,0.1,mouseDist)*0.15;\n\
            bg+=lureGold*(mouseGlow+max(0.0,mouseRipple));\n\
            \n\
            // Marine snow\n\
            float snow1=snoise2(uv*20.0+t*0.3);\n\
            float snow2=snoise2(uv*30.0+vec2(t*0.4,-t*0.2));\n\
            float marineSnow=smoothstep(0.7,0.78,snow1)*0.15+smoothstep(0.75,0.82,snow2)*0.1;\n\
            bg+=vec3(0.5,0.7,0.8)*marineSnow;\n\
            \n\
            gl_FragColor=vec4(bg,1.0);\n\
          }\n\
        }\n\
      ';

      var dGeometry = new ogl.Triangle(dGl);
      var dProgram = new ogl.Program(dGl, {
        vertex: dVertex,
        fragment: dFragment,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: [0.5, 0.5] },
          uScroll: { value: 0 },
          uDark: { value: document.body.classList.contains('dark') ? 1.0 : 0.0 }
        },
        transparent: true,
        depthTest: false,
        depthWrite: false
      });

      var dMesh = new ogl.Mesh(dGl, { geometry: dGeometry, program: dProgram });
      var dMouseTarget = { x: 0.5, y: 0.5 };
      var dMouse = { x: 0.5, y: 0.5 };

      parent.addEventListener('mousemove', function (e) {
        var rect = parent.getBoundingClientRect();
        dMouseTarget.x = (e.clientX - rect.left) / rect.width;
        dMouseTarget.y = 1.0 - (e.clientY - rect.top) / rect.height;
      });

      function animateDisp(t) {
        requestAnimationFrame(animateDisp);
        dMouse.x += (dMouseTarget.x - dMouse.x) * 0.05;
        dMouse.y += (dMouseTarget.y - dMouse.y) * 0.05;

        var scrollNorm = Math.min(window.scrollY / window.innerHeight, 1.0);
        dProgram.uniforms.uTime.value = t * 0.001;
        dProgram.uniforms.uMouse.value = [dMouse.x, dMouse.y];
        dProgram.uniforms.uScroll.value = scrollNorm;
        dProgram.uniforms.uDark.value = document.body.classList.contains('dark') ? 1.0 : 0.0;

        dRenderer.render({ scene: dMesh });
      }
      requestAnimationFrame(animateDisp);
    }

    if (heroImg.complete) {
      initDisplacement();
    } else {
      heroImg.addEventListener('load', initDisplacement);
    }
  }

})();
