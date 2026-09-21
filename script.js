
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const navWrap = document.querySelector('.nav-wrap');
const progressBar = document.querySelector('.scroll-progress');

menuBtn?.addEventListener('click', () => navLinks?.classList.toggle('open'));

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks?.classList.remove('open'));
});

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .section-top').forEach(el => observer.observe(el));

// Scroll progress + navbar state
function onScroll() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
  if (progressBar) progressBar.style.width = `${pct}%`;
  navWrap?.classList.toggle('scrolled', window.scrollY > 24);
}
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

// Typewriter
const typingEl = document.getElementById('roleTyping');
const phrases = [
  'data products',
  'AI-assisted tools',
  'analytics dashboards',
  'SQL workflows',
  'useful data systems'
];
let phraseIndex = 0, charIndex = 0, deleting = false;

function typeLoop(){
  if (!typingEl) return;
  const target = phrases[phraseIndex];

  if (!deleting) {
    charIndex++;
    typingEl.textContent = target.slice(0, charIndex);
    if (charIndex === target.length) {
      deleting = true;
      setTimeout(typeLoop, 1250);
      return;
    }
  } else {
    charIndex--;
    typingEl.textContent = target.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 38 : 74);
}
setTimeout(typeLoop, 500);

// Cursor glow
const glow = document.querySelector('.cursor-glow');
const dot = document.querySelector('.cursor-dot');
let tx = innerWidth/2, ty = innerHeight/2, gx = tx, gy = ty;

window.addEventListener('pointermove', e => {
  tx = e.clientX; ty = e.clientY;
  if (dot) {
    dot.style.left = `${tx}px`;
    dot.style.top = `${ty}px`;
  }
}, { passive:true });

function animateCursor(){
  gx += (tx - gx) * .12;
  gy += (ty - gy) * .12;
  if (glow) {
    glow.style.left = `${gx}px`;
    glow.style.top = `${gy}px`;
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a,button,.tilt-card,.image-hover').forEach(el => {
  el.addEventListener('pointerenter', () => {
    if (dot) { dot.style.width='12px'; dot.style.height='12px'; }
  });
  el.addEventListener('pointerleave', () => {
    if (dot) { dot.style.width='7px'; dot.style.height='7px'; }
  });
});

// 3D tilt cards
if (window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y / r.height) - .5) * -7;
      const ry = ((x / r.width) - .5) * 9;
      card.style.setProperty('--card-x', `${(x/r.width)*100}%`);
      card.style.setProperty('--card-y', `${(y/r.height)*100}%`);
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

// Hero screenshot parallax
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && window.matchMedia('(pointer:fine)').matches) {
  heroVisual.addEventListener('pointermove', e => {
    const r = heroVisual.getBoundingClientRect();
    const dx = ((e.clientX-r.left)/r.width - .5);
    const dy = ((e.clientY-r.top)/r.height - .5);
    heroVisual.querySelectorAll('.floating-card').forEach((el, i) => {
      const strength = (i + 1) * 8;
      el.style.translate = `${dx * strength}px ${dy * strength}px`;
    });
  });
  heroVisual.addEventListener('pointerleave', () => {
    heroVisual.querySelectorAll('.floating-card').forEach(el => el.style.translate = '');
  });
}

// Animated counters
function animateNumber(el, target, decimals=0, duration=1100) {
  const start = performance.now();
  const step = now => {
    const p = Math.min((now-start)/duration,1);
    const eased = 1 - Math.pow(1-p,3);
    const value = target * eased;
    el.textContent = decimals ? value.toFixed(decimals) : Math.round(value);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const raw = el.textContent.trim();
    if (raw === '4+') {
      animateNumber(el,4,0);
      setTimeout(()=>el.textContent='4+',1150);
    } else if (raw === '8.65') {
      animateNumber(el,8.65,2);
    } else if (raw === '129') {
      animateNumber(el,129,0);
    }
    statObserver.unobserve(el);
  });
},{threshold:.5});
document.querySelectorAll('.micro-stats strong').forEach(el => statObserver.observe(el));

// Particle network background
const canvas = document.getElementById('particle-canvas');
const ctx = canvas?.getContext('2d');
let particles = [];
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas(){
  if (!canvas || !ctx) return;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);

  const count = Math.min(80, Math.max(32, Math.floor(innerWidth / 22)));
  particles = Array.from({length:count}, () => ({
    x:Math.random()*innerWidth,
    y:Math.random()*innerHeight,
    vx:(Math.random()-.5)*.20,
    vy:(Math.random()-.5)*.20,
    r:Math.random()*1.4+.45
  }));
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function particleFrame(){
  if (!ctx || !canvas) return;
  ctx.clearRect(0,0,innerWidth,innerHeight);

  for (let i=0;i<particles.length;i++){
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    if (p.x < -20) p.x = innerWidth+20;
    if (p.x > innerWidth+20) p.x = -20;
    if (p.y < -20) p.y = innerHeight+20;
    if (p.y > innerHeight+20) p.y = -20;

    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle='rgba(130,190,255,.36)';
    ctx.fill();

    for(let j=i+1;j<particles.length;j++){
      const q=particles[j];
      const dx=p.x-q.x, dy=p.y-q.y;
      const dist=Math.hypot(dx,dy);
      if(dist<115){
        ctx.beginPath();
        ctx.moveTo(p.x,p.y);
        ctx.lineTo(q.x,q.y);
        ctx.strokeStyle=`rgba(108,242,205,${(1-dist/115)*.10})`;
        ctx.lineWidth=.6;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(particleFrame);
}
if (!window.matchMedia('(prefers-reduced-motion:reduce)').matches) particleFrame();
