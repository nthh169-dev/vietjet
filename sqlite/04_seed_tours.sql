-- ============================================================================
-- VIETJET TRAVEL WEBSITE - SEED DATA: TOURS & TOUR ITINERARIES
-- File: sqlite/04_seed_tours.sql
-- Gồm:
--   + 8 Tour du lịch nổi bật (is_featured = 1) hiển thị tại Trang chủ (thumbnail 600x400)
--   + 4 Tour mở rộng (is_featured = 0) giúp bộ lọc trang Tour thêm phong phú
--   + Lịch trình chi tiết từng ngày (tour_itineraries) cho toàn bộ 12 Tour
-- ============================================================================

INSERT INTO tours (
    id, title, travel_agency, airline_code,
    origin_name, destination_name, duration_text,
    depart_date, depart_time, depart_hour, flight_duration, aircraft,
    price, thumbnail_url, services, is_featured
) VALUES
-- ==================== 8 TOUR NỔI BẬT TRANG CHỦ (is_featured = 1) ====================
(1,
 'Khám phá Đảo Ngọc Phú Quốc - Grand World - Cáp Treo Hòn Thơm',
 'Vietjet Holidays', 'VJ',
 'TP. Hồ Chí Minh', 'Phú Quốc', '3 Ngày 2 Đêm',
 '2026-11-20', '08:15', 8, '1 giờ 00 phút', 'Airbus A321neo',
 3990000,
 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&h=400&q=80',
 'Vé máy bay khứ hồi, Resort 4*, Vé Cáp treo Hòn Thơm, Xe đưa đón, Bảo hiểm du lịch',
 1),

(2,
 'Đà Nẵng - Phố Cổ Hội An - Bà Nà Hills Cầu Vàng Tuyệt Mỹ',
 'Vietravel', 'VJ',
 'TP. Hồ Chí Minh', 'Đà Nẵng', '4 Ngày 3 Đêm',
 '2026-11-22', '06:30', 6, '1 giờ 20 phút', 'Airbus A321',
 4850000,
 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&h=400&q=80',
 'Vé máy bay khứ hồi, Khách sạn 4* ven biển, Buffet Bà Nà, Vé tham quan trọn gói',
 1),

(3,
 'Hà Nội Ngàn Năm - Du Thuyền Vịnh Hạ Long 5 Sao - Tràng An Ninh Bình',
 'Saigontourist', 'VNA',
 'TP. Hồ Chí Minh', 'Hà Nội - Hạ Long', '4 Ngày 3 Đêm',
 '2026-11-25', '07:00', 7, '2 giờ 10 phút', 'Boeing 787-9 Dreamliner',
 6490000,
 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&h=400&q=80',
 'Vé máy bay Vietnam Airlines, 1 đêm Du thuyền 5*, Khách sạn 4*, Thuyền Tràng An',
 1),

(4,
 'Đảo Quốc Sư Tử Singapore - Gardens by the Bay - Đảo Sentosa',
 'Fiditour', 'SQ',
 'TP. Hồ Chí Minh', 'Singapore', '4 Ngày 3 Đêm',
 '2026-11-27', '12:30', 12, '2 giờ 05 phút', 'Boeing 787-10 Dreamliner',
 11990000,
 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&h=400&q=80',
 'Bay Singapore Airlines, Khách sạn 4* trung tâm, Vé Cloud Forest, HDV suốt tuyến',
 1),

(5,
 'Thái Lan Sôi Động: Bangkok - Pattaya - Đảo Coral - Chùa Bình Minh',
 'Vietjet Holidays', 'TG',
 'TP. Hồ Chí Minh', 'Bangkok - Pattaya', '5 Ngày 4 Đêm',
 '2026-11-28', '10:15', 10, '1 giờ 30 phút', 'Boeing 777-300ER',
 7690000,
 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&h=400&q=80',
 'Vé máy bay khứ hồi, Khách sạn 4*, Buffet Baiyoke Sky 86 tầng, Tàu cao tốc Đảo Coral',
 1),

