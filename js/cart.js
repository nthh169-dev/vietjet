/* ==========================================================================
   VIETJET TRAVEL — GIỎ HÀNG & ĐĂNG KÝ CONTROLLER (js/cart.js)
   Quản lý cart_items trong SQLite, lưu bookings & gửi Email từ nvhai061993@gmail.com
   ========================================================================== */

(function () {
  const { formatCurrency, formatDateVN, escapeHtml, showToast } = window.VietjetUtils;

  function fetchCartItems() {
    return window.VietjetDB.query('SELECT * FROM cart_items ORDER BY id DESC');
  }

  function renderCart() {
    const listEl = document.getElementById('cart-items-container');
    const summaryEl = document.getElementById('cart-total-summary');
    const clearBtn = document.getElementById('btn-clear-cart');
    const submitBtn = document.getElementById('btn-submit-booking');
    if (!listEl) return;

    const items = fetchCartItems();

    if (clearBtn) {
      clearBtn.style.display = items.length ? 'inline-flex' : 'none';
    }
    if (submitBtn) {
      submitBtn.disabled = items.length === 0;
    }

    if (!items.length) {
      listEl.innerHTML = `
        <div class="empty-state">
          <h3>Giỏ hàng của bạn đang trống</h3>
          <p>Hãy lựa chọn chuyến bay hoặc một trong 8 tour du lịch nổi bật để bắt đầu hành trình cùng Vietjet.</p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <a href="flights.html" class="btn btn-primary">✈ Tìm Chuyến Bay</a>
            <a href="tours.html" class="btn btn-outline">🌴 Khám Phá Tour</a>
          </div>
        </div>
      `;
      if (summaryEl) summaryEl.innerHTML = '';
      return;
    }

    let grandTotal = 0;

    listEl.innerHTML = items
      .map((item) => {
        const lineTotal = Number(item.unit_price) * Number(item.quantity);
        grandTotal += lineTotal;

        let meta = {};
        try {
          meta = JSON.parse(item.metadata_json || '{}');
        } catch (_) {
          meta = {};
        }

        const isFlight = item.item_type === 'flight';
        const typeBadge = isFlight
          ? '<span class="badge badge-red">✈ Chuyến bay</span>'
          : '<span class="badge badge-gold">🌴 Tour du lịch</span>';

        const detailLink = isFlight
          ? `flight-detail.html?id=${encodeURIComponent(item.ref_id)}`
          : `tour-detail.html?id=${encodeURIComponent(item.ref_id)}`;

        return `
          <div class="cart-item-row" data-cart-id="${item.id}">
            <div class="cart-item-info">
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                ${typeBadge}
                <span class="badge badge-blue">${escapeHtml(item.seat_class)}</span>
              </div>
              <h3 class="cart-item-title">
                <a href="${escapeHtml(detailLink)}">${escapeHtml(item.title)}</a>
              </h3>
              <div class="cart-item-meta">
                ${meta.depart_date ? `<span>📅 Khởi hành: <strong>${formatDateVN(meta.depart_date)}</strong></span>` : ''}
                ${meta.depart_time ? `<span>🕒 Giờ bay: <strong>${escapeHtml(meta.depart_time)}</strong></span>` : ''}
                ${meta.aircraft ? `<span>🛩 Tàu bay: <strong>${escapeHtml(meta.aircraft)}</strong></span>` : ''}
                <span>Đơn giá: <strong>${formatCurrency(item.unit_price)}</strong></span>
              </div>
            </div>

            <div class="cart-item-right">
              <div class="cart-item-price">${formatCurrency(lineTotal)}</div>
              <div class="qty-stepper">
                <button type="button" class="btn-item-dec" data-id="${item.id}" aria-label="Giảm">−</button>
                <span>${item.quantity}</span>
                <button type="button" class="btn-item-inc" data-id="${item.id}" aria-label="Tăng">+</button>
              </div>
              <button type="button" class="remove-item-btn" data-id="${item.id}">✕ Xóa khỏi giỏ</button>
            </div>
          </div>
        `;
      })
      .join('');

    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="cart-total-box">
          <div>
            <div class="cart-total-label">Tổng thanh toán (${items.reduce((s, i) => s + Number(i.quantity), 0)} hành khách)</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">Đã bao gồm thuế, phí sân bay &amp; dịch vụ đi kèm</div>
          </div>
          <div class="cart-total-amount">${formatCurrency(grandTotal)}</div>
        </div>
      `;
    }

    // Bind stepper & delete buttons
    listEl.querySelectorAll('.btn-item-dec').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const row = window.VietjetDB.queryOne('SELECT quantity FROM cart_items WHERE id = ?', [id]);
        if (!row) return;
        if (Number(row.quantity) > 1) {
          window.VietjetDB.run('UPDATE cart_items SET quantity = ? WHERE id = ?', [
            Number(row.quantity) - 1,
            id
          ]);
        } else {
          window.VietjetDB.run('DELETE FROM cart_items WHERE id = ?', [id]);
        }
        renderCart();
      });
    });

    listEl.querySelectorAll('.btn-item-inc').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const row = window.VietjetDB.queryOne('SELECT quantity FROM cart_items WHERE id = ?', [id]);
        if (!row) return;
        window.VietjetDB.run('UPDATE cart_items SET quantity = ? WHERE id = ?', [
          Number(row.quantity) + 1,
          id
        ]);
        renderCart();
      });
    });

    listEl.querySelectorAll('.remove-item-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        window.VietjetDB.run('DELETE FROM cart_items WHERE id = ?', [id]);
        showToast({
          title: 'Đã xóa mục khỏi giỏ hàng',
          message: 'Giỏ hàng của bạn đã được cập nhật.',
          type: 'success'
        });
        renderCart();
      });
    });
  }

  function initEmailJsSettingsBox() {
    const cfg = window.VietjetEmailService.getSavedConfig();
    const pubInput = document.getElementById('cfg-public-key');
    const srvInput = document.getElementById('cfg-service-id');
    const tplInput = document.getElementById('cfg-template-id');
    const saveBtn = document.getElementById('btn-save-emailjs-cfg');

    if (pubInput) pubInput.value = cfg.PUBLIC_KEY;
    if (srvInput) srvInput.value = cfg.SERVICE_ID;
    if (tplInput) tplInput.value = cfg.TEMPLATE_ID;

    saveBtn?.addEventListener('click', () => {
      window.VietjetEmailService.saveConfig({
        PUBLIC_KEY: pubInput?.value || '',
        SERVICE_ID: srvInput?.value || '',
        TEMPLATE_ID: tplInput?.value || ''
      });
      showToast({
        title: 'Đã lưu cấu hình EmailJS',
        message: 'Hệ thống sẽ dùng thông tin này khi gửi email từ nvhai061993@gmail.com.',
        type: 'success'
      });
    });
  }

  function generateBookingCode() {
    const num = Math.floor(100000 + Math.random() * 900000);
    return `VJ-${num}`;
  }

  function openCompletionModal({ bookingCode, customerName, customerPhone, customerEmail, emailResult, totalAmount }) {
    const modal = document.getElementById('booking-success-modal');
    const body = document.getElementById('booking-success-body');
    if (!modal || !body) return;

    const statusBadge =
      emailResult.sentVia === 'emailjs-live'
        ? '<span class="badge badge-green">✓ Đã gửi Email trực tiếp qua EmailJS</span>'
        : '<span class="badge badge-red">✉ Đã tạo &amp; kích hoạt thư xác nhận (Chế độ Demo)</span>';

    body.innerHTML = `
      <div style="text-align: center;">
        <div class="modal-success-icon">✓</div>
        <span class="badge badge-green" style="margin-bottom: 8px;">ĐĂNG KÝ HOÀN THÀNH</span>
        <h2 style="font-size: 1.55rem; font-weight: 900; margin-bottom: 6px;">Chúc Mừng Quý Khách Đặt Chỗ Thành Công!</h2>
        <p style="color: var(--text-secondary); font-size: 0.94rem;">
          Mã đơn đặt chỗ của bạn là <strong style="color: var(--color-primary); font-size: 1.08rem;">${escapeHtml(bookingCode)}</strong> • Tổng thanh toán: <strong>${formatCurrency(totalAmount)}</strong>
        </p>
      </div>

      <div class="email-preview-card">
        <div class="email-preview-header">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
            <strong>Chi tiết Email Xác Nhận</strong>
            ${statusBadge}
          </div>
          <div>📤 Từ (Người gửi): <strong>${escapeHtml(emailResult.from)}</strong></div>
          <div>📥 Đến (Khách hàng): <strong>${escapeHtml(emailResult.to)}</strong></div>
          <div>📝 Tiêu đề: <strong>${escapeHtml(emailResult.subject)}</strong></div>
        </div>
        <div style="white-space: pre-line; color: var(--text-secondary); line-height: 1.6;">Xin chào <strong>${escapeHtml(customerName)}</strong> (SĐT: ${escapeHtml(customerPhone)}),
Cảm ơn quý khách đã tin tưởng lựa chọn dịch vụ của Vietjet!
Chi tiết hành trình đã đăng ký:
${escapeHtml(emailResult.orderSummary)}

Tổng cộng: <strong>${escapeHtml(emailResult.formattedTotal)}</strong>
Trân trọng,
Vietjet Travel &amp; Airlines (${escapeHtml(emailResult.from)})</div>
      </div>

      <div style="display: flex; justify-content: center; gap: 12px; margin-top: 22px; flex-wrap: wrap;">
        <a href="index.html" class="btn btn-primary">Về Trang Chủ</a>
        <button type="button" class="btn btn-outline" id="btn-close-success-modal">Đóng thông báo</button>
      </div>
    `;

    modal.classList.add('open');
    document.getElementById('btn-close-success-modal')?.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  function initCheckoutForm() {
    const form = document.getElementById('cart-checkout-form');
    if (!form) return;

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const items = fetchCartItems();
      if (!items.length) {
        showToast({
          title: 'Giỏ hàng đang trống',
          message: 'Vui lòng chọn ít nhất 1 chuyến bay hoặc tour trước khi đăng ký.',
          type: 'error'
        });
        return;
      }

      const customerName = document.getElementById('cust-name')?.value.trim() || '';
      const customerPhone = document.getElementById('cust-phone')?.value.trim() || '';
      const customerEmail = document.getElementById('cust-email')?.value.trim() || '';
      const customerNote = document.getElementById('cust-note')?.value.trim() || '';

      const phoneRegex = /^[0-9+\-\s]{9,15}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!customerName) {
        alert('Vui lòng nhập Họ và tên của quý khách.');
        return;
      }
      if (!phoneRegex.test(customerPhone)) {
        alert('Vui lòng nhập Số điện thoại hợp lệ (9 - 15 chữ số).');
        return;
      }
      if (!emailRegex.test(customerEmail)) {
        alert('Vui lòng nhập địa chỉ Email hợp lệ để nhận thư xác nhận.');
        return;
      }

      const submitBtn = document.getElementById('btn-submit-booking');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang xử lý & gửi Email...';
      }

      try {
        const totalAmount = items.reduce(
          (sum, item) => sum + Number(item.unit_price) * Number(item.quantity),
          0
        );
        const bookingCode = generateBookingCode();

        // Lưu vào bảng bookings trong SQLite
        window.VietjetDB.run(
          `INSERT INTO bookings (booking_code, customer_name, customer_phone, customer_email, customer_note, total_amount, sender_email)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            bookingCode,
            customerName,
            customerPhone,
            customerEmail,
            customerNote,
            totalAmount,
            window.VietjetEmailService.SENDER_EMAIL
          ]
        );

        const insertedBooking = window.VietjetDB.queryOne(
          'SELECT id FROM bookings WHERE booking_code = ?',
          [bookingCode]
        );

        if (insertedBooking) {
          for (const item of items) {
            window.VietjetDB.run(
              `INSERT INTO booking_items (booking_id, item_type, ref_id, title, seat_class, quantity, unit_price)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                insertedBooking.id,
                item.item_type,
                item.ref_id,
                item.title,
                item.seat_class,
                item.quantity,
                item.unit_price
              ]
            );
          }
        }

        // Gửi email từ nvhai061993@gmail.com tới email khách hàng
        const emailResult = await window.VietjetEmailService.sendBookingConfirmation({
          bookingCode,
          customerName,
          customerPhone,
          customerEmail,
          customerNote,
          items,
          totalAmount
        });

        // Xóa giỏ hàng sau khi hoàn tất đăng ký
        window.VietjetDB.run('DELETE FROM cart_items');
        form.reset();
        renderCart();

        openCompletionModal({
          bookingCode,
          customerName,
          customerPhone,
          customerEmail,
          emailResult,
          totalAmount
        });
      } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra khi hoàn tất đăng ký: ' + err.message);
      } finally {
        if (submitBtn) {
          submitBtn.textContent = '✓ Đăng Ký & Nhận Email Xác Nhận';
          submitBtn.disabled = fetchCartItems().length === 0;
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    window.VietjetComponents.mountShell();
    initEmailJsSettingsBox();

    try {
      await window.VietjetDB.init();
      window.VietjetComponents.syncDbStatus();
      renderCart();
      initCheckoutForm();

      document.getElementById('btn-clear-cart')?.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn xóa toàn bộ chuyến bay và tour trong Giỏ hàng?')) {
          window.VietjetDB.run('DELETE FROM cart_items');
          renderCart();
        }
      });
    } catch (err) {
      console.error(err);
    }
  });
})();
