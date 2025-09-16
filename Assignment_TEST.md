📄 Coding Assignment: ระบบจัดเวรพยาบาล
🎯 เป้าหมาย: สร้างระบบจัดเวรพยาบาล ที่มีระบบผู้ใช้ 2 บทบาทหลัก ได้แก่ หัวหน้าพยาบาล และ พยาบาล โดยระบบต้องรองรับการ:
สร้างและจัดการผู้ใช้
กำหนดบทบาท (Role)
สร้างเวรประจำวัน
พยาบาลดูตารางเวรตัวเอง
พยาบาลขอลาในเวร
หัวหน้าพยาบาลอนุมัติ/ปฏิเสธการลา

✅ ข้อที่ 1: ออกแบบฐานข้อมูล (Database Schema)
🧠 คำสั่ง: ออกแบบตารางฐานข้อมูลเพื่อรองรับ use case ทั้งหมด (สามารถใช้ SQL หรือ ORM schema)
✅ ตารางที่ต้องมี:
users
id, name, email, password, role (nurse, head_nurse)


shifts
id, date, start_time, end_time


shift_assignments
id, user_id, shift_id


leave_requests
id, shift_assignment_id, reason, status (pending, approved, rejected), approved_by
📤 สิ่งที่ต้องส่ง:
SQL DDL หรือ ER Diagram
แนบคำอธิบายตารางสั้น ๆ


✅ ข้อที่ 2: Backend API (NestJS)
🧠 คำสั่ง: พัฒนา REST API สำหรับรองรับฟีเจอร์ทั้งหมด
✅ API ที่ต้องมี:
🔐 Auth & User
POST /auth/register — สมัครผู้ใช้ใหม่ + กำหนด role
POST /auth/login — login และรับ JWT
Middleware ตรวจ role (nurse หรือ head_nurse)
📆 เวร
POST /shifts — (หัวหน้า) สร้างเวร
POST /shift-assignments — (หัวหน้า) จัดเวรให้พยาบาล
GET /my-schedule — (พยาบาล) ดูเวรตัวเอง
📋 ขอลา
POST /leave-requests — (พยาบาล) ขออนุมัติลา
GET /leave-requests — (หัวหน้า) ดูคำขอลาทั้งหมด
PATCH /leave-requests/:id/approve — อนุมัติ/ปฏิเสธคำขอลา
📤 สิ่งที่ต้องส่ง:
Source code backend

✅ ข้อที่ 3: Web Frontend (React Vitejs + tailwind css for responesive)
🧠 คำสั่ง: สร้าง Web UI สำหรับ 2 บทบาท ได้แก่
👩‍⚕️ พยาบาล:
Login เข้าระบบ
ดูตารางเวรตัวเอง
กด “ขอลา” ได้จากเวรที่ได้รับมอบหมาย
👩‍⚕️ หัวหน้าพยาบาล:
Login เข้าระบบ
สร้างเวร
จัดเวรให้พยาบาล
ดูรายการขอลา และกดอนุมัติ/ปฏิเสธ
📤 สิ่งที่ต้องส่ง:
Source code
Deploy link (ถ้ามี)

✅ ข้อที่ 4: Flutter stable 3 lasted version for Mobile (เฉพาะพยาบาล)
🧠 คำสั่ง: สร้าง Flutter App สำหรับพยาบาลเท่านั้น:
Login
ดูเวรของตัวเอง (แนะนำแบบสัปดาห์)
ขออนุมัติลา
📤 สิ่งที่ต้องส่ง:
Source code Flutter
APK / Screenshot

🔐 หมายเหตุ:
- ใช้ auth แบบ JWT หรือ session-based ได้
- สามารถ hardcode ผู้ใช้เริ่มต้นได้ถ้าไม่มีเวลาเขียน register




