# 🏠 Twinkling Home - Hostel Management Application

**Twinkling Home** is a smart hostel management web application designed to streamline day-to-day hostel operations, enhance communication, and ensure student safety. The system offers a seamless interface for students and wardens to interact efficiently in real-time.

---

## 🎯 Project Agenda

> "Enhance hostel life through an advanced application while streamlining management tasks."

---

## 👨‍💻 Contributors

- Aanandha Ruban M. R. K  
- Sunil Subramani R  
- Gokularam M  
- Sanjay Karthi R. P

---

## 🚀 Features

### 👤 Student Portal
- **Login with college email ID**
- View/edit personal profile
- Track outings, laundry usage, and complaint status
- Emergency SOS button with instant contact and SMS
- Outing requests and return check-in
- Laundry session booking and history

### 🛡️ Warden Portal
- View and manage student records
- Handle room allocations
- Approve leave requests and complaints
- Post announcements via notice board
- Emergency management access

### 📩 Smart Notifications
- SMS alerts to parents for outings, emergencies, and leave approvals
- Real-time complaint and laundry updates

---

## 🔐 Secure Login System
- College email-based authentication
- Default password: Date of Birth (DDMMYYYY)
- "Forgot Password" functionality

---

## 🛠️ Tech Stack

| Layer      | Tech Used                        |
|------------|----------------------------------|
| Frontend   | HTML, CSS, JavaScript            |
| Backend    | Node.js, Express.js              |
| Database   | MongoDB (with Mongoose ODM)      |
| Auth       | JWT-based authentication         |
| Tools      | GitHub, Postman, VS Code, Trello |

---

## 🧱 Architecture

- Follows **MVC (Model-View-Controller)** pattern
- **RESTful APIs** for frontend-backend communication
- Separate schemas for:
  - Student
  - Room
  - Complaint
  - Leave Request
  - Laundry Session

---

## 📊 Modules Overview

| Module           | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| Student Profile  | View & update personal info, track laundry & outings                        |
| Complaints       | Submit, view status (Pending → In Progress → Resolved)                     |
| Emergency SOS    | Alert system with call/SMS to key contacts and hostel staff                 |
| Outing System    | Request approvals, auto-SMS to parents, outing stats & history              |
| Laundry Manager  | Book wash slots, track usage, see real-time machine status                  |
| Warden Interface | Room allocations, complaint approvals, noticeboard, emergency monitoring    |

---

## 📱 User Roles & Access

- **Student** – Manage personal info, outings, complaints, emergencies, laundry
- **Warden** – Monitor and approve student activities, manage hostel data
- **Admin** – High-level access for room allocation and system oversight
- **Parents/Guardians** – Receive updates via SMS
- **College Management** – View system reports and logs

---

## 📌 System Highlights

- Real-time updates with SMS integration
- Transparent status tracking for complaints & outings
- Clean and professional interface
- Focus on safety, communication, and digital hostel experience

---
