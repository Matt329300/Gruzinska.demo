(() => {
  const root = document.documentElement;
  const body = document.body;

  // Teksty zależne od języka strony (<html lang="pl"> / <html lang="en">)
  const EN = root.lang === "en";
  const T = EN ? {
    menuOpen: "Open menu", menuClose: "Close menu",
    persons: (p) => `${p} guests`,
    noHours: "No times left today",
    mapTitle: "Map to Gaga restaurant, Al. Ujazdowskie 6A"
  } : {
    menuOpen: "Otwórz menu", menuClose: "Zamknij menu",
    persons: (p) => `${p} ${p < 5 ? "osoby" : "osób"}`,
    noHours: "Brak godzin dziś",
    mapTitle: "Mapa dojazdu do restauracji Gaga, Al. Ujazdowskie 6A"
  };

  // Wejście animacji hero
  requestAnimationFrame(() => body.classList.add('is-loaded'));

  // Pojawianie się elementów przy przewijaniu
  const fades = document.querySelectorAll(".fade-up");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    fades.forEach(el => io.observe(el));
  } else {
    fades.forEach(el => el.classList.add("is-in"));
  }

  // Header po przewinięciu
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobilne
  const burger = document.getElementById('burger');
  const nav = document.getElementById('mainNav');
  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? T.menuClose : T.menuOpen);
  };
  burger.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Formularz rezerwacji -> MojStolik.pl z wypełnionymi polami
  const form = document.getElementById('bookingForm');
  if (form) {
    const dateEl = form.querySelector('#bDate');
    const personsEl = form.querySelector('#bPersons');
    const hourEl = form.querySelector('#bHour');
    const pad = (n) => String(n).padStart(2, '0');
    const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    for (let p = 2; p <= 30; p++) {
      personsEl.add(new Option(T.persons(p), p, p === 2, p === 2));
    }

    const OPEN = 11 * 60, LAST = 21 * 60 + 30; // ostatni termin w MojStolik.pl: 21:30
    const fillHours = () => {
      const prev = hourEl.value || '19:00';
      const now = new Date();
      const isToday = dateEl.value === ymd(now);
      const minNow = now.getHours() * 60 + now.getMinutes() + 30;
      hourEl.innerHTML = '';
      for (let m = OPEN; m <= LAST; m += 30) {
        if (isToday && m < minNow) continue;
        const v = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
        hourEl.add(new Option(v, v));
      }
      if (!hourEl.options.length) hourEl.add(new Option(T.noHours, '', true, true));
      hourEl.value = [...hourEl.options].some(o => o.value === prev) ? prev : hourEl.options[0].value;
    };

    const today = new Date();
    // po 21:30 domyślnie jutro
    if (today.getHours() * 60 + today.getMinutes() > LAST - 30) today.setDate(today.getDate() + 1);
    dateEl.min = ymd(new Date());
    dateEl.value = ymd(today);
    fillHours();
    dateEl.addEventListener('change', fillHours);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = new URL(form.action);
      const date = dateEl.value, hour = hourEl.value;
      url.searchParams.set('date', date);
      if (hour) {
        url.searchParams.set('hour', hour);
        url.searchParams.set('selectedHour', `${date}T${hour}`);
      }
      url.searchParams.set('persons', personsEl.value);
      url.searchParams.set('location', 'Warszawa');
      window.open(url.toString(), '_blank', 'noopener');
    });
  }

  // Mapa Google ładowana dopiero po kliknięciu (prywatność)
  const loadMap = document.getElementById('loadMap');
  if (loadMap) {
    loadMap.addEventListener('click', () => {
      const card = document.getElementById('mapCard');
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=Gaga+restauracja+gruzinska,+Al.+Ujazdowskie+6A,+00-461+Warszawa&z=16&output=embed' + (EN ? '&hl=en' : '&hl=pl');
      iframe.title = T.mapTitle;
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      card.appendChild(iframe);
      document.getElementById('mapPlaceholder').remove();
    });
  }

  // Rok w stopce
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Slideshow hero
  const slides = [...document.querySelectorAll('.hero .slide')];
  const DURATION = 6500;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0, timer;

  const go = (n) => {
    slides[i].classList.remove('is-active');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('is-active');
  };
  const start = () => { if (!reduce) timer = setInterval(() => go(i + 1), DURATION); };
  const restart = () => { clearInterval(timer); start(); };

  document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(timer) : restart());
  start();
})();
