# Database Schema Documentation - ระบบจัดเวรพยาบาล

## ER Diagram Description

### ตาราง users
- **วัตถุประสงค์**: เก็บข้อมูลผู้ใช้ในระบบ (พยาบาลและหัวหน้าพยาบาล)
- **Key Fields**:
  - `id`: Primary Key
  - `email`: Unique identifier for login
  - `role`: ENUM('nurse', 'head_nurse') กำหนดบทบาท

### ตาราง shifts
- **วัตถุประสงค์**: เก็บข้อมูลเวรงานที่สร้างโดยหัวหน้าพยาบาล
- **Key Fields**:
  - `id`: Primary Key
  - `date`, `start_time`, `end_time`: กำหนดช่วงเวลาทำงาน
  - `created_by`: Foreign Key ไปยัง users (head_nurse)

### ตาราง shift_assignments
- **วัตถุประสงค์**: เก็บการมอบหมายเวรให้พยาบาล
- **Key Fields**:
  - `user_id`: Foreign Key ไปยัง users (nurse)
  - `shift_id`: Foreign Key ไปยัง shifts
  - `assigned_by`: Foreign Key ไปยัง users (head_nurse)
- **Constraint**: UNIQUE(user_id, shift_id) - พยาบาลคนเดียวไม่สามารถได้เวรเดียวกันซ้ำ

### ตาราง leave_requests
- **วัตถุประสงค์**: เก็บคำขอลาของพยาบาล
- **Key Fields**:
  - `shift_assignment_id`: Foreign Key ไปยัง shift_assignments
  - `status`: ENUM('pending', 'approved', 'rejected')
  - `approved_by`: Foreign Key ไปยัง users (head_nurse)

## Relationships
1. **users → shifts**: One-to-Many (หัวหน้าพยาบาลสร้างหลายเวร)
2. **users → shift_assignments**: One-to-Many (พยาบาลได้รับหลายเวร)
3. **shifts → shift_assignments**: One-to-Many (เวรหนึ่งมีหลายคนได้รับมอบหมาย)
4. **shift_assignments → leave_requests**: One-to-Many (การมอบหมายหนึ่งสามารถมีหลายคำขอลา)

## Security Considerations
- Password hashing ด้วย bcrypt
- JWT token สำหรับ authentication
- Role-based access control
- Foreign key constraints เพื่อ data integrity
