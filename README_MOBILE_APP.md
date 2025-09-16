# Nursing Shift Management Mobile App (Flutter)

## ข้อมูลทั่วไป
- **Version**: Flutter 3.35.3 stable
- **Platform**: Android, iOS, Web, Windows, macOS, Linux (รองรับ Multi-platform)
- **สำหรับ**: พยาบาลเท่านั้น
- **APK พร้อมใช้งาน**: Android เท่านั้น (iOS ต้องมี Apple Developer Account)

## คุณสมบัติหลัก
1. **เข้าสู่ระบบ** - ใช้รหัสพยาบาลและรหัสผ่าน
2. **ดูตารางเวร** - แสดงตารางแบบรายสัปดาห์
3. **อนุมัติคำขอลา** - ดูและอนุมัติคำขอลาของพยาบาลในทีม
4. **โปรไฟล์** - จัดการข้อมูลส่วนตัว

## การติดตั้ง
1. ดาวน์โหลดไฟล์ APK
   - **Release Version** (แนะนำ): `nursing_app_release.apk` (49.5MB)
   - **Debug Version**: `nursing_app_debug.apk` (148MB)
2. เปิดการติดตั้งจากแหล่งที่ไม่รู้จักในเครื่อง Android
3. ติดตั้งแอป

## ข้อมูลสำหรับทดสอบ
- **Username**:  nurse1@hospital.com, nurse2@hospital.com, nurse3@hospital.com 
- **Password**: password123

## คุณสมบัติเทคนิค
- Material Design 3
- Secure token storage
- API integration with NestJS backend
- Weekly calendar view
- Leave request management
- Auto-login functionality

## การพัฒนา
```bash
cd nursing_shift_mobile
flutter pub get

# สำหรับ Android
flutter run
flutter build apk --release

# สำหรับ iOS (ต้องมี Xcode + CocoaPods)
flutter build ios --no-codesign

# สำหรับ Web
flutter build web

# สำหรับ Desktop
flutter build macos  # macOS
flutter build windows  # Windows
flutter build linux    # Linux
```

## API Backend
- Port: 3000
- Database: SQLite
- Authentication: JWT tokens
