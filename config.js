/**
 * Configuration for Odpočet do shledání / Until We Meet Again
 *
 * Default language is Czech ('cs'), with a live switcher to English ('en').
 * Edit dates, texts, and optional photo captions here.
 */
window.REUNION_CONFIG = {
  defaultLang: 'cs',

  // Erasmus journey dates (ISO 8601 with timezone offset)
  erasmusStart: '2026-08-18T00:00:00+02:00',
  reunionDate: '2026-12-24T12:00:00+01:00',

  // Locations & timezones
  origin: {
    timeZone: 'Europe/Helsinki',
  },
  home: {
    timeZone: 'Europe/Bratislava',
  },

  // Milestones shown along the Erasmus progress bar
  milestones: [
    {
      date: '2026-08-18T00:00:00+02:00',
      label: { cs: '18. 8. · Začátek v Oulu', en: 'Aug 18 · Oulu Begins' },
    },
    {
      date: '2026-10-21T06:30:00+02:00',
      label: { cs: 'Polovina za tebou', en: 'Halfway There' },
    },
    {
      date: '2026-11-20T00:00:00+01:00',
      label: { cs: 'Arktická zima', en: 'Arctic Winter' },
    },
    {
      date: '2026-12-24T12:00:00+01:00',
      label: { cs: 'Štědrý den · Domů', en: 'Christmas Eve · Home' },
    },
  ],

  // Slideshow settings
  slideshow: {
    intervalMs: 6500,
    shuffleOnLoad: true,
  },

  // Localized UI copy
  i18n: {
    cs: {
      pageTitle: 'Odpočet do shledání — Simčin vánoční odpočet',
      routeOrigin: 'Oulu, Finsko 🇫🇮',
      routeHome: 'Domů na Vánoce 🎄',
      auroraOn: 'Polární záře',
      auroraPaused: 'Záře pozastavena',
      eyebrow: 'Erasmus 2026 · Oulu → Domů',
      title: 'Odpočet do shledání',
      subtitle: 'Odpočítáváme každou vteřinu, než se Simča, Ria a Texas vrátí z Oulu domů na Vánoce.',
      clockOulu: 'Oulu',
      clockHome: 'Doma',
      progressKicker: 'Průběh Erasmu',
      progressCompleteLabel: 'hotovo',
      progressStartEndpoint: '18. srpna · Oulu 🇫🇮',
      progressEndEndpoint: '24. prosince, 12:00 · Domů 🎄',
      progressFinished: 'Všechny kilometry mezi Oulu a domovem jsou konečně za tebou.',
      progressBeforeStart: 'Severské dobrodružství v Oulu právě začíná.',
      progressLastDay: 'Už jen poslední noc do Štědrého dne společně doma!',
      progressSummary: (daysDone, daysLeft, doneWord, leftWord) =>
        `Máš za sebou ${daysDone} ${doneWord} — zbývá už jen ${daysLeft} ${leftWord} do návratu domů.`,
      daysStat: (daysDone, daysLeft, doneWord, leftWord) =>
        `${daysDone} ${doneWord} za tebou · zbývá ${daysLeft} ${leftWord}`,
      daysTotalDone: (totalDays, word) => `${totalDays} / ${totalDays} ${word} splněno`,
      daysTotal: (totalDays, word) => `Celkem ${totalDays} ${word}`,
      galleryKicker: 'Vzpomínky & naše smečka',
      galleryTitle: 'Naše oblíbené společné chvíle',
      videoTag: 'Video',
      ouluKicker: 'Právě v Oulu, Finsko 🇫🇮',
      ouluTitle: 'Severský dobrodružný tým',
      homeKicker: 'Čekáme doma 🎄',
      homeTitle: 'Všichni, komu se po tobě stýská',
      footer: 'S láskou vytvořil Mišák pro Simču · Pod stejným zimním nebem ✦',
      ariaCountdown: 'Odpočet do shledání',
      ariaPrev: 'Předchozí fotka',
      ariaNext: 'Další fotka',
      ariaPause: 'Pozastavit prezentaci',
      ariaPlay: 'Spustit prezentaci',
      ariaMute: 'Ztlumit video',
      ariaUnmute: 'Zapnout zvuk videa',
      ariaFullscreen: 'Otevřít na celou obrazovku',
      ariaCloseLightbox: 'Zavřít náhled',
      categories: [
        { id: 'all', label: 'Vše' },
        { id: 'simca', label: 'Simča' },
        { id: 'us', label: 'Simča & Mišák' },
        { id: 'dogs', label: 'Ria & Texas' },
        { id: 'horses', label: 'Bony E & Gorny' },
      ],
      defaultCaptions: {
        simca: 'Simča',
        us: 'Simča & Mišák',
        dogs: 'Simča s Riou a Texasem',
        horses: 'Bony E & Gorny',
      },
      celebration: {
        badge: 'Štědrý den · Konečně spolu',
        heading: 'Vítejte doma, Simčo, Rio a Texasi!',
        message: 'Čekání je u konce. Mišák, Mamka & Tatka, Bony E a Gorny už se vás nemohli dočkat. Krásné Vánoce!',
      },
      inOulu: [
        {
          name: 'Simča',
          role: 'Erasmus v Oulu 🇫🇮',
          note: 'Sbírá nezapomenutelné severské zážitky — a brzy už míří domů na Vánoce.',
          accent: 'aurora-teal',
          icon: 'star',
        },
        {
          name: 'Ria',
          role: 'ČSV × Australský ovčák · V Oulu',
          note: 'Prozkoumává zasněžené arktické stezky věrně po Simčině boku.',
          accent: 'aurora-green',
          icon: 'paw',
        },
        {
          name: 'Texas',
          role: 'Německý ovčák · V Oulu',
          note: 'Oddaně hlídá Simču pod finskou polární září.',
          accent: 'aurora-violet',
          icon: 'paw',
        },
      ],
      waitingAtHome: [
        {
          name: 'Mišák',
          role: 'Čeká doma',
          note: 'Odpočítává každou vteřinu — teplý čaj, vánoční světýlka a to největší objetí už čekají.',
          accent: 'aurora-rose',
          icon: 'heart',
        },
        {
          name: 'Mamka & Tatka',
          role: 'Rodiče · Doma',
          note: 'Chystají útulné Vánoce a těší se na návrat Simči, Rii i Texase.',
          accent: 'aurora-gold',
          icon: 'home',
        },
        {
          name: 'Bony E',
          role: 'Klisna · Stáj',
          note: 'Uši nastražené k bráně — už se nemůže dočkat, až bude Simča zase u ní.',
          accent: 'aurora-violet',
          icon: 'horse',
        },
        {
          name: 'Gorny',
          role: 'Valach · Stáj',
          note: 'Čeká na známé kroky, pamlsky a společné zimní vyjížďky.',
          accent: 'aurora-teal',
          icon: 'horse',
        },
      ],
    },

    en: {
      pageTitle: 'Until We Meet Again — Simča’s Christmas Countdown',
      routeOrigin: 'Oulu, Finland 🇫🇮',
      routeHome: 'Home for Christmas 🎄',
      auroraOn: 'Aurora On',
      auroraPaused: 'Aurora Paused',
      eyebrow: 'Erasmus 2026 · Oulu → Home',
      title: 'Until We Meet Again',
      subtitle: 'Counting every moment until Simča, Ria & Texas come home from Oulu for Christmas.',
      clockOulu: 'Oulu',
      clockHome: 'Home',
      progressKicker: 'Erasmus Journey Progress',
      progressCompleteLabel: 'complete',
      progressStartEndpoint: 'Aug 18 · Oulu 🇫🇮',
      progressEndEndpoint: 'Dec 24, 12:00 · Home 🎄',
      progressFinished: 'Every single mile between Oulu and home is behind you.',
      progressBeforeStart: 'The Oulu adventure is about to begin.',
      progressLastDay: 'Just one final sleep until Christmas Eve together!',
      progressSummary: (daysDone, daysLeft, doneWord, leftWord) =>
        `${daysDone} ${doneWord} completed — only ${daysLeft} ${leftWord} left until you’re back home.`,
      daysStat: (daysDone, daysLeft, doneWord, leftWord) =>
        `${daysDone} ${doneWord} done · ${daysLeft} to go`,
      daysTotalDone: (totalDays, word) => `${totalDays} / ${totalDays} ${word} complete`,
      daysTotal: (totalDays, word) => `${totalDays} ${word} total`,
      galleryKicker: 'Memories & The Pack',
      galleryTitle: 'Holding onto our favorite moments',
      videoTag: 'Video',
      ouluKicker: 'Currently in Oulu, Finland 🇫🇮',
      ouluTitle: 'The northern adventure team',
      homeKicker: 'Waiting at Home 🎄',
      homeTitle: 'Everyone missing you back home',
      footer: 'Made with love by Mišák for Simča · Under the same winter sky ✦',
      ariaCountdown: 'Countdown until reunion',
      ariaPrev: 'Previous photo',
      ariaNext: 'Next photo',
      ariaPause: 'Pause slideshow',
      ariaPlay: 'Play slideshow',
      ariaMute: 'Mute video',
      ariaUnmute: 'Unmute video',
      ariaFullscreen: 'Open media in full screen',
      ariaCloseLightbox: 'Close photo viewer',
      categories: [
        { id: 'all', label: 'All Moments' },
        { id: 'simca', label: 'Simča' },
        { id: 'us', label: 'Simča & Mišák' },
        { id: 'dogs', label: 'Ria & Texas' },
        { id: 'horses', label: 'Bony E & Gorny' },
      ],
      defaultCaptions: {
        simca: 'Simča',
        us: 'Simča & Mišák',
        dogs: 'Simča with Ria & Texas',
        horses: 'Bony E & Gorny',
      },
      celebration: {
        badge: 'Christmas Eve · Finally Together',
        heading: 'Welcome Home, Simča, Ria & Texas!',
        message: 'The wait is over. Mišák, Mamka & Tatka, Bony E, and Gorny have missed you more than words can say. Merry Christmas!',
      },
      inOulu: [
        {
          name: 'Simča',
          role: 'Erasmus in Oulu 🇫🇮',
          note: 'Making unforgettable northern memories — soon heading home for Christmas.',
          accent: 'aurora-teal',
          icon: 'star',
        },
        {
          name: 'Ria',
          role: 'ČSV × Australian Shepherd · In Oulu',
          note: 'Exploring Arctic snowy trails right by Simča’s side.',
          accent: 'aurora-green',
          icon: 'paw',
        },
        {
          name: 'Texas',
          role: 'German Shepherd · In Oulu',
          note: 'Faithfully watching over Simča under the Finnish northern lights.',
          accent: 'aurora-violet',
          icon: 'paw',
        },
      ],
      waitingAtHome: [
        {
          name: 'Mišák',
          role: 'Waiting at home',
          note: 'Counting every single second — warm tea, Christmas lights, and the biggest hug ready.',
          accent: 'aurora-rose',
          icon: 'heart',
        },
        {
          name: 'Mamka & Tatka',
          role: 'Parents · Home',
          note: 'Getting Christmas cozy and ready to welcome Simča, Ria & Texas back home.',
          accent: 'aurora-gold',
          icon: 'home',
        },
        {
          name: 'Bony E',
          role: 'Mare · Stable',
          note: 'Ears perked toward the gate, counting the days until Simča is back.',
          accent: 'aurora-violet',
          icon: 'horse',
        },
        {
          name: 'Gorny',
          role: 'Gelding · Stable',
          note: 'Waiting for familiar footsteps, treats, and winter rides together again.',
          accent: 'aurora-teal',
          icon: 'horse',
        },
      ],
    },
  },

  // Optional custom captions by filename (string or { cs: '...', en: '...' })
  photoCaptions: {
    // 'IMG_4174.jpg': { cs: 'Procházka s Riou a Texasem', en: 'Walk with Ria & Texas' },
  },
};
