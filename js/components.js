/* ==========================================================================
   VIETJET TRAVEL — SHARED UI COMPONENTS (Header & Footer)
   ========================================================================== */

window.VietjetComponents = (function () {
  function getCurrentPage() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path.toLowerCase();
  }

  function renderHeader() {
    const host = document.getElementById('site-header-root');
    if (!host) return;

    const page = getCurrentPage();
    const isHome = page === '' || page === 'index.html';
    const isFlights = page === 'flights.html' || page === 'flight-detail.html';
    const isTours = page === 'tours.html' || page === 'tour-detail.html';
    const isCart = page === 'cart.html';

    host.innerHTML = `
      <div class="top-brand-strip"></div>
      <header class="site-header">
        <div class="container header-inner">
          <a href="index.html" class="brand-logo" aria-label="Trang chủ Vietjet">
            <img src="images/2aOboRAvPCnNF8ux8l12JJoKC6uw9yMZkM5dUYs4.jpg" alt="Vietjet Logo" class="brand-logo-img" />
            <div class="brand-text-wrap">
              <span class="brand-title">VIETJET</span>
              <span class="brand-subtitle">Bay là Thích • Du lịch Trọn gói</span>
            </div>
          </a>

          <nav class="main-nav" aria-label="Điều hướng chính">
            <a href="index.html" class="nav-link ${isHome ? 'active' : ''}">Trang Chủ</a>
            <a href="flights.html" class="nav-link ${isFlights ? 'active' : ''}">Chuyến Bay</a>
            <a href="tours.html" class="nav-link ${isTours ? 'active' : ''}">Tour Du Lịch</a>
          </nav>

          <div class="header-actions">
            <a href="cart.html" class="cart-btn ${isCart ? 'active' : ''}" id="header-cart-link">
              <span>🛒 Giỏ Hàng</span>
              <span class="cart-badge" id="header-cart-badge">0</span>
            </a>
          </div>
        </div>
      </header>
    `;
  }

  function renderFooter() {
    const host = document.getElementById('site-footer-root');
    if (!host) return;

    host.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-col">
              <div class="brand-logo" style="margin-bottom: 12px;">
                <img src="images/2aOboRAvPCnNF8ux8l12JJoKC6uw9yMZkM5dUYs4.jpg" alt="Vietjet" class="brand-logo-img" />
                <div class="brand-text-wrap">
                  <span class="brand-title">VIETJET</span>
                  <span class="brand-subtitle">Travel &amp; Aviation Portal</span>
                </div>
              </div>
              <p style="font-size: 0.9rem; color: var(--text-secondary);">
                Hệ thống đặt vé máy bay và tour du lịch trực tuyến hàng đầu. Tận hưởng hành trình an toàn, chi phí tiết kiệm cùng mạng bay phủ khắp châu Á.
              </p>
            </div>

            <div class="footer-col">
              <h4>Khám Phá Nhanh</h4>
              <ul class="footer-links">
                <li><a href="index.html">Trang chủ</a></li>
                <li><a href="flights.html">Tìm kiếm chuyến bay</a></li>
                <li><a href="tours.html">8 Tour du lịch nổi bật</a></li>
                <li><a href="cart.html">Giỏ hàng &amp; Đăng ký</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>Hãng Hàng Không</h4>
              <ul class="footer-links">
                <li><a href="flights.html?airline=VJ">VietJet Air</a></li>
                <li><a href="flights.html?airline=VNA">Vietnam Airlines</a></li>
                <li><a href="flights.html?airline=SQ">Singapore Airlines</a></li>
                <li><a href="flights.html?airline=QH">Bamboo Airways</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>Liên Hệ &amp; Hỗ Trợ</h4>
              <ul class="footer-links">
                <li>📞 Tổng đài: <strong>1900 1886</strong></li>
                <li>✉️ Email xác nhận: <strong>nvhai061993@gmail.com</strong></li>
                <li>📍 302 Kim Mã, Ba Đình, Hà Nội / Tân Sơn Nhất, TP.HCM</li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <span>© 2026 Vietjet Travel Website — HTML5, CSS3, Vanilla JS &amp; SQLite.</span>
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <span class="db-status-pill">
                <span class="db-dot"></span>
                <span id="footer-db-source">SQLite: sqlite/vietjet.db</span>
              </span>
              <button type="button" class="btn btn-ghost btn-sm" id="btn-reset-demo-db" title="Xóa giỏ hàng đã lưu trong trình duyệt">
                Làm mới Giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </footer>
    `;

    const resetBtn = document.getElementById('btn-reset-demo-db');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Bạn có muốn xóa toàn bộ mục trong Giỏ hàng để kiểm thử lại từ đầu không?')) {
          window.VietjetDB.resetUserState();
          window.location.reload();
        }
      });
    }
  }

  function updateCartBadge() {
    const badge = document.getElementById('header-cart-badge');
    if (!badge) return;
    try {
      badge.textContent = String(window.VietjetDB.getCartCount());
    } catch (_) {
      badge.textContent = '0';
    }
  }

  function syncDbStatus() {
    const labelEl = document.getElementById('footer-db-source');
    if (labelEl && window.VietjetDB) {
      labelEl.textContent = `SQLite: ${window.VietjetDB.getSourceLabel()}`;
    }
    if (window.location.protocol === 'file:' && !document.getElementById('file-protocol-warning')) {
      const warn = document.createElement('div');
      warn.id = 'file-protocol-warning';
      warn.style.cssText =
        'background:#fffbeb;border-bottom:1px solid #fde68a;color:#92400e;padding:8px 16px;font-size:0.84rem;text-align:center;display:flex;justify-content:center;align-items:center;gap:12px;flex-wrap:wrap;';
      warn.innerHTML = `
        <span>⚠️ Bạn đang mở trực tiếp qua <code>file://</code> nên trình duyệt chặn đọc lại file <strong>sqlite/vietjet.db</strong> khi có thay đổi. Hãy mở bằng <strong>Live Server / start-server.bat</strong> hoặc chọn lại file <code>vietjet.db</code>:</span>
        <label class="btn btn-outline btn-sm" style="padding:4px 10px;font-size:0.78rem;cursor:pointer;">
          📂 Chọn file vietjet.db mới
          <input type="file" accept=".db,.sqlite,.sqlite3" id="input-pick-db-file" style="display:none;" />
        </label>
      `;
      document.body.insertBefore(warn, document.body.firstChild);

      document.getElementById('input-pick-db-file')?.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const bytes = new Uint8Array(reader.result);
          let binary = '';
          for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          sessionStorage.setItem('vietjet_manual_db_b64', window.btoa(binary));
          window.location.reload();
        };
        reader.readAsArrayBuffer(file);
      });
    }
    updateCartBadge();
  }

  function mountShell() {
    renderHeader();
    renderFooter();
    document.addEventListener('vietjet:cart-updated', updateCartBadge);
  }

  return {
    mountShell,
    updateCartBadge,
    syncDbStatus
  };
})();
