/* ==========================================================================
   VIETJET TRAVEL — TRANG TOUR CONTROLLER (js/tours.js)
   Lọc giá tăng/giảm dần, hãng hàng không, khung giờ cất cánh từ vietjet.db
   ========================================================================== */

(function () {
  const { formatCurrency, formatDateVN, escapeHtml, getParams, buildTourFallbackSvg } =
    window.VietjetUtils;

  const TIME_RANGES = {
    early: { min: 0, max: 6 },
    morning: { min: 6, max: 12 },
    afternoon: { min: 12, max: 18 },
    evening: { min: 18, max: 24 }
  };

  let highlightedTourId = null;

  function populateAirlineCheckboxes() {
    const box = document.getElementById('tour-filter-airlines');
    if (!box) return;

    const airlines = window.VietjetDB.query(
      `SELECT code, name FROM airlines
       ORDER BY CASE code WHEN 'VJ' THEN 0 WHEN 'VNA' THEN 1 ELSE 2 END, name ASC`
    );

    box.innerHTML = airlines
      .map(
        (a) => `
          <label class="filter-check-label">
            <input type="checkbox" name="tourAirlineFilter" value="${escapeHtml(a.code)}" />
            <span>${escapeHtml(a.name)}</span>
          </label>
        `
      )
      .join('');
  }

  function getTourFilterState() {
    const priceSort = document.querySelector('input[name="tourPriceSort"]:checked')?.value || 'default';
    const airlines = [...document.querySelectorAll('input[name="tourAirlineFilter"]:checked')].map(
      (el) => el.value
    );
    const timeSlots = [...document.querySelectorAll('input[name="tourTimeSlot"]:checked')].map(
      (el) => el.value
    );

    return { priceSort, airlines, timeSlots };
  }

  function queryFilteredTours(filters) {
    const conditions = [];
    const params = [];

    if (filters.airlines.length > 0) {
      const placeholders = filters.airlines.map(() => '?').join(', ');
      conditions.push(`t.airline_code IN (${placeholders})`);
      params.push(...filters.airlines);
    }

    if (filters.timeSlots.length > 0) {
      const slotConds = [];
      for (const key of filters.timeSlots) {
        const range = TIME_RANGES[key];
        if (range) {
          slotConds.push('(t.depart_hour >= ? AND t.depart_hour < ?)');
          params.push(range.min, range.max);
        }
      }
      if (slotConds.length > 0) {
        conditions.push(`(${slotConds.join(' OR ')})`);
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    let orderClause = 'ORDER BY t.is_featured DESC, t.id ASC';

    if (filters.priceSort === 'asc') {
      orderClause = 'ORDER BY t.price ASC';
    } else if (filters.priceSort === 'desc') {
      orderClause = 'ORDER BY t.price DESC';
    } else if (highlightedTourId) {
      orderClause = 'ORDER BY CASE WHEN t.id = ? THEN 0 ELSE 1 END, t.is_featured DESC, t.id ASC';
      params.push(highlightedTourId);
    }

    const sql = `
      SELECT t.*, a.name AS airline_name, a.logo_url AS airline_logo
      FROM tours t
      JOIN airlines a ON t.airline_code = a.code
      ${whereClause}
      ${orderClause}
    `;

    return window.VietjetDB.query(sql, params);
  }

  function renderToursList() {
    const container = document.getElementById('tours-results-list');
    const countEl = document.getElementById('tours-count-text');
    if (!container) return;

    const filters = getTourFilterState();
    const tours = queryFilteredTours(filters);

    if (countEl) {
      countEl.innerHTML = `Hiển thị <strong>${tours.length}</strong> tour du lịch trọn gói từ <code>vietjet.db</code>`;
    }

    if (!tours.length) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>Không tìm thấy tour du lịch phù hợp</h3>
          <p>Hãy thử bỏ bớt bộ lọc hãng bay hoặc khung giờ cất cánh để xem thêm nhiều hành trình hấp dẫn.</p>
          <button type="button" class="btn btn-primary" id="btn-empty-reset-tours">Đặt lại bộ lọc</button>
        </div>
      `;
      document.getElementById('btn-empty-reset-tours')?.addEventListener('click', resetTourFilters);
      return;
    }

    container.innerHTML = tours
      .map((tour) => {
        const isHighlighted = highlightedTourId && Number(tour.id) === Number(highlightedTourId);
        const fallbackSrc = buildTourFallbackSvg(tour.title);
        const detailHref = `tour-detail.html?id=${encodeURIComponent(tour.id)}`;
        const serviceChips = String(tour.services || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => `<span class="service-chip">✓ ${escapeHtml(s)}</span>`)
          .join('');

        return `
          <article class="tour-list-card ${isHighlighted ? 'highlighted-tour' : ''}" data-detail-href="${escapeHtml(detailHref)}" role="link" tabindex="0">
            <div class="tour-list-thumb">
              <img
                src="${escapeHtml(tour.thumbnail_url)}"
                alt="${escapeHtml(tour.title)}"
                width="600"
                height="400"
                loading="lazy"
                onerror="this.onerror=null;this.src='${fallbackSrc}';"
              />
              <span class="tour-duration-badge">⏱ ${escapeHtml(tour.duration_text)}</span>
            </div>

            <div class="tour-list-content">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <span class="badge badge-red">🏢 ${escapeHtml(tour.travel_agency)}</span>
                  ${isHighlighted ? '<span class="badge badge-solid-red">★ Tour bạn chọn từ Trang chủ</span>' : ''}
                </div>
                <h3 class="tour-list-title">${escapeHtml(tour.title)}</h3>

                <div class="tour-meta-grid">
                  <div>✈ Hãng bay: <strong>${escapeHtml(tour.airline_name)}</strong> (${escapeHtml(tour.aircraft)})</div>
                  <div>📅 Ngày cất cánh: <strong>${formatDateVN(tour.depart_date)}</strong></div>
                  <div>🕒 Giờ cất cánh: <strong>${escapeHtml(tour.depart_time)}</strong> (Bay ${escapeHtml(tour.flight_duration)})</div>
                  <div>📍 Hành trình: <strong>${escapeHtml(tour.origin_name)} → ${escapeHtml(tour.destination_name)}</strong></div>
                </div>

                <div class="service-chips" style="margin-top: 12px;">
                  ${serviceChips}
                </div>
              </div>

              <div class="tour-list-bottom">
                <div>
                  <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">Giá trọn gói / khách:</span>
                  <div class="flight-price-value">${formatCurrency(tour.price)}</div>
                </div>
                <a href="${escapeHtml(detailHref)}" class="btn btn-primary">Xem chi tiết &amp; Lịch trình →</a>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    container.querySelectorAll('.tour-list-card').forEach((card) => {
      card.addEventListener('click', (ev) => {
        if (ev.target.closest('a')) return;
        const href = card.getAttribute('data-detail-href');
        if (href) window.location.href = href;
      });
    });
  }

  function resetTourFilters() {
    highlightedTourId = null;
    const defaultSort = document.querySelector('input[name="tourPriceSort"][value="default"]');
    if (defaultSort) defaultSort.checked = true;

    document
      .querySelectorAll('input[name="tourAirlineFilter"], input[name="tourTimeSlot"]')
      .forEach((cb) => {
        cb.checked = false;
      });

    document.querySelectorAll('.time-chip').forEach((chip) => chip.classList.remove('checked'));
    window.history.replaceState({}, '', 'tours.html');
    renderToursList();
  }

  document.addEventListener('DOMContentLoaded', async () => {
    window.VietjetComponents.mountShell();
    const params = getParams();
    if (params.get('tourId')) {
      highlightedTourId = Number(params.get('tourId'));
    }

    try {
      await window.VietjetDB.init();
      window.VietjetComponents.syncDbStatus();
      populateAirlineCheckboxes();

      document.getElementById('tours-filter-sidebar')?.addEventListener('change', (ev) => {
        if (ev.target.name === 'tourTimeSlot') {
          ev.target.closest('.time-chip')?.classList.toggle('checked', ev.target.checked);
        }
        renderToursList();
      });

      document.getElementById('btn-reset-tour-filters')?.addEventListener('click', resetTourFilters);
      renderToursList();
    } catch (err) {
      console.error(err);
    }
  });
})();
