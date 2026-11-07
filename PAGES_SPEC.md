# PAGES_SPEC.md — Đặc tả Chi tiết Từng Trang & Logic Nghiệp vụ

Tài liệu này mô tả chi tiết đầu vào, câu truy vấn dữ liệu, giao diện và sự kiện tương tác cho từng trang trong 6 trang của website **Vietjet**.

---

## 1. Trang Chủ (`index.html`)

### Thành phần & Chức năng:
1. **Phần Tìm kiếm Chuyến bay**:
   - **Loại vé**: Radio `Vé khứ hồi` (`value="round-trip"`, mặc định chọn) và `Vé một chiều` (`value="one-way"`). Khi chọn `Vé một chiều`, ô `Ngày về` bị vô hiệu hóa (`disabled`) hoặc ẩn đi.
   - **Điểm xuất phát & Điểm đến**: Lấy danh sách các điểm đi/đến duy nhất từ bảng `flights` (`SELECT DISTINCT origin_code, origin_name FROM flights`) kèm tùy chọn `"Tất cả điểm đi / đến"` để dễ tìm kiếm.
   - **Ngày đi & Ngày về**: Input `type="date"` (có thể để trống nếu muốn xem mọi ngày hoặc chọn ngày cụ thể).
   - **Sự kiện Click `Tìm Kiếm`**: Chuyển hướng sang `flights.html` với các query params tương ứng.
2. **Phần Tour Du lịch Nổi bật (8 Tour)**:
   - Truy vấn SQLite: `SELECT t.*, a.name AS airline_name FROM tours t JOIN airlines a ON t.airline_code = a.code WHERE t.is_featured = 1 LIMIT 8`.
   - Hiển thị: Ảnh thumbnail kích thước **`600x400`**, tên **hãng du lịch** (`travel_agency`), **số ngày/đêm** (`duration_text`), tên tour và **giá tour** (`price`).
   - **Sự kiện Click**: Dẫn đến trang Tour (`tours.html?tourId=<id>` — trên trang Tour tự động cuộn/highlight tour đó ở đầu danh sách, đồng thời có nút xem chi tiết ngay).
3. **Phần Hãng Hàng Không**:
   - Truy vấn SQLite: `SELECT * FROM airlines`.
   - Hiển thị logo và tên của VietJet Air, Vietnam Airlines, Singapore Airlines, Bamboo Airways, Thai Airways, Korean Air...
   - **Sự kiện Click vào Logo**: Chuyển hướng đến `flights.html?airline=<code>`.

---

## 2. Trang Chuyến Bay (`flights.html`)

### Cột Trái — Bộ lọc (Filters):
Mỗi khi người dùng thay đổi bất kỳ điều kiện lọc nào bên trái, hệ thống tự động xây dựng câu lệnh SQL `SELECT` động trên bảng `flights` và render lại cột phải ngay lập tức:
1. **Sắp xếp giá vé**:
   - Mặc định / Giá tăng dần (`ORDER BY price_economy ASC`) / Giá giảm dần (`ORDER BY price_economy DESC`).
2. **Loại vé**:
   - Tất cả / Vé khứ hồi (`trip_type = 'round-trip'`) / Vé một chiều (`trip_type = 'one-way'`).
3. **Loại điểm dừng / Hành trình**:
   - Bay thẳng (`stop_type = 'direct'`) / Nhiều thành phố (`stop_type = 'multi-city'`).
4. **Các hãng hàng không**:
   - Danh sách checkbox lấy từ bảng `airlines` (`airline_code IN (...)`). Nếu đi từ trang chủ qua `?airline=VJ`, checkbox `VietJet Air` tự động được tích sẵn.
