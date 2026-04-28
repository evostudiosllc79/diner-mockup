// Mobile nav toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

/* ===== Back to Top Button ===== */
/* Shows the button once user has scrolled past 400px. 
   Clicking scrolls smoothly back to the top. */

const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Scroll fade-up animations
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
      observer.unobserve(el.target);
    }
  });
}, { threshold: 0, rootMargin: '200px 0px 200px 0px' });

fadeEls.forEach(el => observer.observe(el));

// Highlight today's special
const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
const today = days[new Date().getDay()];
document.querySelectorAll('.special-day').forEach(el => {
  if (el.dataset.day === today) el.classList.add('today');
});

// Set active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});
   const timingBar = document.getElementById('timingBar');
   const pauseBtn = document.getElementById('pauseBtn');

if (timingBar && pauseBtn) {
  const slides = document.querySelectorAll('.slide');
  const counter = document.getElementById('counter');
  const dotsContainer = document.getElementById('dots');

  const DURATION = 5000;
  let current = 0;
  let paused = false;
  let startTime = null;
  let elapsed = 0;
  let rafId = null;
  let timeoutId = null;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateUI() {
      slides.forEach((s, i) => s.classList.toggle('active', i === current));
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
    }

    function animateBar(from = 0) {
      startTime = performance.now();
      elapsed = from;

      function frame(now) {
        if (paused) return;
        const delta = now - startTime;
        const total = elapsed + delta;
        const pct = Math.min((total / DURATION) * 100, 100);
        timingBar.style.width = pct + '%';

        if (total < DURATION) {
          rafId = requestAnimationFrame(frame);
        }
      }

      rafId = requestAnimationFrame(frame);
    }

    function scheduleNext(delay = DURATION) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!paused) next();
      }, delay - elapsed);
    }
 
   function startSlide(fromElapsed = 0) {
      elapsed = fromElapsed;
      timingBar.style.transition = 'none';
      timingBar.style.width = (elapsed / DURATION * 100) + '%';
      setTimeout(() => {
        timingBar.style.transition = '';
        animateBar(fromElapsed);
        scheduleNext(DURATION);
      }, 20);
    }

    function next() {
      current = (current + 1) % slides.length;
      updateUI();
      elapsed = 0;
      startSlide();
    }

    function prev() {
      current = (current - 1 + slides.length) % slides.length;
      updateUI();
      elapsed = 0;
      startSlide();
    }

    function goTo(index) {
      current = index;
      updateUI();
      elapsed = 0;
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
      startSlide();
    }

    pauseBtn.addEventListener('click', () => {
      paused = !paused;
      pauseBtn.textContent = paused ? '▶' : '⏸';

      if (paused) {
        cancelAnimationFrame(rafId);
        clearTimeout(timeoutId);
        // Save how much time has elapsed
        elapsed = (parseFloat(timingBar.style.width) / 100) * DURATION;
      } else {
        startSlide(elapsed);
      }
    });

    document.getElementById('nextBtn').addEventListener('click', next);
    document.getElementById('prevBtn').addEventListener('click', prev);

    // Keyboard support
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === ' ') { e.preventDefault(); pauseBtn.click(); }
    });

    // Init
    updateUI();
    startSlide();
}
