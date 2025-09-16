-- ระบบจัดเวรพยาบาล Database Schema

-- ตาราง users - เก็บข้อมูลผู้ใช้ระบบ
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- hashed password
    role ENUM('nurse', 'head_nurse') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ตาราง shifts - เก็บข้อมูลเวรงาน
CREATE TABLE shifts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_by INT NOT NULL, -- head_nurse ที่สร้างเวร
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_shift (date, start_time, end_time)
);

-- ตาราง shift_assignments - เก็บการมอบหมายเวรให้พยาบาล
CREATE TABLE shift_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL, -- พยาบาลที่ได้รับมอบหมาย
    shift_id INT NOT NULL,
    assigned_by INT NOT NULL, -- head_nurse ที่มอบหมาย
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (user_id, shift_id)
);

-- ตาราง leave_requests - เก็บคำขอลาของพยาบาล
CREATE TABLE leave_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shift_assignment_id INT NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approved_by INT NULL, -- head_nurse ที่อนุมัติ/ปฏิเสธ
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_assignment_id) REFERENCES shift_assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- สร้าง index เพื่อเพิ่มประสิทธิภาพ
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_shifts_date ON shifts(date);
CREATE INDEX idx_shift_assignments_user ON shift_assignments(user_id);
CREATE INDEX idx_shift_assignments_shift ON shift_assignments(shift_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_shift_assignment ON leave_requests(shift_assignment_id);

-- Insert ข้อมูลตัวอย่าง
INSERT INTO users (name, email, password, role) VALUES 
('หัวหน้าพยาบาล สมใจ', 'head@hospital.com', '$2b$10$encrypted_password_hash', 'head_nurse'),
('พยาบาล สมหญิง', 'nurse1@hospital.com', '$2b$10$encrypted_password_hash', 'nurse'),
('พยาบาล สมชาย', 'nurse2@hospital.com', '$2b$10$encrypted_password_hash', 'nurse'),
('พยาบาล สมศรี', 'nurse3@hospital.com', '$2b$10$encrypted_password_hash', 'nurse');
