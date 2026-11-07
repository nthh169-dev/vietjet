/* ==========================================================================
   VIETJET TRAVEL — TRANG CHỦ CONTROLLER (js/home.js)
   Đọc dữ liệu từ sqlite/vietjet.db: Điểm đi/đến, 8 Tour nổi bật, Hãng hàng không
   ========================================================================== */

(function () {
  const { formatCurrency, escapeHtml, buildTourFallbackSvg } = window.VietjetUtils;

  function initTripTypeToggle() {
    const radios = document.querySelectorAll('input[name="tripType"]');
    const returnInput = document.getElementById('search-return-date');
    const pills = document.querySelectorAll('.trip-radio-pill');

    function syncTripState() {
      const checked = document.querySelector('input[name="tripType"]:checked');
      const isOneWay = checked && checked.value === 'one-way';

      pills.forEach((pill) => {
        const input = pill.querySelector('input');
        pill.classList.toggle('active', Boolean(input && input.checked));
      });

      if (returnInput) {
        returnInput.disabled = isOneWay;
        if (isOneWay) {
          returnInput.value = '';
        }
      }
    }

    radios.forEach((r) => r.addEventListener('change', syncTripState));
    syncTripState();
  }

  function populateAirportDropdowns() {
    const originSelect = document.getElementById('search-origin');
    const destSelect = document.getElementById('search-destination');
    if (!originSelect || !destSelect) return;

    const origins = window.VietjetDB.query(
      'SELECT DISTINCT origin_code, origin_name FROM flights ORDER BY origin_name ASC'
    );
    const destinations = window.VietjetDB.query(
      'SELECT DISTINCT destination_code, destination_name FROM flights ORDER BY destination_name ASC'
    );

    originSelect.innerHTML =
      '<option value="">Tất cả điểm xuất phát</option>' +
      origins
        .map(
          (o) =>
            `<option value="${escapeHtml(o.origin_code)}">${escapeHtml(o.origin_name)}</option>`
        )
        .join('');

    destSelect.innerHTML =
      '<option value="">Tất cả điểm đến</option>' +
      destinations
        .map(
          (d) =>
            `<option value="${escapeHtml(d.destination_code)}">${escapeHtml(d.destination_name)}</option>`
        )
        .join('');

    const swapBtn = document.getElementById('btn-swap-route');
    if (swapBtn) {
      swapBtn.addEventListener('click', () => {
        const curOrigin = originSelect.value;
        const curDest = destSelect.value;
        if ([...originSelect.options].some((o) => o.value === curDest)) {
          originSelect.value = curDest;
        } else {
          originSelect.value = '';
        }
        if ([...destSelect.options].some((o) => o.value === curOrigin)) {
          destSelect.value = curOrigin;
        } else {
          destSelect.value = '';
        }
      });
    }
  }

  function initSearchForm() {
    const form = document.getElementById('flight-search-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const tripType = document.querySelector('input[name="tripType"]:checked')?.value || 'round-trip';
      const from = document.getElementById('search-origin')?.value || '';
      const to = document.getElementById('search-destination')?.value || '';
      const departDate = document.getElementById('search-depart-date')?.value || '';
      const returnDate = document.getElementById('search-return-date')?.value || '';

      const params = new URLSearchParams();
      if (tripType) params.set('tripType', tripType);
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      if (departDate) params.set('departDate', departDate);
      if (tripType === 'round-trip' && returnDate) {
        params.set('returnDate', returnDate);
      }

      window.location.href = `flights.html?${params.toString()}`;
    });
  }

  function renderFeaturedTours() {
    const grid = document.getElementById('featured-tours-grid');
    if (!grid) return;

    const tours = window.VietjetDB.query(
      `SELECT t.id, t.title, t.travel_agency, t.duration_text, t.price, t.thumbnail_url,
              a.name AS airline_name
       FROM tours t
       JOIN airlines a ON t.airline_code = a.code
       WHERE t.is_featured = 1
       ORDER BY t.id ASC
       LIMIT 8`
    );

    if (!tours.length) {
      grid.innerHTML = '<div class="empty-state"><h3>Chưa có dữ liệu tour nổi bật</h3></div>';
      return;
    }

    grid.innerHTML = tours
      .map((tour) => {
        const fallbackSrc = buildTourFallbackSvg(tour.title);
        return `
          <article class="tour-card" data-tour-id="${tour.id}" role="link" tabindex="0" aria-label="${escapeHtml(tour.title)}">
            <div class="tour-thumb-wrap">
              <img
                src="${escapeHtml(tour.thumbnail_url)}"
                alt="${escapeHtml(tour.title)}"
                width="600"
                height="400"
                loading="lazy"
                onerror="this.onerror=null;this.src='${fallbackSrc}';"
              />
              <span class="tour-duration-badge">⏱ ${escapeHtml(tour.duration_text)}</span>
              <span class="tour-airline-tag">✈ ${escapeHtml(tour.airline_name)}</span>
            </div>
            <div class="tour-card-body">
              <div class="tour-agency">🏢 ${escapeHtml(tour.travel_agency)}</div>
              <h3 class="tour-card-title">${escapeHtml(tour.title)}</h3>
              <div class="tour-card-footer">
                <div>
                  <span class="tour-price">${formatCurrency(tour.price)}</span>
                  <span class="tour-price-unit">/ khách</span>
                </div>
                <span class="tour-go-label">Xem Tour →</span>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    grid.querySelectorAll('.tour-card').forEach((card) => {
      const goToTourPage = () => {
        const id = card.getAttribute('data-tour-id');
        window.location.href = `tours.html?tourId=${encodeURIComponent(id)}`;
      };
      card.addEventListener('click', goToTourPage);
      card.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          goToTourPage();
        }
      });
    });
  }

  function renderPartnerAirlines() {
    const grid = document.getElementById('partner-airlines-grid');
    if (!grid) return;

    const airlines = window.VietjetDB.query(
      `SELECT code, name, logo_url, country
       FROM airlines
       ORDER BY CASE code WHEN 'VJ' THEN 0 WHEN 'VNA' THEN 1 WHEN 'SQ' THEN 2 ELSE 3 END, name ASC`
    );

    grid.innerHTML = airlines
      .map(
        (airline) => `
          <a href="flights.html?airline=${encodeURIComponent(airline.code)}" class="airline-card" title="Xem chuyến bay của ${escapeHtml(airline.name)}">
            <div class="airline-logo-box">
              <img src="${escapeHtml(airline.logo_url)}" alt="${escapeHtml(airline.name)}" />
            </div>
            <div>
              <div class="airline-name">${escapeHtml(airline.name)}</div>
              <div style="font-size: 0.76rem; color: var(--text-muted);">${escapeHtml(airline.country)}</div>
            </div>
            <span class="airline-cta">Xem chuyến bay →</span>
          </a>
        `
      )
      .join('');
  }

  document.addEventListener('DOMContentLoaded', async () => {
    window.VietjetComponents.mountShell();
    initTripTypeToggle();
    initSearchForm();

    try {
      await window.VietjetDB.init();
      window.VietjetComponents.syncDbStatus();
      populateAirportDropdowns();
      renderFeaturedTours();
      renderPartnerAirlines();
    } catch (err) {
      console.error(err);
      const grid = document.getElementById('featured-tours-grid');
      if (grid) {
        grid.innerHTML = `<div class="empty-state"><h3>Lỗi nạp cơ sở dữ liệu</h3><p>${escapeHtml(err.message)}</p></div>`;
      }
    }
  });
})();
