-- ============================================================================
-- VIETJET TRAVEL WEBSITE - SEED DATA: AIRLINES
-- File: sqlite/02_seed_airlines.sql
-- Danh sách 6 hãng hàng không tiêu biểu hiển thị ở Trang chủ & Bộ lọc
-- ============================================================================

INSERT INTO airlines (code, name, logo_url, country) VALUES
('VJ',  'VietJet Air',        'assets/images/airlines/vietjet.svg',            'Việt Nam'),
('VNA', 'Vietnam Airlines',   'assets/images/airlines/vietnam-airlines.svg',   'Việt Nam'),
('SQ',  'Singapore Airlines', 'assets/images/airlines/singapore-airlines.svg', 'Singapore'),
('QH',  'Bamboo Airways',     'assets/images/airlines/bamboo-airways.svg',     'Việt Nam'),
('TG',  'Thai Airways',       'assets/images/airlines/thai-airways.svg',       'Thái Lan'),
('KE',  'Korean Air',         'assets/images/airlines/korean-air.svg',         'Hàn Quốc');
