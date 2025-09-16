# 🚀 คำสั่งเริ่มระบบจัดเวรพยาบาล

ไฟล์ shell scripts สำหรับการจัดการระบบอย่างง่ายดาย

## 📁 ไฟล์ Scripts ที่มี

| ไฟล์ | คำอธิบาย |
|------|----------|
| `setup-database.sh` | ติดตั้งและสร้างฐานข้อมูล MySQL |
| `start-all.sh` | เริ่มทั้ง Backend และ Frontend พร้อมกัน |
| `start-backend.sh` | เริ่มเฉพาะ Backend (NestJS) |
| `start-frontend.sh` | เริ่มเฉพาะ Frontend (React) |
| `stop-all.sh` | หยุดระบบทั้งหมด |

## 🏁 การติดตั้งครั้งแรก

### 1. ติดตั้งฐานข้อมูล
```bash
./setup-database.sh
```
- สร้างฐานข้อมูล MySQL
- Import schema และข้อมูลเริ่มต้น
- แสดงข้อมูลการตั้งค่าสำหรับไฟล์ .env

### 2. เริ่มระบบทั้งหมด
```bash
./start-all.sh
```
- ติดตั้ง dependencies อัตโนมัติ
- เริ่ม Backend (http://localhost:3000)
- เริ่ม Frontend (http://localhost:5173)
- แสดงบัญชีทดสอบ

## 🎮 การใช้งานประจำ

### เริ่มระบบทั้งหมด
```bash
./start-all.sh
```

### เริ่มเฉพาะ Backend
```bash
cd nursing-shift-backend
../start-backend.sh
```

### เริ่มเฉพาะ Frontend  
```bash
cd nursing-shift-frontend
../start-frontend.sh
```

### หยุดระบบทั้งหมด
```bash
./stop-all.sh
```
หรือกด `Ctrl+C` ใน terminal ที่รัน `start-all.sh`

## 🔧 ข้อกำหนดระบบ

### ซอฟต์แวร์ที่ต้องมี
- **Node.js** (v16 หรือใหม่กว่า)
- **npm** 
- **MySQL** (v8.0 หรือใหม่กว่า)
- **Git** (สำหรับ clone repository)

### การติดตั้งบน macOS
```bash
# ติดตั้ง Homebrew (ถ้ายังไม่มี)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# ติดตั้งซอฟต์แวร์ที่จำเป็น
brew install node mysql
```

### การติดตั้งบน Ubuntu
```bash
# Update package list
sudo apt update

# ติดตั้ง Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# ติดตั้ง MySQL
sudo apt-get install mysql-server
```

## 👥 บัญชีทดสอบ

### หัวหน้าพยาบาล
- **Email**: head@hospital.com
- **Password**: password123
- **สิทธิ์**: สร้างเวร, มอบหมายเวร, อนุมัติการลา

### พยาบาล
- **Email**: nurse1@hospital.com, nurse2@hospital.com, nurse3@hospital.com  
- **Password**: password123
- **สิทธิ์**: ดูตารางเวร, ขอลา

## 🌐 URLs ของระบบ

- **Frontend (Web)**: http://localhost:5173
- **Backend (API)**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api (ถ้ามี Swagger)

## 🐛 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

#### 1. Port ถูกใช้งานแล้ว
```bash
# หยุดระบบทั้งหมด
./stop-all.sh

# หรือฆ่า process ที่ใช้ port
lsof -ti:3000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
```

#### 2. ฐานข้อมูลเชื่อมต่อไม่ได้
- ตรวจสอบว่า MySQL service ทำงาน: `brew services start mysql` (macOS)
- ตรวจสอบการตั้งค่าใน `nursing-shift-backend/.env`
- รันคำสั่ง `./setup-database.sh` ใหม่

#### 3. Dependencies หายหรือเก่า
```bash
cd nursing-shift-backend && rm -rf node_modules && npm install
cd nursing-shift-frontend && rm -rf node_modules && npm install
```

#### 4. Permission denied
```bash
chmod +x *.sh
```

### Log Files
- **Backend logs**: แสดงใน terminal
- **Frontend logs**: แสดงใน terminal และ browser console
- **Database logs**: ตรวจสอบใน MySQL logs

## 📞 การสนับสนุน

หากพบปัญหาหรือต้องการความช่วยเหลือ:

1. ตรวจสอบ error message ใน terminal
2. ตรวจสอบ browser console (F12)
3. ตรวจสอบไฟล์ log
4. ติดต่อทีมพัฒนา

---

**💡 เคล็ดลับ**: เปิด terminal หลายหน้าต่างสำหรับการ debug หรือใช้ `./start-all.sh` เพื่อความสะดวก
