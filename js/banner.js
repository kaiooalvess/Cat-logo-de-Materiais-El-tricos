(() => {
  const stage = document.getElementById('heroStage');
  const dots = document.getElementById('heroDots');
  const prev = document.getElementById('heroPrev');
  const next = document.getElementById('heroNext');
  const floating = document.getElementById('floatingProducts');
  if (!stage) return;

  const slides = [...stage.querySelectorAll('.hero-slide')];
  let current = 0;
  let timer;
  let produtos = [];

  function renderDots() {
    dots.innerHTML = slides.map((_, i) => `<button class="hero-dot${i === current ? ' ativo' : ''}" aria-label="Ir para destaque ${i + 1}"></button>`).join('');
    dots.querySelectorAll('button').forEach((b, i) => b.addEventListener('click', () => go(i, true)));
  }

  function go(index, manual = false) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.style.setProperty('--slide-index', i);
    });
    renderDots();
    if (manual) restart();
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => go(current + 1), 6500);
  }

  prev.addEventListener('click', () => go(current - 1, true));
  next.addEventListener('click', () => go(current + 1, true));

  // Carrega produtos reais do catálogo e cria a vitrine 3D do segundo slide.
  fetch('./data/produtos.json')
    .then(r => r.json())
    .then(data => {
      produtos = Array.isArray(data) ? data : [];
      const escolhidos = produtos.slice(0, 6);
      floating.innerHTML = escolhidos.map((p, i) => `
        <div class="float-product fp-${i + 1}">
          <div class="float-product-img"><img src="./produtos/${p.imagem}" alt="${p.nome || 'Produto'}"></div>
          <span>${p.nome || ''}</span>
        </div>`).join('');
    })
    .catch(() => {});

  renderDots();
  restart();

  const carousel = document.querySelector('.hero-carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', restart);
})();
