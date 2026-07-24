const menu = document.querySelector('[data-menu]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const yearTarget = document.querySelector('[data-current-year]');
const header = document.querySelector('[data-header]');
const hero = document.querySelector('.hero');
const whatsappUrl = 'https://wa.me/5521974350384';

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

document.querySelectorAll('.primary-nav a').forEach((link) => {
  const linkUrl = new URL(link.getAttribute('href'), window.location.href);
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const linkPage = linkUrl.pathname.split('/').pop() || 'index.html';

  link.classList.toggle('is-active', linkPage === currentPage);
});

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
    '.verse, .services .section-heading, .service-card, .welcome-card, .page-ribbon, .content-card, .map-placeholder, .schedule-grid > *, .values-grid > *, .message-grid > *, .faq-item, .timeline-list > *, .gallery-item, .message-card'
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

const createFloatingWhatsapp = () => {
  const link = document.createElement('a');
  link.className = 'floating-whatsapp';
  link.href = `${whatsappUrl}?text=${encodeURIComponent('Ola! Vim pelo site da Igreja Missionaria Filadelfia.')}`;
  link.target = '_blank';
  link.rel = 'noopener';
  link.setAttribute('aria-label', 'Falar com a igreja pelo WhatsApp');
  link.innerHTML = `
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20.1 3.9A11.8 11.8 0 0 0 1.7 18.2L.4 23.4l5.3-1.4A11.8 11.8 0 0 0 20.1 3.9Zm-8.3 16a9.7 9.7 0 0 1-4.9-1.3l-.4-.2-3.1.8.8-3-.2-.4a9.6 9.6 0 1 1 7.8 4.1Zm5.3-7.2c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2.1-.4 0-.6 0-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.8 0 1.7 1.2 3.3 1.4 3.5.2.2 2.4 3.7 5.8 5.1.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.7-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.4Z" />
    </svg>
  `;
  document.body.append(link);
};

createFloatingWhatsapp();

document.querySelectorAll('.faq-item').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) {
      return;
    }

    document.querySelectorAll('.faq-item[open]').forEach((openItem) => {
      if (openItem !== item) {
        openItem.open = false;
      }
    });
  });
});

const normalizeText = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const messageSearch = document.querySelector('[data-message-search]');
const messageFilters = document.querySelectorAll('[data-message-filter]');
const messageCards = document.querySelectorAll('[data-message-card]');
const messageEmpty = document.querySelector('[data-message-empty]');

if (messageCards.length > 0) {
  let activeFilter = 'todos';

  const filterMessages = () => {
    const query = normalizeText(messageSearch?.value || '');
    let visibleCount = 0;

    messageCards.forEach((card) => {
      const categoryMatches = activeFilter === 'todos' || card.dataset.messageCategory === activeFilter;
      const searchText = normalizeText(`${card.textContent} ${card.dataset.messageText || ''}`);
      const textMatches = !query || searchText.includes(query);
      const isVisible = categoryMatches && textMatches;

      card.classList.toggle('is-hidden', !isVisible);

      if (isVisible) {
        visibleCount += 1;
      }
    });

    messageEmpty?.classList.toggle('is-visible', visibleCount === 0);
  };

  messageSearch?.addEventListener('input', filterMessages);

  messageFilters.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.messageFilter || 'todos';
      messageFilters.forEach((filterButton) => {
        filterButton.classList.toggle('is-active', filterButton === button);
      });
      filterMessages();
    });
  });

  filterMessages();
}

const lightboxButtons = document.querySelectorAll('[data-lightbox-src]');

