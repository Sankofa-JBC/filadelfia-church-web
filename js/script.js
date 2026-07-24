const whatsappUrl = 'https://wa.me/5521974350384';

const normalizeText = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const runWhenIdle = (callback, timeout = 900) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout });
    return;
  }

  window.setTimeout(callback, Math.min(timeout, 300));
};

const initCurrentYear = () => {
  const yearTarget = document.querySelector('[data-current-year]');

  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }
};

const initHeader = () => {
  const header = document.querySelector('[data-header]');

  if (!header) {
    return;
  }

  const setHeaderState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });
};

const initActiveNavigation = () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.primary-nav a').forEach((link) => {
    const linkUrl = new URL(link.getAttribute('href'), window.location.href);
    const linkPage = linkUrl.pathname.split('/').pop() || 'index.html';
    const isCurrent = linkPage === currentPage;

    link.classList.toggle('is-active', isCurrent);

    if (isCurrent) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

const initMobileMenu = () => {
  const menu = document.querySelector('[data-menu]');
  const menuToggle = document.querySelector('[data-menu-toggle]');

  if (!menu || !menuToggle) {
    return;
  }

  let focusedBeforeOpen = null;

  const getFocusableMenuItems = () =>
    menu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');

  const focusFirstMenuItem = () => {
    const firstItem = getFocusableMenuItems()[0];

    if (firstItem instanceof HTMLElement) {
      firstItem.focus();
    }
  };

  const setMenuState = (isOpen, shouldRestoreFocus = false) => {
    const wasOpen = menu.classList.contains('is-open');

    if (isOpen && !wasOpen) {
      focusedBeforeOpen = document.activeElement instanceof HTMLElement ? document.activeElement : menuToggle;
    }

    menu.classList.toggle('is-open', isOpen);
    menuToggle.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');

    if (isOpen) {
      window.requestAnimationFrame(focusFirstMenuItem);
      return;
    }

    if (wasOpen && shouldRestoreFocus && focusedBeforeOpen instanceof HTMLElement) {
      focusedBeforeOpen.focus();
    }
  };

  menuToggle.addEventListener('click', () => {
    const willOpen = !menu.classList.contains('is-open');
    setMenuState(willOpen, true);
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
      setMenuState(false, true);
    }
  });
};

const initFaq = () => {
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
};

const initMessageFilters = () => {
  const messageSearch = document.querySelector('[data-message-search]');
  const messageFilters = document.querySelectorAll('[data-message-filter]');
  const messageCards = document.querySelectorAll('[data-message-card]');
  const messageEmpty = document.querySelector('[data-message-empty]');

  if (messageCards.length === 0) {
    return;
  }

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
    button.setAttribute('aria-pressed', String(button.classList.contains('is-active')));

    button.addEventListener('click', () => {
      activeFilter = button.dataset.messageFilter || 'todos';
      messageFilters.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle('is-active', isActive);
        filterButton.setAttribute('aria-pressed', String(isActive));
      });
      filterMessages();
    });
  });

  filterMessages();
};

const initLightbox = () => {
  const lightboxButtons = document.querySelectorAll('[data-lightbox-src]');

  if (lightboxButtons.length === 0 || !('HTMLDialogElement' in window)) {
    return;
  }

  const lightbox = document.createElement('dialog');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('aria-label', 'Imagem ampliada');
  lightbox.innerHTML = `
    <div class="lightbox__dialog">
      <button class="lightbox__close" type="button" aria-label="Fechar imagem">&times;</button>
      <img alt="" />
      <p></p>
    </div>
  `;
  document.body.append(lightbox);

  const lightboxDialog = lightbox.querySelector('.lightbox__dialog');
  const lightboxImage = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('p');
  const lightboxClose = lightbox.querySelector('.lightbox__close');
  let activeTrigger = null;

  const closeLightbox = () => {
    if (lightbox.open) {
      lightbox.close();
    }
  };

  lightboxButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeTrigger = button;
      lightboxImage.src = button.dataset.lightboxSrc || '';
      lightboxImage.alt = button.querySelector('img')?.alt || '';
      lightboxCaption.textContent = button.dataset.lightboxCaption || '';
      lightbox.showModal();
      lightboxClose.focus();
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (event) => {
    if (!lightboxDialog || event.target !== lightbox) {
      return;
    }

    closeLightbox();
  });

  lightbox.addEventListener('close', () => {
    lightboxImage.removeAttribute('src');

    if (activeTrigger instanceof HTMLElement) {
      activeTrigger.focus();
    }
  });
};

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

