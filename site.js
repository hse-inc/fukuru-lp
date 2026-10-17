(() => {
  const hero = document.querySelector('.page--hero');
  if (hero) {
    const phs = [...hero.querySelectorAll('.fv__ph')];
    let started = false, now = 0;
    const next = () => {
      const prev = now;
      now = (now + 1) % phs.length;
      phs[now].classList.add('is-in');
      setTimeout(() => {
        phs[prev].classList.remove('is-now');
        phs[now].classList.remove('is-in');
        phs[now].classList.add('is-now');
      }, 950);
    };
    const start = () => {
      if (started) return;
      started = true;
      hero.classList.add('is-ready');
      if (phs.length > 1) setInterval(() => { if (!document.hidden) next(); }, 3200);
    };
    const first = phs[0];
    if (first && first.decode) first.decode().then(start, start); else start();
    setTimeout(start, 1200);
  }

  document.querySelectorAll('.reel__track').forEach((track) => {
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
  });

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
    let hold = 0, autoAt = 0;
    const go = (i) => {
      autoAt = Date.now();
      voices.scrollTo({ left: cards[i].offsetLeft - (voices.clientWidth - cards[i].offsetWidth) / 2, behavior: 'smooth' });
    };
    voices.addEventListener('scroll', () => { if (Date.now() - autoAt > 1200) hold = Date.now(); }, { passive: true });
    setInterval(() => {
      if (document.hidden || Date.now() - hold < 8000) return;
      const r = voices.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      go((nowIndex() + 1) % cards.length);
    }, 3500);
    document.querySelectorAll('.voices__nav .arrow').forEach((b) => b.addEventListener('click', () => {
      hold = Date.now();
      const i = (nowIndex() + Number(b.dataset.dir) + cards.length) % cards.length;
      voices.scrollTo({ left: cards[i].offsetLeft - (voices.clientWidth - cards[i].offsetWidth) / 2, behavior: 'smooth' });
    }));
  }
})();
