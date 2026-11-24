(() => {
  'use strict';

  const config = window.REUNION_CONFIG;
  const allPhotosRaw = Array.isArray(window.REUNION_PHOTOS) ? window.REUNION_PHOTOS : [];

  const urlParams = new URLSearchParams(window.location.search);
  const previewMode = (urlParams.get('preview') || '').toLowerCase();
  const previewReunion = previewMode === 'reunion';

  const PREVIEW_TIMESTAMPS = {
    advent1: new Date('2026-11-29T12:00:00+01:00').getTime(),
    anniversary: new Date('2026-12-05T12:00:00+01:00').getTime(),
    mikulas: new Date('2026-12-06T12:00:00+01:00').getTime(),
    nameday: new Date('2026-12-12T12:00:00+01:00').getTime(),
    advent3: new Date('2026-12-13T12:00:00+01:00').getTime(),
    advent4: new Date('2026-12-20T12:00:00+01:00').getTime(),
  };

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
    festiveStripLabel: document.getElementById('festive-strip-label'),
    festiveMilestones: document.getElementById('festive-milestones'),
    specialDayBanner: document.getElementById('special-day-banner'),
    specialDayIcon: document.getElementById('special-day-icon'),
    specialDayBadge: document.getElementById('special-day-badge'),
    specialDayText: document.getElementById('special-day-text'),
    anniversaryCard: document.getElementById('anniversary-card'),
    anniversarySealed: document.getElementById('anniversary-sealed'),
    anniversaryBadge: document.getElementById('anniversary-badge'),
    anniversarySealedTitle: document.getElementById('anniversary-sealed-title'),
    anniversarySealedSubtitle: document.getElementById('anniversary-sealed-subtitle'),
    anniversaryOpenBtn: document.getElementById('anniversary-open-btn'),
    anniversaryOpenLabel: document.getElementById('anniversary-open-label'),
    anniversaryLetter: document.getElementById('anniversary-letter'),
    anniversaryPhotoWrap: document.getElementById('anniversary-photo-wrap'),
    anniversaryPhoto: document.getElementById('anniversary-photo'),
    anniversaryLetterBadge: document.getElementById('anniversary-letter-badge'),
    anniversaryHeading: document.getElementById('anniversary-heading'),
    anniversaryParagraphs: document.getElementById('anniversary-paragraphs'),
    anniversarySignature: document.getElementById('anniversary-signature'),
    anniversaryCloseBtn: document.getElementById('anniversary-close-btn'),
    nameDayCard: document.getElementById('nameday-card'),
    nameDaySealed: document.getElementById('nameday-sealed'),
    nameDayBadge: document.getElementById('nameday-badge'),
    nameDaySealedTitle: document.getElementById('nameday-sealed-title'),
    nameDaySealedSubtitle: document.getElementById('nameday-sealed-subtitle'),
    nameDayOpenBtn: document.getElementById('nameday-open-btn'),
    nameDayOpenLabel: document.getElementById('nameday-open-label'),
    nameDayLetter: document.getElementById('nameday-letter'),
    nameDayPhotoWrap: document.getElementById('nameday-photo-wrap'),
    nameDayPhoto: document.getElementById('nameday-photo'),
    nameDayLetterBadge: document.getElementById('nameday-letter-badge'),
    nameDayHeading: document.getElementById('nameday-heading'),
    nameDayParagraphs: document.getElementById('nameday-paragraphs'),
    nameDaySignature: document.getElementById('nameday-signature'),
    nameDayCloseBtn: document.getElementById('nameday-close-btn'),
    twoWorldsKicker: document.getElementById('two-worlds-kicker'),
    twoWorldsHeading: document.getElementById('two-worlds-heading'),
    distanceValue: document.getElementById('distance-value'),
    distanceLabel: document.getElementById('distance-label'),
    worldOuluName: document.getElementById('world-oulu-name'),
    worldOuluSub: document.getElementById('world-oulu-sub'),
    worldOuluTime: document.getElementById('world-oulu-time'),
    worldOuluIcon: document.getElementById('world-oulu-icon'),
    worldOuluTemp: document.getElementById('world-oulu-temp'),
    worldOuluDesc: document.getElementById('world-oulu-desc'),
    worldOuluFeels: document.getElementById('world-oulu-feels'),
    worldOuluDaylightLabel: document.getElementById('world-oulu-daylight-label'),
    worldOuluDaylightVal: document.getElementById('world-oulu-daylight-val'),
    worldOuluDaylightFill: document.getElementById('world-oulu-daylight-fill'),
    worldOuluSunrise: document.getElementById('world-oulu-sunrise'),
    worldOuluSunset: document.getElementById('world-oulu-sunset'),
    worldHomeName: document.getElementById('world-home-name'),
    worldHomeSub: document.getElementById('world-home-sub'),
    worldHomeTime: document.getElementById('world-home-time'),
    worldHomeIcon: document.getElementById('world-home-icon'),
    worldHomeTemp: document.getElementById('world-home-temp'),
    worldHomeDesc: document.getElementById('world-home-desc'),
    worldHomeFeels: document.getElementById('world-home-feels'),
    worldHomeDaylightLabel: document.getElementById('world-home-daylight-label'),
    worldHomeDaylightVal: document.getElementById('world-home-daylight-val'),
    worldHomeDaylightFill: document.getElementById('world-home-daylight-fill'),
    worldHomeSunrise: document.getElementById('world-home-sunrise'),
    worldHomeSunset: document.getElementById('world-home-sunset'),
    daylightCompare: document.getElementById('daylight-compare'),
    auroraLiveStrip: document.getElementById('aurora-live-strip'),
    auroraStripTitle: document.getElementById('aurora-strip-title'),
    auroraKpBadge: document.getElementById('aurora-kp-badge'),
    auroraMeter: document.getElementById('aurora-meter'),
    auroraStatusText: document.getElementById('aurora-status-text'),
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
    musicToggle: document.getElementById('music-toggle'),
    musicLabel: document.getElementById('music-label'),
    ytMusicWrap: document.getElementById('yt-music-wrap'),
    ytMusicHint: document.getElementById('yt-music-hint'),
    ytMusicDismiss: document.getElementById('yt-music-dismiss'),
    ytMusicHost: document.getElementById('yt-music-host'),
    welcomeGate: document.getElementById('welcome-gate'),
    welcomeEyebrow: document.getElementById('welcome-eyebrow'),
    welcomeHeading: document.getElementById('welcome-heading'),
    welcomeText: document.getElementById('welcome-text'),
    welcomeBtnLabel: document.getElementById('welcome-btn-label'),
    welcomeEnterMusic: document.getElementById('welcome-enter-music'),
    welcomeEnterSilent: document.getElementById('welcome-enter-silent'),
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
  const ouluDateKeyFmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: config.origin.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const homeDateKeyFmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: config.home.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  function getEffectiveNowMs() {
    if (previewReunion) return targetMs + 1000;
    if (PREVIEW_TIMESTAMPS[previewMode]) return PREVIEW_TIMESTAMPS[previewMode];
    return Date.now();
  }

  function getDateKeys(nowMs) {
    const dt = new Date(nowMs);
    return {
      oulu: ouluDateKeyFmt.format(dt),
      home: homeDateKeyFmt.format(dt),
    };
  }

  function isDateKeyToday(dateKey, keys) {
    return Boolean(dateKey) && (keys.oulu === dateKey || keys.home === dateKey);
  }

  function isDateKeyReached(dateKey, keys) {
    return Boolean(dateKey) && (keys.oulu >= dateKey || keys.home >= dateKey);
  }

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

  let anniversaryLetterOpen = false;
  let anniversaryManuallyOpened = false;
  let nameDayLetterOpen = false;
  let nameDayManuallyOpened = false;

  function setAnniversaryLetterState(isOpen) {
    anniversaryLetterOpen = isOpen;
    if (!el.anniversarySealed || !el.anniversaryLetter) return;
    el.anniversarySealed.hidden = isOpen;
    el.anniversaryLetter.hidden = !isOpen;
    el.anniversaryCard.classList.toggle('is-opened', isOpen);
  }

  function setNameDayLetterState(isOpen) {
    nameDayLetterOpen = isOpen;
    if (!el.nameDaySealed || !el.nameDayLetter) return;
    el.nameDaySealed.hidden = isOpen;
    el.nameDayLetter.hidden = !isOpen;
    el.nameDayCard.classList.toggle('is-opened', isOpen);
  }

  function renderAnniversaryCopy() {
    if (!el.anniversaryCard) return;
    const copy = t().anniversary;
    if (!copy) return;

    el.anniversaryBadge.textContent = copy.badge;
    el.anniversaryLetterBadge.textContent = copy.badge;
    el.anniversarySealedTitle.textContent = copy.sealedTitle;
    el.anniversarySealedSubtitle.textContent = copy.sealedSubtitle;
    el.anniversaryOpenLabel.textContent = copy.openBtn;
    el.anniversaryCloseBtn.textContent = copy.closeBtn;
    el.anniversaryHeading.textContent = copy.heading;
    el.anniversarySignature.textContent = copy.signature;

    el.anniversaryParagraphs.innerHTML = '';
    copy.paragraphs.forEach((text) => {
      const p = document.createElement('p');
      p.textContent = text;
      el.anniversaryParagraphs.appendChild(p);
    });

    const photoSrc = config.anniversary && config.anniversary.photo;
    if (photoSrc) {
      el.anniversaryPhotoWrap.hidden = false;
      el.anniversaryPhoto.src = photoSrc;
      el.anniversaryPhoto.alt = copy.heading;
    } else {
      el.anniversaryPhotoWrap.hidden = true;
    }
  }

  function renderNameDayCopy() {
    if (!el.nameDayCard) return;
    const copy = t().nameDay;
    if (!copy) return;

    el.nameDayBadge.textContent = copy.badge;
    el.nameDayLetterBadge.textContent = copy.badge;
    el.nameDaySealedTitle.textContent = copy.sealedTitle;
    el.nameDaySealedSubtitle.textContent = copy.sealedSubtitle;
    el.nameDayOpenLabel.textContent = copy.openBtn;
    el.nameDayCloseBtn.textContent = copy.closeBtn;
    el.nameDayHeading.textContent = copy.heading;
    el.nameDaySignature.textContent = copy.signature;

    el.nameDayParagraphs.innerHTML = '';
    copy.paragraphs.forEach((text) => {
      const p = document.createElement('p');
      p.textContent = text;
      el.nameDayParagraphs.appendChild(p);
    });

    const photoSrc = config.nameDay && config.nameDay.photo;
    if (photoSrc) {
      el.nameDayPhotoWrap.hidden = false;
      el.nameDayPhoto.src = photoSrc;
      el.nameDayPhoto.alt = copy.heading;
    } else {
      el.nameDayPhotoWrap.hidden = true;
    }
  }

  function renderSpecialMoments(nowMs) {
    const strings = t();
    const keys = getDateKeys(nowMs);
    const annivKey = config.anniversary && config.anniversary.dateKey;
    const isAnnivToday = isDateKeyToday(annivKey, keys);
    const isAnnivUnlocked = isDateKeyReached(annivKey, keys);

    const nameDayKey = config.nameDay && config.nameDay.dateKey;
    const isNameDayToday = isDateKeyToday(nameDayKey, keys);
    const isNameDayUnlocked = isDateKeyReached(nameDayKey, keys);

    // Subtle aurora shifts on Dec 5 (Anniversary) and Dec 12 (Name Day)
    document.body.classList.toggle('anniversary-live', isAnnivToday);
    document.body.classList.toggle('nameday-live', isNameDayToday && !isAnnivToday);

    // Show Anniversary card automatically on Dec 5 (or if manually re-opened after Dec 5)
    const showAnnivCard = isAnnivToday || (isAnnivUnlocked && anniversaryManuallyOpened);
    if (el.anniversaryCard) {
      el.anniversaryCard.hidden = !showAnnivCard;
    }

    // Show Name Day card automatically on Dec 12 (or if manually re-opened after Dec 12)
    const showNameDayCard = isNameDayToday || (isNameDayUnlocked && nameDayManuallyOpened);
    if (el.nameDayCard) {
      el.nameDayCard.hidden = !showNameDayCard;
    }

    // Festive Day Spotlight Banner (Advent Sundays & St. Nicholas)
    const festiveOrder = ['advent1', 'mikulas', 'advent3', 'advent4'];
    const activeSpecial = config.milestones.find(
      (m) => festiveOrder.includes(m.id) && isDateKeyToday(m.dateKey, keys)
    );

    if (el.specialDayBanner) {
      if (
        activeSpecial &&
        strings.specialDays &&
        strings.specialDays[activeSpecial.id] &&
        !isAnnivToday &&
        !isNameDayToday
      ) {
        const dayCopy = strings.specialDays[activeSpecial.id];
        el.specialDayBanner.hidden = false;
        el.specialDayBanner.dataset.kind = activeSpecial.kind || 'advent';
        el.specialDayIcon.textContent = activeSpecial.icon || '🕯';
        el.specialDayBadge.textContent = dayCopy.badge;
        el.specialDayText.textContent = dayCopy.text;
      } else {
        el.specialDayBanner.hidden = true;
      }
    }
  }

  function renderMilestones(nowMs) {
    const strings = t();
    const keys = getDateKeys(nowMs);
    const totalDuration = Math.max(1, targetMs - startMs);
    el.progressMilestones.innerHTML = '';

    config.milestones.forEach((m, idx) => {
      const mTime = new Date(m.date).getTime();
      const pct = Math.min(100, Math.max(0, ((mTime - startMs) / totalDuration) * 100));
      const isToday = isDateKeyToday(m.dateKey, keys);
      const isReached = m.dateKey ? isDateKeyReached(m.dateKey, keys) : nowMs >= mTime;
      const labelText = m.label[currentLang] || m.label.cs;

      const dot = document.createElement('span');
      const kindClass = m.kind ? ` milestone-dot--${m.kind}` : '';
      dot.className = `milestone-dot${kindClass}${isReached ? ' reached' : ''}${isToday ? ' is-today' : ''}`;
      dot.style.left = `${pct}%`;
      dot.title = labelText;

      el.progressMilestones.appendChild(dot);

      if (m.showTrackLabel) {
        const label = document.createElement('span');
        let edgeClass = '';
        if (idx === 0) edgeClass = ' first';
        else if (idx === config.milestones.length - 1) edgeClass = ' last';
        label.className = `milestone-label${edgeClass}`;
        label.style.left = `${pct}%`;
        label.textContent = labelText;
        el.progressMilestones.appendChild(label);
      }
    });

    // Render festive December milestones strip (no overlap on desktop or mobile)
    if (!el.festiveMilestones) return;
    el.festiveMilestones.innerHTML = '';

    const festiveItems = config.milestones.filter((m) => m.festive);
    let foundNextUpcoming = false;

    festiveItems.forEach((m) => {
      const mTime = new Date(m.date).getTime();
      const isToday = isDateKeyToday(m.dateKey, keys);
      const isReached = !isToday && (m.dateKey ? isDateKeyReached(m.dateKey, keys) : nowMs >= mTime);
      const isUpcoming = !isToday && !isReached;
      const isNext = isUpcoming && !foundNextUpcoming;
      if (isNext) foundNextUpcoming = true;

      const isAnniversaryClickable = m.id === 'anniversary' && (isToday || isReached);
      const isNameDayClickable = m.id === 'nameday' && (isToday || isReached);
      const isClickable = isAnniversaryClickable || isNameDayClickable;
      const chip = document.createElement(isClickable ? 'button' : 'div');
      if (isAnniversaryClickable) {
        chip.type = 'button';
        chip.title = strings.milestoneOpenAnniversary;
        chip.addEventListener('click', () => {
          anniversaryManuallyOpened = true;
          renderSpecialMoments(getEffectiveNowMs());
          setAnniversaryLetterState(true);
          if (el.anniversaryCard) {
            el.anniversaryCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      } else if (isNameDayClickable) {
        chip.type = 'button';
        chip.title = strings.milestoneOpenNameDay;
        chip.addEventListener('click', () => {
          nameDayManuallyOpened = true;
          renderSpecialMoments(getEffectiveNowMs());
          setNameDayLetterState(true);
          if (el.nameDayCard) {
            el.nameDayCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      }

      chip.setAttribute('role', 'listitem');
      chip.className = [
        'festive-chip',
        `festive-chip--${m.kind || 'advent'}`,
        isToday ? 'is-today' : '',
        isReached ? 'is-reached' : '',
        isNext ? 'is-next' : '',
        isClickable ? 'is-clickable' : '',
      ]
        .filter(Boolean)
        .join(' ');

      const iconSpan = document.createElement('span');
      iconSpan.className = 'festive-chip-icon';
      iconSpan.setAttribute('aria-hidden', 'true');
      iconSpan.textContent = isReached ? '✓' : m.icon || '✦';

      const textWrap = document.createElement('span');
      textWrap.className = 'festive-chip-text';

      const dateSpan = document.createElement('span');
      dateSpan.className = 'festive-chip-date';
      dateSpan.textContent = (m.shortDate && m.shortDate[currentLang]) || '';

      const titleSpan = document.createElement('span');
      titleSpan.className = 'festive-chip-title';
      titleSpan.textContent = (m.shortLabel && m.shortLabel[currentLang]) || m.label[currentLang];

      textWrap.append(dateSpan, titleSpan);
      chip.append(iconSpan, textWrap);

      if (isToday) {
        const tag = document.createElement('span');
        tag.className = 'festive-chip-tag is-today-tag';
        tag.textContent = strings.milestoneToday;
        chip.appendChild(tag);
      } else if (isNext) {
        const daysUntil = Math.max(1, Math.ceil((mTime - nowMs) / 86400000));
        const word = pluralizeUnit(currentLang, daysUntil, 'dayLower');
        const tag = document.createElement('span');
        tag.className = 'festive-chip-tag';
        tag.textContent = strings.milestoneInDays(daysUntil, word);
        chip.appendChild(tag);
      }

      el.festiveMilestones.appendChild(chip);
    });
  }

  if (el.anniversaryOpenBtn) {
    el.anniversaryOpenBtn.addEventListener('click', () => {
      setAnniversaryLetterState(true);
    });
  }

  if (el.anniversaryCloseBtn) {
    el.anniversaryCloseBtn.addEventListener('click', () => {
      const keys = getDateKeys(getEffectiveNowMs());
      const annivKey = config.anniversary && config.anniversary.dateKey;
      if (isDateKeyToday(annivKey, keys)) {
        setAnniversaryLetterState(false);
      } else {
        anniversaryManuallyOpened = false;
        setAnniversaryLetterState(false);
        renderSpecialMoments(getEffectiveNowMs());
      }
    });
  }

  if (el.nameDayOpenBtn) {
    el.nameDayOpenBtn.addEventListener('click', () => {
      setNameDayLetterState(true);
    });
  }

  if (el.nameDayCloseBtn) {
    el.nameDayCloseBtn.addEventListener('click', () => {
      const keys = getDateKeys(getEffectiveNowMs());
      const nameDayKey = config.nameDay && config.nameDay.dateKey;
      if (isDateKeyToday(nameDayKey, keys)) {
        setNameDayLetterState(false);
      } else {
        nameDayManuallyOpened = false;
        setNameDayLetterState(false);
        renderSpecialMoments(getEffectiveNowMs());
      }
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
    const nowMs = getEffectiveNowMs();
    const diffMs = targetMs - nowMs;

    // Live dual clocks (Hero & Two Worlds card)
    const nowDate = new Date();
    const ouluTimeStr = ouluClockFmt.format(nowDate);
    const homeTimeStr = homeClockFmt.format(nowDate);
    el.clockOulu.textContent = ouluTimeStr;
    el.clockHome.textContent = homeTimeStr;
    if (el.worldOuluTime) el.worldOuluTime.textContent = ouluTimeStr;
    if (el.worldHomeTime) el.worldHomeTime.textContent = homeTimeStr;

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

    const keys = getDateKeys(nowMs);
    const milestoneKey = `${currentLang}:${keys.oulu}:${keys.home}`;
    if (milestoneKey !== milestonesRenderedKey) {
      milestonesRenderedKey = milestoneKey;
      renderMilestones(nowMs);
      renderSpecialMoments(nowMs);
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
  let isThumbsHovered = false;
  let thumbUserBrowseUntil = 0;
  let slideElapsedMs = 0;
  let lastFrameTs = performance.now();
  let slideTransitionTimer = null;
  const intervalMs = config.slideshow.intervalMs || 6500;

  function getCategoryLabel(catId) {
    const found = t().categories.find((c) => c.id === catId);
    return found ? found.label : catId;
  }

  function getCustomCaption(photo) {
    const fileName = photo.src.split('/').pop();
    const override = config.photoCaptions && config.photoCaptions[fileName];
    if (!override) return '';
    if (typeof override === 'string') return override;
    return override[currentLang] || override.cs || override.en || '';
  }

  function getPhotoCaption(photo) {
    return getCustomCaption(photo) || getCategoryLabel(photo.category);
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

      btn.addEventListener('click', () => {
        thumbUserBrowseUntil = 0;
        showSlide(idx, { scrollThumb: false });
      });
      el.slideThumbs.appendChild(btn);
    });
  }

  // Highlight active thumbnail; only scroll the strip on explicit navigation (never during auto-advance or user browsing)
  function syncActiveThumb({ scrollThumb = false } = {}) {
    const buttons = el.slideThumbs.querySelectorAll('.thumb-btn');
    const userBrowsingThumbs = isThumbsHovered || performance.now() < thumbUserBrowseUntil;

    buttons.forEach((btn, idx) => {
      const active = idx === currentIndex;
      btn.classList.toggle('is-active', active);
      if (active && scrollThumb && !userBrowsingThumbs) {
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
    const customCaption = getCustomCaption(photo);
    el.slideBadge.textContent = isVideo ? `${categoryName} · ${t().videoTag}` : categoryName;
    el.slideCaption.textContent = customCaption;
    el.slideCaption.hidden = !customCaption;
    el.slideImage.alt = customCaption || categoryName;
    if (el.lightboxDialog.open) {
      el.lightboxCaption.textContent = customCaption || categoryName;
    }
  }

  function showSlide(index, { immediate = false, scrollThumb = false } = {}) {
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

    syncActiveThumb({ scrollThumb });
    syncLightboxMedia(photo);
    syncMusicDucking();
  }

  function updatePlayToggleUI() {
    el.playToggleIcon.textContent = isPlaying ? '❚❚' : '▶';
    el.slidePlayToggle.setAttribute('aria-label', isPlaying ? t().ariaPause : t().ariaPlay);
  }

  el.slidePrev.addEventListener('click', () => showSlide(currentIndex - 1, { scrollThumb: true }));
  el.slideNext.addEventListener('click', () => showSlide(currentIndex + 1, { scrollThumb: true }));
  el.slideMuteToggle.addEventListener('click', () => {
    el.slideVideo.muted = !el.slideVideo.muted;
    updateMuteToggleUI();
    syncMusicDucking();
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

  // Pause auto-advance & never reset scroll position while user browses thumbnails
  const markThumbBrowse = () => {
    thumbUserBrowseUntil = performance.now() + 8000;
  };
  el.slideThumbs.addEventListener('mouseenter', () => {
    isThumbsHovered = true;
  });
  el.slideThumbs.addEventListener('mouseleave', () => {
    isThumbsHovered = false;
  });
  el.slideThumbs.addEventListener('wheel', markThumbBrowse, { passive: true });
  el.slideThumbs.addEventListener('touchstart', markThumbBrowse, { passive: true });
  el.slideThumbs.addEventListener('pointerdown', markThumbBrowse, { passive: true });

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
    syncMusicDucking();
  });

  el.lightboxDialog.addEventListener('close', () => {
    el.lightboxVideo.pause();
    el.lightboxVideo.removeAttribute('src');
    const current = filteredPhotos[currentIndex];
    if (current && current.type === 'video' && isPlaying) {
      el.slideVideo.play().catch(() => { });
    }
    syncMusicDucking();
  });

  el.lightboxClose.addEventListener('click', () => el.lightboxDialog.close());
  el.lightboxPrev.addEventListener('click', () => showSlide(currentIndex - 1, { scrollThumb: true }));
  el.lightboxNext.addEventListener('click', () => showSlide(currentIndex + 1, { scrollThumb: true }));

  el.lightboxDialog.addEventListener('click', (e) => {
    if (e.target === el.lightboxDialog) {
      el.lightboxDialog.close();
    }
  });

  ['play', 'pause', 'ended', 'volumechange'].forEach((evtName) => {
    el.lightboxVideo.addEventListener(evtName, () => syncMusicDucking());
  });

  window.addEventListener('keydown', (e) => {
    if (el.welcomeGate && !el.welcomeGate.hidden) return;
    if (e.key === 'ArrowLeft') {
      showSlide(currentIndex - 1, { scrollThumb: true });
    } else if (e.key === 'ArrowRight') {
      showSlide(currentIndex + 1, { scrollThumb: true });
    }
  });

  function tickSlideshow(ts) {
    const dt = Math.min(100, ts - lastFrameTs);
    lastFrameTs = ts;

    const current = filteredPhotos[currentIndex];
    const isVideo = current && current.type === 'video';
    const userBrowsingThumbs = isThumbsHovered || ts < thumbUserBrowseUntil;

    if (isVideo) {
      if (el.slideVideo.duration > 0) {
        const pct = Math.min(100, (el.slideVideo.currentTime / el.slideVideo.duration) * 100);
        el.slideTimerFill.style.width = `${pct}%`;
      }
    } else {
      const gateClosed = !el.welcomeGate || el.welcomeGate.hidden;
      const shouldAdvance =
        isPlaying &&
        gateClosed &&
        !isStageHovered &&
        !userBrowsingThumbs &&
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
  let snowOpacity = motionEnabled ? 1 : 0;
  let skyRafId = null;

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

  function scheduleSkyFrame() {
    if (skyRafId !== null) return;
    skyRafId = requestAnimationFrame(drawSkyFrame);
  }

  function drawSkyFrame() {
    skyRafId = null;
    ctx.clearRect(0, 0, width, height);

    // Smoothly fade snow in/out when toggling Aurora On / Off
    const targetSnowOpacity = motionEnabled ? 1 : 0;
    if (Math.abs(snowOpacity - targetSnowOpacity) > 0.01) {
      snowOpacity += (targetSnowOpacity - snowOpacity) * 0.08;
    } else {
      snowOpacity = targetSnowOpacity;
    }

    for (const s of stars) {
      if (motionEnabled) s.phase += s.speed;
      const alpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(s.phase));
      ctx.fillStyle = `rgba(225, 248, 255, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (snowOpacity > 0.005) {
      for (const f of flakes) {
        f.wobble += 0.012;
        f.y += f.vy;
        f.x += f.vx + Math.sin(f.wobble) * 0.22;

        if (f.y > height + 6) {
          f.y = -6;
          f.x = Math.random() * width;
        }
        if (f.x > width + 6) f.x = -6;
        if (f.x < -6) f.x = width + 6;

        ctx.fillStyle = `rgba(235, 250, 255, ${(f.alpha * snowOpacity).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const stillFadingSnow = Math.abs(snowOpacity - targetSnowOpacity) > 0.005;
    if ((motionEnabled || stillFadingSnow) && !document.hidden) {
      scheduleSkyFrame();
    }
  }

  function applyMotionState() {
    document.body.classList.toggle('motion-paused', !motionEnabled);
    el.motionToggle.classList.toggle('is-active', motionEnabled);
    el.motionToggle.setAttribute('aria-pressed', String(motionEnabled));
    el.motionToggle.querySelector('.motion-label').textContent = motionEnabled
      ? t().auroraOn
      : t().auroraPaused;

    if (!motionEnabled) {
      el.slideImage.classList.remove('ken-burns');
    }

    scheduleSkyFrame();
  }

  el.motionToggle.addEventListener('click', () => {
    motionEnabled = !motionEnabled;
    applyMotionState();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && motionEnabled) {
      scheduleSkyFrame();
    }
  });

  window.addEventListener('resize', () => {
    initSkyParticles();
    scheduleSkyFrame();
  });

  // =========================================================
  // Two Worlds Under One Sky (Oulu vs. Brno Live Weather, Daylight & Aurora)
  // =========================================================
  const CACHE_TTL_MS = 15 * 60 * 1000;
  const twoWorldsState = {
    oulu: null,
    home: null,
    weatherFailed: false,
    auroraKp: null,
    auroraFailed: false,
  };

  function readSessionCache(key) {
    try {
      const raw = window.sessionStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || Date.now() - parsed.ts > CACHE_TTL_MS) return null;
      return parsed.data;
    } catch {
      return null;
    }
  }

  function writeSessionCache(key, data) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
    } catch {
      // ignore storage restrictions
    }
  }

  function computeFallbackSolar(lat, lon, timeZone, refDate) {
    const startOfYear = Date.UTC(refDate.getUTCFullYear(), 0, 0);
    const dayOfYear = Math.floor((refDate.getTime() - startOfYear) / 86400000);
    const deg2rad = Math.PI / 180;
    const rad2deg = 180 / Math.PI;

    const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1);
    const eqTime =
      229.18 *
      (0.000075 +
        0.001868 * Math.cos(gamma) -
        0.032077 * Math.sin(gamma) -
        0.014615 * Math.cos(2 * gamma) -
        0.040849 * Math.sin(2 * gamma));
    const decl =
      0.006918 -
      0.399912 * Math.cos(gamma) +
      0.070257 * Math.sin(gamma) -
      0.006758 * Math.cos(2 * gamma) +
      0.000907 * Math.sin(2 * gamma) -
      0.002697 * Math.cos(3 * gamma) +
      0.00148 * Math.sin(3 * gamma);

    const latRad = lat * deg2rad;
    const cosHa =
      Math.cos(90.833 * deg2rad) / (Math.cos(latRad) * Math.cos(decl)) -
      Math.tan(latRad) * Math.tan(decl);

    if (cosHa >= 1) {
      return { sunriseStr: '--:--', sunsetStr: '--:--', sunriseMin: 720, daylightSec: 0 };
    }
    if (cosHa <= -1) {
      return { sunriseStr: '00:00', sunsetStr: '24:00', sunriseMin: 0, daylightSec: 86400 };
    }

    const haDeg = Math.acos(cosHa) * rad2deg;
    const solarNoonUtcMin = 720 - 4 * lon - eqTime;
    const sunriseUtcMin = solarNoonUtcMin - 4 * haDeg;
    const sunsetUtcMin = solarNoonUtcMin + 4 * haDeg;

    const baseUtc = Date.UTC(refDate.getUTCFullYear(), refDate.getUTCMonth(), refDate.getUTCDate());
    const sunriseDate = new Date(baseUtc + sunriseUtcMin * 60000);
    const sunsetDate = new Date(baseUtc + sunsetUtcMin * 60000);

    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const sunriseStr = fmt.format(sunriseDate);
    const sunsetStr = fmt.format(sunsetDate);
    const [srH, srM] = sunriseStr.split(':').map(Number);

    return {
      sunriseStr,
      sunsetStr,
      sunriseMin: srH * 60 + srM,
      daylightSec: Math.max(0, Math.round((sunsetUtcMin - sunriseUtcMin) * 60)),
    };
  }

  function mapWeatherCode(code, isDay) {
    const codes = t().twoWorlds.weatherCodes;
    const sunOrMoon = isDay ? '☀' : '☾';
    if (code === 0) return { icon: sunOrMoon, label: codes.clear };
    if (code === 1) return { icon: isDay ? '🌤' : '☾', label: codes.mostlyClear };
    if (code === 2) return { icon: isDay ? '⛅' : '☁', label: codes.partlyCloudy };
    if (code === 3) return { icon: '☁', label: codes.overcast };
    if (code === 45 || code === 48) return { icon: '🌫', label: codes.fog };
    if (code >= 51 && code <= 55) return { icon: '🌦', label: codes.drizzle };
    if (code === 56 || code === 57) return { icon: '🌧', label: codes.freezingDrizzle };
    if (code >= 61 && code <= 65) return { icon: '🌧', label: codes.rain };
    if (code === 66 || code === 67) return { icon: '🌧', label: codes.freezingRain };
    if (code >= 71 && code <= 75) return { icon: '❄', label: codes.snow };
    if (code === 77) return { icon: '❄', label: codes.snowGrains };
    if (code >= 80 && code <= 82) return { icon: '🌦', label: codes.showers };
    if (code === 85 || code === 86) return { icon: '🌨', label: codes.snowShowers };
    if (code >= 95) return { icon: '⛈', label: codes.thunderstorm };
    return { icon: '☁', label: codes.overcast };
  }

  function parseIsoHHMM(isoStr) {
    if (!isoStr || typeof isoStr !== 'string') return null;
    const match = isoStr.match(/T(\d{2}):(\d{2})/);
    if (!match) return null;
    const hh = Number(match[1]);
    const mm = Number(match[2]);
    return { str: `${pad2(hh)}:${pad2(mm)}`, minutes: hh * 60 + mm };
  }

  function formatDurationHM(totalSec) {
    const totalMin = Math.max(0, Math.round(totalSec / 60));
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return { h, m, text: t().twoWorlds.daylightDuration(h, m) };
  }

  function renderCitySky(prefix, data, fallbackSolar) {
    const tw = t().twoWorlds;
    const iconEl = prefix === 'oulu' ? el.worldOuluIcon : el.worldHomeIcon;
    const tempEl = prefix === 'oulu' ? el.worldOuluTemp : el.worldHomeTemp;
    const descEl = prefix === 'oulu' ? el.worldOuluDesc : el.worldHomeDesc;
    const feelsEl = prefix === 'oulu' ? el.worldOuluFeels : el.worldHomeFeels;
    const dlValEl = prefix === 'oulu' ? el.worldOuluDaylightVal : el.worldHomeDaylightVal;
    const dlFillEl = prefix === 'oulu' ? el.worldOuluDaylightFill : el.worldHomeDaylightFill;
    const srEl = prefix === 'oulu' ? el.worldOuluSunrise : el.worldHomeSunrise;
    const ssEl = prefix === 'oulu' ? el.worldOuluSunset : el.worldHomeSunset;

    if (!iconEl || !tempEl) return;

    if (data && typeof data.temp === 'number') {
      const w = mapWeatherCode(data.code, data.isDay !== 0);
      iconEl.textContent = w.icon;
      tempEl.textContent = `${Math.round(data.temp)}°C`;
      descEl.textContent = w.label;
      feelsEl.textContent =
        typeof data.apparent === 'number' ? tw.feelsLike(Math.round(data.apparent)) : '';
    } else if (twoWorldsState.weatherFailed) {
      tempEl.textContent = '--°';
      descEl.textContent = tw.weatherUnavailable;
      feelsEl.textContent = '';
    } else {
      descEl.textContent = tw.weatherLoading;
    }

    const solar = (data && data.solar) || fallbackSolar;
    if (solar) {
      const dur = formatDurationHM(solar.daylightSec);
      dlValEl.textContent = dur.text;
      srEl.textContent = `☀ ${solar.sunriseStr}`;
      ssEl.textContent = `☾ ${solar.sunsetStr}`;

      const leftPct = Math.max(0, Math.min(92, (solar.sunriseMin / 1440) * 100));
      const widthPct = Math.max(4, Math.min(100 - leftPct, (solar.daylightSec / 86400) * 100));
      dlFillEl.style.left = `${leftPct.toFixed(1)}%`;
      dlFillEl.style.width = `${widthPct.toFixed(1)}%`;
    }
  }

  function renderAuroraUI() {
    if (!el.auroraLiveStrip) return;
    const tw = t().twoWorlds;
    el.auroraStripTitle.textContent = tw.auroraTitle;

    if (twoWorldsState.auroraFailed) {
      el.auroraLiveStrip.hidden = true;
      return;
    }

    el.auroraLiveStrip.hidden = false;

    if (typeof twoWorldsState.auroraKp !== 'number') {
      el.auroraKpBadge.textContent = 'Kp --';
      el.auroraStatusText.textContent = tw.auroraLoading;
      return;
    }

    const kp = twoWorldsState.auroraKp;
    const kpDisplay = Number.isInteger(kp) ? String(kp) : kp.toFixed(1);
    el.auroraKpBadge.textContent = tw.auroraKpLabel(kpDisplay);

    let level = 'quiet';
    if (kp >= 5) level = 'storm';
    else if (kp >= 3) level = 'active';
    else if (kp >= 2) level = 'mild';

    el.auroraLiveStrip.dataset.level = level;
    el.auroraStatusText.textContent = tw.auroraLevels[level];

    const litCount = Math.max(1, Math.min(9, Math.round(kp)));
    const segs = el.auroraMeter.querySelectorAll('.kp-seg');
    segs.forEach((seg, idx) => {
      seg.classList.toggle('is-lit', idx < litCount);
    });
  }

  function renderTwoWorldsUI() {
    if (!el.twoWorldsHeading) return;
    const tw = t().twoWorlds;

    el.twoWorldsKicker.textContent = tw.kicker;
    el.twoWorldsHeading.textContent = tw.title;
    if (el.distanceValue && config.distanceKm) {
      const formattedDist = new Intl.NumberFormat(currentLang === 'cs' ? 'cs-CZ' : 'en-US').format(
        config.distanceKm
      );
      el.distanceValue.textContent = `${formattedDist} km`;
    }
    if (el.distanceLabel) el.distanceLabel.textContent = tw.distanceLabel;

    el.worldOuluName.textContent = tw.ouluName;
    el.worldOuluSub.textContent = tw.ouluSub;
    el.worldOuluDaylightLabel.textContent = tw.daylightLabel;

    el.worldHomeName.textContent = tw.homeName;
    el.worldHomeSub.textContent = tw.homeSub;
    el.worldHomeDaylightLabel.textContent = tw.daylightLabel;

    const refDate = new Date(getEffectiveNowMs());
    const ouluFallback = computeFallbackSolar(
      config.origin.lat,
      config.origin.lon,
      config.origin.timeZone,
      refDate
    );
    const homeFallback = computeFallbackSolar(
      config.home.lat,
      config.home.lon,
      config.home.timeZone,
      refDate
    );

    renderCitySky('oulu', twoWorldsState.oulu, ouluFallback);
    renderCitySky('home', twoWorldsState.home, homeFallback);

    const ouluSec = (twoWorldsState.oulu && twoWorldsState.oulu.solar
      ? twoWorldsState.oulu.solar.daylightSec
      : ouluFallback.daylightSec);
    const homeSec = (twoWorldsState.home && twoWorldsState.home.solar
      ? twoWorldsState.home.solar.daylightSec
      : homeFallback.daylightSec);

    if (el.daylightCompare && homeSec > ouluSec + 600) {
      const diffMin = Math.round((homeSec - ouluSec) / 60);
      const diffH = Math.floor(diffMin / 60);
      const diffM = diffMin % 60;
      el.daylightCompare.textContent = tw.daylightCompare(diffH, diffM);
      el.daylightCompare.hidden = false;
    } else if (el.daylightCompare) {
      el.daylightCompare.hidden = true;
    }

    renderAuroraUI();
  }

  async function fetchCityWeather(lat, lon) {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,weather_code,is_day` +
      `&daily=sunrise,sunset,daylight_duration&timezone=auto&forecast_days=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather fetch failed');
    const json = await res.json();
    const cur = json.current || {};
    const daily = json.daily || {};
    const sr = parseIsoHHMM(daily.sunrise && daily.sunrise[0]);
    const ss = parseIsoHHMM(daily.sunset && daily.sunset[0]);
    const daylightSec = daily.daylight_duration && daily.daylight_duration[0];

    return {
      temp: cur.temperature_2m,
      apparent: cur.apparent_temperature,
      code: cur.weather_code,
      isDay: cur.is_day,
      solar:
        sr && ss && typeof daylightSec === 'number'
          ? {
              sunriseStr: sr.str,
              sunsetStr: ss.str,
              sunriseMin: sr.minutes,
              daylightSec,
            }
          : null,
    };
  }

  async function fetchAuroraKp() {
    const res = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
    if (!res.ok) throw new Error('Aurora fetch failed');
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return null;

    for (let i = rows.length - 1; i >= 0; i -= 1) {
      const row = rows[i];
      let val = NaN;
      if (Array.isArray(row)) {
        val = parseFloat(row[1]);
      } else if (row && typeof row === 'object') {
        val = parseFloat(row.Kp ?? row.kp ?? row.kp_index);
      }
      if (!Number.isNaN(val)) return val;
    }
    return null;
  }

  function initTwoWorlds() {
    if (!el.twoWorldsHeading) return;
    renderTwoWorldsUI();

    const cachedWeather = readSessionCache('reunion-weather-v1');
    if (cachedWeather && cachedWeather.oulu && cachedWeather.home) {
      twoWorldsState.oulu = cachedWeather.oulu;
      twoWorldsState.home = cachedWeather.home;
      renderTwoWorldsUI();
    } else {
      Promise.all([
        fetchCityWeather(config.origin.lat, config.origin.lon),
        fetchCityWeather(config.home.lat, config.home.lon),
      ])
        .then(([oulu, home]) => {
          twoWorldsState.oulu = oulu;
          twoWorldsState.home = home;
          twoWorldsState.weatherFailed = false;
          writeSessionCache('reunion-weather-v1', { oulu, home });
          renderTwoWorldsUI();
        })
        .catch(() => {
          twoWorldsState.weatherFailed = true;
          renderTwoWorldsUI();
        });
    }

    const cachedKp = readSessionCache('reunion-aurora-kp-v1');
    if (typeof cachedKp === 'number') {
      twoWorldsState.auroraKp = cachedKp;
      renderAuroraUI();
    } else {
      fetchAuroraKp()
        .then((kp) => {
          if (typeof kp === 'number') {
            twoWorldsState.auroraKp = kp;
            twoWorldsState.auroraFailed = false;
            writeSessionCache('reunion-aurora-kp-v1', kp);
          } else {
            twoWorldsState.auroraFailed = true;
          }
          renderAuroraUI();
        })
        .catch(() => {
          twoWorldsState.auroraFailed = true;
          renderAuroraUI();
        });
    }
  }

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
    if (el.festiveStripLabel) el.festiveStripLabel.textContent = strings.festiveStripLabel;

    renderAnniversaryCopy();
    renderNameDayCopy();
    renderTwoWorldsUI();

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
    if (el.welcomeEyebrow) el.welcomeEyebrow.textContent = strings.welcomeEyebrow;
    if (el.welcomeHeading) el.welcomeHeading.textContent = strings.welcomeHeading;
    if (el.welcomeText) el.welcomeText.textContent = strings.welcomeText;
    if (el.welcomeBtnLabel) el.welcomeBtnLabel.textContent = strings.welcomeBtn;
    if (el.welcomeEnterSilent) el.welcomeEnterSilent.textContent = strings.welcomeSilent;
    updateMusicUI();

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
  // Background Music (Native HTML5 Audio or YouTube IFrame Fallback)
  // =========================================================
  const musicCfg = config.music || {};
  const isTouchDevice =
    window.matchMedia('(pointer: coarse)').matches || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  let htmlAudio = null;
  let ytPlayer = null;
  let ytReady = false;
  let musicWanted = false;
  let musicPlaying = false;
  let musicDucked = false;
  let userManuallyPausedMusic = false;
  let volumeFadeTimer = null;
  let ytFallbackRevealTimer = null;

  function setYtFallbackVisible(visible) {
    if (!el.ytMusicWrap) return;
    el.ytMusicWrap.classList.toggle('is-visible', visible);
  }

  function updateMusicUI() {
    if (!el.musicToggle) return;
    const strings = t();
    const active = musicPlaying && !musicDucked;
    const waiting = musicWanted && !musicPlaying && !musicDucked;
    el.musicToggle.classList.toggle('is-playing', active);
    el.musicToggle.classList.toggle('is-waiting', waiting);
    el.musicToggle.setAttribute('aria-pressed', String(musicWanted));
    el.musicToggle.title = active ? strings.musicPauseTitle : strings.musicPlayTitle;
    if (el.musicLabel) {
      el.musicLabel.textContent = strings.musicLabel;
    }
    if (el.ytMusicHint && strings.musicTapHint) {
      el.ytMusicHint.textContent = strings.musicTapHint;
    }
  }

  function fadeVolumeTo(targetVol) {
    if (volumeFadeTimer !== null) {
      window.clearInterval(volumeFadeTimer);
      volumeFadeTimer = null;
    }

    if (htmlAudio) {
      const targetRatio = Math.max(0, Math.min(1, targetVol / 100));
      if (isTouchDevice) {
        try {
          htmlAudio.volume = targetRatio;
        } catch {
          // iOS controls volume via hardware buttons
        }
        return;
      }
      const startVol = htmlAudio.volume;
      const steps = 14;
      let step = 0;
      const delta = (targetRatio - startVol) / steps;
      volumeFadeTimer = window.setInterval(() => {
        step += 1;
        try {
          htmlAudio.volume = step >= steps ? targetRatio : Math.max(0, Math.min(1, startVol + delta * step));
        } catch {
          // ignore
        }
        if (step >= steps) {
          window.clearInterval(volumeFadeTimer);
          volumeFadeTimer = null;
        }
      }, 80);
      return;
    }

    if (!ytPlayer || !ytReady) return;
    if (isTouchDevice) {
      try {
        ytPlayer.setVolume(Math.max(0, Math.min(100, targetVol)));
      } catch {
        // ignore
      }
      return;
    }

    let currentVol = 0;
    try {
      currentVol = typeof ytPlayer.getVolume === 'function' ? ytPlayer.getVolume() : 0;
    } catch {
      currentVol = 0;
    }

    const steps = 16;
    let step = 0;
    const delta = (targetVol - currentVol) / steps;
    volumeFadeTimer = window.setInterval(() => {
      step += 1;
      const nextVol = step >= steps ? targetVol : Math.round(currentVol + delta * step);
      try {
        ytPlayer.setVolume(Math.max(0, Math.min(100, nextVol)));
      } catch {
        // ignore player state race
      }
      if (step >= steps) {
        window.clearInterval(volumeFadeTimer);
        volumeFadeTimer = null;
      }
    }, 85);
  }

  function clearYtRevealTimer() {
    if (ytFallbackRevealTimer !== null) {
      window.clearTimeout(ytFallbackRevealTimer);
      ytFallbackRevealTimer = null;
    }
  }

  function scheduleYtFallbackReveal() {
    clearYtRevealTimer();
    ytFallbackRevealTimer = window.setTimeout(() => {
      ytFallbackRevealTimer = null;
      if (musicWanted && !musicPlaying && !musicDucked && !htmlAudio) {
        setYtFallbackVisible(true);
      }
    }, 1400);
  }

  const WELCOME_CHOICE_KEY = 'reunion-welcome-choice';
  const forceShowGate = urlParams.get('gate') === '1';

  function readWelcomeChoice() {
    if (forceShowGate) return null;
    try {
      const val = window.localStorage.getItem(WELCOME_CHOICE_KEY);
      return val === 'music' || val === 'silent' ? val : null;
    } catch {
      return null;
    }
  }

  function saveWelcomeChoice(choice) {
    try {
      window.localStorage.setItem(WELCOME_CHOICE_KEY, choice);
    } catch {
      // ignore storage restrictions
    }
  }

  function startMusicPlayback({ revealFallback = true, persist = true } = {}) {
    musicWanted = true;
    userManuallyPausedMusic = false;
    if (persist) saveWelcomeChoice('music');
    updateMusicUI();

    const targetVol = musicCfg.volume ?? 55;

    // 1. Native HTML5 <audio> (100% reliable 1-tap playback on iPhone/Safari/Android/Desktop)
    if (htmlAudio) {
      try {
        htmlAudio.muted = false;
        htmlAudio.volume = isTouchDevice ? Math.max(0, Math.min(1, targetVol / 100)) : 0;
        const p = htmlAudio.play();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            musicPlaying = true;
            updateMusicUI();
            fadeVolumeTo(targetVol);
          }).catch(() => {
            musicPlaying = false;
            updateMusicUI();
          });
        } else {
          musicPlaying = true;
          updateMusicUI();
          fadeVolumeTo(targetVol);
        }
      } catch {
        musicPlaying = false;
        updateMusicUI();
      }
      return;
    }

    // 2. YouTube IFrame Player fallback
    if (revealFallback) {
      scheduleYtFallbackReveal();
    }
    if (!ytPlayer || !ytReady) return;
    try {
      ytPlayer.unMute();
      if (isTouchDevice) {
        ytPlayer.setVolume(targetVol);
      } else {
        ytPlayer.setVolume(0);
      }
      ytPlayer.playVideo();
      if (!isTouchDevice) {
        fadeVolumeTo(targetVol);
      }
    } catch {
      if (revealFallback) setYtFallbackVisible(true);
    }
  }

  function pauseMusicPlayback({ manual = true } = {}) {
    if (manual) {
      musicWanted = false;
      userManuallyPausedMusic = true;
      saveWelcomeChoice('silent');
    }
    musicPlaying = false;
    clearYtRevealTimer();
    setYtFallbackVisible(false);
    if (volumeFadeTimer !== null) {
      window.clearInterval(volumeFadeTimer);
      volumeFadeTimer = null;
    }
    if (htmlAudio) {
      try {
        htmlAudio.pause();
      } catch {
        // ignore
      }
    } else if (ytPlayer && ytReady) {
      try {
        ytPlayer.pauseVideo();
      } catch {
        // ignore
      }
    }
    updateMusicUI();
  }

  function syncMusicDucking() {
    const current = filteredPhotos[currentIndex];
    const galleryVideoWithSound =
      current &&
      current.type === 'video' &&
      ((el.lightboxDialog.open && !el.lightboxVideo.paused) ||
        (!el.slideVideo.hidden && !el.slideVideo.muted));

    if (galleryVideoWithSound) {
      if (musicWanted && !musicDucked) {
        musicDucked = true;
        if (htmlAudio) {
          try {
            htmlAudio.pause();
          } catch {
            // ignore
          }
        } else if (ytPlayer && ytReady) {
          try {
            ytPlayer.pauseVideo();
          } catch {
            // ignore
          }
        }
        updateMusicUI();
      }
    } else if (musicDucked) {
      musicDucked = false;
      if (musicWanted) {
        if (htmlAudio) {
          htmlAudio.play().catch(() => { });
          fadeVolumeTo(musicCfg.volume ?? 55);
        } else if (ytPlayer && ytReady) {
          try {
            ytPlayer.playVideo();
            fadeVolumeTo(musicCfg.volume ?? 55);
          } catch {
            // ignore
          }
        }
      }
      updateMusicUI();
    }
  }

  function closeWelcomeGate({ withMusic = false } = {}) {
    saveWelcomeChoice(withMusic ? 'music' : 'silent');
    if (withMusic) {
      startMusicPlayback({ revealFallback: true, persist: false });
    } else {
      userManuallyPausedMusic = true;
    }

    if (!el.welcomeGate || el.welcomeGate.hidden) return;
    el.welcomeGate.classList.add('is-leaving');
    document.body.classList.remove('gate-open');
    window.setTimeout(() => {
      el.welcomeGate.hidden = true;
    }, 650);
  }

  function initWelcomeGate() {
    if (!el.welcomeGate) return;

    // Only skip the welcome gate if the user previously chose silent mode;
    // users who want music still need a click gesture per browser autoplay policy.
    if (readWelcomeChoice() === 'silent') {
      el.welcomeGate.hidden = true;
      document.body.classList.remove('gate-open');
      userManuallyPausedMusic = true;
      return;
    }

    if (el.welcomeEnterMusic) {
      el.welcomeEnterMusic.addEventListener('click', () => {
        closeWelcomeGate({ withMusic: true });
      });
    }

    if (el.welcomeEnterSilent) {
      el.welcomeEnterSilent.addEventListener('click', () => {
        closeWelcomeGate({ withMusic: false });
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && el.welcomeGate && !el.welcomeGate.hidden) {
        closeWelcomeGate({ withMusic: false });
      }
    });
  }

  function initBackgroundMusic() {
    const hasAudioFile = Boolean(musicCfg.audioSrc);
    const hasYouTube = Boolean(musicCfg.youtubeId && el.ytMusicHost);

    if ((!hasAudioFile && !hasYouTube) || !el.musicToggle) {
      if (el.musicToggle) el.musicToggle.hidden = true;
      if (el.ytMusicWrap) el.ytMusicWrap.hidden = true;
      return;
    }

    el.musicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (musicWanted && musicPlaying) {
        pauseMusicPlayback({ manual: true });
      } else if (musicWanted && !musicPlaying && !htmlAudio) {
        startMusicPlayback({ revealFallback: true, persist: true });
        if (isTouchDevice) setYtFallbackVisible(true);
      } else {
        startMusicPlayback({ revealFallback: true, persist: true });
      }
    });

    if (el.ytMusicDismiss) {
      el.ytMusicDismiss.addEventListener('click', () => {
        setYtFallbackVisible(false);
        if (!musicPlaying) {
          musicWanted = false;
          updateMusicUI();
        }
      });
    }

    if (hasAudioFile) {
      if (el.ytMusicWrap) el.ytMusicWrap.hidden = true;
      htmlAudio = new Audio(musicCfg.audioSrc);
      htmlAudio.loop = true;
      htmlAudio.preload = 'auto';
      htmlAudio.playsInline = true;
      htmlAudio.addEventListener('playing', () => {
        musicPlaying = true;
        updateMusicUI();
      });
      htmlAudio.addEventListener('pause', () => {
        musicPlaying = false;
        updateMusicUI();
      });
      htmlAudio.addEventListener('error', () => {
        musicPlaying = false;
        updateMusicUI();
      });
      return;
    }

    const createPlayer = () => {
      if (ytPlayer || !window.YT || !window.YT.Player) return;
      const playerVars = {
        autoplay: 0,
        controls: 1,
        disablekb: 1,
        fs: 0,
        loop: 1,
        modestbranding: 1,
        playsinline: 1,
        playlist: musicCfg.youtubeId,
        rel: 0,
      };
      if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
        playerVars.origin = window.location.origin;
      }

      ytPlayer = new window.YT.Player('yt-music-host', {
        height: '135',
        width: '240',
        videoId: musicCfg.youtubeId,
        playerVars,
        events: {
          onReady: () => {
            ytReady = true;
            if (musicWanted && !musicDucked) {
              startMusicPlayback({ revealFallback: true, persist: false });
            }
          },
          onStateChange: (event) => {
            if (!window.YT || !window.YT.PlayerState) return;
            if (event.data === window.YT.PlayerState.PLAYING) {
              musicPlaying = true;
              musicWanted = true;
              clearYtRevealTimer();
              setYtFallbackVisible(false);
              updateMusicUI();
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              musicPlaying = false;
              updateMusicUI();
            } else if (event.data === window.YT.PlayerState.ENDED && musicWanted && !musicDucked) {
              try {
                ytPlayer.seekTo(0);
                ytPlayer.playVideo();
              } catch {
                // ignore
              }
            }
          },
          onError: () => {
            musicPlaying = false;
            clearYtRevealTimer();
            updateMusicUI();
          },
        },
      });
    };

    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevReady === 'function') prevReady();
      createPlayer();
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      document.head.appendChild(tag);
    }
  }

  // =========================================================
  // Boot
  // =========================================================
  renderThumbs();
  showSlide(0, { immediate: true });
  initSkyParticles();
  initBackgroundMusic();
  initWelcomeGate();
  applyLanguage(currentLang);
  initTwoWorlds();
  applyMotionState();
  requestAnimationFrame(tickSlideshow);
})();
