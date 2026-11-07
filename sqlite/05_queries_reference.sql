-- ============================================================================
-- VIETJET TRAVEL WEBSITE - REFERENCE SQL QUERIES
-- File: sqlite/05_queries_reference.sql
-- Tập hợp các câu truy vấn SQL mẫu dùng cho các trang của website Vietjet
-- ============================================================================

-- 1. TRANG CHỦ: Lấy đúng 8 Tour du lịch nổi bật kèm tên hãng hàng không
SELECT
    t.id,
    t.title,
    t.travel_agency,
    t.duration_text,
    t.price,
    t.thumbnail_url,
    a.code AS airline_code,
    a.name AS airline_name
FROM tours t
JOIN airlines a ON t.airline_code = a.code
WHERE t.is_featured = 1
ORDER BY t.id ASC
LIMIT 8;

-- 2. TRANG CHỦ: Lấy danh sách các hãng hàng không đối tác
SELECT code, name, logo_url, country
FROM airlines
ORDER BY CASE code WHEN 'VJ' THEN 0 ELSE 1 END, name ASC;

-- 3. TRANG CHUYẾN BAY: Truy vấn lọc chuyến bay mẫu (kết hợp hãng bay, loại vé, giờ bay, sắp xếp giá)
SELECT
    f.*,
    a.name AS airline_name,
    a.logo_url AS airline_logo
FROM flights f
JOIN airlines a ON f.airline_code = a.code
WHERE (:origin IS NULL OR f.origin_code = :origin)
  AND (:destination IS NULL OR f.destination_code = :destination)
  AND (:trip_type IS NULL OR f.trip_type = :trip_type)
  AND (:stop_type IS NULL OR f.stop_type = :stop_type)
  AND (:airline_code IS NULL OR f.airline_code = :airline_code)
  AND (:min_hour IS NULL OR (f.depart_hour >= :min_hour AND f.depart_hour < :max_hour))
ORDER BY f.price_economy ASC;

-- 4. CHI TIẾT CHUYẾN BAY: Lấy thông tin chi tiết 1 chuyến bay theo ID
SELECT
    f.*,
    a.name AS airline_name,
    a.logo_url AS airline_logo
FROM flights f
JOIN airlines a ON f.airline_code = a.code
WHERE f.id = :flight_id;

-- 5. CHI TIẾT TOUR: Lấy thông tin Tour + Lịch trình từng ngày
SELECT
    t.*,
    a.name AS airline_name,
    a.logo_url AS airline_logo
FROM tours t
JOIN airlines a ON t.airline_code = a.code
WHERE t.id = :tour_id;

SELECT day_number, title, description
FROM tour_itineraries
WHERE tour_id = :tour_id
ORDER BY day_number ASC;

-- 6. GIỎ HÀNG: Xem danh sách mục đã chọn & tính tổng tiền
SELECT
    id,
    item_type,
    ref_id,
    title,
    seat_class,
    quantity,
    unit_price,
    (quantity * unit_price) AS line_total,
    metadata_json
FROM cart_items
ORDER BY id DESC;
