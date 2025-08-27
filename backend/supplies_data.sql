-- สร้างตาราง supplies ถ้ายังไม่มี
CREATE TABLE IF NOT EXISTS supplies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit TEXT NOT NULL,
    import_date TEXT NOT NULL,
    expiry_date TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ลบข้อมูลเก่าออกก่อน (กันซ้ำ)
DELETE FROM supplies;

-- ใส่ข้อมูลตัวอย่างเวชภัณฑ์
INSERT INTO supplies (code, name, category, quantity, unit, import_date, expiry_date)
VALUES
('MED001', 'พาราเซตามอล 500mg', 'ยา', 500, 'เม็ด', '2025-06-01', '2027-06-01'),
('MED002', 'อม็อกซิซิลลิน 500mg', 'ยา', 300, 'แคปซูล', '2025-07-15', '2026-07-15'),
('SUP001', 'ถุงมือยาง (S)', 'อุปกรณ์', 1000, 'คู่', '2025-05-20', '2026-05-20'),
('SUP002', 'หน้ากากอนามัย 3 ชั้น', 'อุปกรณ์', 2000, 'ชิ้น', '2025-08-01', '2028-08-01'),
('SUP003', 'สำลีปลอดเชื้อ', 'อุปกรณ์', 800, 'ถุง', '2025-06-10', '2027-06-10'),
('DIS001', 'แอลกอฮอล์ 70%', 'เวชภัณฑ์สิ้นเปลือง', 50, 'ขวด', '2025-07-01', '2026-07-01'),
('DIS002', 'น้ำเกลือ 0.9% NSS 500ml', 'เวชภัณฑ์สิ้นเปลือง', 120, 'ขวด', '2025-06-05', '2026-06-05'),
('DIS003', 'ผ้าก๊อซปลอดเชื้อ', 'เวชภัณฑ์สิ้นเปลือง', 600, 'ห่อ', '2025-07-10', '2027-07-10');
