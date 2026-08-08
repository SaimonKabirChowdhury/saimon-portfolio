const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => { const target = document.querySelector(link.getAttribute('href')); if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }));

document.querySelectorAll('[data-tilt]').forEach((card) => {
  card.addEventListener('pointermove', (event) => { const box = card.getBoundingClientRect(); const x = (event.clientX - box.left) / box.width - .5; const y = (event.clientY - box.top) / box.height - .5; card.style.transform = `rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateZ(5px)`; });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

const canvas = document.querySelector('#magic-field'); const ctx = canvas.getContext('2d'); let particles = [];
function resize(){ canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); particles = Array.from({length: Math.min(88, Math.floor(innerWidth / 16))}, () => ({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.6+.3,v:Math.random()*.28+.06,a:Math.random()*.42+.08,c:Math.random()>.76?'255,106,36':'223,255,49'})); }
function draw(){ ctx.clearRect(0,0,innerWidth,innerHeight); particles.forEach(p=>{p.y-=p.v;p.x+=Math.sin(p.y*.01)*.12;if(p.y<-8){p.y=innerHeight+8;p.x=Math.random()*innerWidth;}ctx.beginPath();ctx.fillStyle=`rgba(${p.c},${p.a})`;ctx.shadowBlur=12;ctx.shadowColor=`rgb(${p.c})`;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();});ctx.shadowBlur=0;requestAnimationFrame(draw); }
resize(); draw(); addEventListener('resize',resize);