(6,
 'Đà Lạt Ngàn Hoa - Săn Mây Đồi Chè Cầu Đất - Nông Trại Puppy Farm',
 'BenThanh Tourist', 'QH',
 'Hà Nội', 'Đà Lạt', '3 Ngày 2 Đêm',
 '2026-11-19', '05:30', 5, '1 giờ 50 phút', 'Airbus A320',
 3450000,
 'https://images.unsplash.com/photo-1586500036706-41963de24d8b?auto=format&fit=crop&w=600&h=400&q=80',
 'Bay Bamboo Airways, Khách sạn 4* trung tâm Chợ Đêm, Tiệc BBQ tối, Giao lưu Cồng chiêng',
 1),

(7,
 'Hàn Quốc Lãng Mạn: Seoul - Đảo Nami - Công Viên Giải Trí Everland',
 'Vietravel', 'KE',
 'TP. Hồ Chí Minh', 'Seoul - Hàn Quốc', '5 Ngày 4 Đêm',
 '2026-12-02', '23:10', 23, '5 giờ 10 phút', 'Boeing 787-9 Dreamliner',
 16900000,
 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=600&h=400&q=80',
 'Bay Korean Air, Visa Hàn Quốc trọn gói, Khách sạn 4*, Vé Everland & Mặc Hanbok cổ truyền',
 1),

(8,
 'Nha Trang Biển Xanh - Thiên Đường Giải Trí VinWonders - Đảo Điệp Sơn',
 'Saigontourist', 'VJ',
 'Hà Nội', 'Nha Trang', '3 Ngày 2 Đêm',
 '2026-11-24', '14:20', 14, '1 giờ 50 phút', 'Airbus A321neo',
 4290000,
 'https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=600&h=400&q=80',
 'Bay VietJet Air, Khách sạn 4* đường Trần Phú, Cáp treo VinWonders, Tắm bùn khoáng I-Resort',
 1),

-- ==================== 4 TOUR MỞ RỘNG TRÊN TRANG TOURS (is_featured = 0) ====================
(9,
 'Quy Nhơn - Kỳ Co Eo Gió - Phú Yên Hoa Vàng Trên Cỏ Xanh',
 'Vietjet Holidays', 'VJ',
 'TP. Hồ Chí Minh', 'Quy Nhơn - Phú Yên', '3 Ngày 2 Đêm',
 '2026-12-05', '05:25', 5, '1 giờ 15 phút', 'Airbus A321',
 3790000,
 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&h=400&q=80',
 'Vé máy bay khứ hồi, Khách sạn 4* sát biển, Cano lặn ngắm san hô Kỳ Co, Hải sản tươi sống',
 0),

(10,
 'Cố Đô Huế - Động Phong Nha Kẻ Bàng - Đại Nội Kinh Thành',
 'BenThanh Tourist', 'VNA',
 'TP. Hồ Chí Minh', 'Huế - Quảng Bình', '4 Ngày 3 Đêm',
 '2026-12-06', '15:10', 15, '1 giờ 25 phút', 'Airbus A321',
 5190000,
 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=600&h=400&q=80',
 'Bay Vietnam Airlines, Khách sạn 4*, Thuyền rồng Ca Huế sông Hương, Vé Động Phong Nha',
 0),

(11,
 'Chiang Mai - Chiang Rai - Chùa Trắng Wat Rong Khun Huyền Bí',
 'Fiditour', 'TG',
 'Hà Nội', 'Chiang Mai - Thái Lan', '4 Ngày 3 Đêm',
 '2026-12-08', '19:15', 19, '2 giờ 00 phút', 'Airbus A350-900',
 8990000,
 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=600&h=400&q=80',
 'Bay Thai Airways, Khách sạn Boutique 4*, Bữa tối Khantoke truyền thống, Vé tham quan trọn gói',
 0),

(12,
 'Côn Đảo Tâm Linh & Nghỉ Dưỡng Sinh Thái Biển Hoang Sơ',
 'Saigontourist', 'QH',
 'TP. Hồ Chí Minh', 'Côn Đảo', '3 Ngày 2 Đêm',
 '2026-12-10', '09:30', 9, '0 giờ 55 phút', 'Airbus A320',
 5450000,
 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&h=400&q=80',
 'Bay thẳng Bamboo Airways, Resort 4*, Xe điện tham quan, Hướng dẫn viên chuyên nghiệp',
 0);

