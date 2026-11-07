-- ============================================================================
-- VIETJET TRAVEL WEBSITE - SEED DATA: FLIGHTS
-- File: sqlite/03_seed_flights.sql
-- 18 chuyến bay đa dạng phủ kín mọi bộ lọc:
--   + Hãng bay: VJ, VNA, SQ, QH, TG, KE
--   + Loại vé: round-trip (khứ hồi), one-way (một chiều)
--   + Hành trình: direct (bay thẳng), multi-city (nhiều thành phố)
--   + Khung giờ cất cánh: 00-06h, 06-12h, 12-18h, 18-24h
--   + Hạng vé: Phổ thông (Economy) & Thương gia (Business)
--   + Tàu bay: Airbus A321neo, A330-300, A350-900, Boeing 787-9, 737 MAX 8...
-- ============================================================================

INSERT INTO flights (
    id, flight_number, airline_code,
    origin_code, origin_name, destination_code, destination_name,
    depart_date, return_date, depart_time, depart_hour, arrive_time, duration,
    trip_type, stop_type, aircraft,
    price_economy, price_business, has_economy, has_business, services
) VALUES
-- 1. VietJet Air | SGN -> HAN | Sáng | Khứ hồi | Bay thẳng
(1, 'VJ122', 'VJ',
 'SGN', 'TP. Hồ Chí Minh (SGN)', 'HAN', 'Hà Nội (HAN)',
 '2026-11-15', '2026-11-18', '07:30', 7, '09:40', '2 giờ 10 phút',
 'round-trip', 'direct', 'Airbus A321neo',
 1450000, 3890000, 1, 1, 'Hành lý xách tay 7kg, Suất ăn nóng SkyCafe, Tích điểm SkyJoy'),

-- 2. VietJet Air | SGN -> DAD | Sáng sớm | Một chiều | Bay thẳng
(2, 'VJ624', 'VJ',
 'SGN', 'TP. Hồ Chí Minh (SGN)', 'DAD', 'Đà Nẵng (DAD)',
 '2026-11-15', NULL, '05:15', 5, '06:35', '1 giờ 20 phút',
 'one-way', 'direct', 'Airbus A320',
 890000, 2450000, 1, 0, 'Hành lý xách tay 7kg, Bảo hiểm du lịch SkyCare'),

-- 3. VietJet Air | SGN -> PQC | Chiều | Khứ hồi | Bay thẳng
(3, 'VJ327', 'VJ',
 'SGN', 'TP. Hồ Chí Minh (SGN)', 'PQC', 'Phú Quốc (PQC)',
 '2026-11-16', '2026-11-19', '14:10', 14, '15:10', '1 giờ 00 phút',
 'round-trip', 'direct', 'Airbus A321neo',
 1190000, 3150000, 1, 1, 'Hành lý xách tay 7kg + Ký gửi 20kg, Nước uống miễn phí'),

-- 4. VietJet Air | HAN -> ICN | Tối | Khứ hồi | Bay thẳng
(4, 'VJ960', 'VJ',
 'HAN', 'Hà Nội (HAN)', 'ICN', 'Seoul - Incheon (ICN)',
 '2026-11-20', '2026-11-25', '21:45', 21, '04:00', '4 giờ 15 phút',
 'round-trip', 'direct', 'Airbus A330-300',
 3650000, 9200000, 1, 1, 'Xách tay 10kg + Ký gửi 20kg, Chăn gối, Suất ăn quốc tế'),

-- 5. Vietnam Airlines | SGN -> HAN | Sáng | Khứ hồi | Bay thẳng
(5, 'VN210', 'VNA',
 'SGN', 'TP. Hồ Chí Minh (SGN)', 'HAN', 'Hà Nội (HAN)',
 '2026-11-15', '2026-11-18', '08:00', 8, '10:10', '2 giờ 10 phút',
 'round-trip', 'direct', 'Boeing 787-9 Dreamliner',
 2150000, 5600000, 1, 1, 'Xách tay 12kg + Ký gửi 23kg, Suất ăn tiêu chuẩn 4*, Giải trí màn hình riêng'),

