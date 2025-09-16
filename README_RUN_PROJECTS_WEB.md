# Nursing Shift Management System

## Overview
Complete nursing shift management system with web interface and mobile app.

## Components
- **Backend**: NestJS v11 + SQLite
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Mobile**: Flutter 3.35.3 (Android, iOS, Web, Desktop)

## Quick Start
```bash

# Setup database
./setup-database.sh

# Start all services
./start-all.sh

# Stop all services  
./stop-all.sh

```

## Project Structure
```
├── nursing-shift-backend/      # NestJS API server
├── nursing-shift-frontend/     # React web app
├── nursing_shift_mobile/       # Flutter mobile app
├── nursing_app_release.apk     # Android APK (49.5MB)
├── nursing_app_macos.app       # macOS app (42.6MB)
└── nursing_app_web/            # Web build
```

## Features
- ✅ Shift scheduling and management
- ✅ Leave request system (separated pending/history)
- ✅ Role-based authentication (Admin/Head Nurse/Nurse)
- ✅ Multi-platform mobile app
- ✅ Responsive web interface

## Technologies
- **Backend**: NestJS, SQLite, JWT, TypeORM
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Mobile**: Flutter, Material Design 3, Secure Storage
- **Database**: SQLite with comprehensive schema

## Getting Started
1. Install dependencies
2. Run `./start-all.sh`
3. Access web app: http://localhost:5173
4. API docs: http://localhost:3000
5. Install APK on Android device

## Test Accounts
- **Admin**: admin@hospital.com / admin123
- **Head Nurse**: headnurse@hospital.com / password123
- **Nurses**: nurse1@hospital.com, nurse2@hospital.com / password123
