const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) entry.target.classList.add('is-visible');
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
  const href = link.getAttribute('href');
  if (!href || href === '#') return;
  const target = document.querySelector(href);
  if (target) {
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}));

/* Keep native vertical scrolling completely in charge on touch devices. */
const isTouchDevice = navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Tilt remains desktop-only so pointer movement never competes with swipe scrolling. */
const canTilt = !isTouchDevice && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (canTilt) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      card.style.transform = `rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateZ(5px)`;
    }, { passive: true });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; }, { passive: true });
  });
}

const canvas = document.querySelector('#magic-field');
const ctx = canvas?.getContext('2d');
let particles = [];
let lastFrame = 0;
const animateField = !!ctx && !isTouchDevice && !prefersReducedMotion;

function resize(){
  if (!canvas || !ctx || !animateField) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  particles = Array.from({length: Math.min(52, Math.floor(innerWidth / 22))}, () => ({
    x:Math.random()*innerWidth,
    y:Math.random()*innerHeight,
    r:Math.random()*1.35+.25,
    v:Math.random()*.23+.05,
    a:Math.random()*.36+.07,
    c:Math.random()>.78?'255,121,80':'117,216,255'
  }));
}

function draw(time = 0){
  if (!ctx || !animateField) return;
  requestAnimationFrame(draw);
  if (time - lastFrame < 33) return; // ~30fps is plenty for the ambient field.
  lastFrame = time;
  ctx.clearRect(0,0,innerWidth,innerHeight);
  particles.forEach(p=>{
    p.y-=p.v;
    p.x+=Math.sin(p.y*.01)*.08;
    if(p.y<-8){p.y=innerHeight+8;p.x=Math.random()*innerWidth;}
    ctx.beginPath();
    ctx.fillStyle=`rgba(${p.c},${p.a})`;
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
  });
}

if (canvas) {
  if (animateField) {
    resize();
    requestAnimationFrame(draw);
    addEventListener('resize', resize, { passive: true });
  } else {
    canvas.style.display = 'none';
  }
}
