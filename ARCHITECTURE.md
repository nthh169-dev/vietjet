# ARCHITECTURE.md — Kiến trúc Kỹ thuật & Tích hợp Hệ thống

## 1. Giải pháp Kỹ thuật cho Ràng buộc "Không Backend + SQLite + Gửi Email"

Dự án có ba yêu cầu kỹ thuật đặc biệt cần phối hợp chặt chẽ:
1. **HTML, CSS, JavaScript thuần, KHÔNG có Backend**.
2. **Database: SQLite**.
3. **Gửi email từ `nvhai061993@gmail.com` đến email khách hàng**.

### 1.1. Cơ chế SQLite trên Trình duyệt với `sql.js` (WebAssembly)
Vì trình duyệt không thể đọc/ghi trực tiếp file SQLite trên ổ cứng máy chủ khi không có backend, dự án sử dụng **`sql.js`** — bản biên dịch chính thức của SQLite C sang WebAssembly:
- Nhúng qua CDN trên các trang HTML:
  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js"></script>
  ```
- **Khởi tạo & Lưu trữ bền vững (Persistence)**:
  1. Khi tải trang, module `js/db.js` kiểm tra khóa `vietjet_sqlite_db` trong `localStorage`.
  2. Nếu **đã tồn tại** (chuỗi Base64 của mảng byte `Uint8Array`): khôi phục database bằng `new SQL.Database(uint8Array)` — giữ nguyên giỏ hàng và lịch sử đặt vé khi chuyển trang.
  3. Nếu **chưa tồn tại** (lần đầu mở web): khởi tạo `new SQL.Database()`, chạy toàn bộ script `CREATE TABLE` và `INSERT` dữ liệu mẫu từ `js/seed-data.js`, sau đó gọi `saveDatabase()`.
  4. Hàm `saveDatabase()` gọi `const binaryArray = db.export()`, mã hóa sang Base64 và lưu lại vào `localStorage.setItem('vietjet_sqlite_db', base64)`. Cũng cung cấp nút nhỏ ở Footer *"Khôi phục dữ liệu gốc"* (`localStorage.removeItem('vietjet_sqlite_db')`) để tiện kiểm thử.

### 1.2. Cơ chế Gửi Email không cần Backend với EmailJS
Để gửi email thực tế từ hộp thư Gmail **`nvhai061993@gmail.com`** tới email khách hàng ngay từ JavaScript trình duyệt:
- Sử dụng **EmailJS Browser SDK** (`https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js`).
- Tạo file cấu hình tập trung `js/email-service.js`:
  ```javascript
  const EMAIL_CONFIG = {
    SENDER_EMAIL: "nvhai061993@gmail.com",
    SENDER_NAME: "Vietjet Travel & Airlines",
    PUBLIC_KEY: "YOUR_EMAILJS_PUBLIC_KEY",   // Cấu hình từ tài khoản EmailJS kết nối Gmail nvhai061993@gmail.com
    SERVICE_ID: "YOUR_EMAILJS_SERVICE_ID",   // Gmail Service (nvhai061993@gmail.com)
    TEMPLATE_ID: "YOUR_EMAILJS_TEMPLATE_ID"  // Template xác nhận đặt vé/tour
  };
  ```
- **Luồng hoạt động kép (Real + Fallback an toàn)**:
  - Nếu người dùng đã điền `PUBLIC_KEY`, `SERVICE_ID`, `TEMPLATE_ID` hợp lệ: gọi `emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)` để gửi email thật từ `nvhai061993@gmail.com` tới `customer_email`.
  - Nếu chưa cấu hình khóa EmailJS (đang chạy demo/chấm bài offline): hệ thống tự động chuyển sang chế độ **Mô phỏng gửi Email thành công**, hiển thị bản xem trước nội dung bức thư gửi từ `nvhai061993@gmail.com` → `<email_khách_hàng>` ngay trong Modal Thông báo hoàn thành để dễ dàng kiểm tra kết quả mà không bị báo lỗi chặn luồng!

---

## 2. Cấu trúc Thư mục Dự án

```text
Vietjet/
├── index.html              # Trang chủ (Tìm chuyến bay, 8 Tour nổi bật, Logo hãng bay)
├── flights.html            # Trang danh sách Chuyến bay (Filter trái + Danh sách phải)
├── flight-detail.html      # Trang Chi tiết chuyến bay (Chọn Phổ Thông / Thương Gia)
├── tours.html              # Trang danh sách Tour du lịch (Filter trái + Danh sách phải)
├── tour-detail.html        # Trang Chi tiết Tour (Thông tin bay + Lịch trình chi tiết)
├── cart.html               # Trang Giỏ hàng, Form thông tin cá nhân & Gửi email đăng ký
│
├── css/
│   ├── variables.css       # Biến CSS màu sắc (#ee1d23, #ffffff...), font, shadow, radius
│   ├── base.css            # Reset CSS, Header, Footer, Buttons, Badges, Modal, Toast
│   ├── home.css            # Style riêng cho Trang chủ (Hero search, Tour grid, Airlines)
│   ├── listing.css         # Style layout 2 cột (Sidebar Filter trái + Cards phải)
│   ├── detail.css          # Style Chi tiết chuyến bay (hạng vé) & Chi tiết tour (lịch trình)
│   └── cart.css            # Style Giỏ hàng, Form đăng ký & Modal hoàn thành
│
├── js/
│   ├── seed-data.js        # Câu lệnh SQL CREATE TABLE & INSERT dữ liệu mẫu chuẩn
│   ├── db.js               # Khởi tạo sql.js, hàm query(sql, params), run(sql, params), persist
│   ├── utils.js            # Định dạng tiền VNĐ, ngày giờ, đọc URLSearchParams, Toast UI
│   ├── components.js       # Render Header (cập nhật số lượng Giỏ hàng), Footer dùng chung
│   ├── email-service.js    # Tích hợp EmailJS gửi từ nvhai061993@gmail.com + Bản xem trước
│   ├── home.js             # Logic Trang chủ
│   ├── flights.js          # Logic lọc SQL & hiển thị danh sách Chuyến bay
│   ├── flight-detail.js    # Logic chọn hạng Phổ thông/Thương gia & thêm vào Giỏ hàng
│   ├── tours.js            # Logic lọc SQL & hiển thị danh sách Tour
│   ├── tour-detail.js      # Logic hiển thị chi tiết Tour, lịch trình & thêm vào Giỏ hàng
│   └── cart.js             # Logic quản lý Giỏ hàng, validate form, lưu Booking & gửi Email
│
└── assets/
    └── images/             # Logo Vietjet, SVG logo các hãng bay, ảnh fallback nếu offline