-- ============================================================================
-- LỊCH TRÌNH CHI TIẾT TỪNG NGÀY (TOUR_ITINERARIES)
-- ============================================================================
INSERT INTO tour_itineraries (tour_id, day_number, title, description) VALUES
-- Tour 1: Phú Quốc (3N2Đ)
(1, 1, 'TP. Hồ Chí Minh - Phú Quốc - Thành phố không ngủ Grand World',
 'Sáng: Quý khách làm thủ tục bay VietJet Air đến sân bay Phú Quốc, xe đón về resort nhận phòng. Chiều: Tham quan Dinh Cậu, làng chài Hàm Ninh. Tối: Khám phá Grand World, thưởng thức show Tinh Hoa Việt Nam và nhạc nước Sắc Màu Venice.'),
(1, 2, 'Cáp treo Hòn Thơm vượt biển - Cano khám phá Nam Đảo',
 'Sáng: Trải nghiệm cáp treo 3 dây vượt biển dài nhất thế giới ra đảo Hòn Thơm, vui chơi tại công viên nước Aquatopia. Chiều: Chụp ảnh tại Thị trấn Hoàng Hôn (Sunset Town) và Cầu Hôn (Kiss Bridge). Tối: Dạo chợ đêm Phú Quốc thưởng thức hải sản.'),
(1, 3, 'Mua sắm đặc sản Đảo Ngọc - Tiễn sân bay về TP. Hồ Chí Minh',
 'Sáng: Dùng điểm tâm buffet tại resort, tắm biển tự do. Tham quan cơ sở nuôi cấy ngọc trai, vườn tiêu và nhà thùng nước mắm truyền thống. Trưa: Xe đưa đoàn ra sân bay Phú Quốc đáp chuyến bay về lại TP.HCM.'),

-- Tour 2: Đà Nẵng - Hội An - Bà Nà (4N3Đ)
(2, 1, 'TP. Hồ Chí Minh - Đà Nẵng - Bán đảo Sơn Trà - Biển Mỹ Khê',
 'Sáng: Đáp chuyến bay VietJet Air đi Đà Nẵng. Tham quan Chùa Linh Ứng Bãi Bụt trên bán đảo Sơn Trà. Chiều: Nhận phòng khách sạn 4 sao và tắm biển Mỹ Khê. Tối: Ngắm Cầu Rồng, Cầu Tình Yêu rực rỡ ánh đèn.'),
(2, 2, 'Bà Nà Hills - Cầu Vàng - Làng Pháp Cổ Kính',
 'Sáng: Khởi hành lên đỉnh Bà Nà bằng cáp treo đạt nhiều kỷ lục thế giới, check-in Cầu Vàng, vườn hoa Le Jardin D''Amour và Hầm rượu Debay. Trưa: Thưởng thức đại tiệc Buffet hơn 90 món. Chiều: Vui chơi Fantasy Park. Tối: Tự do khám phá ẩm thực Đà thành.'),
(2, 3, 'Ngũ Hành Sơn - Phố Cổ Hội An Đèn Lồng Lung Linh',
 'Sáng: Tham quan danh thắng Ngũ Hành Sơn và làng đá mỹ nghệ Non Nước. Chiều: Khởi hành vào Phố Cổ Hội An, thăm Chùa Cầu Nhật Bản, Hội quán Phước Kiến, thả hoa đăng trên sông Hoài. Tối: Thưởng thức Cao lầu, Cơm gà Hội An.'),
(2, 4, 'Chợ Hàn Đà Nẵng - Mua đặc sản miền Trung - Tiễn sân bay',
 'Sáng: Ăn sáng tại khách sạn, tự do mua sắm đặc sản chả bò, mực rim tại Chợ Hàn. Trưa: Làm thủ tục trả phòng, xe đưa đoàn ra sân bay quốc tế Đà Nẵng về lại TP. Hồ Chí Minh.'),

-- Tour 3: Hà Nội - Hạ Long - Ninh Bình (4N3Đ)
(3, 1, 'TP. Hồ Chí Minh - Hà Nội - Lăng Bác - Phố Cổ 36 Phố Phường',
 'Sáng: Bay cùng Vietnam Airlines (Boeing 787-9) ra sân bay Nội Bài. Chiều: Tham quan Văn Miếu Quốc Tử Giám, Hồ Hoàn Kiếm, Đền Ngọc Sơn. Tối: Dạo phố đi bộ Hồ Gươm, thưởng thức chả cá Lã Vọng và kem Tràng Tiền.'),
