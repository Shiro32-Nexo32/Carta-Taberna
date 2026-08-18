const totalPages = 6;
let currentPage = 1;

const cover = document.querySelector('.cover');
const menu = document.querySelector('.menu');
const menuPage = document.querySelector('#menu-page');
const pageCount = document.querySelector('#page-count');
const previousButton = document.querySelector('#previous-page');
const nextButton = document.querySelector('#next-page');

const pageDescriptions = [
  'Portada de La Taberna de RuMaku',
  'Página 2 de la carta: bebidas',
  'Página 3 de la carta: comidas',
  'Página 4 de la carta: comidas',
  'Página 5 de la carta: bocados y rápidos',
  'Página 6 de la carta: postres, dulces y café',
];

function showPage(page) {
  currentPage = Math.min(Math.max(page, 1), totalPages);

  menuPage.src = `assets/carta/carta-${currentPage}.webp`;
  menuPage.alt = pageDescriptions[currentPage - 1];

  pageCount.value = `Página ${currentPage} / ${totalPages}`;

  previousButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

async function enterFullscreen() {
  if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
    try {
      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.warn('No se pudo activar pantalla completa:', error);
    }
  }
}

function enableReadingMode() {
  document.documentElement.style.zoom = '40%';
}

function disableReadingMode() {
  document.documentElement.style.zoom = '100%';
}

function openMenu(page = 1) {
  cover.hidden = true;
  menu.hidden = false;

  showPage(page);

  history.replaceState(null, '', '#carta');

  enableReadingMode();
}

document.querySelector('[data-open-menu]').addEventListener('click', async () => {
  openMenu();

  await enterFullscreen();
});

document.querySelector('[data-home]').addEventListener('click', async () => {
  disableReadingMode();

  menu.hidden = true;
  cover.hidden = false;

  history.replaceState(null, '', '#inicio');

  if (document.fullscreenElement && document.exitFullscreen) {
    try {
      await document.exitFullscreen();
    } catch (error) {
      console.warn('No se pudo salir de pantalla completa:', error);
    }
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

previousButton.addEventListener('click', () => {
  showPage(currentPage - 1);
});

nextButton.addEventListener('click', () => {
  showPage(currentPage + 1);
});

document.querySelectorAll('[data-page]').forEach((button) => {
  button.addEventListener('click', () => {
    showPage(Number(button.dataset.page));
  });
});

document.addEventListener('keydown', (event) => {
  if (menu.hidden) return;

  if (event.key === 'ArrowLeft') {
    showPage(currentPage - 1);
  }

  if (event.key === 'ArrowRight') {
    showPage(currentPage + 1);
  }
});

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && !menu.hidden) {
    disableReadingMode();
  }
});

if (location.hash === '#carta') {
  openMenu();
}
