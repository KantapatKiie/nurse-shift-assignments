# ระบบจัดเวรพยาบาล (Nursing Shift Management System)

ระบบบริหารจัดการเวรการทำงานสำหรับพยาบาลและหัวหน้าพยาบาล ประกอบด้วย Backend API, Web Frontend, และ Mobile App

## 🏗️ สถาปัตยกรรมระบบ

```
├── nursing-shift-backend/     # NestJS Backend API
├── nursing-shift-frontend/    # React Web Application  
├── database_schema.sql        # MySQL Database Schema
├── database_documentation.md  # Database Documentation
└── Flutter_Implementation_Guide.md # Flutter Mobile Guide
```

## 🚀 การติดตั้งและรันระบบ

### 1. ติดตั้ง Database
```bash
# สร้างฐานข้อมูล MySQL
mysql -u root -p
CREATE DATABASE nursing_shift_system;
exit

# Import schema
mysql -u root -p nursing_shift_system < database_schema.sql
```

### 2. รัน Backend (NestJS)
```bash
cd nursing-shift-backend

# ติดตั้ง dependencies
npm install

# กำหนดค่า environment
cp .env.example .env
# แก้ไขค่าในไฟล์ .env ตามการตั้งค่าฐานข้อมูลของคุณ

# สร้างข้อมูลผู้ใช้เริ่มต้น
npm run seed

# รันเซิร์ฟเวอร์
npm run start:dev
```

Backend จะทำงานที่ `http://localhost:3000`

### 3. รัน Frontend (React)
```bash
cd nursing-shift-frontend

# ติดตั้ง dependencies
npm install

# รันเว็บแอปพลิเคชัน
npm run dev
```

Frontend จะทำงานที่ `http://localhost:5173`

## 👥 บัญชีผู้ใช้ทดสอบ

### หัวหน้าพยาบาล
- **อีเมล**: head@hospital.com
- **รหัสผ่าน**: password123
- **สิทธิ์**: สร้างเวร, มอบหมายเวร, อนุมัติการลา

### พยาบาล
- **อีเมล**: nurse1@hospital.com, nurse2@hospital.com, nurse3@hospital.com
- **รหัสผ่าน**: password123
- **สิทธิ์**: ดูตารางเวร, ขอลา

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - สมัครสมาชิก
- `POST /auth/login` - เข้าสู่ระบบ

### Shifts (เวร)
- `POST /shifts` - สร้างเวร (หัวหน้าเท่านั้น)
- `POST /shifts/assign` - มอบหมายเวร (หัวหน้าเท่านั้น)
- `GET /shifts/my-schedule` - ดูตารางเวรของตัวเอง (พยาบาล)
- `GET /shifts` - ดูเวรทั้งหมด (หัวหน้าเท่านั้น)

### Leave Requests (การขอลา)
- `POST /leave-requests` - ขอลา (พยาบาล)
- `GET /leave-requests` - ดูคำขอลาทั้งหมด (หัวหน้าเท่านั้น)
- `GET /leave-requests/my-requests` - ดูคำขอลาของตัวเอง (พยาบาล)
- `PATCH /leave-requests/:id/approve` - อนุมัติ/ปฏิเสธการลา (หัวหน้าเท่านั้น)

## 🏥 ฟีเจอร์หลัก

### สำหรับพยาบาล
- ✅ เข้าสู่ระบบ
- ✅ ดูตารางเวรของตัวเอง
- ✅ ขอลาจากเวรที่ได้รับมอบหมาย
- ✅ ดูประวัติการขอลา

### สำหรับหัวหน้าพยาบาล
- ✅ เข้าสู่ระบบ
- ✅ สร้างเวรใหม่
- ✅ มอบหมายเวรให้พยาบาล
- ✅ ดูคำขอลาและอนุมัติ/ปฏิเสธ
- ✅ จัดการเวรทั้งหมด

## 🛠️ เทคโนโลยีที่ใช้

### Backend
- **NestJS** - Node.js Framework
- **TypeORM** - ORM สำหรับ Database
- **MySQL** - ฐานข้อมูล
- **JWT** - Authentication
- **bcrypt** - Password Hashing

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP Client

### Mobile (Flutter)
- **Flutter** - Cross-platform Mobile Framework
- **Dart** - Programming Language
- **HTTP** - API Communication
- **Shared Preferences** - Local Storage

## 📱 Mobile App

Mobile app สำหรับพยาบาลใช้ Flutter โดยมีฟีเจอร์:
- เข้าสู่ระบบ
- ดูตารางเวรรายสัปดาห์
- ขอลา
- ดูประวัติการขอลา

ดู `Flutter_Implementation_Guide.md` สำหรับคำแนะนำการพัฒนา

## 🗄️ โครงสร้างฐานข้อมูล

### ตาราง users
เก็บข้อมูลผู้ใช้ (พยาบาล, หัวหน้าพยาบาล)

### ตาราง shifts  
เก็บข้อมูลเวรงาน (วันที่, เวลา)

### ตาราง shift_assignments
เก็บการมอบหมายเวรให้พยาบาล

### ตาราง leave_requests
เก็บคำขอลาของพยาบาล

## 🔒 ความปลอดภัย

- Password hashing ด้วย bcrypt
- JWT token authentication
- Role-based access control
- Input validation
- SQL injection prevention

## 📋 การทดสอบ

### ทดสอบ Backend
```bash
cd nursing-shift-backend
npm run test
```

### ทดสอบ Frontend
```bash
cd nursing-shift-frontend  
npm run test
```

## 📝 การใช้งาน

1. **หัวหน้าพยาบาล**: เข้าสู่ระบบ → สร้างเวร → มอบหมายเวรให้พยาบาล → อนุมัติการลา
2. **พยาบาล**: เข้าสู่ระบบ → ดูตารางเวร → ขอลา → ติดตามสถานะการลา

## 🚧 การพัฒนาต่อ

- Push Notifications
- Email Notifications  
- Offline Mode
- Advanced Scheduling
- Reporting & Analytics
- Multi-language Support

## 📞 การสนับสนุน

สำหรับคำถามหรือปัญหา กรุณาติดต่อทีมพัฒนา

---

**ระบบจัดเวรพยาบาล** - พัฒนาด้วย ❤️ สำหรับโรงพยาบาลและสถานพยาบาล