5. **Thời gian cất cánh (giờ)**:
   - Checkbox khung giờ lọc theo cột `depart_hour`:
     - `00:00 - 06:00` (`depart_hour >= 0 AND depart_hour < 6`)
     - `06:00 - 12:00` (`depart_hour >= 6 AND depart_hour < 12`)
     - `12:00 - 18:00` (`depart_hour >= 12 AND depart_hour < 18`)
     - `18:00 - 24:00` (`depart_hour >= 18 AND depart_hour <= 23`)
6. **Hạng dịch vụ**:
   - Hạng Phổ thông (`has_economy = 1`) / Hạng Thương gia (`has_business = 1`). Khi lọc Thương gia thì hiển thị và sắp xếp theo `price_business`.

### Cột Phải — Danh sách Chuyến bay:
- Hiển thị mỗi chuyến bay gồm: Logo & tên hãng hàng không, số hiệu chuyến bay, điểm đi → điểm đến, **ngày cất cánh** (`depart_date`), **thời gian bay** (`depart_time` - `arrive_time`, `duration`), loại vé & điểm dừng, **dịch vụ** (`services`), **giá tiền** nổi bật màu `#ee1d23`.
- **Sự kiện Click chọn chuyến bay**: Chuyển hướng đến `flight-detail.html?id=<flight.id>`.

---

## 3. Trang Chi Tiết Chuyến Bay (`flight-detail.html`)

- Đọc `id` từ URL `?id=...`, truy vấn chi tiết từ bảng `flights` kết hợp `airlines`.
- **Thông tin hành trình chi tiết**:
  - **Điểm đi** (`origin_name`) & **Điểm đến** (`destination_name`).
  - **Thời gian bay**: Ngày cất cánh, giờ đi, giờ đến, tổng thời gian bay (kèm ngày về nếu là vé khứ hồi).
  - **Hãng bay**: Logo + Tên hãng + Số hiệu chuyến bay.
  - **Loại máy bay**: Hiển thị rõ dòng tàu bay (ví dụ: `Boeing 787-9 Dreamliner`, `Airbus A321neo`...).
- **Chọn Giá Vé (2 hạng vé trực quan)**:
  - Thẻ **Hạng Phổ Thông**: Giá `price_economy` + chi tiết hành lý, suất ăn, điều kiện vé.
  - Thẻ **Hạng Thương Gia**: Giá `price_business` + chi tiết phòng chờ thương gia, hành lý ký gửi 30kg, suất ăn VIP.
  - Cho phép chọn thêm số lượng hành khách (mặc định `1`).
- **Sự kiện Click `Chọn chuyến bay`**:
  - Thực thi `INSERT INTO cart_items (...)` lưu chuyến bay, hạng vé đã chọn (`Phổ Thông` hoặc `Thương Gia`) và đơn giá tương ứng vào SQLite, sau đó lưu `localStorage`.
  - Cập nhật số lượng trên icon Giỏ Hàng, hiển thị thông báo thành công kèm 2 lựa chọn: *"Tiếp tục tìm kiếm"* hoặc *"Xem Giỏ Hàng ngay"*.

---

## 4. Trang Tour (`tours.html`)

### Cột Trái — Bộ lọc (Filters):
Thực thi truy vấn SQL động trên bảng `tours` kết hợp `airlines`:
1. **Giá vé / Giá tour**: Tăng dần (`ORDER BY t.price ASC`) / Giảm dần (`ORDER BY t.price DESC`).
2. **Các hãng hàng không**: Checkbox lọc theo `t.airline_code IN (...)`.
3. **Thời gian cất cánh (giờ)**: Checkbox lọc theo khung giờ bay khởi hành `t.depart_hour` (`00:00 - 06:00`, `06:00 - 12:00`, `12:00 - 18:00`, `18:00 - 24:00`).

### Cột Phải — Danh sách Tour:
- Mỗi thẻ tour hiển thị: Ảnh thumbnail `600x400`, tên tour, hãng lữ hành, **hãng bay**, **ngày cất cánh** (`depart_date`), **thời gian bay** (`depart_time` & `flight_duration`, kèm thời lượng ngày/đêm), **dịch vụ** (`services`), **giá tiền** (`price`).
- **Sự kiện Click chọn tour**: Chuyển hướng đến `tour-detail.html?id=<tour.id>`.