(3, 2, 'Hà Nội - Vịnh Hạ Long - Nghỉ đêm Du Thuyền 5 Sao',
 'Sáng: Khởi hành đi Quảng Ninh qua cao tốc, làm thủ tục lên Du thuyền 5 sao. Chiều: Thăm Hang Sửng Sốt, chèo thuyền Kayak tại Hang Luồn và tắm biển đảo Ti Tốp. Tối: Tiệc hải sản sang trọng trên boong tàu và câu mực đêm.'),
(3, 3, 'Ngắm bình minh Vịnh Hạ Long - Cố Đô Ninh Bình',
 'Sáng: Tập Thái Cực Quyền đón bình minh trên vịnh, dùng brunch và rời tàu di chuyển về Ninh Bình. Chiều: Viếng Chùa Bái Đính — quần thể chùa lớn bậc nhất Đông Nam Á. Tối: Thưởng thức đặc sản dê núi cơm cháy Ninh Bình.'),
(3, 4, 'Quần thể danh thắng Tràng An - Sân bay Nội Bài - TP. Hồ Chí Minh',
 'Sáng: Ngồi thuyền nan xuôi dòng Sào Khê khám phá hệ thống hang động xuyên thủy kỳ ảo tại Di sản thế giới Tràng An. Chiều: Xe đưa đoàn thẳng ra sân bay Nội Bài đáp chuyến bay về TP.HCM.'),

-- Tour 4: Singapore (4N3Đ)
(4, 1, 'TP. Hồ Chí Minh - Sân bay Jewel Changi - Công viên Merlion',
 'Trưa: Đáp chuyến bay Singapore Airlines đến Changi, chiêm ngưỡng thác nước trong nhà Rain Vortex tại Jewel Changi. Chiều: Chụp ảnh tại Công viên Sư tử biển Merlion, Nhà hát Trái Sầu Riêng Esplanade. Tối: Xem nhạc nước Spectra tại Marina Bay Sands.'),
(4, 2, 'Khu vườn năng lượng Gardens by the Bay - Đảo giải trí Sentosa',
 'Sáng: Tham quan nhà kính Cloud Forest và siêu cây khổng lồ Supertree Grove. Chiều: Sang đảo Sentosa chụp hình quả địa cầu Universal Studios, tham quan Bảo tàng Sáp Madame Tussauds và tắm biển Siloso.'),
(4, 3, 'Chùa Răng Phật Chinatown - Khu Tiểu Ấn - Đại lộ mua sắm Orchard Road',
 'Sáng: Viếng Chùa Răng Phật linh thiêng tại khu phố Hoa Chinatown và sắc màu rực rỡ tại Little India. Chiều: Tự do mua sắm hàng hiệu miễn thuế trên đại lộ Orchard Road và khu Bugis nhộn nhịp.'),
(4, 4, 'Tự do khám phá ẩm thực Singapore - Đáp chuyến bay về Việt Nam',
 'Sáng: Thưởng thức bữa sáng truyền thống Kaya Toast, tự do dạo phố. Trưa: Xe đón đoàn ra sân bay quốc tế Changi làm thủ tục hoàn thuế và đáp chuyến bay Singapore Airlines về lại TP. Hồ Chí Minh.'),

-- Tour 5: Bangkok - Pattaya (5N4Đ)
(5, 1, 'TP. Hồ Chí Minh - Bangkok - Thành phố biển Pattaya',
 'Sáng: Bay cùng Thai Airways đến sân bay Suvarnabhumi (Bangkok), xe đưa đoàn thẳng về thành phố biển Pattaya. Tối: Dạo phố đi bộ Walking Street và thưởng thức ẩm thực đường phố Thái Lan.'),
(5, 2, 'Tàu cao tốc Đảo San Hô Coral - Trân Bảo Phật Sơn - Alcazar Show',
 'Sáng: Đi cano cao tốc ra Đảo Coral tắm biển trong vắt, tham gia dù lượn, mô tô nước. Chiều: Viếng núi Phật Vàng Khao Chee Chan và Vườn nhiệt đới Nong Nooch. Tối: Xem chương trình nghệ thuật Alcazar Cabaret Show hoành tráng.'),
