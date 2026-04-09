/* ═══════ LOADER ═══════ */
const loader = document.getElementById('loader');
const loaderNum = document.getElementById('loaderNum');
const loaderBar = document.getElementById('loaderBar');
let loadCount = 0;

function runLoader() {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      loadCount += Math.floor(Math.random() * 4) + 1;
      if (loadCount > 100) loadCount = 100;
      loaderNum.textContent = loadCount;
      loaderBar.style.width = loadCount + '%';
      if (loadCount >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('exit');
          setTimeout(resolve, 1400);
        }, 500);
      }
    }, 30);
  });
}

/* ═══════ HERO TEXT ═══════ */
function buildHeroText() {
  const labelEl = document.getElementById('heroLabel');
  const labelText = 'Senior Designer & Developer — Apple';
  labelEl.innerHTML = labelText.split('').map(c => c === ' ' ? ' ' : `<span class="char">${c}</span>`).join('');

  document.getElementById('heroName').innerHTML = `
    <div class="hero-line-row"><span class="word"><span class="word-inner">Votre</span></span></div>
    <div class="hero-line-row"><span class="word"><span class="word-inner red">Nom</span></span> <span class="word"><span class="word-inner">Ici</span></span></div>
  `;

  document.getElementById('heroSub').innerHTML = `
    <span class="word"><span class="word-inner">Design</span></span>
    <span class="line-accent"></span>
    <span class="word"><span class="word-inner">Développement</span></span>
    <span class="line-accent"></span>
    <span class="word"><span class="word-inner">創造</span></span>
  `;
}

function animateHero() {
  document.querySelectorAll('.hero-label .char').forEach((c, i) => {
    setTimeout(() => {
      c.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s';
      c.style.transform = 'translateY(0)';
      c.style.opacity = '1';
    }, 80 + i * 18);
  });
  document.querySelectorAll('.hero-name .word-inner').forEach((w, i) => {
    setTimeout(() => {
      w.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
      w.style.transform = 'translateY(0)';
    }, 500 + i * 120);
  });
  document.querySelectorAll('.hero-sub .word-inner').forEach((w, i) => {
    setTimeout(() => {
      w.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      w.style.transform = 'translateY(0)';
    }, 1200 + i * 100);
  });
  setTimeout(() => {
    document.querySelectorAll('.line-accent').forEach(l => l.classList.add('animate'));
  }, 1600);
}

