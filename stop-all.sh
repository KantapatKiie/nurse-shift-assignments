#!/bin/bash

# ระบบจัดเวรพยาบาล - Stop All Services
# Author: GitHub Copilot
# Date: September 16, 2025

echo "🛑 หยุดระบบจัดเวรพยาบาล"
echo "========================="

# ฆ่า process ที่รันบน port 3000 (Backend)
BACKEND_PID=$(lsof -t -i:3000)
if [ ! -z "$BACKEND_PID" ]; then
    echo "🔧 หยุด Backend Server (PID: $BACKEND_PID)"
    kill $BACKEND_PID
else
    echo "ℹ️  Backend Server ไม่ได้ทำงาน"
fi

# ฆ่า process ที่รันบน port 5173 (Frontend)
FRONTEND_PID=$(lsof -t -i:5173)
if [ ! -z "$FRONTEND_PID" ]; then
    echo "🌐 หยุด Frontend Server (PID: $FRONTEND_PID)"
    kill $FRONTEND_PID
else
    echo "ℹ️  Frontend Server ไม่ได้ทำงาน"
fi

# ฆ่า npm และ node process ที่เหลือ
echo "🧹 ทำความสะอาด process ที่เหลือ..."
pkill -f "npm run start:dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "nest start" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

sleep 2

echo "✅ หยุดระบบทั้งหมดเรียบร้อยแล้ว"
