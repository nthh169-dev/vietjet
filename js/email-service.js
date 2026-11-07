/* ==========================================================================
   VIETJET TRAVEL — EMAIL SERVICE (js/email-service.js)
   Gửi email từ nvhai061993@gmail.com đến email của khách hàng qua EmailJS
   (Kèm cơ chế Fallback hiển thị bản xem trước Email khi chưa cấu hình API Key)
   ========================================================================== */

window.VietjetEmailService = (function () {
  const CONFIG_STORAGE_KEY = 'vietjet_emailjs_config_v1';

  const DEFAULT_CONFIG = {
    SENDER_EMAIL: 'nvhai061993@gmail.com',
    SENDER_NAME: 'Vietjet Travel & Airlines',
    PUBLIC_KEY: '',
    SERVICE_ID: '',
    TEMPLATE_ID: ''
  };

  function getSavedConfig() {
    try {
      const saved = JSON.parse(localStorage.getItem(CONFIG_STORAGE_KEY) || '{}');
      return {
        ...DEFAULT_CONFIG,
        PUBLIC_KEY: (saved.PUBLIC_KEY || DEFAULT_CONFIG.PUBLIC_KEY || '').trim(),
        SERVICE_ID: (saved.SERVICE_ID || DEFAULT_CONFIG.SERVICE_ID || '').trim(),
        TEMPLATE_ID: (saved.TEMPLATE_ID || DEFAULT_CONFIG.TEMPLATE_ID || '').trim()
      };
    } catch (_) {
      return { ...DEFAULT_CONFIG };
    }
  }

  function saveConfig({ PUBLIC_KEY, SERVICE_ID, TEMPLATE_ID }) {
    localStorage.setItem(
      CONFIG_STORAGE_KEY,
      JSON.stringify({
        PUBLIC_KEY: (PUBLIC_KEY || '').trim(),
        SERVICE_ID: (SERVICE_ID || '').trim(),
        TEMPLATE_ID: (TEMPLATE_ID || '').trim()
      })
    );
  }

  function buildOrderSummaryText(items) {
    return items
      .map(
        (item, idx) =>
          `${idx + 1}. [${item.item_type === 'flight' ? 'Chuyến bay' : 'Tour'}] ${item.title} (${item.seat_class}) x ${item.quantity} khách = ${window.VietjetUtils.formatCurrency(item.unit_price * item.quantity)}`
      )
      .join('\n');
  }

  async function sendBookingConfirmation({ bookingCode, customerName, customerPhone, customerEmail, customerNote, items, totalAmount }) {
    const cfg = getSavedConfig();
    const orderSummary = buildOrderSummaryText(items);
    const formattedTotal = window.VietjetUtils.formatCurrency(totalAmount);

    const templateParams = {
      from_name: cfg.SENDER_NAME,
      from_email: cfg.SENDER_EMAIL,
      reply_to: cfg.SENDER_EMAIL,
      to_email: customerEmail,
      to_name: customerName,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      customer_note: customerNote || 'Không có ghi chú',
      booking_code: bookingCode,
      order_summary: orderSummary,
      total_amount: formattedTotal
    };

    const hasRealKeys =
      cfg.PUBLIC_KEY &&
      cfg.SERVICE_ID &&
      cfg.TEMPLATE_ID &&
      !cfg.PUBLIC_KEY.startsWith('YOUR_');

    if (hasRealKeys && window.emailjs && typeof window.emailjs.send === 'function') {
      try {
        await window.emailjs.send(cfg.SERVICE_ID, cfg.TEMPLATE_ID, templateParams, {
          publicKey: cfg.PUBLIC_KEY
        });
        return {
          sentVia: 'emailjs-live',
          from: cfg.SENDER_EMAIL,
          to: customerEmail,
          subject: `[Vietjet] Xác nhận đăng ký đặt chỗ thành công #${bookingCode}`,
          orderSummary,
          formattedTotal
        };
      } catch (err) {
        console.warn('EmailJS gửi lỗi, chuyển sang chế độ xác nhận mô phỏng:', err);
        return {
          sentVia: 'fallback-after-error',
          errorDetail: err && (err.text || err.message) ? String(err.text || err.message) : 'Lỗi kết nối EmailJS',
          from: cfg.SENDER_EMAIL,
          to: customerEmail,
          subject: `[Vietjet] Xác nhận đăng ký đặt chỗ thành công #${bookingCode}`,
          orderSummary,
          formattedTotal
        };
      }
    }

    return {
      sentVia: 'simulated',
      from: cfg.SENDER_EMAIL,
      to: customerEmail,
      subject: `[Vietjet] Xác nhận đăng ký đặt chỗ thành công #${bookingCode}`,
      orderSummary,
      formattedTotal
    };
  }

  return {
    SENDER_EMAIL: DEFAULT_CONFIG.SENDER_EMAIL,
    getSavedConfig,
    saveConfig,
    sendBookingConfirmation
  };
})();
