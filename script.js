// MZ App Studio - WITH INTRO VIDEO (SAFE VERSION)
(function() {
  "use strict";
  
  console.log('🎬 MZ App Studio - Loading with Intro Video...');
  
  // ============================================================
  // STEP 1: ENSURE SCROLLING IS ENABLED
  // ============================================================
  (function enableScrolling() {
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
    console.log('✅ Scrolling enabled');
  })();
  
  // ============================================================
  // STEP 2: INTRO VIDEO - PROPER IMPLEMENTATION
  // ============================================================
  var introOverlay = document.getElementById('introVideoOverlay');
  var introVideo = document.getElementById('introVideoPlayer');
  var skipBtn = document.getElementById('introSkipBtn');
  var progressFill = document.getElementById('introProgressFill');
  var unmuteBtn = document.getElementById('introUnmuteBtn');
  var volumeIcon = document.getElementById('introVolumeIcon');
  var pageLoader = document.getElementById('pageLoader');
  
  // Track if intro has been shown before (session storage)
  var introShown = sessionStorage.getItem('introShown');
  
  function completelyRemoveIntro() {
    console.log('🗑️ Removing intro overlay completely');
    
    if (introOverlay) {
      introOverlay.style.opacity = '0';
      introOverlay.style.transition = 'opacity 0.5s ease';
      
      setTimeout(function() {
        if (introOverlay) {
          introOverlay.remove(); // COMPLETELY REMOVE FROM DOM
        }
        if (introVideo) {
          introVideo.pause();
          introVideo.src = ''; // Stop loading
        }
        console.log('✅ Intro removed from DOM');
      }, 500);
    }
    
    // Mark as shown for this session
    sessionStorage.setItem('introShown', 'true');
  }
  
  function skipIntro() {
    console.log('⏭️ Skipping intro');
    completelyRemoveIntro();
  }
  
  // If intro was already shown this session, skip it
  if (introShown === 'true') {
    console.log('📌 Intro already shown this session, skipping');
    if (introOverlay) introOverlay.remove();
    if (pageLoader) {
      pageLoader.classList.add('fade-out');
      setTimeout(function() { if (pageLoader) pageLoader.remove(); }, 500);
    }
  } else {
    // Show intro video
    if (pageLoader) {
      pageLoader.classList.add('fade-out');
      setTimeout(function() { if (pageLoader) pageLoader.remove(); }, 500);
    }
    
    if (introOverlay && introVideo) {
      introOverlay.classList.add('active');
      
      // Try to play video
      var playPromise = introVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(function(error) {
          console.log('ℹ️ Autoplay blocked, user can click unmute or skip');
        });
      }
      
      // Update progress bar
      introVideo.addEventListener('timeupdate', function() {
        if (introVideo.duration && progressFill) {
          var pct = (introVideo.currentTime / introVideo.duration) * 100;
          progressFill.style.width = pct + '%';
        }
      });
      
      // When video ends, remove intro
      introVideo.addEventListener('ended', function() {
        console.log('🎬 Video ended');
        completelyRemoveIntro();
      });
      
      // If video errors, skip intro
      introVideo.addEventListener('error', function() {
        console.log('⚠️ Video error, skipping');
        completelyRemoveIntro();
      });
      
      // Skip button
      if (skipBtn) {
        skipBtn.addEventListener('click', skipIntro);
      }
      
      // Unmute button
      if (unmuteBtn) {
        unmuteBtn.addEventListener('click', function() {
          introVideo.muted = !introVideo.muted;
          if (volumeIcon) {
            if (introVideo.muted) {
              volumeIcon.className = 'fas fa-volume-mute';
              unmuteBtn.querySelector('span').textContent = 'Tap to unmute';
            } else {
              volumeIcon.className = 'fas fa-volume-up';
              unmuteBtn.querySelector('span').textContent = 'Mute';
            }
          }
        });
      }
      
      // Click on overlay background to skip (optional)
      introOverlay.addEventListener('click', function(e) {
        if (e.target === introOverlay) {
          skipIntro();
        }
      });
      
      // Auto-skip after 10 seconds max (safety)
      setTimeout(function() {
        if (introOverlay && introOverlay.parentNode) {
          console.log('⏰ Auto-skip timeout');
          completelyRemoveIntro();
        }
      }, 10000);
    }
  }
  
  // ============================================================
  // STEP 3: SIMPLE SCROLL FUNCTION
  // ============================================================
  window.scrollToSection = function(sectionId) {
    console.log('🎯 Scrolling to:', sectionId);
    
    var section = document.getElementById(sectionId);
    if (!section) {
      console.error('Section not found:', sectionId);
      return;
    }
    
    // Close mobile menu
    var navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('active');
    
    // Get header height
    var header = document.querySelector('header');
    var headerHeight = header ? header.offsetHeight : 65;
    
    // Calculate position
    var rect = section.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var targetPosition = scrollTop + rect.top - headerHeight;
    
    // SCROLL!
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    // Update URL
    window.location.hash = sectionId;
  };
  
  // ============================================================
  // STEP 4: ATTACH CLICK HANDLERS
  // ============================================================
  function attachClickHandlers() {
    var allLinks = document.querySelectorAll('a[href^="#"]');
    var count = 0;
    
    allLinks.forEach(function(link) {
      var href = link.getAttribute('href');
      
      if (!href || href === '#' || href.includes('wa.me') || href.includes('mailto:')) {
        return;
      }
      
      // Remove existing listeners
      var newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      
      // Add fresh handler
      newLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        var targetId = this.getAttribute('href').substring(1);
        window.scrollToSection(targetId);
        
        return false;
      });
      
      count++;
    });
    
    console.log('✅ Attached to', count, 'navigation links');
  }
  
  attachClickHandlers();
  setTimeout(attachClickHandlers, 100);
  setTimeout(attachClickHandlers, 500);
  
  // ============================================================
  // STEP 5: HANDLE INITIAL HASH
  // ============================================================
  window.addEventListener('load', function() {
    var hash = window.location.hash;
    if (hash && hash !== '#') {
      var targetId = hash.substring(1);
      setTimeout(function() {
        window.scrollToSection(targetId);
      }, 300);
    }
  });
  
  // ============================================================
  // STEP 6: BRAND LOGO
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
  // STEP 7: MOBILE MENU
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
  // STEP 8: HEADER SCROLL EFFECT
  // ============================================================
  window.addEventListener('scroll', function() {
    var header = document.querySelector('header');
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    
    var backToTop = document.getElementById('backToTop');
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });
  
  // ============================================================
  // STEP 9: BACK TO TOP
  // ============================================================
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  // ============================================================
  // STEP 10: THEME TOGGLE
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
  // STEP 11: ACTIVE NAV HIGHLIGHT
  // ============================================================
  function updateActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var navItems = document.querySelectorAll('.nav-links a');
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
  // STEP 12: FAQ ACCORDION
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
  // STEP 13: STATS COUNTER
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
  // STEP 14: PORTFOLIO CAROUSEL
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
  // STEP 15: CONTACT FORM
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
  // STEP 16: NEWSLETTER
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
  // STEP 17: REVEAL ANIMATIONS
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
  // STEP 18: YEAR IN FOOTER
  // ============================================================
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  
  console.log('✅ MZ App Studio - Fully Loaded!');
  
})();