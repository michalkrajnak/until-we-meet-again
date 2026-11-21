(() => {
  'use strict';

  const config = window.REUNION_CONFIG;
  const allPhotosRaw = Array.isArray(window.REUNION_PHOTOS) ? window.REUNION_PHOTOS : [];

  const urlParams = new URLSearchParams(window.location.search);
  const previewReunion = urlParams.get('preview') === 'reunion';

  // Resolve initial language (?lang= > localStorage > config.defaultLang ('cs'))
  const storedLang = (() => {
    try {
      return window.localStorage.getItem('reunion-lang');
    } catch {
      return null;
    }
  })();
  const requestedLang = urlParams.get('lang') || storedLang || config.defaultLang || 'cs';
  let currentLang = config.i18n[requestedLang] ? requestedLang : 'cs';

  const startMs = new Date(config.erasmusStart).getTime();
  const targetMs = new Date(config.reunionDate).getTime();

  // DOM References
  const el = {
    routeOrigin: document.getElementById('route-origin'),
    routeHome: document.getElementById('route-home'),
    langButtons: document.querySelectorAll('.lang-btn'),
    eyebrow: document.getElementById('hero-eyebrow'),
    title: document.getElementById('page-title'),
    subtitle: document.getElementById('hero-subtitle'),
    countdownGrid: document.getElementById('countdown-grid'),
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds'),
    daysLabel: document.getElementById('cd-days-label'),
    hoursLabel: document.getElementById('cd-hours-label'),
    minutesLabel: document.getElementById('cd-minutes-label'),
    secondsLabel: document.getElementById('cd-seconds-label'),
    celebrationPanel: document.getElementById('celebration-panel'),
    celebrationBadge: document.getElementById('celebration-badge'),
    celebrationHeading: document.getElementById('celebration-heading'),
    celebrationMessage: document.getElementById('celebration-message'),
    targetDateText: document.getElementById('target-date-text'),
    clockOuluLabel: document.getElementById('clock-oulu-label'),
    clockHomeLabel: document.getElementById('clock-home-label'),
    clockOulu: document.getElementById('clock-oulu'),
    clockHome: document.getElementById('clock-home'),
    progressHeading: document.getElementById('progress-heading'),
    progressBar: document.getElementById('progress-bar'),
    progressFill: document.getElementById('progress-fill'),
    progressMarker: document.getElementById('progress-marker'),
    progressPercent: document.getElementById('progress-percent'),
    progressPercentLabel: document.getElementById('progress-percent-label'),
    progressSummary: document.getElementById('progress-summary'),
    progressMilestones: document.getElementById('progress-milestones'),
    progressStartEndpoint: document.getElementById('progress-start-endpoint'),
    progressEndEndpoint: document.getElementById('progress-end-endpoint'),
    daysStat: document.getElementById('days-stat'),
    galleryKicker: document.getElementById('gallery-kicker'),
    galleryHeading: document.getElementById('gallery-heading'),
    categoryFilters: document.getElementById('category-filters'),
    slideshowStage: document.getElementById('slideshow-stage'),
    slideBackdrop: document.getElementById('slide-backdrop'),
    slideImage: document.getElementById('slide-image'),
    slideVideo: document.getElementById('slide-video'),
    slideBadge: document.getElementById('slide-category-badge'),
    slideCaption: document.getElementById('slide-caption'),
    slideCounter: document.getElementById('slide-counter'),
    slidePrev: document.getElementById('slide-prev'),
    slideNext: document.getElementById('slide-next'),
    slideMuteToggle: document.getElementById('slide-mute-toggle'),
    muteToggleIcon: document.getElementById('mute-toggle-icon'),
    slidePlayToggle: document.getElementById('slide-play-toggle'),
    playToggleIcon: document.getElementById('play-toggle-icon'),
    slideTimerFill: document.getElementById('slide-timer-fill'),
    slideThumbs: document.getElementById('slide-thumbs'),
    slideOpenLightbox: document.getElementById('slide-open-lightbox'),
    ouluKicker: document.getElementById('oulu-kicker'),
    ouluHeading: document.getElementById('oulu-heading'),
    homeKicker: document.getElementById('home-kicker'),
    crewHeading: document.getElementById('crew-heading'),
    ouluGrid: document.getElementById('oulu-grid'),
    crewGrid: document.getElementById('crew-grid'),
    footerText: document.getElementById('footer-text'),
    motionToggle: document.getElementById('motion-toggle'),
    snowCanvas: document.getElementById('snow-canvas'),
    lightboxDialog: document.getElementById('lightbox-dialog'),
    lightboxImage: document.getElementById('lightbox-image'),
    lightboxVideo: document.getElementById('lightbox-video'),
    lightboxCaption: document.getElementById('lightbox-caption'),
    lightboxClose: document.getElementById('lightbox-close'),
    lightboxPrev: document.getElementById('lightbox-prev'),
    lightboxNext: document.getElementById('lightbox-next'),
  };

  function t() {
    return config.i18n[currentLang];
  }

  function pluralizeUnit(lang, n, unit) {
    if (lang === 'cs') {
      const forms = {
        day: ['Den', 'Dny', 'Dní'],
        dayLower: ['den', 'dny', 'dní'],
        hour: ['Hodina', 'Hodiny', 'Hodin'],
        minute: ['Minuta', 'Minuty', 'Minut'],
        second: ['Sekunda', 'Sekundy', 'Sekund'],
      }[unit];
      if (n === 1) return forms[0];
      if (n >= 2 && n <= 4) return forms[1];
      return forms[2];
    }

    const forms = {
      day: ['Day', 'Days'],
      dayLower: ['day', 'days'],
      hour: ['Hour', 'Hours'],
      minute: ['Minute', 'Minutes'],
      second: ['Second', 'Seconds'],
    }[unit];
    return n === 1 ? forms[0] : forms[1];
  }

  const ouluClockFmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: config.origin.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const homeClockFmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: config.home.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  function formatTargetDate(lang) {
    const locale = lang === 'cs' ? 'cs-CZ' : 'en-US';
    const datePart = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: config.home.timeZone,
    }).format(new Date(targetMs));
    const timePart = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: config.home.timeZone,
    }).format(new Date(targetMs));
    return lang === 'cs' ? `${datePart} · ${timePart}` : `${datePart} · ${timePart} CET`;
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function updateDigit(node, value) {
    if (node.textContent === value) return;
    node.textContent = value;
    node.classList.remove('tick-pop');
    void node.offsetWidth;
    node.classList.add('tick-pop');
  }

  function renderMilestones(nowMs) {
    const totalDuration = Math.max(1, targetMs - startMs);
    el.progressMilestones.innerHTML = '';

    config.milestones.forEach((m, idx) => {
      const mTime = new Date(m.date).getTime();
      const pct = Math.min(100, Math.max(0, ((mTime - startMs) / totalDuration) * 100));
      const isReached = nowMs >= mTime;

      const dot = document.createElement('span');
      dot.className = `milestone-dot${isReached ? ' reached' : ''}`;
      dot.style.left = `${pct}%`;

      const label = document.createElement('span');
      let edgeClass = '';
      if (idx === 0) edgeClass = ' first';
      else if (idx === config.milestones.length - 1) edgeClass = ' last';
      label.className = `milestone-label${edgeClass}`;
      label.style.left = `${pct}%`;
      label.textContent = m.label[currentLang] || m.label.cs;

      el.progressMilestones.append(dot, label);
    });
  }

  let countdownTimerId = null;
  let milestonesRenderedKey = '';

  function updateCountdownAndProgress() {
    if (countdownTimerId !== null) {
      window.clearTimeout(countdownTimerId);
      countdownTimerId = null;
    }

    const strings = t();
    const nowMs = previewReunion ? targetMs + 1000 : Date.now();
    const diffMs = targetMs - nowMs;

    // Live dual clocks
    const nowDate = new Date();
    el.clockOulu.textContent = ouluClockFmt.format(nowDate);
    el.clockHome.textContent = homeClockFmt.format(nowDate);

    // Countdown
    if (diffMs <= 0) {
      document.body.classList.add('reunion-live');
      el.countdownGrid.hidden = true;
      el.celebrationPanel.hidden = false;
    } else {
      document.body.classList.remove('reunion-live');
      el.countdownGrid.hidden = false;
      el.celebrationPanel.hidden = true;

      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      updateDigit(el.days, String(days));
      updateDigit(el.hours, pad2(hours));
      updateDigit(el.minutes, pad2(minutes));
      updateDigit(el.seconds, pad2(seconds));

      el.daysLabel.textContent = pluralizeUnit(currentLang, days, 'day');
      el.hoursLabel.textContent = pluralizeUnit(currentLang, hours, 'hour');
      el.minutesLabel.textContent = pluralizeUnit(currentLang, minutes, 'minute');
      el.secondsLabel.textContent = pluralizeUnit(currentLang, seconds, 'second');
    }

    // Erasmus Progress Bar
    const totalDuration = Math.max(1, targetMs - startMs);
    const elapsed = Math.min(totalDuration, Math.max(0, nowMs - startMs));
    const progressPct = (elapsed / totalDuration) * 100;

    const formattedPct = progressPct >= 100 ? '100%' : `${progressPct.toFixed(1)}%`;
    el.progressPercent.textContent = formattedPct;
    el.progressFill.style.width = `${progressPct}%`;
    el.progressMarker.style.left = `${progressPct}%`;
    el.progressBar.setAttribute('aria-valuenow', progressPct.toFixed(1));

    const totalDays = Math.ceil(totalDuration / 86400000);
    const daysDone = Math.min(totalDays, Math.max(0, Math.floor((nowMs - startMs) / 86400000)));
    const daysLeft = Math.max(0, Math.ceil(diffMs / 86400000));

    const doneWord = pluralizeUnit(currentLang, daysDone, 'dayLower');
    const leftWord = pluralizeUnit(currentLang, daysLeft, 'dayLower');
    const totalWord = pluralizeUnit(currentLang, totalDays, 'dayLower');

    if (diffMs <= 0) {
      el.progressSummary.textContent = strings.progressFinished;
      el.daysStat.textContent = strings.daysTotalDone(totalDays, totalWord);
    } else if (nowMs < startMs) {
      el.progressSummary.textContent = strings.progressBeforeStart;
      el.daysStat.textContent = strings.daysTotal(totalDays, totalWord);
    } else {
      el.progressSummary.textContent =
        daysLeft === 1
          ? strings.progressLastDay
          : strings.progressSummary(daysDone, daysLeft, doneWord, leftWord);
      el.daysStat.textContent = strings.daysStat(daysDone, daysLeft, doneWord, leftWord);
    }

    const milestoneKey = `${currentLang}:${Math.floor(nowMs / 86400000)}`;
    if (milestoneKey !== milestonesRenderedKey) {
      milestonesRenderedKey = milestoneKey;
      renderMilestones(nowMs);
    }

    const msToNextSecond = 1000 - (Date.now() % 1000);
    countdownTimerId = window.setTimeout(updateCountdownAndProgress, msToNextSecond + 15);
  }

  // =========================================================
  // In Oulu & Waiting at Home Cards
  // =========================================================
  const CREW_ICONS = {
    heart:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
    paw:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="6.5" cy="9.5" r="2.2"/><circle cx="10.2" cy="6.2" r="2.2"/><circle cx="13.8" cy="6.2" r="2.2"/><circle cx="17.5" cy="9.5" r="2.2"/><path d="M12 11.2c-2.7 0-5.1 2.2-5.1 4.8 0 1.6 1.2 2.8 2.8 2.8 1 0 1.7-.4 2.3-.4s1.3.4 2.3.4c1.6 0 2.8-1.2 2.8-2.8 0-2.6-2.4-4.8-5.1-4.8z"/></svg>',
    star:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.6 6.7L21.5 9.3l-5.3 4.5 1.7 6.9L12 17l-5.9 3.7 1.7-6.9-5.3-4.5 6.9-.6L12 2z"/></svg>',
    home:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/><path d="M9.5 21v-6h5v6"/></svg>',
    horse:
      '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 20v-6.5c0-3.5-2.1-6.5-5.5-7.8L12 3l-2 2.2C7.4 6.1 5.6 8 4.6 10.5L3.5 13c-.3.8.1 1.7.9 2l1.8.6c.9.3 1.9-.1 2.4-.9l1.1-1.7c.7.4 1.6.5 2.4.3-.4 1.9-.6 4.1-.6 6.7"/><circle cx="8.5" cy="9.5" r="0.8" fill="currentColor" stroke="none"/></svg>',
  };

  function renderMemberCards(container, members) {
    if (!container || !Array.isArray(members)) return;
    container.innerHTML = '';

    members.forEach((member) => {
      const card = document.createElement('article');
      card.className = 'glass-card crew-card';

      const iconSvg = CREW_ICONS[member.icon] || CREW_ICONS.star;

      card.innerHTML = `
        <div class="crew-top">
          <div class="crew-avatar ${member.accent}">${iconSvg}</div>
          <div>
            <h3 class="crew-name"></h3>
            <p class="crew-role"></p>
          </div>
        </div>
        <p class="crew-note"></p>
      `;

      card.querySelector('.crew-name').textContent = member.name;
      card.querySelector('.crew-role').textContent = member.role;
      card.querySelector('.crew-note').textContent = member.note;
      container.appendChild(card);
    });
  }

  function renderCrew() {
    const strings = t();
    renderMemberCards(el.ouluGrid, strings.inOulu);
    renderMemberCards(el.crewGrid, strings.waitingAtHome);
  }

  // =========================================================
  // Photo & Video Slideshow + Lightbox
  // =========================================================
  const normalizedPhotos = allPhotosRaw.map((photo) => ({ ...photo }));

  if (config.slideshow.shuffleOnLoad && normalizedPhotos.length > 1) {
    for (let i = normalizedPhotos.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [normalizedPhotos[i], normalizedPhotos[j]] = [normalizedPhotos[j], normalizedPhotos[i]];
    }
  }

  let activeCategory = 'all';
  let filteredPhotos = [...normalizedPhotos];
  let currentIndex = 0;
  let isPlaying = true;
  let isStageHovered = false;
  let slideElapsedMs = 0;
  let lastFrameTs = performance.now();
  let slideTransitionTimer = null;
  const intervalMs = config.slideshow.intervalMs || 6500;

  function getCategoryLabel(catId) {
    const found = t().categories.find((c) => c.id === catId);
    return found ? found.label : catId;
  }

  function getPhotoCaption(photo) {
    const fileName = photo.src.split('/').pop();
    const override = config.photoCaptions && config.photoCaptions[fileName];
    if (override) {
      if (typeof override === 'string') return override;
      return override[currentLang] || override.cs || override.en || '';
    }
    return t().defaultCaptions[photo.category] || photo.caption || getCategoryLabel(photo.category);
  }

  function renderCategoryFilters() {
    el.categoryFilters.innerHTML = '';

    t().categories.forEach((cat) => {
      const count =
        cat.id === 'all'
          ? normalizedPhotos.length
          : normalizedPhotos.filter((p) => p.category === cat.id).length;

      if (cat.id !== 'all' && count === 0) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.role = 'tab';
      btn.className = `filter-pill${cat.id === activeCategory ? ' is-active' : ''}`;
      btn.setAttribute('aria-selected', String(cat.id === activeCategory));
      btn.textContent = `${cat.label} (${count})`;

      btn.addEventListener('click', () => {
        if (activeCategory === cat.id) return;
        activeCategory = cat.id;
        filteredPhotos =
          cat.id === 'all'
            ? [...normalizedPhotos]
            : normalizedPhotos.filter((p) => p.category === cat.id);
        currentIndex = 0;
        renderCategoryFilters();
        renderThumbs();
        showSlide(0, { immediate: true });
      });

      el.categoryFilters.appendChild(btn);
    });
  }

  function renderThumbs() {
    el.slideThumbs.innerHTML = '';

    filteredPhotos.forEach((photo, idx) => {
      const caption = getPhotoCaption(photo);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `thumb-btn${idx === currentIndex ? ' is-active' : ''}`;
      btn.setAttribute('aria-label', `${idx + 1}: ${caption}`);

      if (photo.type === 'video' && !photo.thumb) {
        const vid = document.createElement('video');
        vid.src = `${photo.src}#t=0.2`;
        vid.muted = true;
        vid.playsInline = true;
        vid.preload = 'metadata';
        vid.setAttribute('aria-hidden', 'true');
        btn.appendChild(vid);
      } else {
        const img = document.createElement('img');
        img.src = photo.thumb || photo.src;
        img.alt = caption;
        img.loading = 'lazy';
        btn.appendChild(img);
      }

      if (photo.type === 'video') {
        const badge = document.createElement('span');
        badge.className = 'thumb-video-badge';
        badge.setAttribute('aria-hidden', 'true');
        badge.textContent = '▶';
        btn.appendChild(badge);
      }

      btn.addEventListener('click', () => showSlide(idx));
      el.slideThumbs.appendChild(btn);
    });
  }

  // Scroll ONLY the horizontal thumbnail strip — never hijack the page's vertical scroll!
  function syncActiveThumb() {
    const buttons = el.slideThumbs.querySelectorAll('.thumb-btn');
    buttons.forEach((btn, idx) => {
      const active = idx === currentIndex;
      btn.classList.toggle('is-active', active);
      if (active) {
        const targetLeft =
          btn.offsetLeft - el.slideThumbs.clientWidth / 2 + btn.clientWidth / 2;
        el.slideThumbs.scrollTo({
          left: Math.max(0, targetLeft),
          behavior: 'smooth',
        });
      }
    });
  }

  function updateMuteToggleUI() {
    const muted = el.slideVideo.muted;
    el.muteToggleIcon.textContent = muted ? '🔇' : '🔊';
    el.slideMuteToggle.setAttribute('aria-label', muted ? t().ariaUnmute : t().ariaMute);
  }

  function syncLightboxMedia(photo) {
    if (!el.lightboxDialog.open || !photo) return;
    const caption = getPhotoCaption(photo);
    el.lightboxCaption.textContent = caption;

    if (photo.type === 'video') {
      el.lightboxImage.hidden = true;
      el.lightboxVideo.hidden = false;
      el.lightboxVideo.poster = photo.thumb || '';
      el.lightboxVideo.src = photo.src;
      el.lightboxVideo.play().catch(() => { });
    } else {
      el.lightboxVideo.pause();
      el.lightboxVideo.removeAttribute('src');
      el.lightboxVideo.hidden = true;
      el.lightboxImage.hidden = false;
      el.lightboxImage.src = photo.src;
      el.lightboxImage.alt = caption;
    }
  }

  function updateSlideText(photo) {
    if (!photo) return;
    const isVideo = photo.type === 'video';
    const categoryName = getCategoryLabel(photo.category);
    const caption = getPhotoCaption(photo);
    el.slideBadge.textContent = isVideo ? `${categoryName} · ${t().videoTag}` : categoryName;
    el.slideCaption.textContent = caption;
    el.slideImage.alt = caption;
    if (el.lightboxDialog.open) {
      el.lightboxCaption.textContent = caption;
    }
  }

  function showSlide(index, { immediate = false } = {}) {
    if (filteredPhotos.length === 0) return;
    if (slideTransitionTimer !== null) {
      window.clearTimeout(slideTransitionTimer);
      slideTransitionTimer = null;
    }

    currentIndex = (index + filteredPhotos.length) % filteredPhotos.length;
    const photo = filteredPhotos[currentIndex];
    const isVideo = photo.type === 'video';
    slideElapsedMs = 0;
    el.slideTimerFill.style.width = '0%';

    const applyPhoto = () => {
      updateSlideText(photo);
      el.slideCounter.textContent = `${currentIndex + 1} / ${filteredPhotos.length}`;
      el.slideMuteToggle.hidden = !isVideo;

      if (isVideo) {
        el.slideImage.hidden = true;
        el.slideImage.classList.remove('ken-burns', 'is-fading');

        el.slideBackdrop.src = photo.thumb || '';
        el.slideBackdrop.hidden = !photo.thumb;

        el.slideVideo.hidden = false;
        el.slideVideo.poster = photo.thumb || '';
        el.slideVideo.onloadedmetadata = () => {
          const isLandscape =
            el.slideVideo.videoHeight > 0 &&
            el.slideVideo.videoWidth >= el.slideVideo.videoHeight * 1.15;
          el.slideVideo.classList.toggle('is-landscape', isLandscape);
          el.slideVideo.classList.remove('is-fading');
        };
        el.slideVideo.onerror = () => el.slideVideo.classList.remove('is-fading');
        el.slideVideo.src = photo.src;
        el.slideVideo.currentTime = 0;
        if (isPlaying && !el.lightboxDialog.open) {
          el.slideVideo.play().catch(() => { });
        }
        updateMuteToggleUI();
      } else {
        el.slideVideo.pause();
        el.slideVideo.hidden = true;
        el.slideVideo.classList.remove('is-fading');
        el.slideVideo.removeAttribute('src');
        el.slideVideo.load();

        el.slideBackdrop.hidden = false;
        el.slideBackdrop.src = photo.thumb || photo.src;

        el.slideImage.hidden = false;
        el.slideImage.classList.remove('ken-burns');

        const revealImage = () => {
          const isLandscape =
            el.slideImage.naturalHeight > 0 &&
            el.slideImage.naturalWidth >= el.slideImage.naturalHeight * 1.15;
          el.slideImage.classList.toggle('is-landscape', isLandscape);
          el.slideImage.classList.remove('is-fading');
          void el.slideImage.offsetWidth;
          if (!document.body.classList.contains('motion-paused')) {
            el.slideImage.classList.add('ken-burns');
          }
        };

        el.slideImage.onload = revealImage;
        el.slideImage.onerror = () => el.slideImage.classList.remove('is-fading');
        el.slideImage.src = photo.src;

        if (el.slideImage.complete && el.slideImage.naturalWidth > 0) {
          revealImage();
        }
      }
    };

    if (immediate) {
      applyPhoto();
    } else {
      el.slideImage.classList.add('is-fading');
      el.slideVideo.classList.add('is-fading');
      slideTransitionTimer = window.setTimeout(() => {
        slideTransitionTimer = null;
        applyPhoto();
      }, 180);
    }

    syncActiveThumb();
    syncLightboxMedia(photo);
  }

  function updatePlayToggleUI() {
    el.playToggleIcon.textContent = isPlaying ? '❚❚' : '▶';
    el.slidePlayToggle.setAttribute('aria-label', isPlaying ? t().ariaPause : t().ariaPlay);
  }

  el.slidePrev.addEventListener('click', () => showSlide(currentIndex - 1));
  el.slideNext.addEventListener('click', () => showSlide(currentIndex + 1));
  el.slideMuteToggle.addEventListener('click', () => {
    el.slideVideo.muted = !el.slideVideo.muted;
    updateMuteToggleUI();
  });
  el.slidePlayToggle.addEventListener('click', () => {
    isPlaying = !isPlaying;
    const current = filteredPhotos[currentIndex];
    if (current && current.type === 'video') {
      if (isPlaying) {
        el.slideVideo.play().catch(() => { });
      } else {
        el.slideVideo.pause();
      }
    }
    updatePlayToggleUI();
  });

  el.slideVideo.addEventListener('ended', () => {
    if (isPlaying && !el.lightboxDialog.open && filteredPhotos.length > 1) {
      showSlide(currentIndex + 1);
    }
  });

  el.slideshowStage.addEventListener('mouseenter', () => {
    isStageHovered = true;
  });
  el.slideshowStage.addEventListener('mouseleave', () => {
    isStageHovered = false;
  });

  // Touch swipe support on mobile
  let touchStartX = null;
  el.slideshowStage.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  el.slideshowStage.addEventListener(
    'touchend',
    (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) > 42) {
        showSlide(dx < 0 ? currentIndex + 1 : currentIndex - 1);
      }
    },
    { passive: true }
  );

  // Lightbox (native <dialog>)
  el.slideOpenLightbox.addEventListener('click', () => {
    const photo = filteredPhotos[currentIndex];
    if (!photo) return;
    if (photo.type === 'video') {
      el.slideVideo.pause();
    }
    el.lightboxDialog.showModal();
    syncLightboxMedia(photo);
  });

  el.lightboxDialog.addEventListener('close', () => {
    el.lightboxVideo.pause();
    el.lightboxVideo.removeAttribute('src');
    const current = filteredPhotos[currentIndex];
    if (current && current.type === 'video' && isPlaying) {
      el.slideVideo.play().catch(() => { });
    }
  });

  el.lightboxClose.addEventListener('click', () => el.lightboxDialog.close());
  el.lightboxPrev.addEventListener('click', () => showSlide(currentIndex - 1));
  el.lightboxNext.addEventListener('click', () => showSlide(currentIndex + 1));

  el.lightboxDialog.addEventListener('click', (e) => {
    if (e.target === el.lightboxDialog) {
      el.lightboxDialog.close();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      showSlide(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showSlide(currentIndex + 1);
    }
  });

  function tickSlideshow(ts) {
    const dt = Math.min(100, ts - lastFrameTs);
    lastFrameTs = ts;

    const current = filteredPhotos[currentIndex];
    const isVideo = current && current.type === 'video';

    if (isVideo) {
      if (el.slideVideo.duration > 0) {
        const pct = Math.min(100, (el.slideVideo.currentTime / el.slideVideo.duration) * 100);
        el.slideTimerFill.style.width = `${pct}%`;
      }
    } else {
      const shouldAdvance =
        isPlaying &&
        !isStageHovered &&
        !el.lightboxDialog.open &&
        !document.hidden &&
        filteredPhotos.length > 1;

      if (shouldAdvance) {
        slideElapsedMs += dt;
        const pct = Math.min(100, (slideElapsedMs / intervalMs) * 100);
        el.slideTimerFill.style.width = `${pct}%`;

        if (slideElapsedMs >= intervalMs) {
          showSlide(currentIndex + 1);
        }
      }
    }

    requestAnimationFrame(tickSlideshow);
  }

  // =========================================================
  // Gentle Arctic Stars & Falling Snow Canvas
  // =========================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionEnabled = !prefersReducedMotion.matches;

  const ctx = el.snowCanvas.getContext('2d');
  let width = 0;
  let height = 0;
  let flakes = [];
  let stars = [];

  function initSkyParticles() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    el.snowCanvas.width = Math.floor(width * dpr);
    el.snowCanvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const starCount = Math.min(95, Math.floor((width * height) / 14000));
    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.72,
      r: Math.random() * 1.35 + 0.35,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005,
    }));

    const flakeCount = Math.min(72, Math.floor(width / 19));
    flakes = Array.from({ length: flakeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.1 + 0.7,
      vy: Math.random() * 0.55 + 0.22,
      vx: (Math.random() - 0.5) * 0.25,
      wobble: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.45 + 0.18,
    }));
  }

  function drawSkyFrame() {
    ctx.clearRect(0, 0, width, height);

    for (const s of stars) {
      if (motionEnabled) s.phase += s.speed;
      const alpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(s.phase));
      ctx.fillStyle = `rgba(225, 242, 255, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const f of flakes) {
      if (motionEnabled) {
        f.wobble += 0.012;
        f.y += f.vy;
        f.x += f.vx + Math.sin(f.wobble) * 0.22;

        if (f.y > height + 6) {
          f.y = -6;
          f.x = Math.random() * width;
        }
        if (f.x > width + 6) f.x = -6;
        if (f.x < -6) f.x = width + 6;
      }

      ctx.fillStyle = `rgba(235, 248, 255, ${f.alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (motionEnabled && !document.hidden) {
      requestAnimationFrame(drawSkyFrame);
    }
  }

  function applyMotionState() {
    document.body.classList.toggle('motion-paused', !motionEnabled);
    el.motionToggle.setAttribute('aria-pressed', String(!motionEnabled));
    el.motionToggle.querySelector('.motion-label').textContent = motionEnabled
      ? t().auroraOn
      : t().auroraPaused;
    drawSkyFrame();
  }

  el.motionToggle.addEventListener('click', () => {
    motionEnabled = !motionEnabled;
    applyMotionState();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && motionEnabled) {
      requestAnimationFrame(drawSkyFrame);
    }
  });

  window.addEventListener('resize', () => {
    initSkyParticles();
    if (!motionEnabled) drawSkyFrame();
  });

  // =========================================================
  // Language Switching (CZ default / EN)
  // =========================================================
  function applyLanguage(lang) {
    if (!config.i18n[lang]) return;
    currentLang = lang;
    try {
      window.localStorage.setItem('reunion-lang', lang);
    } catch {
      // ignore storage restrictions
    }

    const strings = t();
    document.documentElement.lang = lang;
    document.title = strings.pageTitle;

    el.langButtons.forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    el.routeOrigin.textContent = strings.routeOrigin;
    el.routeHome.textContent = strings.routeHome;
    el.eyebrow.textContent = strings.eyebrow;
    el.title.textContent = strings.title;
    el.subtitle.textContent = strings.subtitle;
    el.countdownGrid.setAttribute('aria-label', strings.ariaCountdown);

    el.celebrationBadge.textContent = strings.celebration.badge;
    el.celebrationHeading.textContent = strings.celebration.heading;
    el.celebrationMessage.textContent = strings.celebration.message;

    el.targetDateText.textContent = formatTargetDate(lang);
    el.clockOuluLabel.textContent = strings.clockOulu;
    el.clockHomeLabel.textContent = strings.clockHome;

    el.progressHeading.textContent = strings.progressKicker;
    el.progressPercentLabel.textContent = strings.progressCompleteLabel;
    el.progressStartEndpoint.textContent = strings.progressStartEndpoint;
    el.progressEndEndpoint.textContent = strings.progressEndEndpoint;

    el.galleryKicker.textContent = strings.galleryKicker;
    el.galleryHeading.textContent = strings.galleryTitle;
    el.slidePrev.setAttribute('aria-label', strings.ariaPrev);
    el.slideNext.setAttribute('aria-label', strings.ariaNext);
    el.slideOpenLightbox.setAttribute('aria-label', strings.ariaFullscreen);
    el.lightboxClose.setAttribute('aria-label', strings.ariaCloseLightbox);
    el.lightboxPrev.setAttribute('aria-label', strings.ariaPrev);
    el.lightboxNext.setAttribute('aria-label', strings.ariaNext);

    el.ouluKicker.textContent = strings.ouluKicker;
    el.ouluHeading.textContent = strings.ouluTitle;
    el.homeKicker.textContent = strings.homeKicker;
    el.crewHeading.textContent = strings.homeTitle;
    el.footerText.textContent = strings.footer;

    el.motionToggle.querySelector('.motion-label').textContent = motionEnabled
      ? strings.auroraOn
      : strings.auroraPaused;

    renderCrew();
    renderCategoryFilters();
    updatePlayToggleUI();
    updateMuteToggleUI();
    updateSlideText(filteredPhotos[currentIndex]);
    updateCountdownAndProgress();
  }

  el.langButtons.forEach((btn) => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  // =========================================================
  // Boot
  // =========================================================
  renderThumbs();
  showSlide(0, { immediate: true });
  initSkyParticles();
  applyLanguage(currentLang);
  applyMotionState();
  requestAnimationFrame(tickSlideshow);
})();
