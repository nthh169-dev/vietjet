# UI_UX_DESIGN.md — Quy chuẩn Thiết kế Giao diện & Trải nghiệm Người dùng

## 1. Hệ thống Màu sắc (Color Palette)

Website sử dụng **tông màu sáng (Light Mode)**, nền trắng tinh khiết kết hợp màu chủ đạo **Đỏ Vietjet (`#ee1d23`)** tạo cảm giác năng động, tin cậy và nổi bật.

| Vai trò | Mã màu (HEX) | Biến CSS | Cách sử dụng |
| :--- | :--- | :--- | :--- |
| **Màu chủ đạo (Primary)** | `#EE1D23` | `--color-primary` | Nút CTA chính (Tìm kiếm, Chọn vé, Đăng ký), tiêu đề nhấn, viền thẻ đang chọn, Header brand |
| **Primary Hover** | `#C81016` | `--color-primary-dark` | Trạng thái di chuột (hover) của các nút màu đỏ |
| **Primary Tint (Nền đỏ nhạt)** | `#FFF1F2` | `--color-primary-light` | Nền badge, nền radio/checkbox khi active, highlight bộ lọc |
| **Màu nhấn phụ (Gold/Yellow)** | `#FFB800` | `--color-accent` | Nhãn Hạng Thương Gia (Business Class), ngôi sao đánh giá, huy hiệu Hot Deal |
| **Nền chính (Background)** | `#FFFFFF` | `--bg-white` | Nền trang chính, nền các thẻ (Cards), Sidebar Filter |
| **Nền phụ (Surface)** | `#F7F8FA` | `--bg-light` | Nền phân tách giữa các section hoặc vùng danh sách thẻ để làm nổi thẻ trắng |
| **Chữ chính (Heading/Body)** | `#1A1A2E` | `--text-primary` | Tiêu đề, tên chuyến bay, tên tour, thông tin chính |
| **Chữ phụ (Muted)** | `#64748B` | `--text-secondary` | Giờ phụ, ghi chú dịch vụ, nhãn phụ |
| **Đường viền (Border)** | `#E2E8F0` | `--border-color` | Viền thẻ, ô input, đường kẻ phân cách |
| **Trạng thái Thành công** | `#16A34A` | `--color-success` | Thông báo thêm giỏ hàng & hoàn thành đăng ký |

---

## 2. Typography & Bố cục Chung

- **Font chữ**: `'Be Vietnam Pro'` hoặc `'Inter'`, `'Segoe UI'`, `sans-serif` (nhúng từ Google Fonts để hỗ trợ tiếng Việt đẹp mắt, rõ dấu).
- **Container**: Độ rộng tối đa `1240px`, căn giữa (`margin: 0 auto`), padding hai bên `20px`.
- **Bo góc & Đổ bóng**:
  - Card & Search Box: `border-radius: 14px`, `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06)`.
  - Nút bấm (Buttons): `border-radius: 8px`, chữ in đậm `font-weight: 600`.

---

## 3. Thiết kế Chi tiết các Thành phần Trọng tâm

### 3.1. Header & Thanh điều hướng (Sticky Topbar)
- Nền trắng `#FFFFFF`, viền dưới mảnh hoặc dải viền đỏ `#EE1D23` dày `4px` phía trên cùng.
- Bên trái: Logo **VIETJET** màu đỏ `#EE1D23` đậm nét kèm biểu tượng máy bay.
- Ở giữa: Menu điều hướng gồm `Trang Chủ`, `Chuyến Bay`, `Tour Du Lịch`. Trang hiện tại có gạch chân đỏ `#EE1D23`.
- Bên phải: Nút **Giỏ Hàng** nổi bật có icon giỏ hàng/vali và **Badge tròn màu đỏ `#EE1D23`** hiển thị tổng số mục đã chọn.

### 3.2. Khối Tìm kiếm Chuyến bay ở Trang chủ
- Đặt nổi bật trên banner sáng màu (có họa tiết mây/đường bay tinh tế tông trắng - đỏ nhạt).
- Hàng trên: 2 nút chọn dạng Pill/Radio: `(•) Vé khứ hồi` và `( ) Vé một chiều`.
- Hàng dưới: Lưới ngang gồm `Điểm xuất phát` ⇄ `Điểm đến` | `Ngày đi` | `Ngày về` | Nút lớn **`Tìm Kiếm`** nền `#EE1D23` chữ trắng.

