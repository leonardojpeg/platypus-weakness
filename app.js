(function () {
  'use strict';

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
  // THEME TOGGLE
  // ========================================
  var themeToggle = document.querySelector('.theme-toggle');
  var saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark');
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark');
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
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
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('active');
      toggle.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('active');
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
  // CUSTOM CURSOR
  // ========================================
  var cursorDot = document.querySelector('.cursor-dot');
  var cursorRing = document.querySelector('.cursor-ring');
  var isTouchDevice = 'ontouchstart' in window;

  if (cursorDot && cursorRing && !isTouchDevice) {
    var mouseX = 0, mouseY = 0;
    var ringX = 0, ringY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    // Smooth ring follow
    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover state for interactive elements
    var hoverTargets = 'a, button, .tag, .project-card, .blog-entry, .contact-link';
    document.querySelectorAll(hoverTargets).forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('cursor-hover');
      });
    });
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
    // Split hero tagline into words
    var tagline = document.querySelector('.hero-tagline');
    if (tagline && !tagline.dataset.split) {
      var text = tagline.innerHTML;
      var words = text.split(/\s+/);
      tagline.innerHTML = words.map(function (word) {
        return '<span class="word"><span class="word-inner">' + word + '</span></span>';
      }).join('');
      tagline.dataset.split = 'true';

      // Stagger word reveals
      var wordInners = tagline.querySelectorAll('.word-inner');
      wordInners.forEach(function (w, i) {
        setTimeout(function () {
          w.classList.add('visible');
        }, 200 + i * 80);
      });
    }

    // Tags cascade
    var tags = document.querySelectorAll('.tags-wall .tag');
    tags.forEach(function (tag, i) {
      setTimeout(function () {
        tag.classList.add('visible');
      }, 800 + i * 60);
    });

    // CTA appear
    var cta = document.querySelector('.hero-cta');
    if (cta) {
      setTimeout(function () {
        cta.classList.add('visible');
      }, 1200);
    }

    // Hero image
    var heroImg = document.querySelector('.hero-image');
    if (heroImg) {
      setTimeout(function () {
        heroImg.classList.add('visible');
      }, 400);
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
    revealEls.forEach(function (el) {
      revealObs.observe(el);
    });

    // Contact statement word reveal
    if (contactStatement) {
      var csObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var words = e.target.querySelectorAll('.word-inner');
            words.forEach(function (w, i) {
              setTimeout(function () {
                w.classList.add('visible');
              }, i * 60);
            });
            csObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.2 });
      csObs.observe(contactStatement);
    }
  }

  // ========================================
  // PARALLAX ON SCROLL
  // ========================================
  var heroImage = document.querySelector('.hero-image img');
  if (heroImage && !isTouchDevice) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroImage.style.transform = 'translateY(' + (scrolled * 0.08) + 'px) scale(' + (1 + scrolled * 0.0001) + ')';
      }
    }, { passive: true });

    // Easter egg: double-click the hero image for a wobble + particle burst
    var clickCount = 0;
    var clickTimer = null;
    heroImage.addEventListener('click', function () {
      clickCount++;
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = setTimeout(function () { clickCount = 0; }, 400);
      if (clickCount >= 2) {
        clickCount = 0;
        heroImage.classList.add('flip-easter-egg');
        heroImage.addEventListener('animationend', function () {
          heroImage.classList.remove('flip-easter-egg');
        }, { once: true });
        // Spawn a burst of particles from the image center
        var rect = heroImage.getBoundingClientRect();
        var heroRect = document.getElementById('hero').getBoundingClientRect();
        var cx = rect.left + rect.width / 2 - heroRect.left;
        var cy = rect.top + rect.height / 2 - heroRect.top;
        for (var i = 0; i < 25; i++) {
          var angle = Math.random() * Math.PI * 2;
          var speed = Math.random() * 3 + 1;
          particles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r: Math.random() * 3 + 1,
            opacity: Math.random() * 0.7 + 0.3
          });
        }
      }
    });
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
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / centerY * -3;
        var rotateY = (x - centerX) / centerX * 3;
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
        el.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
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
      // Only apply to internal links (not anchors, not external)
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
  // SMOOTH SCROLL (anchor links)
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ========================================
  // HERO PARTICLE FIELD
  // ========================================
  var canvas = document.getElementById('hero-particles');
  if (canvas && !isTouchDevice) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 60;
    var mouse = { x: 0, y: 0 };

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    var heroEl = document.getElementById('hero');
    if (heroEl) {
      heroEl.addEventListener('mousemove', function (e) {
        var rect = heroEl.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var accent = document.body.classList.contains('dark') ? '212, 160, 90' : '184, 112, 59';

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // Gentle mouse repulsion
        var dx = p.x - mouse.x;
        var dy = p.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          var force = (120 - dist) / 120 * 0.4;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + accent + ', ' + p.opacity + ')';
        ctx.fill();

        // Draw connections
        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var d = Math.sqrt((p.x - p2.x) * (p.x - p2.x) + (p.y - p2.y) * (p.y - p2.y));
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(' + accent + ', ' + ((100 - d) / 100 * 0.15) + ')';
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  // ========================================
  // SCROLL-LINKED SECTION PARALLAX
  // ========================================
  var sections = document.querySelectorAll('#writing, #experience, #contact');
  if (!isTouchDevice && sections.length) {
    window.addEventListener('scroll', function () {
      sections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        var offset = rect.top / window.innerHeight;
        if (offset > -0.5 && offset < 1.5) {
          var shift = offset * 15;
          section.style.transform = 'translateY(' + shift + 'px)';
        }
      });
    }, { passive: true });
  }

})();
