(() => {
  const hero = document.querySelector('.page--hero');
  const kvImg = hero && hero.querySelector('img');
  if (hero) {
    let started = false;
    const start = () => { if (!started) { started = true; hero.classList.add('is-ready'); } };
    if (kvImg && kvImg.decode) kvImg.decode().then(start, start); else start();
    setTimeout(start, 1200);
  }

  const track = document.getElementById('voices');
  if (track) {
    const cards = [...track.children];
    const dots = [...document.querySelectorAll('.dots__d')];
    const nowIndex = () => {
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0, bestD = Infinity;
      cards.forEach((c, i) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bestD) { bestD = d; best = i; } });
      return best;
    };
    const sync = () => { const i = nowIndex(); dots.forEach((d, k) => d.classList.toggle('is-now', k === i)); };
    let ticking = false;
    track.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; sync(); });
    }, { passive: true });
    document.querySelectorAll('.voices__nav .arrow').forEach((b) => b.addEventListener('click', () => {
      const i = Math.max(0, Math.min(cards.length - 1, nowIndex() + Number(b.dataset.dir)));
      track.scrollTo({ left: cards[i].offsetLeft - (track.clientWidth - cards[i].offsetWidth) / 2, behavior: 'smooth' });
    }));
  }
})();