/* ═══════ SAKURA ═══════ */
class SakuraEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.petals = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  spawn() {
    this.petals.push({
      x: Math.random() * this.canvas.width * 0.6 + this.canvas.width * 0.4,
      y: -15,
      size: 6 + Math.random() * 8,
      speedX: -(0.4 + Math.random() * 0.8),
      speedY: 0.6 + Math.random() * 1.0,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2,
      wobbleFreq: 0.008 + Math.random() * 0.015,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.5 + Math.random() * 0.3,
      life: 0,
    });
  }
  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = this.petals.length - 1; i >= 0; i--) {
      const p = this.petals[i];
      p.life++;
      p.x += p.speedX + Math.sin(p.life * p.wobbleFreq + p.phase) * 0.8;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;
      const fadeIn = Math.min(p.life / 30, 1);
      const fadeOut = p.y > this.canvas.height - 100 ? (this.canvas.height - p.y) / 100 : 1;
      const alpha = p.opacity * fadeIn * Math.max(0, fadeOut);
      if (p.y > this.canvas.height + 20 || p.x < -50) { this.petals.splice(i, 1); continue; }
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation * Math.PI / 180);
      this.ctx.globalAlpha = alpha;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.bezierCurveTo(p.size * 0.4, -p.size * 0.6, p.size, -p.size * 0.3, p.size * 0.5, p.size * 0.2);
      this.ctx.bezierCurveTo(p.size * 0.2, p.size * 0.5, -p.size * 0.1, p.size * 0.3, 0, 0);
      this.ctx.fillStyle = `rgba(254, 220, 225, 1)`;
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(p.size * 0.25, -p.size * 0.1, p.size * 0.15, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(240, 160, 176, 0.3)`;
      this.ctx.fill();
      this.ctx.restore();
    }
    requestAnimationFrame(() => this.update());
  }
  start() {
    this.update();
    setInterval(() => this.spawn(), 700);
    for (let i = 0; i < 6; i++) setTimeout(() => this.spawn(), i * 200);
  }
}

/* ═══════════════════════════════════════════════════
   ████ BOOK ENGINE — self-contained, no page scroll
   ═══════════════════════════════════════════════════ */
class BookEngine {
  constructor() {
    this.pages = Array.from(document.querySelectorAll('.book-page'));
    this.numPages = this.pages.length;

    // Virtual progress (0 to numPages-1). No actual page scrolling involved.
    this.progress = 0;
    this.target = 0;
    this.ease = 0.08;
    this.sensitivity = 0.0022;
    this.lastActiveIndex = -1;
    this.snapTimer = null;

    // UI refs
    this.indicator = document.getElementById('pageIndicator');
    this.progressBar = document.getElementById('bookProgress');
    this.heroScroll = document.getElementById('heroScroll');
    this.piCurrent = document.getElementById('piCurrent');
    this.piLabel = document.getElementById('piLabel');
    this.piJp = document.getElementById('piJp');
    this.bpFill = document.getElementById('bpFill');

    // Z-index: earlier pages on top (covering the later ones)
    this.pages.forEach((p, i) => {
      p.style.zIndex = String(this.numPages - i);
    });

    // Total indicator
    const piTotal = document.querySelector('.page-indicator .pi-total');
    if (piTotal) piTotal.textContent = String(this.numPages - 1).padStart(2, '0');
  }

  init() {
    // Wheel
    window.addEventListener('wheel', e => {
      e.preventDefault();
      this.target += e.deltaY * this.sensitivity;
      this.clamp();
      this.scheduleSnap();
    }, { passive: false });

    // Touch
    let touchY = 0;
    window.addEventListener('touchstart', e => {
      touchY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchmove', e => {
      const delta = touchY - e.touches[0].clientY;
      touchY = e.touches[0].clientY;
      this.target += delta * this.sensitivity * 2.5;
      this.clamp();
    }, { passive: true });
    window.addEventListener('touchend', () => {
      this.target = Math.round(this.target);
      this.clamp();
    }, { passive: true });

    // Keyboard
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        this.target = Math.min(this.numPages - 1, Math.floor(this.target + 0.5) + 1);
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        this.target = Math.max(0, Math.ceil(this.target - 0.5) - 1);
      }
    });

    // Initial active page
    this.pages[0].classList.add('active');
    this.tick();
  }

  clamp() {
    this.target = Math.max(0, Math.min(this.numPages - 1, this.target));
  }

  scheduleSnap() {
    clearTimeout(this.snapTimer);
    this.snapTimer = setTimeout(() => {
      this.target = Math.round(this.target);
      this.clamp();
    }, 180);
  }

  tick() {
    // Lerp
    const diff = this.target - this.progress;
    if (Math.abs(diff) > 0.0003) {
      this.progress += diff * this.ease;
    } else {
      this.progress = this.target;
    }
    this.update();
    requestAnimationFrame(() => this.tick());
  }

  update() {
    const pageProgress = this.progress;
    const clampedProgress = pageProgress / (this.numPages - 1);

    if (this.bpFill) this.bpFill.style.width = (clampedProgress * 100) + '%';

    for (let i = 0; i < this.numPages; i++) {
      const page = this.pages[i];
      let localProgress = pageProgress - i;
      localProgress = Math.max(0, Math.min(1, localProgress));

      const eased = this.easeInOutCubic(localProgress);
      const rotation = -180 * eased;

      // Opacity fade near the edge-on angle
      const absRot = Math.abs(rotation);
      let opacity = 1;
      if (absRot >= 95) opacity = 0;
      else if (absRot >= 85) opacity = 1 - (absRot - 85) / 10;

      page.style.transform = `rotateY(${rotation}deg)`;
      page.style.opacity = opacity;

      if (opacity < 0.1) page.style.pointerEvents = 'none';
      else page.style.pointerEvents = '';
    }

    // Determine topmost visible page
    let topPageIndex = 0;
    for (let i = 0; i < this.numPages; i++) {
      const localProgress = pageProgress - i;
      if (localProgress < 0.5) {
        topPageIndex = i;
        break;
      }
      topPageIndex = i + 1;
    }
    if (topPageIndex >= this.numPages) topPageIndex = this.numPages - 1;

    // Toggle active class
    this.pages.forEach((p, i) => {
      if (i === topPageIndex) p.classList.add('active');
      else p.classList.remove('active');
    });

    // Toggle indicator visibility
    if (topPageIndex === 0) {
      this.heroScroll.classList.add('show');
      this.indicator.classList.remove('show');
      this.progressBar.classList.remove('show');
    } else {
      this.heroScroll.classList.remove('show');
      this.indicator.classList.add('show');
      this.progressBar.classList.add('show');
    }

    // Update text
    if (topPageIndex !== this.lastActiveIndex) {
      const activePage = this.pages[topPageIndex];
      this.piCurrent.textContent = String(topPageIndex).padStart(2, '0');
      this.piLabel.textContent = activePage.dataset.label || '';
      this.piJp.textContent = activePage.dataset.jp || '';
      this.lastActiveIndex = topPageIndex;
    }
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  goToPage(pageIndex) {
    this.target = pageIndex;
    this.clamp();
  }
}

/* ═══════ MAGNETIC ═══════ */
function setupMagnetic() {
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = 'translate(0, 0)');
  });
}

/* ═══════ CURSOR ═══════ */
function setupCursor() {
  const cursor = document.getElementById('cursor');
  const follow = document.getElementById('cursorFollow');
  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx - 6 + 'px';
    cursor.style.top = my - 6 + 'px';
  });
  function animFollow() {
    fx += (mx - fx) * 0.09;
    fy += (my - fy) * 0.09;
    follow.style.left = fx - 24 + 'px';
    follow.style.top = fy - 24 + 'px';
    requestAnimationFrame(animFollow);
  }
  animFollow();
  document.querySelectorAll('a, .proj-card, .skill-card, .magnetic-btn').forEach(el => {
    el.addEventListener('mouseenter', () => follow.classList.add('active'));
    el.addEventListener('mouseleave', () => follow.classList.remove('active'));
  });
}

/* ═══════ NAV LINKS ═══════ */
function setupNavLinks(book) {
  document.querySelectorAll('nav a[data-page]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const pageIdx = parseInt(a.dataset.page);
      book.goToPage(pageIdx);
    });
  });
}

/* ═══════ INIT ═══════ */
async function init() {
  buildHeroText();
  await runLoader();
  document.getElementById('nav').classList.add('show');

  animateHero();

  const sakura = new SakuraEngine(document.getElementById('sakura-canvas'));
  sakura.start();

  const book = new BookEngine();
  book.init();

  setupMagnetic();
  setupCursor();
  setupNavLinks(book);
}

init();