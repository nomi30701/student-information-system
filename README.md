# 🎓 Fullstack Student Information System

This is a full-stack Student Information System (SIS) built with a React VITE frontend, ASP.NET Core Web API backend, and MS SQL database. The system provides student management, course management, and registration functions with role-based interfaces for students, teachers and administrators.

---

## 🚀 Features Overview

### 👤 User Management
- Supports registration and login for three roles: students, teachers, and administrators
- Invitation code system for registration control
- User permission management

### 📚 Course Management
- Course listing, search, and pagination
- Detailed course information view
- Teacher course assignment
- Course capacity management

### 📝 Registration Management
- Course registration for students
- Course withdrawal functionality
- Re-registration for withdrawn courses
- Course status tracking (registered, withdrawn, completed)

### 📊 Dashboard Functions
- **Student Dashboard**: Displays registered courses and credit statistics
- **Teacher Dashboard**: Manage taught courses and students
- **Admin Dashboard**: System statistics and user management, course management, invitation code management

---

## 🖼️ Preview

<img src="./preview/homepage.png" width="70%" alt="Homepage">

<details>
<summary>🏠 Homepage and Authentication (click to expand)</summary>

<img src="./preview/homepage.png" width="70%" alt="Homepage">
<img src="./preview/homepage_rwd.png" width="70%" alt="Homepage RWD">
<img src="./preview/login.png" width="70%" alt="Login Screen">
<img src="./preview/register.png" width="70%" alt="Registration">

</details>

<details>
<summary>🛠️ Admin Interface (click to expand)</summary>

<img src="./preview/admin-user-management.png" width="70%" alt="User Management">
<img src="./preview/admin-user-adduser.png" width="70%" alt="Add User Modal">
<img src="./preview/admin-user-edituser.png" width="70%" alt="Edit User Modal">
<img src="./preview/admin-course-management.png.png" width="70%" alt="Course Management">
<img src="./preview/admin-invitationcode-management.png" width="70%" alt="Invitation Code Management">
<img src="./preview/admin-invitationcode-generatecode.png" width="70%" alt="Generate Code Modal">
<img src="./preview/admin-invitationcode-editcode.png" width="70%" alt="Edit Code Modal">
<img src="./preview/admin-invitationcode-detail.png" width="70%" alt="Invitation Code Detail">

</details>

<details>
<summary>🎓 Student Interface (click to expand)</summary>

<img src="./preview/student-statistics.png" width="70%" alt="Student Dashboard">
<img src="./preview/student-course-registration.png" width="70%" alt="Course Registration">
<img src="./preview/student-course-mycourse.png" width="70%" alt="My Courses">

</details>

<details>
<summary>👨‍🏫 Teacher Interface (click to expand)</summary>

<img src="./preview/teacher-course-management.png" width="70%" alt="Course Management">
<img src="./preview/teacher-course-addcourse.png" width="70%" alt="Add Course Modal">
<img src="./preview/teacher-course-editcourse.png" width="70%" alt="Edit Course Modal">
<img src="./preview/teacher-course-detail-1.png" width="70%" alt="Course Detail 1">
<img src="./preview/teacher-course-detail-2.png" width="70%" alt="Course Detail 2">

</details>

---

## 🏗️ Technical Architecture

### 💻 Frontend
- **Framework**: React + VITE
- **Styling**: Bootstrap 5, Bootstrap Icons, SCSS
- **State Management**: React Context API
- **Routing**: React Router dom
- **HTTP Requests**: Axios

### 🔗 Backend
- **Framework**: ASP.NET Core Web API (.NET8.0)
- **Data Access**: Entity Framework Core for database operations (CRUD)
- **Authentication**:MS JwtBearer, JWT Token for secure user authentication
- **Hash password**:BCrypt.Net-NEXT hash password.

### 🗄️ Database
- **MS SQL Server**: Relational database with 7 tables (Roles, Users, Courses, etc.), using primary and foreign keys for data integrity

---

## 📂 Project Structure
```text
fullstack-student-information-system/
│
├── frontend/              # React VITE frontend project
│   ├── src/               # Source code directory
│   │   ├── components/    # React components
│   │   ├── contexts/      # Context API
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── ...
│   └── ...
│
├── backend/               # ASP.NET Core Web API backend project
│   ├── Controllers/       # API controllers
│   ├── Models/            # Data models
│   ├── Services/          # Business logic services
│   ├── Dtos/              # Data Transfer Objects
│   └── ...
│
└── database/              # Database related files
    └── Std_info_sys.bak  # Sample data
```

---

## ⚙️ Installation and Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (for frontend)
- [.NET SDK](https://dotnet.microsoft.com/download) (version 8.0 or higher)
- [Microsoft SQL Server Express](https://www.microsoft.com/sql-server/sql-server-downloads) or LocalDB
- [SQL Server Management Studio (SSMS)](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms)

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the frontend root directory and configure the backend API URL:
   ```env
   VITE_API_URL=https://localhost:7001
   ```
   > **Note**: Make sure the API URL matches your backend server address. Check `backend/student_information_system/Properties/launchSettings.json` for the correct URL.
4. Start the development server: `npm run dev`

### Backend Setup
1. Navigate to the backend directory: `cd backend/student_information_system`
2. Restore NuGet packages: `dotnet restore`
3. Check the API URL in `Properties/launchSettings.json` to ensure frontend `.env` matches:
   ```json
   {
     "profiles": {
         "https": {
            "applicationUrl": "https://localhost:7001;http://localhost:5062"
         },
     }
   }
   ```
   > **Note**: If this file doesn't exist, the application will use default ports. You can create it if you need specific port configuration.
4. Configure the database connection string in `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=(localdb);Database=Std_info_sys;User ID=(userid);Password=(password);TrustServerCertificate=true"
   }
   ```
5. Create the database:
   - **Using EF Core**: Run `dotnet ef database update` to apply migrations
   - **Using SQL Scripts**: In SSMS, execute `database/script.sql`.
6. Start the API server: `dotnet run`

---

## 🖥️ System Demonstration

### 👨‍🎓 Student
- Browse course listings
- Register/withdraw from courses
- View personal credit statistics
- Check registered courses

### 👨‍🏫 Teacher
- Manage taught courses (course CRUD actions)
- View student registration status
- Update course information

### 🛡️ Administrator
- Manage all users (user CRUD actions)
- Manage all courses (course CRUD actions)
- Manage invitation codes (invitation code CRUD actions)
- View system statistics

---

## 🔐 Authentication and Authorization
The system uses JWT Tokens for authentication and implements role-based access control to ensure secure access to features based on user roles.

---

## 📱 Responsive Design
Implements responsive design using Bootstrap 5, ensuring a seamless user experience across devices (desktop, tablet, mobile).

---

## 👨‍💻 Author
本專案作為求職作品集，展示全端開發能力，包括前端與後端整合、資料庫設計和互動式使用者介面開發。  
This project serves as a job application portfolio, demonstrating full-stack development capabilities, including frontend-backend integration, database design, and interactive user interface development.