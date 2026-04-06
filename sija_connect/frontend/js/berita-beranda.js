// SLIDER BERITA 
(function () {
  const track      = document.getElementById('sliderTrack');
  const dotsWrap   = document.getElementById('dots');
  const cards      = track.querySelectorAll('.news-card');
  const totalCards = cards.length;
  const GAP        = 20; 

   function visibleCount() {
    return window.innerWidth <= 560 ? 1 : window.innerWidth <= 900 ? 2 : 3;
  }

  let currentIndex = 0;
  let maxIndex     = totalCards - visibleCount();
  let autoTimer    = null;

  function buildDots() {
    dotsWrap.innerHTML = '';
    const count = totalCards - visibleCount() + 1;
    for (let i = 0; i < count; i++) {
      const d       = document.createElement('button');
      d.className   = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      d.onclick     = () => goTo(i);
      dotsWrap.appendChild(d);
    }
  }

  // Hitung lebar satu kartu 
  function cardWidth() {
    const visible  = visibleCount();
    const viewport = track.parentElement.offsetWidth; 
    return (viewport - GAP * (visible - 1)) / visible;
  }

  // Update posisi track & highlight dot aktif
  function update() {
    const offset = currentIndex * (cardWidth() + GAP);
    track.style.transform = `translateX(-${offset}px)`;

    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });
  }

  // Navigasi ke index tertentu 
  function goTo(i) {
    currentIndex = Math.max(0, Math.min(i, maxIndex));
    update();
    resetAuto();
  }

  function prev() { goTo(currentIndex - 1); }
  function next() { goTo(currentIndex + 1); }

  // maju otomatis setiap 4 detik 
  function startAuto() {
    autoTimer = setInterval(() => {
      currentIndex >= maxIndex ? goTo(0) : next();
    }, 4000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  // tombol panah 
  document.querySelector('.arrow-btn.prev').onclick = prev;
  document.querySelector('.arrow-btn.next').onclick = next;

  // resize layar → hitung ulang 
  window.addEventListener('resize', () => {
    maxIndex = totalCards - visibleCount();
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    buildDots();
    update();
  });

  buildDots();
  update();
  startAuto();
})();