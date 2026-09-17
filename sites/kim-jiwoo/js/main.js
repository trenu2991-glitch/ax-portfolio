/**
 * Main UI Controller for Kim Ji-woo's Dietitian Portfolio.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  loadProjects();
  initContactForm();
  initPrintButton();
});

/* ==========================================================================
   1. Navigation & Scroll Spy
   ========================================================================== */
function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // Active state on scroll
  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   2. Projects Loading, Filtering & Modal
   ========================================================================== */
let allProjects = [];

async function loadProjects() {
  const container = document.getElementById('projects_container');
  if (!container) return;

  allProjects = await window.PortfolioAPI.getProjects();
  renderProjects('all');

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.filter;
      renderProjects(category);
    });
  });
}

function renderProjects(filterCategory) {
  const container = document.getElementById('projects_container');
  if (!container) return;

  const filtered = filterCategory === 'all' 
    ? allProjects 
    : allProjects.filter(p => p.category === filterCategory);

  container.innerHTML = '';

  filtered.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.id = project.id;

    const tagsArr = project.tags ? project.tags.split(',').map(t => t.trim()) : [];
    const tagsHtml = tagsArr.map(t => `<span class="project-tag">#${t}</span>`).join('');

    const categoryNames = {
      clinical: '임상영양 · 질환식',
      foodservice: '단체급식 · HACCP',
      rd: '식품 R&D · 메뉴기획',
      community: '지역사회 · 영양상담'
    };

    const isAward = project.badge && project.badge.includes('수상');

    card.innerHTML = `
      <div class="project-thumb">
        <img src="${project.image_path}" alt="${project.title}" loading="lazy">
        ${project.badge ? `<span class="project-badge-pill ${isAward ? 'highlight-award' : ''}">${project.badge}</span>` : ''}
      </div>
      <div class="project-content">
        <span class="project-category">${categoryNames[project.category] || project.category}</span>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-summary">${project.summary}</p>
        <div class="project-tags">${tagsHtml}</div>
        <div class="project-footer">
          <span class="project-date">${project.date_period || ''}</span>
          <span class="project-detail-link">상세보기 &rarr;</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openProjectModal(project));
    container.appendChild(card);
  });
}

function openProjectModal(project) {
  const modal = document.getElementById('project_modal');
  const modalBody = document.getElementById('modal_body_content');
  if (!modal || !modalBody) return;

  // Simple Markdown parser for bold, lists, and headers
  let parsedMd = project.detail_md || project.summary;
  parsedMd = parsedMd
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '<br><br>');

  modalBody.innerHTML = `
    <img src="${project.image_path}" alt="${project.title}">
    <span class="section-tag">${project.subtitle || project.category}</span>
    <h2>${project.title}</h2>
    <div class="modal-meta-bar">
      <span>📅 수행기간: ${project.date_period || '2024~2025'}</span>
      <span>🏆 평가: ${project.badge || '우수 과제'}</span>
    </div>
    <div class="modal-markdown-content">
      ${parsedMd}
    </div>
  `;

  modal.classList.add('show');
}

// Modal Close logic
window.closeProjectModal = function() {
  const modal = document.getElementById('project_modal');
  if (modal) modal.classList.remove('show');
};

window.addEventListener('click', (e) => {
  const modal = document.getElementById('project_modal');
  if (e.target === modal) {
    modal.classList.remove('show');
  }
});

/* ==========================================================================
   3. Contact Form Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact_form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '접수 중...';
    submitBtn.disabled = true;

    const payload = {
      name: document.getElementById('contact_name').value.trim(),
      email: document.getElementById('contact_email').value.trim(),
      organization: document.getElementById('contact_org').value.trim(),
      category: document.getElementById('contact_category').value,
      message: document.getElementById('contact_message').value.trim()
    };

    try {
      const res = await window.PortfolioAPI.submitInquiry(payload);
      showToast(res.message || '소중한 메시지가 전달되었습니다. 감사합니다!');
      form.reset();
    } catch (err) {
      showToast('메시지 전송 중 일시적 오류가 발생했습니다. 이메일로 연락 부탁드립니다.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

function showToast(message) {
  const container = document.getElementById('toast_container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>🌿</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

/* ==========================================================================
   4. Print & PDF Export Button
   ========================================================================== */
function initPrintButton() {
  const printBtns = document.querySelectorAll('.btn-print-trigger');
  printBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });
}
