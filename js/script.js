/* ============================================
   BARBEARIA DO CAZÉ — By m4chado7.
   Interações, animações e funcionalidades.
   @m4chado7.web nas redes sociais. @m4chado7 no github.com
   ============================================ */

(function () {
  'use strict';

  /* ============================
     1. VARIÁVEIS GLOBAIS
     ============================ */
  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileClose = document.getElementById('mobileClose');
  var mobileLinks = document.querySelectorAll('.mobile-menu__link');
  var backToTop = document.getElementById('backToTop');
  var navLinks = document.querySelectorAll('.navbar__link');
  var sections = document.querySelectorAll('.section, .hero');
  var fadeElements = document.querySelectorAll('.fade-in');
  var counters = document.querySelectorAll('.counter');
  var faqItems = document.querySelectorAll('.faq__item');
  var currentYearEl = document.getElementById('currentYear');

  /* ============================
     2. ANO ATUAL NO FOOTER
     ============================ */
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  /* ============================
     3. NAVBAR — Mudança ao rolar
     ============================ */
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ============================
     4. MENU MOBILE
     ============================ */
  function openMobileMenu() {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      if (mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ============================
     5. LINK ATIVO NO MENU
     ============================ */
  function updateActiveLink() {
    var scrollPos = window.scrollY + 200;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* ============================
     6. BOTÃO VOLTAR AO TOPO
     ============================ */
  function handleBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================
     7. SCROLL — Listener unificado
     ============================ */
  var ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleNavbarScroll();
        updateActiveLink();
        handleBackToTop();
        handleParallax();
        ticking = false;
      });
      ticking = true;
    }
  });

  /* ============================
     8. PARALLAX DISCRETO NO HERO
     ============================ */
  var heroImage = document.getElementById('heroImage');
  var heroContent = document.getElementById('heroContent');

  function handleParallax() {
    if (window.innerWidth < 768) return;
    var scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      if (heroImage) {
        heroImage.style.transform = 'translateY(' + scrolled * 0.15 + 'px)';
      }
      if (heroContent) {
        heroContent.style.transform = 'translateY(' + scrolled * 0.05 + 'px)';
      }
    }
  }

  /* ============================
     9. FADE-IN AO SCROLL
     ============================ */
  var fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  fadeElements.forEach(function (el) {
    fadeObserver.observe(el);
  });

  /* ============================
     10. CONTADORES ANIMADOS
     ============================ */
  var countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    counters.forEach(function (counter) {
      var parent = counter.closest('.stat-card');
      if (!parent) return;

      var target = parseInt(parent.getAttribute('data-target'));
      var duration = 2000;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);

        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(step);
    });

    countersAnimated = true;
  }

  var statsSection = document.querySelector('.sobre__stats');
  if (statsSection) {
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  }

  /* ============================
     11. GALERIA — Lightbox
     ============================ */
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightboxImage');
  var lightboxCounter = document.getElementById('lightboxCounter');
  var lightboxCloseBtn = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var galeriaItems = document.querySelectorAll('.galeria__item');
  var currentImageIndex = 0;
  var galleryImages = [];

  galeriaItems.forEach(function (item, index) {
    var img = item.querySelector('img');
    if (img) galleryImages.push(img.src);

    item.addEventListener('click', function () {
      currentImageIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    if (galleryImages.length === 0) return;
    lightboxImage.src = galleryImages[currentImageIndex];
    lightboxCounter.textContent = (currentImageIndex + 1) + ' / ' + galleryImages.length;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImage.src = galleryImages[currentImageIndex];
    lightboxCounter.textContent = (currentImageIndex + 1) + ' / ' + galleryImages.length;
  }

  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[currentImageIndex];
    lightboxCounter.textContent = (currentImageIndex + 1) + ' / ' + galleryImages.length;
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* ============================
     12. CARROSSEL DE DEPOIMENTOS
     ============================ */
  var track = document.getElementById('depoimentosTrack');
  var depPrev = document.getElementById('depPrev');
  var depNext = document.getElementById('depNext');
  var depIndicators = document.getElementById('depIndicators');
  var depoimentoCards = document.querySelectorAll('.depoimento-card');
  var currentSlide = 0;
  var totalSlides = depoimentoCards.length;
  var autoPlayInterval;
  var slidesPerView = 1;

  function createIndicators() {
    if (!depIndicators) return;
    depIndicators.innerHTML = '';
    var totalIndicators = Math.ceil(totalSlides / slidesPerView);
    for (var i = 0; i < totalIndicators; i++) {
      var dot = document.createElement('button');
      dot.classList.add('depoimentos__indicator');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', 'Ir para slide ' + (i + 1));
      (function (index) {
        dot.addEventListener('click', function () {
          goToSlide(index);
        });
      })(i);
      depIndicators.appendChild(dot);
    }
  }

  function updateSlidesPerView() {
    slidesPerView = 1;
    createIndicators();
    goToSlide(0);
  }

  function goToSlide(index) {
    var maxIndex = totalSlides - slidesPerView;
    if (index < 0) index = maxIndex;
    if (index > maxIndex) index = 0;
    currentSlide = index;

    var percentage = -(currentSlide * (100 / slidesPerView));
    track.style.transform = 'translateX(' + percentage + '%)';

    var dots = depIndicators.querySelectorAll('.depoimentos__indicator');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  if (depNext) depNext.addEventListener('click', function () { nextSlide(); resetAutoPlay(); });
  if (depPrev) depPrev.addEventListener('click', function () { prevSlide(); resetAutoPlay(); });

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  var carousel = document.getElementById('depoimentosCarousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', function () { clearInterval(autoPlayInterval); });
    carousel.addEventListener('mouseleave', function () { startAutoPlay(); });
  }

  /* Touch / Swipe */
  var touchStartX = 0;
  var touchEndX = 0;

  if (track) {
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
        resetAutoPlay();
      }
    }, { passive: true });
  }

  updateSlidesPerView();
  startAutoPlay();

  window.addEventListener('resize', updateSlidesPerView);

  /* ============================
     13. FAQ — Accordion
     ============================ */
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq__question');
    if (!question) return;

    question.addEventListener('click', function () {
      var isActive = item.classList.contains('active');

      faqItems.forEach(function (faqItem) {
        faqItem.classList.remove('active');
        var btn = faqItem.querySelector('.faq__question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ============================
     14. SMOOTH SCROLL
     ============================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var navHeight = navbar.offsetHeight;
        var targetPos = targetEl.offsetTop - navHeight;

        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  /* ============================
     15. INICIALIZAÇÃO
     ============================ */
  handleNavbarScroll();
  updateActiveLink();
  handleBackToTop();

})();