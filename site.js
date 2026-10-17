(() => {
  const hero = document.querySelector('.page--hero');
  if (hero) {
    const phs = [...hero.querySelectorAll('.fv__ph')];
    const bgs = [...hero.querySelectorAll('.fv__bgimg')];
    const days = [...hero.querySelectorAll('.cal__d')];
    const STAMPS = [2, 5, 8, 10, 13, 16, 19];
    let started = false, now = 0, stampAt = 0;
    const stamp = () => {
      if (stampAt >= STAMPS.length) { days.forEach((d) => d.classList.remove('is-stamp')); stampAt = 0; }
      const d = days[STAMPS[stampAt++]];
      if (d) d.classList.add('is-stamp');
    };
    const next = () => {
      const prev = now;
      now = (now + 1) % phs.length;
      phs[prev].classList.remove('is-now');
      phs[prev].classList.add('is-out');
      phs[now].classList.remove('is-out');
      phs[now].classList.add('is-now');
      setTimeout(() => phs[prev].classList.remove('is-out'), 750);
      bgs.forEach((g, i) => g.classList.toggle('is-now', i === now));
      stamp();
    };
    const start = () => {
      if (started) return;
      started = true;
      hero.classList.add('is-ready');
      setTimeout(stamp, 1300);
      if (phs.length > 1) setInterval(() => { if (!document.hidden) next(); }, 2800);
    };
    const first = phs[0];
    if (first && first.decode) first.decode().then(start, start); else start();
    setTimeout(start, 1200);
  }

  const track = document.querySelector('.reel__track');
  if (track) {
    const n = track.children.length;
    [...track.children].forEach((img) => track.appendChild(img.cloneNode(true)));
    const PXS = 30;
    const measure = () => {
      const dist = track.children[n].offsetLeft - track.children[0].offsetLeft;
      track.style.setProperty('--reel-dist', `${dist}px`);
      track.style.setProperty('--reel-speed', `${dist / PXS}s`);
      track.classList.add('is-run');
    };
    Promise.all([...track.querySelectorAll('img')].map((i) => (i.decode ? i.decode().catch(() => {}) : null))).then(measure);
    let rt = null;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(measure, 200); });
  }

  const voices = document.getElementById('voices');
  if (voices) {
    const cards = [...voices.children];
    const dots = [...document.querySelectorAll('.dots__d')];
    const nowIndex = () => {
      const mid = voices.scrollLeft + voices.clientWidth / 2;
      let best = 0, bestD = Infinity;
      cards.forEach((c, i) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bestD) { bestD = d; best = i; } });
      return best;
    };
    const sync = () => { const i = nowIndex(); dots.forEach((d, k) => d.classList.toggle('is-now', k === i)); };
    let ticking = false;
    voices.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; sync(); });
    }, { passive: true });
    document.querySelectorAll('.voices__nav .arrow').forEach((b) => b.addEventListener('click', () => {
      const i = Math.max(0, Math.min(cards.length - 1, nowIndex() + Number(b.dataset.dir)));
      voices.scrollTo({ left: cards[i].offsetLeft - (voices.clientWidth - cards[i].offsetWidth) / 2, behavior: 'smooth' });
    }));
  }
})();