const initCalendarButtons = () => {
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
};

const initCopyLocation = () => {
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
};

const initDeferredMaps = () => {
  const mapEmbeds = document.querySelectorAll('[data-map-embed]');

  if (mapEmbeds.length === 0) {
    return;
  }

  const loadMap = (embed) => {
    if (embed.classList.contains('is-loading') || embed.classList.contains('is-loaded')) {
      return;
    }

    const iframe = embed.querySelector('[data-map-frame]');
    const src = iframe?.dataset.mapSrc || embed.dataset.mapSrc;

    if (!(iframe instanceof HTMLIFrameElement) || !src) {
      embed.classList.add('has-failed');
      return;
    }

    embed.classList.add('is-loading');

    const failTimer = window.setTimeout(() => {
      if (!embed.classList.contains('is-loaded')) {
        embed.classList.add('has-failed');
      }
    }, 12000);

    iframe.addEventListener(
      'load',
      () => {
        window.clearTimeout(failTimer);
        embed.classList.add('is-loaded');
        embed.classList.remove('has-failed');
      },
      { once: true }
    );

    runWhenIdle(() => {
      iframe.src = src;
    }, 1200);
  };

  if (!('IntersectionObserver' in window)) {
    mapEmbeds.forEach(loadMap);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMap(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '400px 0px',
      threshold: 0.01
    }
  );

  mapEmbeds.forEach((embed) => observer.observe(embed));
};

const initContactForm = () => {
  const contactForm = document.querySelector('[data-contact-form]');

  if (!contactForm) {
    return;
  }

  const status = contactForm.querySelector('[data-form-status]');
  const getField = (name) => contactForm.elements.namedItem(name);

  const ensureFieldAccessibility = (name) => {
    const field = getField(name);
    const errorTarget = contactForm.querySelector(`[data-error-for="${name}"]`);

    if (!(field instanceof HTMLElement) || !errorTarget) {
      return;
    }

    if (!errorTarget.id) {
      errorTarget.id = `${field.id || name}Error`;
    }

    field.setAttribute('aria-describedby', errorTarget.id);
    field.setAttribute('aria-invalid', 'false');
  };

  const setError = (name, message) => {
    const field = getField(name);
    const wrapper = field?.closest('.field-group');
    const errorTarget = contactForm.querySelector(`[data-error-for="${name}"]`);

    wrapper?.classList.toggle('has-error', Boolean(message));

    if (field instanceof HTMLElement) {
      field.setAttribute('aria-invalid', String(Boolean(message)));
    }

    if (errorTarget) {
      errorTarget.textContent = message;
    }
  };

  ['name', 'phone', 'message'].forEach(ensureFieldAccessibility);

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

  contactForm.addEventListener('input', (event) => {
    if (status) {
      status.textContent = '';
    }

    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      setError(event.target.name, '');
    }
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const result = validateContactForm();

    if (!result.isValid) {
      result.firstInvalidField?.focus();
      if (status) {
        status.textContent = '';
      }
      return;
    }

    const text = [
      'Ola! Vim pelo site da Igreja Missionaria Filadelfia.',
      `Nome: ${result.name}`,
      `WhatsApp: ${result.phone}`,
      `Mensagem: ${result.message}`
    ].join('\n');

    if (status) {
      status.textContent = 'Mensagem pronta para envio no WhatsApp.';
    }
    window.open(`${whatsappUrl}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
};

initCurrentYear();
initHeader();
initActiveNavigation();
initMobileMenu();
initFaq();
initMessageFilters();
initLightbox();
initCalendarButtons();
initCopyLocation();
initDeferredMaps();
initContactForm();
