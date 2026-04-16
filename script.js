// MZ App Studio - COMPLETE WORKING VERSION
(function() {
  "use strict";
  
  console.log('🎬 MZ App Studio - Loading...');
  
  // ============================================================
  // ENABLE SCROLLING
  // ============================================================
  var style = document.createElement('style');
  style.textContent = `
    html, body {
      overflow: auto !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      height: auto !important;
      scroll-behavior: smooth !important;
    }
  `;
  document.head.appendChild(style);
  
  // ============================================================
  // PREMIUM INTRO SYSTEM
  // ============================================================
  var intro = document.getElementById('premiumIntro');
  var introVideo = document.getElementById('premiumIntroVideo');
  var skipBtn = document.getElementById('premiumSkipBtn');
  var progressFill = document.getElementById('premiumProgressFill');
  var rotateHint = document.getElementById('rotateHint');
  var animatedText = document.getElementById('introAnimatedText');
  var introControls = document.querySelector('.intro-controls');
  var loadingSpinner = document.getElementById('introLoading');
  var pageLoader = document.getElementById('pageLoader');
  var heroContainer = document.getElementById('heroVideoContainer');
  var heroVisual = document.getElementById('heroVisualContainer');
  
  var introComplete = false;
  var animationsStarted = false;
  
  // Remove page loader
  if (pageLoader) {
    setTimeout(function() {
      pageLoader.classList.add('fade-out');
      setTimeout(function() { 
        if (pageLoader) pageLoader.style.display = 'none'; 
      }, 500);
    }, 200);
  }
  
  // Check orientation
  function checkOrientation() {
    var isPortrait = window.innerHeight > window.innerWidth;
    var isMobile = window.innerWidth <= 768;
    
    if (isPortrait && isMobile) {
      if (rotateHint) rotateHint.classList.add('show');
      if (animatedText) animatedText.classList.remove('show');
      if (introControls) introControls.classList.remove('show');
    } else {
      if (rotateHint) rotateHint.classList.remove('show');
      if (animatedText) animatedText.classList.add('show');
      if (introControls) introControls.classList.add('show');
      
      if (!animationsStarted) {
        startTextAnimations();
        animationsStarted = true;
      }
    }
  }
  
  // Animated text
  function startTextAnimations() {
    var word1 = document.getElementById('word1');
    var arrow1 = document.getElementById('arrow1');
    var word2 = document.getElementById('word2');
    var arrow2 = document.getElementById('arrow2');
    var word3 = document.getElementById('word3');
    
    setTimeout(function() { if (word1) word1.classList.add('animate'); }, 300);
    setTimeout(function() { if (arrow1) arrow1.classList.add('animate'); }, 800);
    setTimeout(function() { if (word2) word2.classList.add('animate'); }, 1300);
    setTimeout(function() { if (arrow2) arrow2.classList.add('animate'); }, 1800);
    setTimeout(function() { if (word3) word3.classList.add('animate'); }, 2300);
  }
  
// Transition to hero container (KEEPS BACKGROUND VIDEO)
function transitionToHero() {
  if (introComplete) return;
  introComplete = true;
  
  console.log('🎬 Transitioning to hero container...');
  
  sessionStorage.setItem('premiumIntroShown', 'true');
  
  var video = introVideo;
  var videoSource = video.querySelector('source').src;
  
  // Create hero container video (right side)
  var heroVideo = document.createElement('video');
  heroVideo.className = 'hero-container-video';
  heroVideo.muted = true;
  heroVideo.loop = true;
  heroVideo.playsInline = true;
  heroVideo.autoplay = true;
  heroVideo.style.width = '100%';
  heroVideo.style.height = '100%';
  heroVideo.style.objectFit = 'cover';
  heroVideo.style.borderRadius = 'var(--radius-lg)';
  
  var source = document.createElement('source');
  source.src = videoSource;
  source.type = 'video/mp4';
  heroVideo.appendChild(source);
  
  if (heroContainer) {
    heroContainer.innerHTML = '';
    heroContainer.appendChild(heroVideo);
    heroVideo.load();
    heroVideo.play().catch(function(err) {
      console.log('Hero container video play:', err);
    });
  }
  
  // Fade out intro
  if (animatedText) animatedText.style.opacity = '0';
  if (introControls) introControls.style.opacity = '0';
  
  setTimeout(function() {
    if (intro) intro.classList.add('fade-out');
    if (video) video.pause();
  }, 100);
  
  setTimeout(function() {
    if (intro) intro.style.display = 'none';
    console.log('✅ Intro complete!');
  }, 800);
}
  
  // Skip intro
  function skipIntro() {
    console.log('⏭️ Skipping intro');
    transitionToHero();
  }
  
  // Initialize intro
  function initIntro() {
    if (!intro || !introVideo) return;
    
    if (sessionStorage.getItem('premiumIntroShown') === 'true') {
      transitionToHero();
      return;
    }
    
    introVideo.muted = true;
    
    if (loadingSpinner) loadingSpinner.classList.add('show');
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    introVideo.addEventListener('loadeddata', function() {
      if (loadingSpinner) loadingSpinner.classList.remove('show');
    });
    
    introVideo.addEventListener('timeupdate', function() {
      if (introVideo.duration && progressFill) {
        progressFill.style.width = (introVideo.currentTime / introVideo.duration) * 100 + '%';
      }
    });
    
    introVideo.addEventListener('ended', transitionToHero);
    introVideo.addEventListener('error', function() {
      if (loadingSpinner) loadingSpinner.classList.remove('show');
      setTimeout(transitionToHero, 500);
    });
    
    introVideo.play().catch(function() {});
    
    if (skipBtn) skipBtn.addEventListener('click', skipIntro);
    
    intro.addEventListener('click', function(e) {
      if (e.target === intro) skipIntro();
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && intro && intro.style.display !== 'none') {
        skipIntro();
      }
    });
    
    setTimeout(function() {
      if (!introComplete && intro) transitionToHero();
    }, 15000);
  }
  
  initIntro();
  
  // ============================================================
  // NAVIGATION SYSTEM
  // ============================================================
  window.scrollToSection = function(sectionId) {
    var section = document.getElementById(sectionId);
    if (!section) return;
    
    var navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('active');
    
    var header = document.querySelector('header');
    var headerHeight = header ? header.offsetHeight : 65;
    var rect = section.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var targetPosition = scrollTop + rect.top - headerHeight;
    
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    window.location.hash = sectionId;
  };
  
  function attachNavListeners() {
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
      var href = link.getAttribute('href');
      if (!href || href === '#' || href.includes('wa.me') || href.includes('mailto:')) return;
      
      var newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      
      newLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollToSection(this.getAttribute('href').substring(1));
      });
    });
  }
  
  attachNavListeners();
  setTimeout(attachNavListeners, 200);
  
  // ============================================================
  // MOBILE MENU
  // ============================================================
  var mobileBtn = document.getElementById('mobileMenuBtn');
  var navLinks = document.getElementById('navLinks');
  
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      var icon = this.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
    
    document.addEventListener('click', function(e) {
      if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        var icon = mobileBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      }
    });
  }
  
  // ============================================================
  // HEADER SCROLL
  // ============================================================
  window.addEventListener('scroll', function() {
    var header = document.querySelector('header');
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    
    var backToTop = document.getElementById('backToTop');
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  });
  
  // ============================================================
  // BACK TO TOP
  // ============================================================
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', function() {
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
      if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      }
    }
    
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('light-mode');
      var icon = this.querySelector('i');
      
      if (document.body.classList.contains('light-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
      }
    });
  }
  
  // ============================================================
  // BRAND LOGO
  // ============================================================
  var brandLogo = document.getElementById('brandLogo');
  if (brandLogo) {
    brandLogo.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.location.hash = '';
    });
  }
  
  // ============================================================
  // ACTIVE NAV HIGHLIGHT
  // ============================================================
  var sections = document.querySelectorAll('section[id]');
  var navItems = document.querySelectorAll('.nav-links a');
  
  function updateActiveNav() {
    var scrollPos = window.scrollY + 150;
    
    sections.forEach(function(section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;
      
      if (scrollPos >= top && scrollPos < bottom) {
        var id = section.getAttribute('id');
        navItems.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();
  
  // ============================================================
  // FAQ ACCORDION
  // ============================================================
  document.querySelectorAll('.faq-question').forEach(function(q) {
    q.addEventListener('click', function() {
      var item = this.closest('.faq-item');
      if (!item) return;
      
      document.querySelectorAll('.faq-item').forEach(function(i) {
        if (i !== item) i.classList.remove('active');
      });
      
      item.classList.toggle('active');
    });
  });
  
  // ============================================================
  // STATS COUNTER
  // ============================================================
  var stats = document.querySelectorAll('.stat-number');
  if (stats.length) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          stats.forEach(function(stat) {
            var target = parseInt(stat.dataset.target) || 50;
            var current = 0;
            var timer = setInterval(function() {
              current += target / 40;
              if (current >= target) {
                stat.textContent = target + '+';
                clearInterval(timer);
              } else {
                stat.textContent = Math.floor(current);
              }
            }, 25);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    
    if (stats[0] && stats[0].parentElement) {
      observer.observe(stats[0].parentElement);
    }
  }
  
  // ============================================================
  // PORTFOLIO CAROUSEL
  // ============================================================
  var track = document.getElementById('carouselTrack');
  if (track) {
    var items = [
      { title: 'AI Chatbot', device: 'iPhone 15 Pro', image: 'images/ai chatbots.png' },
      { title: 'E-commerce', device: 'Samsung S24', image: 'images/ecommerce.png' },
      { title: 'Finance', device: 'iPhone 15', image: 'images/finance.png' },
      { title: 'Fitness', device: 'Samsung S24', image: 'images/fitness.png' },
      { title: 'Health', device: 'iPhone 15 Pro', image: 'images/health.png' }
    ];
    
    var currentIdx = 3;
    var interval;
    var w = 320;
    var gap = 32;
    
    function createItem(item) {
      var div = document.createElement('div');
      div.className = 'carousel-item';
      div.innerHTML = '<img src="' + item.image + '" alt="' + item.title + '" style="width:100%;height:100%;object-fit:cover;"><div class="device-badge">' + item.device + '</div><div class="carousel-caption">' + item.title + '</div>';
      return div;
    }
    
    function buildCarousel() {
      track.innerHTML = '';
      items.slice(0, 3).forEach(function(item) { track.appendChild(createItem(item)); });
      items.forEach(function(item) { track.appendChild(createItem(item)); });
      items.slice(-3).forEach(function(item) { track.appendChild(createItem(item)); });
      updateCarousel(true);
    }
    
    function updateCarousel(instant) {
      var allItems = document.querySelectorAll('.carousel-item');
      allItems.forEach(function(item, i) {
        item.classList.remove('active', 'semi-active');
        if (i === currentIdx) item.classList.add('active');
        else if (i === currentIdx - 1 || i === currentIdx + 1) item.classList.add('semi-active');
      });
      
      track.style.transition = instant ? 'none' : 'transform 0.5s ease';
      track.style.transform = 'translateX(' + (-currentIdx * (w + gap)) + 'px)';
      
      if (instant) {
        track.offsetHeight;
        track.style.transition = 'transform 0.5s ease';
      }
      
      var len = items.length;
      if (currentIdx >= len + 3) {
        setTimeout(function() {
          track.style.transition = 'none';
          currentIdx = 3;
          updateCarousel(true);
        }, 500);
      }
      if (currentIdx <= 2) {
        setTimeout(function() {
          track.style.transition = 'none';
          currentIdx = len + 2;
          updateCarousel(true);
        }, 500);
      }
    }
    
    function next() { currentIdx++; updateCarousel(false); }
    function prev() { currentIdx--; updateCarousel(false); }
    function startAuto() { if (interval) clearInterval(interval); interval = setInterval(next, 3500); }
    
    buildCarousel();
    startAuto();
    
    document.getElementById('next').addEventListener('click', function() { next(); startAuto(); });
    document.getElementById('prev').addEventListener('click', function() { prev(); startAuto(); });
    
    track.addEventListener('mouseenter', function() { clearInterval(interval); });
    track.addEventListener('mouseleave', startAuto);
  }
  
  // ============================================================
  // CONTACT FORM
  // ============================================================
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      var btn = this.querySelector('button[type="submit"]');
      var original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;
      
      try {
        var res = await fetch(this.action, { method: 'POST', body: new FormData(this) });
        var msg = document.getElementById('formMessage');
        if (res.ok) {
          msg.textContent = '✓ Message sent!';
          msg.style.display = 'block';
          msg.style.background = '#10B98133';
          msg.style.color = '#10B981';
          this.reset();
        } else {
          throw new Error('Failed');
        }
      } catch (err) {
        var msg = document.getElementById('formMessage');
        msg.textContent = 'Error. Try WhatsApp.';
        msg.style.display = 'block';
        msg.style.background = '#F9731633';
        msg.style.color = '#F97316';
      } finally {
        btn.innerHTML = original;
        btn.disabled = false;
        setTimeout(function() {
          document.getElementById('formMessage').style.display = 'none';
        }, 5000);
      }
    });
  }
  
  // ============================================================
  // NEWSLETTER
  // ============================================================
  var newsletter = document.getElementById('newsletterForm');
  if (newsletter) {
    newsletter.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thanks for subscribing!');
      this.reset();
    });
  }
  
  // ============================================================
  // REVEAL ANIMATIONS
  // ============================================================
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.15 });
  
  document.querySelectorAll('.reveal, .section-title, .sprint-step, .timeline-item, .tech-item, .testimonial-card, .pricing-card').forEach(function(el) {
    revealObserver.observe(el);
  });
  
  // ============================================================
  // YEAR
  // ============================================================
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  
  console.log('✅ MZ App Studio - Ready!');
  
})();