### 3.3. Thẻ Tour Nổi bật (Chuẩn Thumbnail `600x400`)
- Lưới 4 cột x 2 hàng = **8 tour nổi bật**.
- Khung ảnh bắt buộc giữ tỷ lệ `600x400` (`aspect-ratio: 600 / 400; width: 100%; object-fit: cover;`), góc trên trái gắn nhãn số ngày/đêm nền đỏ `#EE1D23` (VD: `4N3Đ`).
- Nội dung thẻ:
  - Tên hãng du lịch (chữ nhỏ màu xám kèm icon).
  - Tên tour (tối đa 2 dòng, đậm).
  - Giá tour màu đỏ `#EE1D23` cỡ lớn + nhãn `/ khách`.
  - Toàn bộ thẻ có hiệu ứng nhấc nhẹ khi hover (`transform: translateY(-4px)`) và trỏ chuột `cursor: pointer`.

### 3.4. Khối Hãng Hàng Không Đối tác
- Dải 6 ô logo nền trắng viền sáng, hiển thị logo rõ nét + tên hãng: **VietJet Air**, **Vietnam Airlines**, **Singapore Airlines**, **Bamboo Airways**, **Thai Airways**, **Korean Air**.
- Hover vào ô hãng bay: viền chuyển sang `#EE1D23`, hiện gợi ý *"Xem chuyến bay →"*.

### 3.5. Bố cục 2 Cột cho Trang Chuyến Bay & Trang Tour
- **Cột trái (`280px` - `300px`, sticky khi cuộn trên Desktop)**:
  - Tiêu đề **Bộ lọc tìm kiếm** + nút *Đặt lại*.
  - Từng nhóm bộ lọc phân cách bằng đường kẻ mảnh, gồm Radio cho sắp xếp giá, Checkbox/Chip khung giờ cất cánh (`00:00 - 06:00`, `06:00 - 12:00`, `12:00 - 18:00`, `18:00 - 24:00`), Checkbox hãng hàng không...
- **Cột phải (`1fr`)**:
  - Thanh tiêu đề hiển thị số lượng kết quả tìm thấy.
  - Các thẻ ngang (Horizontal Cards) trình bày trực quan: Cột hãng bay | Cột sơ đồ giờ cất cánh `08:00 ──✈── 10:05` & loại máy bay | Cột dịch vụ (icon hành lý, suất ăn) | Cột giá vé màu `#EE1D23` & nút **Chọn**.

### 3.6. Thẻ Chọn Hạng Vé tại Chi tiết Chuyến bay (`flight-detail.html`)
Thiết kế 2 thẻ chọn hạng vé đặt cạnh nhau rõ ràng, trực quan:
1. **Thẻ Hạng Phổ Thông (Economy)**:
   - Tiêu đề nền xám sáng/đỏ nhạt, giá vé in đậm, danh sách dấu tích `✓` quyền lợi tiêu chuẩn (07kg hành lý xách tay, chọn chỗ ngồi tiêu chuẩn, tích điểm SkyJoy).
   - Radio/Button chọn trạng thái.
2. **Thẻ Hạng Thương Gia (Business)**:
   - Viền nhấn vàng/đỏ sang trọng, gắn huy hiệu `VIP / Thương Gia`, giá vé hạng Thương gia, danh sách quyền lợi cao cấp (`✓` 18kg xách tay + 30kg ký gửi, `✓` Phòng chờ sang trọng, `✓` Suất ăn nóng cao cấp, `✓` Ưu tiên check-in & lên máy bay).
- Khi người dùng click vào thẻ nào, thẻ đó sáng viền `#EE1D23` dày `2px`, nền phủ nhẹ `#FFF1F2`, và nút **Chọn chuyến bay (Thêm vào Giỏ hàng)** bên dưới cập nhật đúng mức giá tương ứng.
