/* ==========================================================================
   VIETJET TRAVEL — CHI TIẾT TOUR CONTROLLER (js/tour-detail.js)
   Hiển thị thông tin bay, loại máy bay, lịch trình từng ngày & Lưu vào Giỏ Hàng
   ========================================================================== */

(function () {
  const {
    formatCurrency,
    formatDateVN,
    escapeHtml,
    getParams,
    buildTourFallbackSvg,
    showToast
  } = window.VietjetUtils;

  let currentTour = null;
  let itineraries = [];
  let guestQty = 1;

  function renderTourDetail() {
    const root = document.getElementById('tour-detail-root');
    if (!root || !currentTour) return;

    const t = currentTour;
    const fallbackSrc = buildTourFallbackSvg(t.title);
    const totalAmount = t.price * guestQty;

    const serviceBadges = String(t.services || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => `<span class="service-chip">✓ ${escapeHtml(s)}</span>`)
      .join('');

    const itineraryHtml = itineraries.length
      ? itineraries
          .map(
            (day) => `
              <div class="timeline-day">
                <span class="timeline-dot"></span>
                <div class="timeline-day-header">
                  <span class="badge badge-solid-red">Ngày ${day.day_number}</span>
                  <h3 class="timeline-day-title">${escapeHtml(day.title)}</h3>
                </div>
                <p class="timeline-day-desc">${escapeHtml(day.description)}</p>
              </div>
            `
          )
          .join('')
      : '<p>Đang cập nhật lịch trình chi tiết.</p>';

    root.innerHTML = `
      <div style="margin-bottom: 22px;">
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 8px;">
          <span class="badge badge-red">🏢 ${escapeHtml(t.travel_agency)}</span>
          <span class="badge badge-gold">⏱ ${escapeHtml(t.duration_text)}</span>
        </div>
        <h1 style="font-size: 1.95rem; font-weight: 900; line-height: 1.25;">${escapeHtml(t.title)}</h1>
      </div>

      <div class="tour-detail-layout">
        <!-- Cột trái: Ảnh, Thông tin chuyến bay của Tour & Lịch trình -->
        <div>
          <div class="tour-hero-photo">
            <img
              src="${escapeHtml(t.thumbnail_url)}"
              alt="${escapeHtml(t.title)}"
              width="600"
              height="400"
              onerror="this.onerror=null;this.src='${fallbackSrc}';"
            />
          </div>

          <div class="detail-card-block">
            <h2>✈ Thông Tin Vận Chuyển Hàng Không &amp; Hành Trình</h2>
            <div class="flight-specs-grid">
              <div class="spec-box">
                <div class="spec-label">Điểm đi</div>
                <div class="spec-value">📍 ${escapeHtml(t.origin_name)}</div>
              </div>
              <div class="spec-box">
                <div class="spec-label">Điểm đến</div>
                <div class="spec-value">🎯 ${escapeHtml(t.destination_name)}</div>
              </div>
              <div class="spec-box">
                <div class="spec-label">Thời gian bay</div>
                <div class="spec-value">🕒 ${escapeHtml(t.depart_time)} (${escapeHtml(t.flight_duration)})</div>
              </div>
              <div class="spec-box">
                <div class="spec-label">Ngày khởi hành</div>
                <div class="spec-value">📅 ${formatDateVN(t.depart_date)}</div>
              </div>
              <div class="spec-box">
                <div class="spec-label">Hãng bay đồng hành</div>
                <div class="spec-value">${escapeHtml(t.airline_name)}</div>
              </div>
              <div class="spec-box">
                <div class="spec-label">Loại máy bay</div>
                <div class="spec-value">🛩 ${escapeHtml(t.aircraft)}</div>
              </div>
            </div>

            <div style="margin-top: 18px;">
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">DỊCH VỤ TRỌN GÓI BAO GỒM:</div>
              <div class="service-chips">${serviceBadges}</div>
            </div>
          </div>

          <div class="detail-card-block">
            <h2>🗺️ Lịch Trình Chuyến Đi Chi Tiết (${escapeHtml(t.duration_text)})</h2>
            <div class="itinerary-timeline">
              ${itineraryHtml}
            </div>
          </div>
        </div>

        <!-- Cột phải: Box Đặt Tour lưu vào Giỏ Hàng -->
        <aside class="tour-booking-sidebar">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 0.84rem; font-weight: 700; color: var(--text-muted);">GIÁ TOUR TRỌN GÓI</span>
            <img src="${escapeHtml(t.airline_logo)}" alt="${escapeHtml(t.airline_name)}" style="height: 30px; border-radius: 5px;" />
          </div>
          <div class="sidebar-price-big">${formatCurrency(t.price)} <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">/ khách</span></div>

          <div class="sidebar-summary-rows">
            <div class="sidebar-row">
              <span style="color: var(--text-muted);">Đơn vị tổ chức:</span>
              <strong>${escapeHtml(t.travel_agency)}</strong>
            </div>
            <div class="sidebar-row">
              <span style="color: var(--text-muted);">Khởi hành:</span>
              <strong>${escapeHtml(t.origin_name)} → ${escapeHtml(t.destination_name)}</strong>
            </div>
            <div class="sidebar-row">
              <span style="color: var(--text-muted);">Ngày &amp; giờ bay:</span>
              <strong>${formatDateVN(t.depart_date)} • ${escapeHtml(t.depart_time)}</strong>
            </div>
            <div class="sidebar-row">
              <span style="color: var(--text-muted);">Hãng bay / Tàu bay:</span>
              <strong>${escapeHtml(t.airline_name)} (${escapeHtml(t.aircraft)})</strong>
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <span style="font-weight: 700; font-size: 0.92rem;">Số lượng khách:</span>
            <div class="qty-stepper">
              <button type="button" id="btn-tour-qty-minus" aria-label="Giảm số khách">−</button>
              <span>${guestQty}</span>
              <button type="button" id="btn-tour-qty-plus" aria-label="Tăng số khách">+</button>
            </div>
          </div>

          <div style="background: var(--color-primary-light); padding: 14px 16px; border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
            <span style="font-weight: 800;">Tổng cộng:</span>
            <strong style="font-size: 1.35rem; color: var(--color-primary);">${formatCurrency(totalAmount)}</strong>
          </div>

          <button type="button" class="btn btn-primary btn-lg" style="width: 100%;" id="btn-add-tour-to-cart">
            🛒 Chọn tour (Lưu vào Giỏ Hàng)
          </button>
          <a href="tours.html" class="btn btn-ghost" style="width: 100%; margin-top: 10px;">← Xem các tour khác</a>
        </aside>
      </div>
    `;

    document.getElementById('btn-tour-qty-minus')?.addEventListener('click', () => {
      if (guestQty > 1) {
        guestQty -= 1;
        renderTourDetail();
      }
    });

    document.getElementById('btn-tour-qty-plus')?.addEventListener('click', () => {
      if (guestQty < 15) {
        guestQty += 1;
        renderTourDetail();
      }
    });

    document.getElementById('btn-add-tour-to-cart')?.addEventListener('click', handleAddTourToCart);
  }

  function handleAddTourToCart() {
    if (!currentTour) return;
    const t = currentTour;
    const seatClassLabel = `Tour Trọn Gói (${t.duration_text})`;
    const metadata = JSON.stringify({
      travel_agency: t.travel_agency,
      airline_name: t.airline_name,
      origin_name: t.origin_name,
      destination_name: t.destination_name,
      depart_date: t.depart_date,
      depart_time: t.depart_time,
      flight_duration: t.flight_duration,
      aircraft: t.aircraft
    });

    const existing = window.VietjetDB.queryOne(
      'SELECT id, quantity FROM cart_items WHERE item_type = ? AND ref_id = ?',
      ['tour', t.id]
    );

    if (existing) {
      window.VietjetDB.run('UPDATE cart_items SET quantity = ? WHERE id = ?', [
        Number(existing.quantity) + guestQty,
        existing.id
      ]);
    } else {
      window.VietjetDB.run(
        `INSERT INTO cart_items (item_type, ref_id, title, seat_class, quantity, unit_price, metadata_json)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['tour', t.id, t.title, seatClassLabel, guestQty, t.price, metadata]
      );
    }

    showToast({
      title: 'Đã lưu Tour vào Giỏ Hàng!',
      message: `${t.title} (${guestQty} khách)`,
      type: 'success',
      actionText: 'Mở Giỏ Hàng ngay →',
      actionHref: 'cart.html'
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    window.VietjetComponents.mountShell();
    const params = getParams();
    const tourId = Number(params.get('id')) || 1;

    try {
      await window.VietjetDB.init();
      window.VietjetComponents.syncDbStatus();

      currentTour = window.VietjetDB.queryOne(
        `SELECT t.*, a.name AS airline_name, a.logo_url AS airline_logo
         FROM tours t
         JOIN airlines a ON t.airline_code = a.code
         WHERE t.id = ?`,
        [tourId]
      );

      if (!currentTour) {
        document.getElementById('tour-detail-root').innerHTML = `
          <div class="empty-state">
            <h3>Không tìm thấy Tour du lịch</h3>
            <a href="tours.html" class="btn btn-primary">Quay lại danh sách Tour</a>
          </div>
        `;
        return;
      }

      itineraries = window.VietjetDB.query(
        'SELECT day_number, title, description FROM tour_itineraries WHERE tour_id = ? ORDER BY day_number ASC',
        [tourId]
      );

      renderTourDetail();
    } catch (err) {
      console.error(err);
    }
  });
})();
