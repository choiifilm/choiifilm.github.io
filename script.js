// ===== GNB Scroll Effect =====
const gnb = document.getElementById('gnb');

window.addEventListener('scroll', () => {
  gnb.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Smooth scroll for nav links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== Scroll Animations =====
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger animation for sibling elements
      const parent = entry.target.parentElement;
      const siblings = parent.querySelectorAll('[data-aos]');
      let delay = 0;
      siblings.forEach((el) => {
        if (el === entry.target) {
          setTimeout(() => el.classList.add('visible'), delay);
        }
        delay += 100;
      });
      // Fallback: always add visible
      setTimeout(() => entry.target.classList.add('visible'), 200);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// ===== Number Counter Animation =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const ease = 1 - Math.pow(2, -10 * progress);
    const current = Math.floor(ease * target);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.stats');
if (statsEl) statsObserver.observe(statsEl);

// ===== Portfolio More Toggle =====
const btnMore = document.getElementById('btn-more');
const portfolioMore = document.getElementById('portfolio-more');

if (btnMore && portfolioMore) {
  btnMore.addEventListener('click', () => {
    const isExpanded = portfolioMore.classList.toggle('show');
    btnMore.classList.toggle('expanded', isExpanded);
    btnMore.querySelector('span').textContent = isExpanded ? '접기' : '더보기';
  });
}

// ===== Video Popup =====
const popup = document.getElementById('videoPopup');
const popupIframe = document.getElementById('popupIframe');
const popupClose = document.getElementById('popupClose');
const popupOverlay = popup ? popup.querySelector('.popup-overlay') : null;

document.querySelectorAll('.portfolio-item').forEach(item => {
  item.addEventListener('click', () => {
    const youtubeUrl = item.getAttribute('data-youtube');
    if (youtubeUrl && popup && popupIframe) {
      const separator = youtubeUrl.includes('?') ? '&' : '?';
      popupIframe.src = youtubeUrl + separator + 'autoplay=1&rel=0&playsinline=1';
      popup.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
});

function closePopup() {
  if (popup && popupIframe) {
    popup.classList.remove('active');
    popupIframe.src = '';
    document.body.style.overflow = '';
  }
}

if (popupClose) popupClose.addEventListener('click', closePopup);
if (popupOverlay) popupOverlay.addEventListener('click', closePopup);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePopup();
});
