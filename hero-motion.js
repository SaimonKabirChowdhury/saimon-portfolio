(() => {
  const root = document.documentElement;
  const stage = document.getElementById('heroStage');
  const shell = document.querySelector('.hero-shell');
  const parts = [...document.querySelectorAll('.hero-part')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  function updateScroll() {
    if (!shell || reduce || window.innerWidth < 980) return;
    const rect = shell.getBoundingClientRect();
    const travel = Math.max(shell.offsetHeight - window.innerHeight, 1);
    const p = clamp(-rect.top / travel, 0, 1);
    root.style.setProperty('--hero-progress', p.toFixed(3));

    parts.forEach((part, index) => {
      const depth = Number(part.dataset.depth || 1);
      const dir = index % 2 === 0 ? 1 : -1;
      const spread = Math.sin(p * Math.PI);
      const x = dir * spread * 64 * depth;
      const y = (index - 2) * spread * 12 * depth;
      const rot = dir * spread * 3.6 * depth;
      part.style.transform = `translate3d(var(--mouse-x,0px),var(--mouse-y,0px),0) translate3d(${x}px,${y}px,0) rotate(${rot}deg)`;
    });
  }

  function updatePointer(e) {
    if (!stage || reduce || window.innerWidth < 980) return;
    const r = stage.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - .5;
    const ny = (e.clientY - r.top) / r.height - .5;
    parts.forEach(part => {
      const depth = Number(part.dataset.depth || 1);
      part.style.setProperty('--mouse-x', `${nx * 13 * depth}px`);
      part.style.setProperty('--mouse-y', `${ny * 13 * depth}px`);
    });
    updateScroll();
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll);
  stage?.addEventListener('pointermove', updatePointer, { passive: true });
  stage?.addEventListener('pointerleave', () => {
    parts.forEach(part => {
      part.style.setProperty('--mouse-x', '0px');
      part.style.setProperty('--mouse-y', '0px');
    });
    updateScroll();
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: .12 });

  document.querySelectorAll('.reveal-block').forEach(el => observer.observe(el));
  updateScroll();
})();
