-- ============================================================================
-- VIETJET TRAVEL WEBSITE - SQLITE DATABASE SCHEMA
-- File: sqlite/01_schema.sql
-- Tương thích 100% với SQLite3 CLI, DB Browser for SQLite và sql.js (WebAssembly)
-- ============================================================================

PRAGMA foreign_keys = ON;

-- Xóa các bảng cũ theo thứ tự phụ thuộc khóa ngoại (nếu khởi tạo lại)
DROP TABLE IF EXISTS booking_items;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS tour_itineraries;
DROP TABLE IF EXISTS tours;
DROP TABLE IF EXISTS flights;
DROP TABLE IF EXISTS airlines;

-- ----------------------------------------------------------------------------
-- 1. Bảng AIRLINES: Danh mục các hãng hàng không đối tác
-- ----------------------------------------------------------------------------
CREATE TABLE airlines (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    country TEXT NOT NULL
);

-- ----------------------------------------------------------------------------
-- 2. Bảng FLIGHTS: Danh sách chuyến bay và thông tin hạng vé
-- ----------------------------------------------------------------------------
CREATE TABLE flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_number TEXT NOT NULL,
    airline_code TEXT NOT NULL,
    origin_code TEXT NOT NULL,
    origin_name TEXT NOT NULL,
    destination_code TEXT NOT NULL,
    destination_name TEXT NOT NULL,
    depart_date TEXT NOT NULL,
    return_date TEXT,
    depart_time TEXT NOT NULL,
    depart_hour INTEGER NOT NULL CHECK (depart_hour >= 0 AND depart_hour <= 23),
    arrive_time TEXT NOT NULL,
    duration TEXT NOT NULL,
    trip_type TEXT NOT NULL CHECK (trip_type IN ('one-way', 'round-trip')),
    stop_type TEXT NOT NULL CHECK (stop_type IN ('direct', 'multi-city')),
    aircraft TEXT NOT NULL,
    price_economy INTEGER NOT NULL CHECK (price_economy >= 0),
    price_business INTEGER NOT NULL CHECK (price_business >= 0),
    has_economy INTEGER NOT NULL DEFAULT 1 CHECK (has_economy IN (0, 1)),
    has_business INTEGER NOT NULL DEFAULT 1 CHECK (has_business IN (0, 1)),
    services TEXT NOT NULL,
    FOREIGN KEY (airline_code) REFERENCES airlines(code) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 3. Bảng TOURS: Danh sách tour du lịch trọn gói (bao gồm 8 tour nổi bật)
-- ----------------------------------------------------------------------------
CREATE TABLE tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    travel_agency TEXT NOT NULL,
    airline_code TEXT NOT NULL,
    origin_name TEXT NOT NULL,
    destination_name TEXT NOT NULL,
    duration_text TEXT NOT NULL,
    depart_date TEXT NOT NULL,
    depart_time TEXT NOT NULL,
    depart_hour INTEGER NOT NULL CHECK (depart_hour >= 0 AND depart_hour <= 23),
    flight_duration TEXT NOT NULL,
    aircraft TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    thumbnail_url TEXT NOT NULL,
    services TEXT NOT NULL,
    is_featured INTEGER NOT NULL DEFAULT 1 CHECK (is_featured IN (0, 1)),
    FOREIGN KEY (airline_code) REFERENCES airlines(code) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 4. Bảng TOUR_ITINERARIES: Lịch trình chi tiết theo từng ngày của mỗi Tour
-- ----------------------------------------------------------------------------
CREATE TABLE tour_itineraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tour_id INTEGER NOT NULL,
    day_number INTEGER NOT NULL CHECK (day_number >= 1),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 5. Bảng CART_ITEMS: Giỏ hàng lưu các Chuyến bay & Tour khách đã chọn
-- ----------------------------------------------------------------------------
CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_type TEXT NOT NULL CHECK (item_type IN ('flight', 'tour')),
    ref_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    seat_class TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
    unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
    metadata_json TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 6. Bảng BOOKINGS: Đơn đăng ký đặt vé / tour của khách hàng
-- ----------------------------------------------------------------------------
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_note TEXT,
    total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
    sender_email TEXT NOT NULL DEFAULT 'nvhai061993@gmail.com',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 7. Bảng BOOKING_ITEMS: Chi tiết từng mục trong đơn đăng ký
-- ----------------------------------------------------------------------------
CREATE TABLE booking_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('flight', 'tour')),
    ref_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    seat_class TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
    unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- INDEXES: Tối ưu hóa truy vấn lọc và sắp xếp trên trang Flights & Tours
-- ----------------------------------------------------------------------------
CREATE INDEX idx_flights_airline ON flights(airline_code);
CREATE INDEX idx_flights_route ON flights(origin_code, destination_code);
CREATE INDEX idx_flights_trip_stop ON flights(trip_type, stop_type);
CREATE INDEX idx_flights_depart_hour ON flights(depart_hour);
CREATE INDEX idx_flights_price_eco ON flights(price_economy);
CREATE INDEX idx_flights_price_biz ON flights(price_business);

CREATE INDEX idx_tours_featured ON tours(is_featured);
CREATE INDEX idx_tours_airline ON tours(airline_code);
CREATE INDEX idx_tours_depart_hour ON tours(depart_hour);
CREATE INDEX idx_tours_price ON tours(price);
CREATE INDEX idx_tour_itineraries_tour ON tour_itineraries(tour_id, day_number);