if (lightboxButtons.length > 0) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <div class="lightbox__dialog" role="dialog" aria-modal="true" aria-label="Imagem ampliada">
      <button class="lightbox__close" type="button" aria-label="Fechar imagem">&times;</button>
      <img alt="" />
      <p></p>
    </div>
  `;
  document.body.append(lightbox);

  const lightboxImage = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('p');
  const lightboxClose = lightbox.querySelector('.lightbox__close');

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove('menu-is-open');
  };

  lightboxButtons.forEach((button) => {
    button.addEventListener('click', () => {
      lightboxImage.src = button.dataset.lightboxSrc || '';
      lightboxImage.alt = button.querySelector('img')?.alt || '';
      lightboxCaption.textContent = button.dataset.lightboxCaption || '';
      lightbox.hidden = false;
      document.body.classList.add('menu-is-open');
      lightboxClose.focus();
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !lightbox.hidden) {
      closeLightbox();
    }
  });
}

const padDateValue = (value) => String(value).padStart(2, '0');

const formatDateForCalendar = (date) =>
  `${date.getFullYear()}${padDateValue(date.getMonth() + 1)}${padDateValue(date.getDate())}T${padDateValue(date.getHours())}${padDateValue(date.getMinutes())}00`;

const getNextServiceDate = ({ weekday, hour, minute }) => {
  const now = new Date();
  const serviceDate = new Date(now);
  serviceDate.setHours(hour, minute, 0, 0);

  const daysUntilService = (weekday - now.getDay() + 7) % 7;
  serviceDate.setDate(now.getDate() + daysUntilService);

  if (serviceDate <= now) {
    serviceDate.setDate(serviceDate.getDate() + 7);
  }

  return serviceDate;
};

const escapeCalendarText = (value) =>
  value.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');

document.querySelectorAll('[data-calendar-button]').forEach((button) => {
  button.addEventListener('click', () => {
    const title = button.dataset.calendarTitle || 'Culto online';
    const weekday = Number(button.dataset.calendarWeekday);
    const hour = Number(button.dataset.calendarHour);
    const minute = Number(button.dataset.calendarMinute);
    const startsAt = getNextServiceDate({ weekday, hour, minute });
    const endsAt = new Date(startsAt.getTime() + 90 * 60 * 1000);
    const filename = `${normalizeText(title).replace(/\s+/g, '-')}.ics`;
    const calendarBody = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Igreja Missionaria Filadelfia//Site//PT-BR',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}-${filename}@filadelfia`,
      `DTSTART;TZID=America/Sao_Paulo:${formatDateForCalendar(startsAt)}`,
      `DTEND;TZID=America/Sao_Paulo:${formatDateForCalendar(endsAt)}`,
      'RRULE:FREQ=WEEKLY',
      `SUMMARY:${escapeCalendarText(title)}`,
      'DESCRIPTION:Culto online da Igreja Missionaria Filadelfia Jesus Cristo Reina',
      'LOCATION:Online',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const file = new Blob([calendarBody], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  });
});

document.querySelectorAll('[data-copy-location]').forEach((button) => {
  button.addEventListener('click', async () => {
    const location = button.dataset.copyLocation || '';
    const originalText = button.textContent;

    try {
      await navigator.clipboard.writeText(location);
    } catch {
      const helper = document.createElement('textarea');
      helper.value = location;
      helper.setAttribute('readonly', '');
      helper.style.position = 'fixed';
      helper.style.left = '-9999px';
      document.body.append(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
    }

    button.textContent = 'Copiado';
    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1800);
  });
});

const contactForm = document.querySelector('[data-contact-form]');

if (contactForm) {
  const status = contactForm.querySelector('[data-form-status]');
  const getField = (name) => contactForm.elements.namedItem(name);
  const setError = (name, message) => {
    const field = getField(name);
    const wrapper = field?.closest('.field-group');
    const errorTarget = contactForm.querySelector(`[data-error-for="${name}"]`);

    wrapper?.classList.toggle('has-error', Boolean(message));

    if (errorTarget) {
      errorTarget.textContent = message;
    }
  };

  const validateContactForm = () => {
    const name = getField('name')?.value.trim() || '';
    const phone = getField('phone')?.value.trim() || '';
    const message = getField('message')?.value.trim() || '';
    let firstInvalidField = null;

    const requireValid = (fieldName, isValid, errorMessage) => {
      setError(fieldName, isValid ? '' : errorMessage);

      if (!isValid && !firstInvalidField) {
        firstInvalidField = getField(fieldName);
      }
    };

    requireValid('name', name.length >= 2, 'Informe seu nome.');
    requireValid('phone', phone.replace(/\D/g, '').length >= 10, 'Informe um WhatsApp valido.');
    requireValid('message', message.length >= 8, 'Escreva uma mensagem um pouco maior.');

    return { isValid: !firstInvalidField, firstInvalidField, name, phone, message };
  };

  contactForm.addEventListener('input', () => {
    status.textContent = '';
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const result = validateContactForm();

    if (!result.isValid) {
      result.firstInvalidField?.focus();
      status.textContent = '';
      return;
    }

    const text = [
      'Ola! Vim pelo site da Igreja Missionaria Filadelfia.',
      `Nome: ${result.name}`,
      `WhatsApp: ${result.phone}`,
      `Mensagem: ${result.message}`
    ].join('\n');

    status.textContent = 'Mensagem pronta para envio no WhatsApp.';
    window.open(`${whatsappUrl}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
}
