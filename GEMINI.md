# GEMINI.md — Quy tắc & Ngữ cảnh Dự án Website Du lịch Vietjet

Tài liệu này là **Workspace Rule** mặc định cho **Google Antigravity**. Mọi tác vụ lập trình, thiết kế giao diện, xử lý dữ liệu và kiểm thử trong workspace này PHẢI tuân thủ nghiêm ngặt các quy định dưới đây.

---

## 1. Tổng quan Dự án
- **Tên website**: **Vietjet** (Website đặt vé máy bay & tour du lịch trực tuyến)
- **Ngôn ngữ lập trình**: HTML5, CSS3, JavaScript thuần (Vanilla ES6+) — **TUYỆT ĐỐI KHÔNG dùng Backend server** (không Node.js/Express, PHP, Python backend...) và không dùng framework JS nặng (React/Vue/Angular).
- **Cơ sở dữ liệu**: **SQLite chạy trực tiếp trên trình duyệt** thông qua thư viện `sql.js` (WebAssembly) kết hợp lưu trữ bền vững (`db.export()`) vào `localStorage` để giữ nguyên dữ liệu giữa các trang HTML.
- **Gửi Email**: Sử dụng **EmailJS** (Client-side SDK) cấu hình tài khoản gửi từ `nvhai061993@gmail.com` đến email của khách hàng khi hoàn tất đăng ký tại Giỏ hàng (kèm chế độ fallback mô phỏng trực quan nếu chưa điền API Key).
- **Phong cách thiết kế (Theme)**:
  - Tông màu sáng (Light Mode), nền chính màu trắng (`#FFFFFF`), nền phụ xám cực nhạt (`#F8F9FA`).
  - Màu chủ đạo (Primary Brand Color): **Đỏ Vietjet (`#EE1D23`)**, hover (`#C81016`).
  - Màu nhấn phụ (Accent): Vàng ánh kim (`#FFC107` / `#FFD400`) cho nhãn khuyến mãi hoặc hạng Thương Gia.

---

## 2. Bản đồ Tài liệu Đặc tả Dự án (Bắt buộc đọc trước khi code)

Trước khi triển khai bất kỳ tính năng nào, Agent phải dùng công cụ `read_file` đọc các tài liệu đặc tả tương ứng tại thư mục gốc:

1. [PRD.md](./PRD.md) — Yêu cầu nghiệp vụ tổng thể, luồng người dùng (User Flows) và danh mục tính năng.
2. [ARCHITECTURE.md](./ARCHITECTURE.md) — Cấu trúc thư mục, cơ chế hoạt động của SQLite (`sql.js`) không cần backend, điều hướng URL params và tích hợp EmailJS (`nvhai061993@gmail.com`).
3. [DATABASE.md](./DATABASE.md) — Schema SQLite đầy đủ (`CREATE TABLE`) và dữ liệu mẫu (`INSERT`) cho hãng bay, chuyến bay, 8 tour nổi bật, lịch trình tour, giỏ hàng và đơn đăng ký.
4. [UI_UX_DESIGN.md](./UI_UX_DESIGN.md) — Hệ thống Design Tokens (màu `#ee1d23`, font chữ, spacing), bố cục các thành phần UI, thẻ chọn hạng vé Phổ Thông / Thương Gia, thumbnail `600x400`.
5. [PAGES_SPEC.md](./PAGES_SPEC.md) — Đặc tả chi tiết từng trang: Trang chủ, Chuyến bay, Chi tiết chuyến bay, Tour, Chi tiết Tour và Giỏ hàng.
6. [TASKS.md](./TASKS.md) — Lộ trình triển khai từng bước (Checklist) để xây dựng và kiểm thử hoàn chỉnh dự án.

---

## 3. Quy tắc Kỹ thuật Cốt lõi (Coding Standards)

1. **Không Backend (Pure Static Multi-Page App)**:
   - Tất cả các trang là file `.html` độc lập (`index.html`, `flights.html`, `flight-detail.html`, `tours.html`, `tour-detail.html`, `cart.html`).
   - Truyền tham số giữa các trang thông qua **URL Query Parameters** (ví dụ: `flights.html?from=SGN&to=HAN&tripType=round-trip`, `flight-detail.html?id=1`, `tour-detail.html?id=3`) và lưu trạng thái dữ liệu trong **SQLite (`sql.js` + `localStorage`)**.
2. **SQLite bắt buộc hoạt động thực tế**:
   - Mọi thao tác lấy danh sách chuyến bay, lọc chuyến bay, lấy 8 tour nổi bật, xem chi tiết, thêm/xóa giỏ hàng và lưu đơn đăng ký **PHẢI truy vấn bằng câu lệnh SQL (`SELECT`, `WHERE`, `ORDER BY`, `INSERT`, `DELETE`)** thông qua tầng `js/db.js`, không lọc mảng hardcode bỏ qua SQLite.
   - Sử dụng **Parameterized Queries** (`stmt.bind([...])`) để tránh lỗi cú pháp và SQL Injection.
3. **Chuẩn hình ảnh & tài nguyên**:
   - Ảnh thumbnail của 8 tour du lịch ở Trang chủ và Trang Tour có tỷ lệ chuẩn **`600x400`** (`width="600" height="400"`, `aspect-ratio: 3 / 2`, `object-fit: cover`).
   - Logo các hãng hàng không (VietJet Air, Vietnam Airlines, Singapore Airlines, Bamboo Airways...) hiển thị sắc nét bằng SVG nội tuyến hoặc ảnh chất lượng cao có fallback.
4. **Định dạng tiền tệ & ngôn ngữ**:
   - Toàn bộ giao diện hiển thị bằng **Tiếng Việt** tự nhiên, chuyên nghiệp.
   - Giá tiền định dạng theo chuẩn Việt Nam Đồng: ví dụ `1.450.000 ₫` (`Intl.NumberFormat('vi-VN')`).
5. **Chất lượng Giao diện (UI/UX)**:
   - Giao diện sáng sủa, hiện đại, bóng đổ nhẹ (`box-shadow`), bo góc tinh tế (`8px` - `16px`), hiệu ứng hover mượt mà.
   - Đảm bảo Responsive tốt trên cả Desktop (layout 2 cột trái/phải cho trang danh sách) và Mobile/Tablet.
   - Header luôn hiển thị thanh điều hướng (Trang chủ, Chuyến bay, Tour du lịch, Giỏ hàng kèm **badge đếm số lượng** cập nhật tức thì).
