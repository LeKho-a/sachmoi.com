// script.js
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  // match the id used in HTML (searchButton)
  const searchBtn = document.getElementById('searchButton');
  // we can delegate clicks for any .book-card button from the document
  const bookGrid = document.querySelector('.book-grid');
  const bookCards = Array.from(document.querySelectorAll('.book-card'));

  // 1) Tìm kiếm (filter) theo tiêu đề
  function filterBooks(query) {
    const q = query.trim().toLowerCase();
    bookCards.forEach(card => {
      const title = (card.querySelector('h3')?.innerText || '').toLowerCase();
      const matches = title.includes(q);
      card.style.display = matches ? '' : 'none';
    });
  }

  // realtime search khi gõ
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterBooks(e.target.value);
    });
  }

  // nút tìm kiếm (nếu muốn)
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      filterBooks(searchInput.value);
    });
  }

  // 2) Modal "Xem chi tiết"
  // Tạo modal element 1 lần
  const modal = document.createElement('div');
  modal.className = 'book-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" tabindex="-1">
      <div class="modal-content" role="dialog" aria-modal="true">
        <button class="modal-close" aria-label="Close">&times;</button>
        <div class="modal-body">
          <img class="modal-img" src="" alt="">
          <div class="modal-info">
            <h3 class="modal-title"></h3>
            <p class="modal-price"></p>
            <p class="modal-desc">Mô tả: Sách hay, lý tưởng để đọc và học hỏi.</p>
            <button class="add-cart"><i class="fa-solid fa-bag-shopping"></i>Thêm vào giỏ</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const modalBackdrop = modal.querySelector('.modal-backdrop');
  const modalClose = modal.querySelector('.modal-close');
  const modalImg = modal.querySelector('.modal-img');
  const modalTitle = modal.querySelector('.modal-title');
  const modalPrice = modal.querySelector('.modal-price');
  const addCartBtn = modal.querySelector('.add-cart');

  function openModalFromCard(card) {
    const imgSrc = card.querySelector('img')?.src || '';
    const title = card.querySelector('h3')?.innerText || 'No title';
    const price = card.querySelector('p')?.innerText || '';
    const desc = card.dataset.desc || 'Mô tả: Sách hay, lý tưởng để đọc và học hỏi.';

    modalImg.src = imgSrc;
    modalImg.alt = title;
    modalTitle.innerText = title;
    modalPrice.innerText = price;
    modal.querySelector('.modal-desc').innerText = desc;

    modal.classList.add('open');
    // trap focus simple: focus close btn
    modalClose.focus();
    document.body.style.overflow = 'hidden'; // disable page scroll
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Delegate click on any button inside a .book-card (works for all grids)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.book-card button');
    if (!btn) return;
    const card = btn.closest('.book-card');
    if (!card) return;
    openModalFromCard(card);
  });

  // Mobile nav toggle behavior
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // close menu when a nav link is clicked
    mainNav.addEventListener('click', (ev) => {
      if (ev.target.tagName === 'A') {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Close handlers
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    // nếu click ngoài modal-content thì đóng
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // 3) Thêm vào giỏ (ví dụ: toast)
  function showToast(text) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 20);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  addCartBtn.addEventListener('click', () => {
    const title = modalTitle.innerText;
    showToast(`Đã thêm "${title}" vào giỏ`);
    // nếu muốn: update localStorage hoặc cart UI ở đây
  });

  // Progressive enhancement: nếu JS tắt, site vẫn hiển thị grid tĩnh
});
