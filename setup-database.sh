#!/bin/bash

# ระบบจัดเวรพยาบาล - Setup Database
# Author: GitHub Copilot
# Date: September 16, 2025

echo "🗄️  ติดตั้งฐานข้อมูลระบบจัดเวรพยาบาล"
echo "====================================="

# เช็คว่ามี MySQL หรือไม่
if ! command -v mysql &> /dev/null; then
    echo "❌ ไม่พบ MySQL กรุณาติดตั้ง MySQL ก่อน"
    echo "   macOS: brew install mysql"
    echo "   Ubuntu: sudo apt-get install mysql-server"
    echo "   Windows: ดาวน์โหลดจาก https://dev.mysql.com/downloads/"
    exit 1
fi

echo "✅ พบ MySQL"

# ตัวแปรสำหรับฐานข้อมูล
DB_NAME="nursing_shift_system"
DB_USER="root"

echo ""
echo "📋 ข้อมูลการตั้งค่า:"
echo "   ชื่อฐานข้อมูล: $DB_NAME"
echo "   ผู้ใช้: $DB_USER"
echo ""

# ขอรหัสผ่าน MySQL
read -s -p "🔐 กรอกรหัสผ่าน MySQL root (กด Enter ถ้าไม่มีรหัสผ่าน): " DB_PASSWORD
echo ""

# ทดสอบการเชื่อมต่อ
echo "🔍 ทดสอบการเชื่อมต่อ MySQL..."
if [ -z "$DB_PASSWORD" ]; then
    # ไม่มีรหัสผ่าน
    mysql -u$DB_USER -e "SELECT 1;" &> /dev/null
    MYSQL_CMD="mysql -u$DB_USER"
else
    # มีรหัสผ่าน
    mysql -u$DB_USER -p$DB_PASSWORD -e "SELECT 1;" &> /dev/null
    MYSQL_CMD="mysql -u$DB_USER -p$DB_PASSWORD"
fi

if [ $? -ne 0 ]; then
    echo "❌ ไม่สามารถเชื่อมต่อ MySQL ได้"
    echo "   กรุณาตรวจสอบ:"
    echo "   1. MySQL service ทำงานหรือไม่: brew services start mysql"
    echo "   2. รหัสผ่าน root ถูกต้องหรือไม่"
    exit 1
fi
echo "✅ เชื่อมต่อ MySQL สำเร็จ"

# สร้างฐานข้อมูล
echo "🏗️  สร้างฐานข้อมูล $DB_NAME..."
$MYSQL_CMD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ สร้างฐานข้อมูลสำเร็จ"
else
    echo "❌ ไม่สามารถสร้างฐานข้อมูลได้"
    exit 1
fi

# Import schema
echo "📊 Import database schema..."
if [ -f "database_schema.sql" ]; then
    $MYSQL_CMD $DB_NAME < database_schema.sql
    if [ $? -eq 0 ]; then
        echo "✅ Import schema สำเร็จ"
    else
        echo "❌ Import schema ไม่สำเร็จ"
        exit 1
    fi
else
    echo "❌ ไม่พบไฟล์ database_schema.sql"
    exit 1
fi

# แสดงตารางที่สร้าง
echo ""
echo "📋 ตารางที่สร้างในฐานข้อมูล:"
$MYSQL_CMD $DB_NAME -e "SHOW TABLES;"

echo ""
echo "✅ ติดตั้งฐานข้อมูลเรียบร้อยแล้ว!"
echo ""
echo "📝 อัปเดตไฟล์ .env ใน nursing-shift-backend:"
echo "   DB_HOST=localhost"
echo "   DB_PORT=3306"
echo "   DB_USERNAME=$DB_USER"
echo "   DB_PASSWORD=$DB_PASSWORD"
echo "   DB_DATABASE=$DB_NAME"
echo ""
echo "🚀 พร้อมเริ่มระบบด้วยคำสั่ง: ./start-all.sh"
