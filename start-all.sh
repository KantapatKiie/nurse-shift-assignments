#!/bin/bash

# ระบบจัดเวรพยาบาล - Start All Services
# Author: GitHub Copilot
# Date: September 16, 2025

echo "🏥 เริ่มต้นระบบจัดเวรพยาบาล (ทั้งหมด)"
echo "============================================="
echo ""

# ฟังก์ชันสำหรับจัดการ signal
cleanup() {
    echo ""
    echo "🛑 กำลังหยุดระบบทั้งหมด..."
    # ฆ่า process ทั้งหมดที่อยู่ใน background
    kill $(jobs -p) 2>/dev/null
    echo "✅ หยุดระบบเรียบร้อยแล้ว"
    exit 0
}

# ตั้งค่า trap สำหรับ Ctrl+C
trap cleanup SIGINT SIGTERM

# เช็คว่าอยู่ใน directory หลักหรือไม่
if [ ! -d "nursing-shift-backend" ] || [ ! -d "nursing-shift-frontend" ]; then
    echo "❌ ไม่พบ directory nursing-shift-backend หรือ nursing-shift-frontend"
    echo "   กรุณาเรียกใช้ script นี้ใน directory หลักที่มี project ทั้งสอง"
    exit 1
fi

# เช็คว่ามี Node.js หรือไม่
if ! command -v node &> /dev/null; then
    echo "❌ ไม่พบ Node.js กรุณาติดตั้ง Node.js ก่อน"
    exit 1
fi

echo "✅ พบ Node.js เวอร์ชัน: $(node --version)"
echo ""

# ติดตั้ง dependencies สำหรับ backend
echo "📦 ติดตั้ง Backend Dependencies..."
cd nursing-shift-backend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ การติดตั้ง backend dependencies ไม่สำเร็จ"
        exit 1
    fi
fi

# สร้างไฟล์ .env ถ้ายังไม่มี
if [ ! -f ".env" ]; then
    echo "⚠️  สร้างไฟล์ .env สำหรับ Backend..."
    cat > .env << EOL
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=nursing_shift_system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h

# Application Configuration
PORT=3000
NODE_ENV=development
EOL
fi

cd ..

# ติดตั้ง dependencies สำหรับ frontend
echo "📦 ติดตั้ง Frontend Dependencies..."
cd nursing-shift-frontend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ การติดตั้ง frontend dependencies ไม่สำเร็จ"
        exit 1
    fi
fi
cd ..

echo ""
echo "🚀 เริ่มต้นระบบทั้งหมด..."
echo ""

# เริ่ม Backend
echo "🔧 เริ่มต้น Backend Server..."
cd nursing-shift-backend
npm run seed 2>/dev/null || echo "   ข้อมูลผู้ใช้อาจมีอยู่แล้ว"
npm run start:dev &
BACKEND_PID=$!
cd ..

# รอสักครู่ให้ Backend เริ่มทำงาน
echo "⏳ รอ Backend เริ่มทำงาน..."
sleep 5

# เช็คว่า Backend เริ่มทำงานแล้วหรือไม่
if ! curl -s http://localhost:3000 &> /dev/null; then
    echo "⚠️  Backend อาจยังไม่พร้อม กำลังรอ..."
    sleep 5
fi

# เริ่ม Frontend
echo "🌐 เริ่มต้น Frontend Server..."
cd nursing-shift-frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ ระบบเริ่มทำงานเรียบร้อยแล้ว!"
echo "============================================="
echo "🔗 URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo ""
echo "👥 บัญชีทดสอบ:"
echo "   หัวหน้าพยาบาล: head@hospital.com"
echo "   พยาบาล: nurse1@hospital.com"
echo "   รหัสผ่าน: password123"
echo ""
echo "💡 คำแนะนำ:"
echo "   - เปิดเบราว์เซอร์ไปที่ http://localhost:5173"
echo "   - ใช้บัญชีทดสอบด้านบนสำหรับ login"
echo "   - กด Ctrl+C เพื่อหยุดระบบทั้งหมด"
echo "============================================="

# รอให้ process ทำงาน
wait
