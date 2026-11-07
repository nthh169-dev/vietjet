/* ==========================================================================
   VIETJET TRAVEL — SHARED UTILITIES (js/utils.js)
   ========================================================================== */

window.VietjetUtils = (function () {
  const vndFormatter = new Intl.NumberFormat('vi-VN');

  function formatCurrency(amount) {
    const num = Number(amount) || 0;
    return `${vndFormatter.format(num)} ₫`;
  }

  function formatDateVN(isoDate) {
    if (!isoDate) return 'Linh hoạt';
    const parts = String(isoDate).split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getParams() {
    return new URLSearchParams(window.location.search);
  }

  function buildTourFallbackSvg(title) {
    const safeTitle = escapeHtml((title || 'Vietjet Tour').slice(0, 34));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ee1d23"/>
          <stop offset="100%" stop-color="#ff8a00"/>
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#g)"/>
      <circle cx="510" cy="80" r="95" fill="rgba(255,255,255,0.14)"/>
      <text x="40" y="185" fill="#ffffff" font-family="Arial,sans-serif" font-weight="900" font-size="32">VIETJET HOLIDAYS</text>
      <text x="40" y="230" fill="#fffbeb" font-family="Arial,sans-serif" font-weight="700" font-size="20">${safeTitle}</text>
      <text x="40" y="350" fill="rgba(255,255,255,0.85)" font-family="Arial,sans-serif" font-size="15">Thumbnail 600 x 400</text>
    </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function ensureToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast({ title, message, type = 'success', actionText = '', actionHref = '' }) {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
    toast.innerHTML = `
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-msg">${escapeHtml(message)}</div>
      ${
        actionHref
          ? `<div class="toast-actions">
               <a href="${escapeHtml(actionHref)}" class="btn btn-primary btn-sm">${escapeHtml(actionText || 'Xem Giỏ Hàng')}</a>
             </div>`
          : ''
      }
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 260);
    }, 4500);
  }

  return {
    formatCurrency,
    formatDateVN,
    escapeHtml,
    getParams,
    buildTourFallbackSvg,
    showToast
  };
})();