-- 6. Vietnam Airlines | HAN -> DAD | Chiều | Một chiều | Bay thẳng
(6, 'VN171', 'VNA',
 'HAN', 'Hà Nội (HAN)', 'DAD', 'Đà Nẵng (DAD)',
 '2026-11-16', NULL, '15:30', 15, '16:50', '1 giờ 20 phút',
 'one-way', 'direct', 'Airbus A321',
 1580000, 4100000, 1, 1, 'Xách tay 12kg + Ký gửi 23kg, Đồ uống & Khăn lạnh'),

-- 7. Vietnam Airlines | SGN -> SIN | Sáng | Khứ hồi | Bay thẳng
(7, 'VN651', 'VNA',
 'SGN', 'TP. Hồ Chí Minh (SGN)', 'SIN', 'Singapore (SIN)',
 '2026-11-18', '2026-11-21', '09:15', 9, '12:15', '2 giờ 00 phút',
 'round-trip', 'direct', 'Airbus A350-900',
 2950000, 7800000, 1, 1, 'Xách tay 12kg + Ký gửi 23kg, Suất ăn nóng Á - Âu, Wifi trên không'),

-- 8. Singapore Airlines | SGN -> SIN | Chiều | Khứ hồi | Bay thẳng
(8, 'SQ177', 'SQ',
 'SGN', 'TP. Hồ Chí Minh (SGN)', 'SIN', 'Singapore (SIN)',
 '2026-11-18', '2026-11-22', '12:30', 12, '15:35', '2 giờ 05 phút',
 'round-trip', 'direct', 'Boeing 787-10 Dreamliner',
 3850000, 10500000, 1, 1, 'Xách tay 7kg + Ký gửi 30kg, Ẩm thực 5 sao KrisWorld, Wifi miễn phí'),

-- 9. Singapore Airlines | HAN -> SIN | Tối | Một chiều | Nhiều thành phố
(9, 'SQ193', 'SQ',
 'HAN', 'Hà Nội (HAN)', 'SIN', 'Singapore (SIN)',
 '2026-11-19', NULL, '18:35', 18, '23:10', '3 giờ 35 phút',
 'one-way', 'multi-city', 'Airbus A350-900',
 3490000, 9600000, 1, 1, 'Ký gửi 30kg, Giải trí KrisWorld, Phòng chờ SilverKris (Thương gia)'),

-- 10. Bamboo Airways | HAN -> PQC | Sáng | Khứ hồi | Bay thẳng
(10, 'QH1621', 'QH',
 'HAN', 'Hà Nội (HAN)', 'PQC', 'Phú Quốc (PQC)',
 '2026-11-17', '2026-11-20', '06:45', 6, '08:55', '2 giờ 10 phút',
 'round-trip', 'direct', 'Airbus A321neo',
 1890000, 4650000, 1, 1, 'Xách tay 7kg + Ký gửi 20kg, Suất ăn nhẹ, Chọn ghế miễn phí'),

-- 11. Bamboo Airways | SGN -> DLI | Sáng sớm | Một chiều | Bay thẳng
(11, 'QH1320', 'QH',
 'SGN', 'TP. Hồ Chí Minh (SGN)', 'DLI', 'Đà Lạt (DLI)',
 '2026-11-15', NULL, '05:40', 5, '06:35', '0 giờ 55 phút',
 'one-way', 'direct', 'Airbus A320',
 980000, 2600000, 1, 1, 'Xách tay 7kg + Ký gửi 20kg, Nước suối & Khăn giấy'),