(5, 3, 'Pattaya - Bangkok - Buffet Tòa nhà 86 tầng Baiyoke Sky',
 'Sáng: Tham quan Trung tâm Đá quý Hoàng gia và Trại mật ong. Trưa: Trở về thủ đô Bangkok, thưởng thức đại tiệc Buffet trưa tại tầng 86 tòa nhà Baiyoke Sky ngắm toàn cảnh thành phố. Tối: Mua sắm tại Central World & Big C.'),
(5, 4, 'Dạo thuyền sông Chao Phraya - Chùa Bình Minh Wat Arun - Wat Yannawa',
 'Sáng: Dạo thuyền trên dòng sông Huyền thoại Chao Phraya, check-in Chùa Bình Minh (Wat Arun) và Chùa Thuyền (Wat Yannawa). Chiều: Viếng Phật Bốn Mặt linh thiêng và dạo trung tâm thương mại ICONSIAM.'),
(5, 5, 'Mua sắm lưu niệm tại Bangkok - Đáp chuyến bay về TP.HCM',
 'Sáng: Dùng điểm tâm tại khách sạn, nghỉ ngơi và đóng gói hành lý. Trưa: Xe đưa đoàn ra sân bay quốc tế Suvarnabhumi làm thủ tục chuyến bay về lại TP. Hồ Chí Minh.'),

-- Tour 6: Đà Lạt (3N2Đ)
(6, 1, 'Hà Nội - Đà Lạt - Quảng Trường Lâm Viên - Nông Trại Puppy Farm',
 'Sáng: Đáp chuyến bay sớm của Bamboo Airways vào sân bay Liên Khương. Tham quan Quảng trường Lâm Viên (nụ hoa Atiso & Dã quỳ khổng lồ). Chiều: Ghé Nông trại cún Puppy Farm và vườn dâu tây công nghệ cao. Tối: Dạo Chợ đêm Đà Lạt.'),
(6, 2, 'Săn mây Đồi Chè Cầu Đất - Ga Đà Lạt Cổ - Giao lưu Cồng Chiêng',
 'Sáng sớm: Đón bình minh và săn biển mây bồng bềnh tại Đồi chè Cầu Đất. Chiều: Tham quan Ga xe lửa cổ Đà Lạt, Chùa Linh Phước (Chùa Ve Chai). Tối: Thưởng thức tiệc nướng BBQ lẩu rau và giao lưu Văn hóa Cồng chiêng Tây Nguyên dưới chân núi Langbiang.'),
(6, 3, 'Thác Datanla - Thiền Viện Trúc Lâm - Tiễn sân bay Liên Khương',
 'Sáng: Viếng Thiền Viện Trúc Lâm bên hồ Tuyền Lâm thơ mộng, trải nghiệm máng trượt xuyên rừng thông tại Thác Datanla. Trưa: Mua đặc sản mứt, trà Atiso rồi ra sân bay Liên Khương về lại Hà Nội.'),

-- Tour 7: Seoul - Nami - Everland (5N4Đ)
(7, 1, 'TP. Hồ Chí Minh - Chuyến bay đêm Korean Air đi Incheon',
 'Tối: Quý khách tập trung tại sân bay quốc tế Tân Sơn Nhất, làm thủ tục chuyến bay thẳng Korean Air (Boeing 787-9 Dreamliner) khởi hành đi Seoul. Nghỉ đêm tiện nghi trên máy bay.'),
(7, 2, 'Seoul - Đảo Nami Thơ Mộng - Tháp Truyền Hình Namsan',
 'Sáng: Hạ cánh sân bay Incheon, xe đón đi Đảo Nami — bối cảnh phim Bản Tình Ca Mùa Đông nổi tiếng với hàng cây ngân hạnh và thủy sam thẳng tắp. Chiều: Lên Tháp N Seoul ngắm toàn cảnh thủ đô và móc khóa tình yêu.'),
(7, 3, 'Công viên Giải trí Everland - Lớp học làm Kim Chi & Mặc Hanbok',
 'Sáng: Trải nghiệm làm Kim chi truyền thống và diện trang phục Hanbok chụp ảnh. Chiều: Thỏa sức vui chơi tại Everland — một trong 10 công viên chủ đề hấp dẫn nhất thế giới với vườn thú Safari World.'),