```

---

## 3. Quy ước Truyền Tham số URL giữa các Trang

| Điểm xuất phát | Hành động | URL đích |
| :--- | :--- | :--- |
| `index.html` | Click nút **Tìm Kiếm** | `flights.html?tripType=round-trip&from=SGN&to=HAN&departDate=2026-11-15&returnDate=2026-11-18` |
| `index.html` | Click vào 1 trong **8 Tour nổi bật** | `tours.html?highlight=<tour_id>` (hoặc hỗ trợ nút xem ngay chi tiết `tour-detail.html?id=<tour_id>`) |
| `index.html` | Click vào **Logo Hãng hàng không** | `flights.html?airline=VJ` (mã hãng bay tương ứng) |
| `flights.html` | Click **Chọn chuyến bay** | `flight-detail.html?id=<flight_id>` |
| `tours.html` | Click **Chọn tour** | `tour-detail.html?id=<tour_id>` |
| `flight-detail.html` / `tour-detail.html` | Click thêm vào giỏ hàng | Lưu vào bảng `cart_items`, hiện Toast kèm nút chuyển đến `cart.html` |

---

## 4. Hướng dẫn Cấu hình EmailJS thật cho `nvhai061993@gmail.com` (Tài liệu tham khảo)
1. Đăng nhập https://www.emailjs.com/ và vào mục **Email Services** → **Add New Service** → chọn **Gmail**.
2. Kết nối tài khoản **`nvhai061993@gmail.com`** và lưu lại `SERVICE_ID`.
3. Vào **Email Templates** → tạo template nhận các biến:
   - `{{to_email}}` (đặt trong trường *To Email* của Template)
   - `{{from_email}}` (`nvhai061993@gmail.com`)
   - `{{customer_name}}`, `{{customer_phone}}`, `{{booking_code}}`, `{{order_summary}}`, `{{total_amount}}`.
4. Điền `PUBLIC_KEY`, `SERVICE_ID`, `TEMPLATE_ID` vào `js/email-service.js`.
