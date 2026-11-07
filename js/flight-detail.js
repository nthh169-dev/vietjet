/* ==========================================================================
   VIETJET TRAVEL — CHI TIẾT CHUYẾN BAY CONTROLLER (js/flight-detail.js)
   Chọn Hạng Phổ Thông / Hạng Thương Gia và lưu vào Giỏ Hàng (cart_items)
   ========================================================================== */

(function () {
  const { formatCurrency, formatDateVN, escapeHtml, getParams, showToast } = window.VietjetUtils;

  let currentFlight = null;
  let selectedClass = 'economy'; // 'economy' | 'business'
  let passengerQty = 1;

  function renderFlightDetail() {
    const root = document.getElementById('flight-detail-root');
    if (!root || !currentFlight) return;

    const f = currentFlight;
    const isBusiness = selectedClass === 'business';
    const unitPrice = isBusiness ? f.price_business : f.price_economy;
    const totalPrice = unitPrice * passengerQty;

    const serviceItems = String(f.services || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => `<span class="service-chip">✓ ${escapeHtml(s)}</span>`)
      .join('');

    root.innerHTML = `
      <div class="flight-summary-hero">
        <div class="flight-summary-banner">
          <div>
            <span class="badge badge-gold" style="margin-bottom: 6px;">✈ CHI TIẾT HÀNH TRÌNH BAY</span>
            <h1>${escapeHtml(f.origin_name)} → ${escapeHtml(f.destination_name)}</h1>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.85rem; opacity: 0.9;">Số hiệu chuyến bay</div>
            <div style="font-size: 1.35rem; font-weight: 900;">${escapeHtml(f.flight_number)} • ${escapeHtml(f.airline_name)}</div>
          </div>
        </div>

        <div class="flight-summary-body">
          <div>
            <div class="flight-route-visual">
              <div class="route-point">
                <h3>${escapeHtml(f.depart_time)}</h3>
                <p>${escapeHtml(f.origin_name)}</p>
                <span style="font-size: 0.82rem; color: var(--text-muted);">Ngày đi: ${formatDateVN(f.depart_date)}</span>
              </div>

              <div class="flight-duration-track" style="max-width: 220px;">
                <span class="duration-label">Thời gian bay: ${escapeHtml(f.duration)}</span>
                <div class="track-line"><span class="track-plane" style="background: var(--bg-light);">✈</span></div>
                <span class="badge ${f.stop_type === 'direct' ? 'badge-green' : 'badge-gold'}">
                  ${f.stop_type === 'direct' ? 'Bay thẳng' : 'Nhiều thành phố'}
                </span>
              </div>

              <div class="route-point" style="text-align: right;">
                <h3>${escapeHtml(f.arrive_time)}</h3>
                <p>${escapeHtml(f.destination_name)}</p>
                <span style="font-size: 0.82rem; color: var(--text-muted);">
                  ${f.return_date ? `Ngày về: ${formatDateVN(f.return_date)}` : 'Vé một chiều'}
                </span>
              </div>
            </div>

            <div class="flight-specs-grid">
              <div class="spec-box">
                <div class="spec-label">Hãng hàng không</div>
                <div class="spec-value">${escapeHtml(f.airline_name)}</div>
              </div>
              <div class="spec-box">
                <div class="spec-label">Loại máy bay</div>
                <div class="spec-value">🛩 ${escapeHtml(f.aircraft)}</div>
              </div>
              <div class="spec-box">
                <div class="spec-label">Loại hành trình</div>
                <div class="spec-value">${f.trip_type === 'round-trip' ? 'Vé khứ hồi' : 'Vé một chiều'}</div>
              </div>
            </div>

            <div style="margin-top: 16px;">
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">DỊCH VỤ CHUYẾN BAY ĐI KÈM:</div>
              <div class="service-chips">${serviceItems}</div>
            </div>
          </div>

          <div class="aircraft-showcase">
            <img src="images/2aOboRAvPCl8aJFLRvC9C6cuHOJz016Hhl8xEeG0.jpg" alt="${escapeHtml(f.aircraft)}" />
            <div class="aircraft-caption">
              <span>Tàu bay khai thác: <strong>${escapeHtml(f.aircraft)}</strong></span>
              <img src="${escapeHtml(f.airline_logo)}" alt="${escapeHtml(f.airline_name)}" style="height: 28px; border-radius: 4px;" />
            </div>
          </div>
        </div>
      </div>

      <!-- KHU VỰC CHỌN HẠNG GIÁ VÉ -->
      <div class="section-header" style="margin-bottom: 18px;">
        <div>
          <span class="section-eyebrow">Lựa chọn hạng dịch vụ</span>
          <h2 class="section-title">Chọn Giá Vé Phù Hợp Cho Hành Trình Của Bạn</h2>
        </div>
      </div>

      <div class="fare-classes-grid">
        <!-- Thẻ 1: Hạng Phổ Thông -->
        <div class="fare-card fare-card-economy ${!isBusiness ? 'selected' : ''}" data-select-class="economy" role="button" tabindex="0">
          <div class="fare-card-head">
            <div>
              <div class="fare-name">Hạng Phổ Thông</div>
              <div class="fare-sub">Economy / SkyEco Tiết Kiệm</div>
            </div>
            <span class="badge badge-red">Phổ biến</span>
          </div>
          <div class="fare-price-box">
            <div class="fare-price-amount">${formatCurrency(f.price_economy)}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">Giá vé / 1 hành khách (đã gồm thuế phí)</div>
          </div>
          <ul class="fare-perks-list">
            <li><span class="perk-check">✓</span> <span>07kg – 10kg hành lý xách tay tiêu chuẩn</span></li>
            <li><span class="perk-check">✓</span> <span>Ghế ngồi êm ái trên tàu bay <strong>${escapeHtml(f.aircraft)}</strong></span></li>
            <li><span class="perk-check">✓</span> <span>${escapeHtml(f.services)}</span></li>
            <li><span class="perk-check">✓</span> <span>Hỗ trợ làm thủ tục trực tuyến (Online Check-in)</span></li>
          </ul>
          <div class="fare-select-indicator">
            ${!isBusiness ? '✓ Đang chọn Hạng Phổ Thông' : 'Chọn Hạng Phổ Thông'}
          </div>
        </div>

        <!-- Thẻ 2: Hạng Thương Gia -->
        <div class="fare-card fare-card-business ${isBusiness ? 'selected' : ''}" data-select-class="business" role="button" tabindex="0">
          <div class="fare-card-head">
            <div>
              <div class="fare-name">Hạng Thương Gia</div>
              <div class="fare-sub">SkyBoss Business Đẳng Cấp</div>
            </div>
            <span class="badge badge-gold">★ VIP Thương Gia</span>
          </div>
          <div class="fare-price-box">
            <div class="fare-price-amount">${formatCurrency(f.price_business)}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">Giá vé / 1 hành khách (đặc quyền ưu tiên trọn gói)</div>
          </div>
          <ul class="fare-perks-list">
            <li><span class="perk-check">✓</span> <span><strong>18kg xách tay + 30kg hành lý ký gửi</strong> miễn phí</span></li>
            <li><span class="perk-check">✓</span> <span>Đặc quyền sử dụng <strong>Phòng chờ Thương gia sang trọng</strong></span></li>
            <li><span class="perk-check">✓</span> <span>Ưu tiên làm thủ tục check-in, lối đi riêng &amp; xe đưa đón sân đỗ</span></li>
            <li><span class="perk-check">✓</span> <span>Thưởng thức ẩm thực nóng thực đơn 5 sao &amp; miễn phí đổi lịch bay</span></li>
          </ul>
          <div class="fare-select-indicator">
            ${isBusiness ? '✓ Đang chọn Hạng Thương Gia' : 'Chọn Hạng Thương Gia'}
          </div>
        </div>
      </div>

      <!-- THANH XÁC NHẬN THÊM VÀO GIỎ HÀNG -->
      <div class="booking-confirm-bar">
        <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">HẠNG VÉ ĐANG CHỌN</div>
            <div style="font-size: 1.08rem; font-weight: 900; color: var(--text-primary);">
              ${isBusiness ? 'Hạng Thương Gia (Business)' : 'Hạng Phổ Thông (Economy)'}
            </div>
          </div>

          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">SỐ HÀNH KHÁCH</div>
            <div class="qty-stepper">
              <button type="button" id="btn-qty-minus" aria-label="Giảm số khách">−</button>
              <span id="passenger-qty-val">${passengerQty}</span>
              <button type="button" id="btn-qty-plus" aria-label="Tăng số khách">+</button>
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 22px; flex-wrap: wrap;">
          <div style="text-align: right;">
            <div style="font-size: 0.82rem; color: var(--text-muted);">Tổng tạm tính (${passengerQty} khách)</div>
            <div style="font-size: 1.65rem; font-weight: 900; color: var(--color-primary);">${formatCurrency(totalPrice)}</div>
          </div>

          <button type="button" class="btn btn-primary btn-lg" id="btn-add-flight-to-cart">
            🛒 Chọn chuyến bay (Lưu vào Giỏ Hàng)
          </button>
        </div>
      </div>
    `;

    // Bind fare card selection
    root.querySelectorAll('.fare-card').forEach((card) => {
      card.addEventListener('click', () => {
        selectedClass = card.getAttribute('data-select-class') || 'economy';
        renderFlightDetail();
      });
    });

    document.getElementById('btn-qty-minus')?.addEventListener('click', () => {
      if (passengerQty > 1) {
        passengerQty -= 1;
        renderFlightDetail();
      }
    });

    document.getElementById('btn-qty-plus')?.addEventListener('click', () => {
      if (passengerQty < 9) {
        passengerQty += 1;
        renderFlightDetail();
      }
    });

    document.getElementById('btn-add-flight-to-cart')?.addEventListener('click', handleAddFlightToCart);
  }

  function handleAddFlightToCart() {
    if (!currentFlight) return;
    const f = currentFlight;
    const seatClassLabel = selectedClass === 'business' ? 'Hạng Thương Gia' : 'Hạng Phổ Thông';
    const unitPrice = selectedClass === 'business' ? f.price_business : f.price_economy;
    const title = `${f.airline_name} (${f.flight_number}): ${f.origin_name} → ${f.destination_name}`;

    const metadata = JSON.stringify({
      airline_name: f.airline_name,
      flight_number: f.flight_number,
      depart_date: f.depart_date,
      return_date: f.return_date,
      depart_time: f.depart_time,
      arrive_time: f.arrive_time,
      duration: f.duration,
      aircraft: f.aircraft,
      trip_type: f.trip_type
    });

    const existing = window.VietjetDB.queryOne(
      'SELECT id, quantity FROM cart_items WHERE item_type = ? AND ref_id = ? AND seat_class = ?',
      ['flight', f.id, seatClassLabel]
    );

    if (existing) {
      window.VietjetDB.run('UPDATE cart_items SET quantity = ? WHERE id = ?', [
        Number(existing.quantity) + passengerQty,
        existing.id
      ]);
    } else {
      window.VietjetDB.run(
        `INSERT INTO cart_items (item_type, ref_id, title, seat_class, quantity, unit_price, metadata_json)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['flight', f.id, title, seatClassLabel, passengerQty, unitPrice, metadata]
      );
    }

    showToast({
      title: 'Đã lưu chuyến bay vào Giỏ Hàng!',
      message: `${title} • ${seatClassLabel} (${passengerQty} khách)`,
      type: 'success',
      actionText: 'Mở Giỏ Hàng ngay →',
      actionHref: 'cart.html'
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    window.VietjetComponents.mountShell();
    const params = getParams();
    const flightId = Number(params.get('id')) || 1;
    if (params.get('seatClass') === 'business') {
      selectedClass = 'business';
    }

    try {
      await window.VietjetDB.init();
      window.VietjetComponents.syncDbStatus();

      currentFlight = window.VietjetDB.queryOne(
        `SELECT f.*, a.name AS airline_name, a.logo_url AS airline_logo
         FROM flights f
         JOIN airlines a ON f.airline_code = a.code
         WHERE f.id = ?`,
        [flightId]
      );

      if (!currentFlight) {
        document.getElementById('flight-detail-root').innerHTML = `
          <div class="empty-state">
            <h3>Không tìm thấy chuyến bay</h3>
            <p>Chuyến bay bạn yêu cầu không tồn tại trong cơ sở dữ liệu.</p>
            <a href="flights.html" class="btn btn-primary">Quay lại danh sách Chuyến bay</a>
          </div>
        `;
        return;
      }

      renderFlightDetail();
    } catch (err) {
      console.error(err);
    }
  });
})();