(7, 4, 'Cung điện Gyeongbokgung - Làng cổ Bukchon Hanok - Phố Myeongdong',
 'Sáng: Tham quan Cung điện Hoàng gia Gyeongbokgung, Bảo tàng Dân gian Quốc gia và đi ngang Nhà Xanh Phủ Tổng thống. Chiều: Dạo làng cổ Bukchon Hanok và mua sắm mỹ phẩm tại thiên đường thời trang Myeongdong.'),
(7, 5, 'Thư viện Starfield COEX - Sân bay Incheon - TP. Hồ Chí Minh',
 'Sáng: Check-in Thư viện khổng lồ Starfield COEX và mua sắm nhân sâm, nấm linh chi Hàn Quốc. Chiều: Xe đưa đoàn ra sân bay quốc tế Incheon đáp chuyến bay về lại TP. Hồ Chí Minh.'),

-- Tour 8: Nha Trang (3N2Đ)
(8, 1, 'Hà Nội - Cam Ranh - Tháp Bà Ponagar - Tắm bùn khoáng I-Resort',
 'Chiều: Đáp chuyến bay VietJet Air đến sân bay Cam Ranh, nhận phòng khách sạn 4 sao mặt biển Trần Phú. Tham quan Tháp Bà Ponagar và thư giãn ngâm bùn khoáng nóng tại I-Resort. Tối: Thưởng thức hải sản Nha Trang.'),
(8, 2, 'Con đường đi bộ giữa biển Đảo Điệp Sơn - Giải trí VinWonders Nha Trang',
 'Sáng: Cano đưa đoàn khám phá con đường cát trắng giữa biển độc đáo tại Đảo Điệp Sơn. Chiều: Đi cáp treo sang đảo Hòn Tre vui chơi tại VinWonders, xem Tata Show đặc sắc vào buổi tối.'),
(8, 3, 'Chùa Long Sơn - Nhà Yến Nha Trang - Tiễn sân bay Cam Ranh',
 'Sáng: Viếng Chùa Long Sơn chiêm bái tượng Kim Thân Phật Tổ, tham quan Nhà Yến và mua đặc sản chả cá, nem Ninh Hòa tại Chợ Đầm. Trưa: Xe tiễn đoàn ra sân bay Cam Ranh về Hà Nội.'),

-- Tour 9: Quy Nhơn - Phú Yên (3N2Đ)
(9, 1, 'TP. Hồ Chí Minh - Quy Nhơn - Ghềnh Ráng Tiên Sa - Tháp Đôi',
 'Sáng: Bay VietJet Air đến sân bay Phù Cát. Tham quan Tháp Đôi Chăm Pa và khu du lịch Ghềnh Ráng Tiên Sa, mộ thi sĩ Hàn Mặc Tử. Chiều: Tự do tắm biển Quy Nhơn.'),
(9, 2, 'Thiên đường biển Kỳ Co - Eo Gió - Tịnh Xá Ngọc Hòa',
 'Sáng: Đi cano sang bãi biển Kỳ Co làn nước hai màu tuyệt đẹp, lặn ngắm san hô tại Bãi Dứa. Chiều: Check-in con đường ven biển Eo Gió hùng vĩ và đón hoàng hôn tại làng chài Nhơn Lý.'),
(9, 3, 'Phú Yên Gành Đá Đĩa - Nhà Thờ Mằng Lăng - Tiễn sân bay',
 'Sáng: Khởi hành sang Phú Yên tham quan Nhà thờ cổ Mằng Lăng, danh thắng quốc gia đặc biệt Gành Đá Đĩa và Bãi Xép (Hoa vàng trên cỏ xanh). Chiều: Ra sân bay về lại TP.HCM.'),

-- Tour 10: Huế - Quảng Bình (4N3Đ)
(10, 1, 'TP. Hồ Chí Minh - Cố Đô Huế - Chùa Thiên Mụ - Ca Huế Sông Hương',
 'Chiều: Bay Vietnam Airlines đến sân bay Phú Bài, viếng Chùa Thiên Mụ cổ kính bên bờ sông Hương. Tối: Ngồi thuyền rồng nghe nhã nhạc Ca Huế và thả đèn hoa đăng.'),
