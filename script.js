// Canvas background animation
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let w = canvas.width = innerWidth;
let h = canvas.height = innerHeight;

const blobs = [];
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

for (let i = 0; i < 6; i++) {
  blobs.push({
    x: rand(0, w),
    y: rand(0, h),
    r: rand(120, 300),
    vx: rand(-0.2, 0.2),
    vy: rand(-0.2, 0.2),
    hue: 200 + i * 8
  });
}

function draw() {
  ctx.clearRect(0, 0, w, h);

  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, 'rgba(3,11,23,0.85)');
  g.addColorStop(1, 'rgba(5,18,40,0.75)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  for (const b of blobs) {
    b.x += b.vx;
    b.y += b.vy;

    if (b.x < -b.r) b.x = w + b.r;
    if (b.x > w + b.r) b.x = -b.r;
    if (b.y < -b.r) b.y = h + b.r;
    if (b.y > h + b.r) b.y = -b.r;

    const bg = ctx.createRadialGradient(b.x, b.y, b.r * 0.1, b.x, b.y, b.r);
    bg.addColorStop(0, `hsla(${b.hue}, 80%, 60%, 0.18)`);
    bg.addColorStop(0.5, `hsla(${b.hue + 20}, 70%, 45%, 0.12)`);
    bg.addColorStop(1, `hsla(${b.hue + 40}, 60%, 10%, 0.04)`);

    ctx.beginPath();
    ctx.fillStyle = bg;
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

window.addEventListener('resize', () => {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
});

draw();

// Mode toggle
const modeToggle = document.getElementById('modeToggle');
const modeIcon = modeToggle.querySelector('i');
const savedMode = localStorage.getItem('theme');

if (savedMode === 'light') {
  document.body.classList.add('light');
  modeIcon.classList.replace('fa-moon', 'fa-sun');
}

modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  modeIcon.classList.toggle('fa-sun', isLight);
  modeIcon.classList.toggle('fa-moon', !isLight);
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Audio controls
const audio = document.getElementById('ambientAudio');
const audioToggle = document.getElementById('audioToggle');
const audioIcon = audioToggle.querySelector('i');
let isPlaying = false;

audioToggle.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    audioIcon.classList.replace('fa-pause', 'fa-play');
  } else {
    audio.play();
    audioIcon.classList.replace('fa-play', 'fa-pause');
  }
  isPlaying = !isPlaying;
});

// Scroll-triggered fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.verse-block').forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(20px)';
  observer.observe(el);
});

// Verse Audio Mode — one voice at a time
let currentUtterance = null;

document.querySelectorAll('.speak-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const quote = btn.getAttribute('data-quote');

    // Stop any current speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    // Create new utterance
    currentUtterance = new SpeechSynthesisUtterance(quote);

    // Choose a softer voice
    const voices = speechSynthesis.getVoices();
    const poeticVoice = voices.find(v =>
      v.name.includes('Google UK English Female') ||
      v.name.includes('Microsoft Zira') ||
      v.lang === 'en-GB'
    );
    if (poeticVoice) currentUtterance.voice = poeticVoice;

    currentUtterance.rate = 0.9;
    currentUtterance.pitch = 1.1;

    speechSynthesis.speak(currentUtterance);
  });
});

// Page Loading Transition — slower and smoother
window.addEventListener('load', () => {
    const overlay = document.getElementById('loadingOverlay');
    setTimeout(() => {
      overlay.style.opacity = 0;
      overlay.style.visibility = 'hidden';
    }, 3000); // stays visible for 3 seconds
  });

  const bgImages = [
    "https://i.ibb.co/hRkcvtL2/file-99.jpg",
    "https://i.ibb.co/207LYfPn/file-97.jpg",
    "https://i.ibb.co/Z6XkJGsJ/file-108.jpg",
    "https://i.ibb.co/xK0CtCb0/file-107.jpg",
    "https://i.ibb.co/0VQDG1MG/file-106.jpg",
    "https://i.ibb.co/0VydVFJX/file-98.jpg"
  ];
  
  const bgOverlay = document.querySelector('.bg-overlay');
let currentIndex = 0;

function changeBackground() {
  currentIndex = (currentIndex + 1) % bgImages.length;
  bgOverlay.style.opacity = 0;

  setTimeout(() => {
    bgOverlay.style.backgroundImage = `url('${bgImages[currentIndex]}')`;
    bgOverlay.style.opacity = 1;
  }, 600);
}

// Start rotation every 8 seconds
setInterval(changeBackground, 8000);

// Intro Dialog Box
const introModal = document.getElementById('introModal');
const beginBtn = document.getElementById('beginBtn');

beginBtn.addEventListener('click', () => {
  introModal.style.opacity = 0;
  setTimeout(() => {
    introModal.style.display = 'none';
  }, 1000);
});
