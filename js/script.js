const menu = document.querySelector('[data-menu]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const yearTarget = document.querySelector('[data-current-year]');
const header = document.querySelector('[data-header]');
const hero = document.querySelector('.hero');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (header) {
  const setHeaderState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });
}

if (menu && menuToggle) {
  const setMenuState = (isOpen) => {
    menu.classList.toggle('is-open', isOpen);
    menuToggle.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  };

  menuToggle.addEventListener('click', () => {
    setMenuState(!menu.classList.contains('is-open'));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (!menu.contains(target) && !menuToggle.contains(target)) {
      setMenuState(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenuState(false);
    }
  });
}

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll(
    '.verse, .services .section-heading, .service-card, .welcome-card, .page-ribbon, .content-card, .map-placeholder, .schedule-grid > *, .values-grid > *, .message-grid > *'
  );

  revealTargets.forEach((target) => target.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.12
    }
  );

  revealTargets.forEach((target) => observer.observe(target));
}

if (hero && !prefersReducedMotion) {
  const canUseParallax = window.matchMedia('(min-width: 981px)').matches;
  let ticking = false;

  const updateHeroParallax = () => {
    ticking = false;

    if (!canUseParallax) {
      hero.style.removeProperty('--hero-parallax-y');
      return;
    }

    const heroRect = hero.getBoundingClientRect();
    const isHeroVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;

    if (!isHeroVisible) {
      return;
    }

    const offset = Math.min(Math.max(window.scrollY * 0.12, 0), 42);
    hero.style.setProperty('--hero-parallax-y', `${offset}px`);
  };

  const requestParallaxUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeroParallax);
      ticking = true;
    }
  };

  updateHeroParallax();
  window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
}
