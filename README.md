# Adopt-me API Backend

ระบบ Backend API สำหรับการจัดการรับเลี้ยงสัตว์ (Adopt-Me) พัฒนาด้วย Express.js และ PostgreSQL

---

## 🚀 วิธีเริ่มต้นใช้งาน (Getting Started)

### 1. ติดตั้ง Dependencies
เปิด Terminal ในโฟลเดอร์ `backend`:
```bash
cd backend
npm install
```

### 2. ตั้งค่าไฟล์ Environment (.env)
สร้างหรือตรวจสอบไฟล์ `.env` ในโฟลเดอร์ `backend`:
```env
PORT=5000
NODE_ENV=development

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dev
DB_USER=dev
DB_PASSWORD=aa1234

# JWT Configuration
JWT_SECRET=secret123
JWT_EXPIRATION=24h
```

### 3. รันเซิร์ฟเวอร์ Backend
```bash
npm run dev
# หรือรันปกติ
npm start
```
เมื่อเซิร์ฟเวอร์ทำงาน จะแสดงข้อความพร้อม Endpoint ที่พร้อมใช้งานบน `http://localhost:5000`

---

## 🧪 วิธีทดสอบระบบผ่าน Postman (Postman Testing Guide)

โปรเจกต์มีไฟล์ Postman Collection เตรียมไว้ให้เรียบร้อยแล้ว:
📁 [Adopt-me-API.postman_collection.json](file:///c:/Users/poom/Desktop/server/Adopt-me/Adopt-me-API.postman_collection.json)

### ขั้นตอนการ Import เข้า Postman
1. เปิดโปรแกรม **Postman**
2. คลิกปุ่ม **Import** ที่มุมบนซ้าย
3. ลากไฟล์ `Adopt-me-API.postman_collection.json` วางลงใน Postman (หรือกดเลือก Browse ไปที่ไฟล์นี้)
4. จะได้ Collection ชื่อ **Adopt-Me API (Full Complete)**

---

### ลำดับการทดสอบ Endpoints (Test Flow)

Collection ถูกออกแบบให้มี **Test Scripts บันทึก Token และ ID ให้อัตโนมัติ (Auto-Set Variables)** ทำให้สามารถกดรันเรียงตามลำดับได้ทันที:

| ลำดับ | Endpoint | Method | Role | รายละเอียด | หมายเหตุ |
|---|---|---|---|---|---|
| **0** | `/health` | `GET` | Public | เช็คสถานะเซิร์ฟเวอร์ | คืนค่า `status: "ok"` |
| **1.1** | `/api/v1/auth/register` | `POST` | Public | สมัครสมาชิกบัญชี Adopter | บันทึก `token_adopter` อัตโนมัติ |
| **1.2** | `/api/v1/auth/register` | `POST` | Public | สมัครสมาชิกบัญชี Caretaker | บันทึก `token_caretaker` อัตโนมัติ |
| **1.3** | `/api/v1/auth/login` | `POST` | Public | เข้าสู่ระบบ | คืนค่า JWT Token |
| **2.1** | `/api/v1/animals` | `POST` | Public | ลงทะเบียนสัตว์ตัวใหม่ | บันทึก `animal_id` อัตโนมัติ |
| **2.2** | `/api/v1/animals` | `GET` | Public | ดึงรายการสัตว์ทั้งหมด | รองรับ Query Filter |
| **2.3** | `/api/v1/animals/:id` | `GET` | Public | ดูรายละเอียดสัตว์รายตัว | ดึงตาม `animal_id` |
| **2.4** | `/api/v1/animals/:id/claim` | `PATCH` | **Caretaker** | ผู้ดูแลกด Claim สัตว์ไปดูแล | ใช้ `token_caretaker` |
| **3.1** | `/api/v1/adoption-applications` | `POST` | **Adopter** | ยื่นขอรับเลี้ยงสัตว์ | ใช้ `token_adopter`, บันทึก `application_id` |
| **3.2** | `/api/v1/adoption-applications/me` | `GET` | **Adopter** | ผู้สมัครดูใบสมัครของตนเอง | ใช้ `token_adopter` |
| **3.3** | `/api/v1/adoption-applications/:id/status` | `PATCH` | **Caretaker** | อนุมัติ/ปฏิเสธใบสมัคร | ใช้ `token_caretaker` |
| **4.1** | `/api/v1/follow-ups` | `POST` | **Caretaker** | บันทึกผลการติดตามหลังรับเลี้ยง | ใช้ `token_caretaker` |
| **4.2** | `/api/v1/follow-ups` | `GET` | **Caretaker** | ดูรายการบันทึกผลการติดตาม | ใช้ `token_caretaker` |

---

### วิธีทดสอบแบบคลิกเดียวจบ (Run Collection Automation)
1. คลิกขวาที่ชื่อ Collection **Adopt-Me API (Full Complete)** ใน Postman
2. เลือก **Run collection**
3. กดปุ่ม **Run Adopt-Me API...**
4. Postman จะส่ง Request และตรวจสอบ Test Assertion ของทุก Endpoint ให้ครบทั้งหมด 100%
