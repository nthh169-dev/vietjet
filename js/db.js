/* ==========================================================================
   VIETJET TRAVEL — SQLITE ENGINE LAYER (js/db.js)
   Đọc dữ liệu trực tiếp từ file sqlite/vietjet.db bằng sql.js (WebAssembly)
   và đồng bộ các bảng giao dịch (cart_items, bookings, booking_items) qua localStorage
   ========================================================================== */

window.VietjetDB = (function () {
  const USER_STATE_KEY = 'vietjet_db_user_tables_v1';
  const SQL_WASM_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/';
  const DB_FILE_PATH = 'sqlite/vietjet.db';

  let dbInstance = null;
  let initPromise = null;
  let dbSourceLabel = 'sqlite/vietjet.db';

  function base64ToUint8Array(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  async function loadDatabaseBytes() {
    // 1. Nếu người dùng đã chủ động nạp file vietjet.db mới trong phiên làm việc (khi mở bằng file://)
    const manualDbBase64 = sessionStorage.getItem('vietjet_manual_db_b64');
    if (window.location.protocol === 'file:' && manualDbBase64) {
      dbSourceLabel = 'sqlite/vietjet.db (Đã nạp thủ công)';
      return base64ToUint8Array(manualDbBase64);
    }

    // 2. Luôn ưu tiên đọc trực tiếp file sqlite/vietjet.db mới nhất (chống cache bằng timestamp)
    try {
      const cacheBuster = `${DB_FILE_PATH}?t=${Date.now()}`;
      const response = await fetch(cacheBuster, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const buffer = await response.arrayBuffer();
      dbSourceLabel = 'sqlite/vietjet.db (Đọc trực tiếp Live)';
      return new Uint8Array(buffer);
    } catch (err) {
      if (window.VIETJET_DB_BASE64) {
        dbSourceLabel =
          window.location.protocol === 'file:'
            ? 'Bản tĩnh (Đang mở file:// — Hãy chạy qua localhost để đọc vietjet.db Live)'
            : 'sqlite/vietjet.db (Snapshot)';
        return base64ToUint8Array(window.VIETJET_DB_BASE64);
      }
      throw new Error('Không thể tải file cơ sở dữ liệu sqlite/vietjet.db: ' + err.message);
    }
  }

  function queryRaw(db, sql, params = []) {
    const stmt = db.prepare(sql);
    const rows = [];
    try {
      if (params && params.length > 0) {
        stmt.bind(params);
      }
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
    } finally {
      stmt.free();
    }
    return rows;
  }

  function restoreUserTables(db) {
    try {
      const raw = localStorage.getItem(USER_STATE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);

      if (Array.isArray(saved.cart_items) && saved.cart_items.length > 0) {
        db.run('DELETE FROM cart_items;');
        const stmt = db.prepare(
          `INSERT INTO cart_items (id, item_type, ref_id, title, seat_class, quantity, unit_price, metadata_json, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );
        try {
          for (const item of saved.cart_items) {
            stmt.run([
              item.id,
              item.item_type,
              item.ref_id,
              item.title,
              item.seat_class,
              item.quantity,
              item.unit_price,
              item.metadata_json || null,
              item.created_at || new Date().toISOString()
            ]);
          }
        } finally {
          stmt.free();
        }
      }

      if (Array.isArray(saved.bookings) && saved.bookings.length > 0) {
        db.run('DELETE FROM booking_items;');
        db.run('DELETE FROM bookings;');
        const bStmt = db.prepare(
          `INSERT INTO bookings (id, booking_code, customer_name, customer_phone, customer_email, customer_note, total_amount, sender_email, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );
        try {
          for (const b of saved.bookings) {
            bStmt.run([
              b.id,
              b.booking_code,
              b.customer_name,
              b.customer_phone,
              b.customer_email,
              b.customer_note || '',
              b.total_amount,
              b.sender_email || 'nvhai061993@gmail.com',
              b.created_at || new Date().toISOString()
            ]);
          }
        } finally {
          bStmt.free();
        }

        if (Array.isArray(saved.booking_items) && saved.booking_items.length > 0) {
          const biStmt = db.prepare(
            `INSERT INTO booking_items (id, booking_id, item_type, ref_id, title, seat_class, quantity, unit_price)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
          );
          try {
            for (const bi of saved.booking_items) {
              biStmt.run([
                bi.id,
                bi.booking_id,
                bi.item_type,
                bi.ref_id,
                bi.title,
                bi.seat_class,
                bi.quantity,
                bi.unit_price
              ]);
            }
          } finally {
            biStmt.free();
          }
        }
      }
    } catch (e) {
      console.warn('Khôi phục dữ liệu giỏ hàng từ localStorage thất bại:', e);
    }
  }

  function persistUserTables() {
    if (!dbInstance) return;
    try {
      const payload = {
        cart_items: queryRaw(dbInstance, 'SELECT * FROM cart_items ORDER BY id ASC'),
        bookings: queryRaw(dbInstance, 'SELECT * FROM bookings ORDER BY id ASC'),
        booking_items: queryRaw(dbInstance, 'SELECT * FROM booking_items ORDER BY id ASC')
      };
      localStorage.setItem(USER_STATE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Lưu trạng thái SQLite vào localStorage thất bại:', e);
    }
  }

  async function init() {
    if (dbInstance) return dbInstance;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      if (typeof window.initSqlJs !== 'function') {
        throw new Error('Thư viện sql.js chưa được nạp.');
      }
      const [SQL, dbBytes] = await Promise.all([
        window.initSqlJs({ locateFile: (file) => `${SQL_WASM_CDN}${file}` }),
        loadDatabaseBytes()
      ]);

      dbInstance = new SQL.Database(dbBytes);
      dbInstance.run('PRAGMA foreign_keys = ON;');
      restoreUserTables(dbInstance);
      return dbInstance;
    })();

    return initPromise;
  }

  function query(sql, params = []) {
    if (!dbInstance) throw new Error('Database chưa khởi tạo. Hãy gọi await VietjetDB.init() trước.');
    return queryRaw(dbInstance, sql, params);
  }

  function queryOne(sql, params = []) {
    const rows = query(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }

  function run(sql, params = []) {
    if (!dbInstance) throw new Error('Database chưa khởi tạo. Hãy gọi await VietjetDB.init() trước.');
    dbInstance.run(sql, params);
    persistUserTables();
    document.dispatchEvent(new CustomEvent('vietjet:cart-updated'));
  }

  function getCartCount() {
    if (!dbInstance) return 0;
    const row = queryOne('SELECT COALESCE(SUM(quantity), 0) AS total FROM cart_items');
    return row ? Number(row.total) : 0;
  }

  function getSourceLabel() {
    return dbSourceLabel;
  }

  function resetUserState() {
    localStorage.removeItem(USER_STATE_KEY);
    if (dbInstance) {
      dbInstance.run('DELETE FROM cart_items;');
      dbInstance.run('DELETE FROM booking_items;');
      dbInstance.run('DELETE FROM bookings;');
    }
    document.dispatchEvent(new CustomEvent('vietjet:cart-updated'));
  }

  return {
    init,
    query,
    queryOne,
    run,
    getCartCount,
    getSourceLabel,
    resetUserState
  };
})();
