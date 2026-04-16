// MZ App Studio — script.js (fixed + upgraded)
(function () {
  "use strict";

  // ============================================================
  // INTRO VIDEO OVERLAY
  // ============================================================
  var overlay = document.getElementById('introVideoOverlay');
  var introVideo = document.getElementById('introVideoPlayer');
  var skipBtn = document.getElementById('introSkipBtn');
  var progressFill = document.getElementById('introProgressFill');
  var unmuteBtn = document.getElementById('introUnmuteBtn');
  var volumeIcon = document.getElementById('introVolumeIcon');

  function dismissIntro() {
    if (!overlay) return;
    overlay.classList.remove('active');
    overlay.classList.add('fade-out');
    if (introVideo) {
      introVideo.pause();
      introVideo.currentTime = 0;
    }
    setTimeout(function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    setTimeout(function () {
      overlay.style.display = 'none';
    }, 700);
  }

  window.addEventListener('load', function () {
    setTimeout(function () {
      var loader = document.getElementById('pageLoader');
      if (loader) loader.classList.add('fade-out');

      if (overlay && introVideo) {
        overlay.classList.add('active');
        var playPromise = introVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(function () {
            // autoplay blocked — overlay still visible, user can skip
          });
        }
      }
    }, 600);
  });

  if (introVideo) {
    introVideo.addEventListener('timeupdate', function () {
      if (!introVideo.duration) return;
      var pct = (introVideo.currentTime / introVideo.duration) * 100;
      if (progressFill) progressFill.style.width = pct + '%';
    });

    // Auto-dismiss when video ends → lands on hero
    introVideo.addEventListener('ended', dismissIntro);

    // If video file missing, dismiss quickly
    introVideo.addEventListener('error', function () {
      setTimeout(dismissIntro, 1500);
    });
  }

  if (skipBtn) skipBtn.addEventListener('click', dismissIntro);

  if (unmuteBtn && introVideo) {
    unmuteBtn.addEventListener('click', function () {
      introVideo.muted = !introVideo.muted;
      if (introVideo.muted) {
        volumeIcon.className = 'fas fa-volume-mute';
        unmuteBtn.querySelector('span').textContent = 'Tap to unmute';
      } else {
        volumeIcon.className = 'fas fa-volume-up';
        unmuteBtn.querySelector('span').textContent = 'Mute';
      }
    });
  }

  // ============================================================
  // YEAR
  // ============================================================
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ============================================================
  // MOBILE MENU
  // ============================================================
  var mobileBtn = document.getElementById('mobileMenuBtn');
  var navLinks = document.getElementById('navLinks');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      var icon = this.querySelector('i');
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    });

    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        var icon = mobileBtn.querySelector('i');
        if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-times'); }
      }
    });
  }

  // ============================================================
  // HEADER SCROLL
  // ============================================================
  window.addEventListener('scroll', function () {
    var header = document.querySelector('header');
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    var backToTop = document.getElementById('backToTop');
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  });

  // ============================================================
  // BACK TO TOP
  // ============================================================
  var backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // THEME TOGGLE
  // ============================================================
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    if (localStorage.getItem('theme') === 'light') {
      document.body.classList.add('light-mode');
      var icon = themeToggle.querySelector('i');
      if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
    }

    themeToggle.addEventListener('click', function () {
      document.body.classList.toggle('light-mode');
      var icon = this.querySelector('i');
      if (icon.classList.contains('fa-moon')) {
        icon.classList.replace('fa-moon', 'fa-sun');
      } else {
        icon.classList.replace('fa-sun', 'fa-moon');
      }
      localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    });
  }

  // ============================================================
  // NAVIGATION — smooth scroll to sections
  // ============================================================
  function goToSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (!section) return;
    if (navLinks) navLinks.classList.remove('active');
    if (mobileBtn) {
      var icon = mobileBtn.querySelector('i');
      if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-times'); }
    }
    var headerEl = document.querySelector('header');
    var headerH = headerEl ? headerEl.offsetHeight : 64;
    var top = section.getBoundingClientRect().top + window.pageYOffset - headerH;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href === '#') return;
    e.preventDefault();
    goToSection(href.slice(1));
  });

  // Active nav highlight
  var sections = document.querySelectorAll('section[id]');
  var navItems = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    var scrollPos = window.scrollY + 150;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        var id = section.getAttribute('id');
        navItems.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) link.classList.add('active');
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // ============================================================
  // BRAND LOGO
  // ============================================================
  var brandLogo = document.getElementById('brandLogo');
  if (brandLogo) {
    brandLogo.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // STATS COUNTER
  // ============================================================
  var stats = document.querySelectorAll('.stat-number');
  if (stats.length > 0) {
    var statObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          stats.forEach(function (stat) {
            var target = parseInt(stat.dataset.target);
            var current = 0;
            var timer = setInterval(function () {
              current += target / 50;
              if (current >= target) {
                stat.textContent = target + '+';
                clearInterval(timer);
              } else {
                stat.textContent = Math.floor(current);
              }
            }, 30);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    statObserver.observe(stats[0].parentElement);
  }

  // ============================================================
  // FAQ ACCORDION — one open at a time, click-on-question only
  // ============================================================
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var isActive = item.classList.contains('active');

      // Close all first
      document.querySelectorAll('.faq-item').forEach(function (faq) {
        faq.classList.remove('active');
      });

      // If wasn't open, open it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ============================================================
  // PORTFOLIO CAROUSEL
  // ============================================================
  var track = document.getElementById('carouselTrack');
  if (track) {
    var portfolioItems = [
      { title: 'AI Chatbot', device: 'iPhone 15 Pro', image: 'images/ai chatbots.png' },
      { title: 'E-commerce', device: 'Samsung S24', image: 'images/ecommerce.png' },
      { title: 'Finance', device: 'iPhone 15', image: 'images/finance.png' },
      { title: 'Fitness', device: 'Samsung S24', image: 'images/fitness.png' },
      { title: 'Health', device: 'iPhone 15 Pro', image: 'images/health.png' }
    ];

    var currentIdx = 3;
    var carouselInterval;
    var items = [];
    var w = 320;
    var gap = 32;

    function makeItem(item, isClone) {
      var div = document.createElement('div');
      div.className = 'carousel-item' + (isClone ? ' clone' : '');
      div.innerHTML = '<img src="' + item.image + '" alt="' + item.title + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.src=\'hero-placeholder.svg\'"><div class="device-badge">' + item.device + '</div><div class="carousel-caption">' + item.title + '</div>';
      track.appendChild(div);
    }

    function buildCarousel() {
      track.innerHTML = '';
      portfolioItems.slice(0, 3).forEach(function (item) { makeItem(item, true); });
      portfolioItems.forEach(function (item) { makeItem(item, false); });
      portfolioItems.slice(-3).forEach(function (item) { makeItem(item, true); });
      items = document.querySelectorAll('.carousel-item');
      currentIdx = 3;
      updateCarousel(true);
    }

    function updateCarousel(instant) {
      items.forEach(function (item, index) {
        item.classList.remove('active', 'semi-active');
        if (index === currentIdx) item.classList.add('active');
        else if (index === currentIdx - 1 || index === currentIdx + 1) item.classList.add('semi-active');
      });
      track.style.transition = instant ? 'none' : 'transform 0.5s ease';
      track.style.transform = 'translateX(' + (-currentIdx * (w + gap)) + 'px)';
      if (instant) { track.offsetHeight; track.style.transition = 'transform 0.5s ease'; }
      var len = portfolioItems.length;
      if (currentIdx >= len + 3) {
        setTimeout(function () { track.style.transition = 'none'; currentIdx = 3; updateCarousel(true); }, 500);
      }
      if (currentIdx <= 0) {
        setTimeout(function () { track.style.transition = 'none'; currentIdx = len + 2; updateCarousel(true); }, 500);
      }
    }

    function nextSlide() { currentIdx++; updateCarousel(false); }
    function prevSlide() { currentIdx--; updateCarousel(false); }
    function startAutoSlide() { carouselInterval = setInterval(nextSlide, 3500); }
    function resetAutoSlide() { clearInterval(carouselInterval); startAutoSlide(); }

    buildCarousel();
    startAutoSlide();

    var nextBtn = document.getElementById('next');
    var prevBtn = document.getElementById('prev');
    if (nextBtn) nextBtn.onclick = function () { nextSlide(); resetAutoSlide(); };
    if (prevBtn) prevBtn.onclick = function () { prevSlide(); resetAutoSlide(); };
    track.onmouseenter = function () { clearInterval(carouselInterval); };
    track.onmouseleave = startAutoSlide;

    var touchStartX = 0;
    track.ontouchstart = function (e) { touchStartX = e.touches[0].clientX; clearInterval(carouselInterval); };
    track.ontouchend = function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
      startAutoSlide();
    };

    window.addEventListener('resize', function () {
      if (items.length) { w = items[0].offsetWidth; updateCarousel(true); }
    });
  }

  // ============================================================
  // CONTACT FORM
  // ============================================================
  var form = document.getElementById('contactForm');
  if (form) {
    form.onsubmit = async function (e) {
      e.preventDefault();
      var btn = this.querySelector('button[type="submit"]');
      var originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;
      try {
        var res = await fetch(this.action, { method: 'POST', body: new FormData(this) });
        var msg = document.getElementById('formMessage');
        if (res.ok) {
          msg.textContent = "✓ Message sent! We'll reply soon.";
          msg.style.cssText = 'display:block;background:#10B98133;color:#10B981;padding:16px;border-radius:12px;';
          this.reset();
        } else { throw new Error('Failed'); }
      } catch (err) {
        var msg = document.getElementById('formMessage');
        msg.textContent = 'Error sending. Please try WhatsApp instead.';
        msg.style.cssText = 'display:block;background:#F9731633;color:#F97316;padding:16px;border-radius:12px;';
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
        setTimeout(function () {
          var m = document.getElementById('formMessage');
          if (m) m.style.display = 'none';
        }, 5000);
      }
    };
  }

  // ============================================================
  // NEWSLETTER
  // ============================================================
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.onsubmit = function (e) {
      e.preventDefault();
      alert('Thanks for subscribing! (Demo)');
      this.reset();
    };
  }

  // ============================================================
  // REVEAL ANIMATIONS
  // ============================================================
  var revealElements = document.querySelectorAll('.reveal, .section-title, .sprint-step');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.1 });
  revealElements.forEach(function (el) { revealObserver.observe(el); });

})();