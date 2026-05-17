# 📝 Smart Notes App

### A full-stack collaborative note-taking application built with modern web technologies that allows users to create, manage, share, and collaborate on notes in real time with version history and voice note support.
---

# 🚀 Features

## 🔐 Authentication & Authorization
- Secure user authentication using JWT
- User registration and login
- Password encryption using bcrypt
- Protected routes and APIs

---

## 📝 Notes Management
- Create new notes
- Edit existing notes
- Delete notes
- Rich text note support
- Auto timestamps for notes

---

## 🤝 Note Sharing & Collaboration
- Share notes with other users
- Permission-based access
  - View permission
  - Edit permission
- Shared notes dashboard
- Collaborative workflow

---

## 🕘 Version History
- Automatic note version tracking
- Stores previous edits
- View edit history
- Track who edited notes
- Restore previous versions

---

## 🎤 Voice Notes Support
- Record voice notes
- Convert speech into notes
- Quick note creation experience
- Useful for meetings and ideas

---

## 📂 Dashboard Features
- Personal notes section
- Shared notes section
- Recently updated notes
- Responsive UI design

---

## ⚡ Real-Time Collaboration *(Optional Feature)*
- Live note updates
- Multi-user collaboration
- Instant synchronization

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM
- Socket.io

## Backend
- Node.js
- Express.js
- Prisma ORM
- Socket.io

## Database
- PostgreSQL

## Authentication
- JWT Authentication
- bcrypt.js

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/IMxSPYDER/smart-notes-app.git

cd smart-notes-app
```

---

## 2️⃣ Install Dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd server
npm install
```

---

## 3️⃣ Setup Environment Variables

Create a `.env` file inside the server folder.

```env
DATABASE_URL="postgresql://username:password@localhost:5432/notesdb"

JWT_SECRET="your_jwt_secret"

PORT=5000
```

---

## 4️⃣ Prisma Setup

```bash
npx prisma generate

npx prisma migrate dev --name init
```

---

## 5️⃣ Run Application

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm start
```

---

# 🔗 API Features

## Auth APIs
- Register User
- Login User

## Notes APIs
- Create Note
- Update Note
- Delete Note
- Fetch User Notes

## Sharing APIs
- Share Notes with Users
- Manage Permissions

## Version APIs
- Fetch Note History
- Restore Previous Versions

---

# 🔒 Security Features

- JWT-based authentication
- Password hashing using bcrypt
- Protected routes
- Prisma relational integrity
- Secure database handling

---



# 📸 Screenshots

<img width="1349" height="602" alt="image" src="https://github.com/user-attachments/assets/0886d12a-fa58-40b5-915b-b6566323f19e" />
<img width="1351" height="606" alt="image" src="https://github.com/user-attachments/assets/056e5a7d-455f-4df9-acaf-e86eedeca916" />
<img width="1357" height="604" alt="image" src="https://github.com/user-attachments/assets/9c3c7480-2054-42a3-92be-32e6a3c64dc4" />
<img width="1346" height="606" alt="image" src="https://github.com/user-attachments/assets/093a4b60-175e-4a18-a006-7afe1481c64c" />