(10, 2, 'Huế - Quảng Bình - Động Phong Nha Kỳ Quan Đệ Nhất Động',
 'Sáng: Khởi hành đi Quảng Bình, viếng Thánh địa La Vang trên đường đi. Chiều: Ngồi thuyền ngược dòng sông Son khám phá vẻ đẹp thạch nhũ huyền ảo trong Động Phong Nha.'),
(10, 3, 'Đại Nội Kinh Thành Huế - Lăng Khải Định',
 'Sáng: Trở về Huế tham quan Hoàng Thành (Đại Nội) của 13 vị vua triều Nguyễn. Chiều: Chiêm ngưỡng kiến trúc giao thoa Đông - Tây tinh xảo tại Lăng vua Khải Định và làng hương Thủy Xuân.'),
(10, 4, 'Chợ Đông Ba - Thưởng thức Bún Bò Huế - Đáp chuyến bay về TP.HCM',
 'Sáng: Thưởng thức bún bò Huế chính gốc, mua mè xửng và tôm chua tại Chợ Đông Ba. Trưa: Xe tiễn đoàn ra sân bay Phú Bài về TP.HCM.'),

-- Tour 11: Chiang Mai - Chiang Rai (4N3Đ)
(11, 1, 'Hà Nội - Chiang Mai - Phố Cổ Lanna',
 'Tối: Đáp chuyến bay Thai Airways đến Chiang Mai — Đóa hồng phương Bắc Thái Lan, nhận phòng khách sạn nghỉ ngơi và dạo chợ đêm Night Bazaar.'),
(11, 2, 'Chùa Phrathat Doi Suthep - Làng Cổ Dài Karen - Bữa tối Khantoke',
 'Sáng: Viếng ngôi chùa linh thiêng Doi Suthep dát vàng trên đỉnh núi. Chiều: Thăm làng dân tộc cổ dài Karen. Tối: Dùng bữa tối cung đình Khantoke kèm múa truyền thống Lanna.'),
(11, 3, 'Chiang Rai - Chùa Trắng Wat Rong Khun - Chùa Xanh Wat Rong Suea Ten',
 'Cả ngày: Hành trình đến Chiang Rai chiêm ngưỡng kiệt tác kiến trúc Chùa Trắng tinh khôi, Chùa Xanh huyền ảo và vùng biên giới Tam Giác Vàng lịch sử.'),
(11, 4, 'Vườn Hoa Hoàng Gia Royal Flora - Sân bay Chiang Mai - Hà Nội',
 'Sáng: Dạo Vườn hoa Hoàng gia Royal Park Rajapruek rực rỡ sắc màu và mua sắm đồ thủ công mỹ nghệ. Chiều: Đáp chuyến bay về lại Hà Nội.'),

-- Tour 12: Côn Đảo (3N2Đ)
(12, 1, 'TP. Hồ Chí Minh - Bay thẳng Côn Đảo - Dinh Chúa Đảo - Nghĩa Trang Hàng Dương',
 'Sáng: Đáp chuyến bay thẳng Bamboo Airways ra Côn Đảo. Chiều: Tham quan Bảo tàng Côn Đảo, Trại Phú Hải và Chuồng Cọp. Tối: Dâng hương tưởng niệm tại Nghĩa trang Hàng Dương.'),
(12, 2, 'Bãi Đầm Trầu - Miếu Hoàng Tử Cải - Vân Sơn Tự',
 'Sáng: Viếng chùa Núi Một (Vân Sơn Tự) ngắm toàn cảnh vịnh Côn Sơn, tắm biển tại Bãi Đầm Trầu hoang sơ tuyệt đẹp và ngắm máy bay hạ cánh sát bờ biển.'),
(12, 3, 'Cảng Bến Đầm - Mua hạt bàng Côn Đảo - Bay về TP. Hồ Chí Minh',
 'Sáng: Tham quan Cảng Bến Đầm, Mũi Cá Mập, mua đặc sản mứt hạt bàng Côn Đảo tại chợ địa phương. Trưa: Xe đưa đoàn ra sân bay Cỏ Ống về lại TP. Hồ Chí Minh.');
