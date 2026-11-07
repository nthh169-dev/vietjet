# TASKS.md — Kế hoạch Triển khai Từng Bước với Antigravity

Bạn có thể yêu cầu **Antigravity** thực hiện toàn bộ dự án trong một lần hoặc làm lần lượt theo 5 giai đoạn dưới đây để dễ kiểm soát chất lượng.

---

## Danh sách Công việc (Implementation Checklist)

### Giai đoạn 1: Khởi tạo Nền tảng, Giao diện Chung & Cơ sở Dữ liệu SQLite
- [x] Tạo cấu trúc thư mục `css/`, `js/`, `assets/images/`.
- [x] Xây dựng `css/variables.css` và `css/base.css` với tông sáng nền trắng `#FFFFFF`, màu chủ đạo đỏ Vietjet `#EE1D23`, Header sticky (có badge đếm Giỏ hàng) và Footer.
- [x] Khởi tạo CSDL SQLite `sqlite/vietjet.db` (từ bộ `sqlite/*.sql`) chứa đầy đủ `airlines`, `flights`, **8 tour nổi bật** thumbnail `600x400` trong `tours`, `tour_itineraries`.
- [x] Viết `js/db.js` tích hợp `sql.js` (WebAssembly) đọc trực tiếp từ `sqlite/vietjet.db` trên trình duyệt và đồng bộ `localStorage`.
- [x] Viết `js/utils.js` và `js/components.js` để dùng chung trên cả 6 trang.

### Giai đoạn 2: Xây dựng Trang Chủ (`index.html`)
- [x] Thiết kế khối Tìm kiếm chuyến bay: chuyển đổi Vé khứ hồi / Vé một chiều, chọn Điểm xuất phát, Điểm đến, Ngày đi, Ngày về, nút **Tìm Kiếm** dẫn tới `flights.html`.
- [x] Render **8 tour du lịch nổi bật** từ SQLite với ảnh thumbnail chuẩn `600x400`, hãng du lịch, số ngày/đêm, giá tour; click dẫn đến `tours.html`.
- [x] Render danh sách **Logo các hãng hàng không** (VietJet Air, Vietnam Airlines, Singapore Airlines...); click vào logo dẫn đến `flights.html?airline=...`.

### Giai đoạn 3: Xây dựng Cụm Trang Chuyến Bay (`flights.html` & `flight-detail.html`)
- [x] Trang `flights.html`: Tạo Sidebar Filter bên trái (giá tăng/giảm dần, khứ hồi/một chiều, bay thẳng/nhiều thành phố, hãng bay, khung giờ cất cánh, hạng Phổ thông/Thương gia) + danh sách chuyến bay bên phải truy vấn bằng SQL động.
- [x] Trang `flight-detail.html`: Hiển thị điểm đi, điểm đến, thời gian bay, hãng bay, loại máy bay (Boeing, Airbus...).
- [x] Thiết kế 2 thẻ chọn giá vé **Hạng Phổ Thông** và **Hạng Thương Gia** trực quan; nút **Chọn chuyến bay** lưu vào bảng `cart_items` trong SQLite.

### Giai đoạn 4: Xây dựng Cụm Trang Tour Du Lịch (`tours.html` & `tour-detail.html`)
- [x] Trang `tours.html`: Tạo Sidebar Filter bên trái (giá tăng/giảm dần, hãng hàng không, khung giờ cất cánh) + danh sách tour bên phải truy vấn từ SQLite.
- [x] Trang `tour-detail.html`: Hiển thị điểm đi, điểm đến, thời gian bay, hãng bay, loại máy bay (Boeing, Airbus...) và **Lịch trình chuyến đi** theo từng ngày.
- [x] Xử lý nút **Chọn tour** lưu vào bảng `cart_items` trong SQLite.

### Giai đoạn 5: Xây dựng Trang Giỏ Hàng, Đăng ký & Gửi Email (`cart.html`)
- [x] Hiển thị danh sách chuyến bay & tour trong Giỏ hàng, tính tổng tiền, hỗ trợ xóa từng mục hoặc xóa toàn bộ giỏ hàng.
- [x] Tạo form nhập thông tin cá nhân (Họ tên, SĐT, Email, Ghi chú) có kiểm tra hợp lệ.
- [x] Tích hợp `js/email-service.js` gửi email xác nhận từ `nvhai061993@gmail.com` tới email khách hàng qua EmailJS (kèm bản xem trước email khi chạy demo chưa điền API key).
- [x] Hiển thị Modal **Thông báo hoàn thành** khi click **Đăng ký** và lưu đơn vào bảng `bookings`.

---

## Prompt Mẫu để Bắt đầu Code ngay trong Antigravity

Khi đã sẵn sàng tạo code cho toàn bộ website, bạn chỉ cần copy và gửi câu lệnh sau cho Antigravity:

> *"Hãy đọc file `GEMINI.md` và toàn bộ các file đặc tả `.md` trong thư mục gốc, sau đó triển khai hoàn chỉnh mã nguồn website du lịch **Vietjet** theo đúng checklist trong `TASKS.md`. Hãy kiểm tra kỹ kết nối SQLite (`sql.js`) và chạy thử trên trình duyệt để đảm bảo mọi bộ lọc, giỏ hàng và luồng đăng ký hoạt động trơn tru."*