-- 12. Bamboo Airways | SGN -> HAN | Tối | Một chiều | Nhiều thành phố (qua DAD)
(12, 'QH284', 'QH',
 'SGN', 'TP. Hồ Chí Minh (SGN)', 'HAN', 'Hà Nội (HAN)',
 '2026-11-15', NULL, '19:20', 19, '22:45', '3 giờ 25 phút',
 'one-way', 'multi-city', 'Boeing 787-9 Dreamliner',
 1320000, 3950000, 1, 1, 'Hành trình qua Đà Nẵng, Ký gửi 20kg, Suất ăn nhẹ'),

-- 13. Thai Airways | SGN -> BKK | Sáng | Khứ hồi | Bay thẳng
(13, 'TG551', 'TG',
 'SGN', 'TP. Hồ Chí Minh (SGN)', 'BKK', 'Bangkok - Suvarnabhumi (BKK)',
 '2026-11-21', '2026-11-25', '10:15', 10, '11:45', '1 giờ 30 phút',
 'round-trip', 'direct', 'Boeing 777-300ER',
 2750000, 7400000, 1, 1, 'Ký gửi 30kg, Suất ăn truyền thống Thái Lan, Giải trí cá nhân'),

-- 14. Thai Airways | HAN -> BKK | Tối | Khứ hồi | Nhiều thành phố
(14, 'TG565', 'TG',
 'HAN', 'Hà Nội (HAN)', 'BKK', 'Bangkok - Suvarnabhumi (BKK)',
 '2026-11-22', '2026-11-26', '20:30', 20, '23:55', '3 giờ 25 phút',
 'round-trip', 'multi-city', 'Airbus A350-900',
 2590000, 6900000, 1, 1, 'Ký gửi 30kg, Ẩm thực Royal Orchid, Quá cảnh ngắn'),

-- 15. Korean Air | SGN -> ICN | Tối muộn | Khứ hồi | Bay thẳng
(15, 'KE476', 'KE',
 'SGN', 'TP. Hồ Chí Minh (SGN)', 'ICN', 'Seoul - Incheon (ICN)',
 '2026-11-23', '2026-11-28', '23:10', 23, '06:20', '5 giờ 10 phút',
 'round-trip', 'direct', 'Boeing 787-9 Dreamliner',
 5450000, 14200000, 1, 1, 'Ký gửi 23kg x 2 kiện, Suất ăn Bibimbap Hàn Quốc, Bộ tiện nghi cá nhân'),

-- 16. Korean Air | DAD -> ICN | Chiều | Một chiều | Nhiều thành phố
(16, 'KE462', 'KE',
 'DAD', 'Đà Nẵng (DAD)', 'ICN', 'Seoul - Incheon (ICN)',
 '2026-11-24', NULL, '16:15', 16, '23:50', '5 giờ 35 phút',
 'one-way', 'multi-city', 'Boeing 737 MAX 8',
 4350000, 11800000, 1, 1, 'Ký gửi 23kg, Suất ăn nóng, Phòng chờ KAL Prestige (Thương gia)'),

-- 17. VietJet Air | SGN -> CXR | Sáng | Khứ hồi | Bay thẳng
(17, 'VJ772', 'VJ',
 'SGN', 'TP. Hồ Chí Minh (SGN)', 'CXR', 'Nha Trang - Cam Ranh (CXR)',
 '2026-11-16', '2026-11-18', '11:05', 11, '12:15', '1 giờ 10 phút',
 'round-trip', 'direct', 'Airbus A321neo',
 950000, 2590000, 1, 0, 'Hành lý xách tay 7kg, Đặt trước suất ăn giảm 20%'),

-- 18. VietJet Air | HAN -> BKK | Chiều | Khứ hồi | Bay thẳng
(18, 'VJ901', 'VJ',
 'HAN', 'Hà Nội (HAN)', 'BKK', 'Bangkok - Suvarnabhumi (BKK)',
 '2026-11-21', '2026-11-25', '13:15', 13, '15:05', '1 giờ 50 phút',
 'round-trip', 'direct', 'Airbus A321neo',
 1990000, 4890000, 1, 1, 'Xách tay 7kg + Ký gửi 20kg, Suất ăn nóng, Ưu tiên quầy làm thủ tục');