---

## 5. Trang Chi Tiết Tour (`tour-detail.html`)

- Đọc `id` từ URL `?id=...`, truy vấn bảng `tours` + `airlines` và bảng `tour_itineraries` (`SELECT * FROM tour_itineraries WHERE tour_id = ? ORDER BY day_number ASC`).
- **Thông tin hành trình & Hàng không**:
  - **Điểm đi**, **Điểm đến**, **Thời gian bay** (ngày khởi hành, giờ cất cánh, thời lượng bay), **Hãng bay** (logo + tên hãng), **Loại máy bay** (`Boeing`, `Airbus`...), đơn vị lữ hành và thời lượng tour.
- **Lịch trình chuyến đi**:
  - Hiển thị danh sách từng ngày (`Ngày 1`, `Ngày 2`, `Ngày 3`...) theo dạng Timeline dọc bắt mắt với chấm tròn màu đỏ `#ee1d23`, tiêu đề ngày và nội dung tham quan chi tiết.
- **Sự kiện Click `Chọn tour`**:
  - Thực thi `INSERT INTO cart_items (...)` với `item_type = 'tour'`, lưu vào SQLite & `localStorage`, cập nhật badge Giỏ Hàng và thông báo đã lưu vào Giỏ Hàng.

---

## 6. Trang Giỏ Hàng (`cart.html`)

### Khu vực 1 — Danh sách Chuyến bay & Tour đã chọn:
- Truy vấn `SELECT * FROM cart_items ORDER BY id DESC`.
- Hiển thị bảng/danh sách các mục đã chọn:
  - Phân biệt rõ nhãn **Vé máy bay** hoặc **Tour du lịch**.
  - Hiển thị tên hành trình/tour, hạng dịch vụ (`Phổ Thông` / `Thương Gia` / `Tour trọn gói`), thông tin hãng bay & giờ bay, số lượng khách (cho phép `+` / `-`), thành tiền.
  - Nút **Xóa** từng dòng (`DELETE FROM cart_items WHERE id = ?`) và nút **Xóa toàn bộ giỏ hàng** (`DELETE FROM cart_items`).
  - Nếu giỏ hàng trống: hiển thị trạng thái trống thân thiện kèm nút quay lại chọn Chuyến bay hoặc Tour.

### Khu vực 2 — Nhập Thông tin Cá nhân & Đăng ký:
- Các trường thông tin:
  - **Họ và tên** (`required`)
  - **Số điện thoại** (`required`, kiểm tra 9-11 chữ số)
  - **Email của khách hàng** (`required`, kiểm tra định dạng email hợp lệ)
  - **Ghi chú thêm** (tùy chọn)
- Hiển thị rõ dòng chú thích: *"Email xác nhận đặt chỗ sẽ được gửi từ **nvhai061993@gmail.com** tới hộp thư của quý khách."*
- **Sự kiện Click nút `Đăng ký`**:
  1. Validate dữ liệu nhập và đảm bảo giỏ hàng có ít nhất 1 mục.
  2. Sinh mã đặt chỗ ngẫu nhiên (VD: `VJ-849201`), lưu vào bảng `bookings` và `booking_items` trong SQLite.
  3. Gọi `sendBookingConfirmationEmail()` trong `js/email-service.js` để gửi email từ **`nvhai061993@gmail.com`** tới `customer_email`.
  4. Xóa các mục trong `cart_items` (`DELETE FROM cart_items`) và lưu lại SQLite vào `localStorage`.
  5. Hiển thị **Modal Thông báo Hoàn thành** trang trọng (biểu tượng thành công, mã đơn hàng, thông tin người đặt, trạng thái gửi email từ `nvhai061993@gmail.com` đến email khách hàng).
