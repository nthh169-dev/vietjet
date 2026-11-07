/* ==========================================================================
   VIETJET TRAVEL — TRANG CHUYẾN BAY CONTROLLER (js/flights.js)
   Truy vấn lọc động bằng SQL từ bảng flights & airlines trong vietjet.db
   ========================================================================== */

(function () {
  const { formatCurrency, formatDateVN, escapeHtml, getParams } = window.VietjetUtils;

  const TIME_RANGES = {
    early: { min: 0, max: 6 },
    morning: { min: 6, max: 12 },
    afternoon: { min: 12, max: 18 },
    evening: { min: 18, max: 24 }
  };

  function populateInitialControls() {
    const params = getParams();
    const originSel = document.getElementById('quick-origin');
    const destSel = document.getElementById('quick-destination');
    const dateInput = document.getElementById('quick-depart-date');
    const airlinesBox = document.getElementById('filter-airlines-list');

    const origins = window.VietjetDB.query(
      'SELECT DISTINCT origin_code, origin_name FROM flights ORDER BY origin_name ASC'
    );
    const destinations = window.VietjetDB.query(
      'SELECT DISTINCT destination_code, destination_name FROM flights ORDER BY destination_name ASC'
    );

    if (originSel) {
      originSel.innerHTML =
        '<option value="">Tất cả điểm xuất phát</option>' +
        origins
          .map(
            (o) =>
              `<option value="${escapeHtml(o.origin_code)}">${escapeHtml(o.origin_name)}</option>`
          )
          .join('');
      if (params.get('from')) originSel.value = params.get('from');
    }

    if (destSel) {
      destSel.innerHTML =
        '<option value="">Tất cả điểm đến</option>' +
        destinations
          .map(
            (d) =>
              `<option value="${escapeHtml(d.destination_code)}">${escapeHtml(d.destination_name)}</option>`
          )
          .join('');
      if (params.get('to')) destSel.value = params.get('to');
    }

    if (dateInput && params.get('departDate')) {
      dateInput.value = params.get('departDate');
    }

    // Populate Airlines checkboxes
    if (airlinesBox) {
      const selectedAirline = params.get('airline') || '';
      const airlines = window.VietjetDB.query(
        `SELECT code, name FROM airlines
         ORDER BY CASE code WHEN 'VJ' THEN 0 WHEN 'VNA' THEN 1 ELSE 2 END, name ASC`
      );
      airlinesBox.innerHTML = airlines
        .map(
          (a) => `
            <label class="filter-check-label">
              <input type="checkbox" name="airlineFilter" value="${escapeHtml(a.code)}" ${selectedAirline === a.code ? 'checked' : ''} />
              <span>${escapeHtml(a.name)}</span>
            </label>
          `
        )
        .join('');
    }

    // Preselect tripType from URL if sent from Homepage
    const urlTripType = params.get('tripType');
    if (urlTripType === 'round-trip' || urlTripType === 'one-way') {
      const tripRadio = document.querySelector(`input[name="tripTypeFilter"][value="${urlTripType}"]`);
      if (tripRadio) tripRadio.checked = true;
    }
  }

  function collectFilterState() {
    const origin = document.getElementById('quick-origin')?.value || '';
    const destination = document.getElementById('quick-destination')?.value || '';
    const departDate = document.getElementById('quick-depart-date')?.value || '';

    const priceSort = document.querySelector('input[name="priceSort"]:checked')?.value || 'default';
    const tripType = document.querySelector('input[name="tripTypeFilter"]:checked')?.value || 'all';
    const seatClass = document.querySelector('input[name="seatClassFilter"]:checked')?.value || 'all';

    const stopTypes = [...document.querySelectorAll('input[name="stopTypeFilter"]:checked')].map(
      (el) => el.value
    );
    const airlines = [...document.querySelectorAll('input[name="airlineFilter"]:checked')].map(
      (el) => el.value
    );
    const timeSlots = [...document.querySelectorAll('input[name="timeSlotFilter"]:checked')].map(
      (el) => el.value
    );

    return {
      origin,
      destination,
      departDate,
      priceSort,
      tripType,
      seatClass,
      stopTypes,
      airlines,
      timeSlots
    };
  }

  function queryFilteredFlights(filters) {
    const conditions = [];
    const params = [];

    if (filters.origin) {
      conditions.push('f.origin_code = ?');
      params.push(filters.origin);
    }

    if (filters.destination) {
      conditions.push('f.destination_code = ?');
      params.push(filters.destination);
    }

    if (filters.departDate) {
      conditions.push('f.depart_date = ?');
      params.push(filters.departDate);
    }

    if (filters.tripType !== 'all') {
      conditions.push('f.trip_type = ?');
      params.push(filters.tripType);
    }

    if (filters.stopTypes.length > 0) {
      const placeholders = filters.stopTypes.map(() => '?').join(', ');
      conditions.push(`f.stop_type IN (${placeholders})`);
      params.push(...filters.stopTypes);
    }

    if (filters.airlines.length > 0) {
      const placeholders = filters.airlines.map(() => '?').join(', ');
      conditions.push(`f.airline_code IN (${placeholders})`);
      params.push(...filters.airlines);
    }

    if (filters.timeSlots.length > 0) {
      const slotConds = [];
      for (const slotKey of filters.timeSlots) {
        const range = TIME_RANGES[slotKey];
        if (range) {
          slotConds.push('(f.depart_hour >= ? AND f.depart_hour < ?)');
          params.push(range.min, range.max);
        }
      }
      if (slotConds.length > 0) {
        conditions.push(`(${slotConds.join(' OR ')})`);
      }
    }

    if (filters.seatClass === 'economy') {
      conditions.push('f.has_economy = 1');
    } else if (filters.seatClass === 'business') {
      conditions.push('f.has_business = 1');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const priceColumn = filters.seatClass === 'business' ? 'f.price_business' : 'f.price_economy';

    let orderClause = 'ORDER BY f.depart_date ASC, f.depart_hour ASC';
    if (filters.priceSort === 'asc') {
      orderClause = `ORDER BY ${priceColumn} ASC, f.depart_hour ASC`;
    } else if (filters.priceSort === 'desc') {
      orderClause = `ORDER BY ${priceColumn} DESC, f.depart_hour ASC`;
    }

    const sql = `
      SELECT f.*, a.name AS airline_name, a.logo_url AS airline_logo
      FROM flights f
      JOIN airlines a ON f.airline_code = a.code
      ${whereClause}
      ${orderClause}
    `;

    return window.VietjetDB.query(sql, params);
  }

  function renderFlights() {
    const container = document.getElementById('flights-results-list');
    const countEl = document.getElementById('flights-count-text');
    if (!container) return;

    const filters = collectFilterState();
    const flights = queryFilteredFlights(filters);
    const isBusinessView = filters.seatClass === 'business';

    if (countEl) {
      countEl.innerHTML = `Tìm thấy <strong>${flights.length}</strong> chuyến bay phù hợp từ <code>vietjet.db</code>`;
    }

    if (!flights.length) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>Không tìm thấy chuyến bay khớp bộ lọc</h3>
          <p>Bạn hãy thử nới rộng điều kiện ngày bay, khung giờ hoặc đặt lại bộ lọc tìm kiếm.</p>
          <button type="button" class="btn btn-primary" id="btn-empty-reset-flights">Xem tất cả chuyến bay</button>
        </div>
      `;
      document.getElementById('btn-empty-reset-flights')?.addEventListener('click', resetAllFilters);
      return;
    }

    container.innerHTML = flights
      .map((f) => {
        const displayPrice = isBusinessView ? f.price_business : f.price_economy;
        const priceLabel = isBusinessView ? 'Hạng Thương Gia' : 'Hạng Phổ Thông từ';
        const tripBadge =
          f.trip_type === 'round-trip'
            ? '<span class="badge badge-red">⇄ Vé khứ hồi</span>'
            : '<span class="badge badge-blue">→ Vé một chiều</span>';
        const stopBadge =
          f.stop_type === 'direct'
            ? '<span class="badge badge-green">Bay thẳng</span>'
            : '<span class="badge badge-gold">Nhiều thành phố</span>';

        const serviceList = String(f.services || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => `<span class="service-chip">✓ ${escapeHtml(s)}</span>`)
          .join('');

        const detailHref = `flight-detail.html?id=${encodeURIComponent(f.id)}${isBusinessView ? '&seatClass=business' : ''}`;

        return `
          <article class="flight-item-card" data-detail-href="${escapeHtml(detailHref)}" role="link" tabindex="0">
            <div class="flight-card-main">
              <div class="flight-airline-col">
                <img src="${escapeHtml(f.airline_logo)}" alt="${escapeHtml(f.airline_name)}" class="flight-airline-logo" />
                <div class="flight-airline-name">${escapeHtml(f.airline_name)}</div>
                <div class="flight-code-meta">${escapeHtml(f.flight_number)} • ${escapeHtml(f.aircraft)}</div>
              </div>

              <div class="flight-schedule-col">
                <div class="flight-endpoint">
                  <div class="flight-time-big">${escapeHtml(f.depart_time)}</div>
                  <div class="flight-city-code">${escapeHtml(f.origin_name)}</div>
                </div>

                <div class="flight-duration-track">
                  <span class="duration-label">⏱ ${escapeHtml(f.duration)}</span>
                  <div class="track-line"><span class="track-plane">✈</span></div>
                  <div class="flight-date-tags">
                    ${tripBadge}
                    ${stopBadge}
                  </div>
                </div>

                <div class="flight-endpoint">
                  <div class="flight-time-big">${escapeHtml(f.arrive_time)}</div>
                  <div class="flight-city-code">${escapeHtml(f.destination_name)}</div>
                </div>
              </div>

              <div class="flight-price-col">
                <span class="price-class-caption">${priceLabel}</span>
                <div class="flight-price-value">${formatCurrency(displayPrice)}</div>
                <a href="${escapeHtml(detailHref)}" class="btn btn-primary btn-sm">Chọn chuyến bay</a>
              </div>
            </div>

            <div class="flight-card-bottom">
              <div>
                📅 Ngày cất cánh: <strong>${formatDateVN(f.depart_date)}</strong>
                ${f.return_date ? ` • Ngày về: <strong>${formatDateVN(f.return_date)}</strong>` : ''}
              </div>
              <div class="service-chips">${serviceList}</div>
            </div>
          </article>
        `;
      })
      .join('');

    container.querySelectorAll('.flight-item-card').forEach((card) => {
      card.addEventListener('click', (ev) => {
        if (ev.target.closest('a')) return;
        const href = card.getAttribute('data-detail-href');
        if (href) window.location.href = href;
      });
    });
  }

  function resetAllFilters() {
    const originSel = document.getElementById('quick-origin');
    const destSel = document.getElementById('quick-destination');
    const dateInput = document.getElementById('quick-depart-date');
    if (originSel) originSel.value = '';
    if (destSel) destSel.value = '';
    if (dateInput) dateInput.value = '';

    const defaultSort = document.querySelector('input[name="priceSort"][value="default"]');
    if (defaultSort) defaultSort.checked = true;

    const allTrip = document.querySelector('input[name="tripTypeFilter"][value="all"]');
    if (allTrip) allTrip.checked = true;

    const allClass = document.querySelector('input[name="seatClassFilter"][value="all"]');
    if (allClass) allClass.checked = true;

    document
      .querySelectorAll(
        'input[name="stopTypeFilter"], input[name="airlineFilter"], input[name="timeSlotFilter"]'
      )
      .forEach((cb) => {
        cb.checked = false;
      });

    document.querySelectorAll('.time-chip').forEach((chip) => chip.classList.remove('checked'));
    window.history.replaceState({}, '', 'flights.html');
    renderFlights();
  }

  function bindFilterEvents() {
    const sidebar = document.getElementById('flights-filter-sidebar');
    if (sidebar) {
      sidebar.addEventListener('change', (ev) => {
        if (ev.target.name === 'timeSlotFilter') {
          ev.target.closest('.time-chip')?.classList.toggle('checked', ev.target.checked);
        }
        renderFlights();
      });
    }

    ['quick-origin', 'quick-destination', 'quick-depart-date'].forEach((id) => {
      document.getElementById(id)?.addEventListener('change', renderFlights);
    });

    document.getElementById('btn-clear-route')?.addEventListener('click', resetAllFilters);
    document.getElementById('btn-reset-flight-filters')?.addEventListener('click', resetAllFilters);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    window.VietjetComponents.mountShell();
    try {
      await window.VietjetDB.init();
      window.VietjetComponents.syncDbStatus();
      populateInitialControls();
      bindFilterEvents();
      renderFlights();
    } catch (err) {
      console.error(err);
      const container = document.getElementById('flights-results-list');
      if (container) {
        container.innerHTML = `<div class="empty-state"><h3>Lỗi nạp dữ liệu chuyến bay</h3><p>${escapeHtml(err.message)}</p></div>`;
      }
    }
  });
})();
