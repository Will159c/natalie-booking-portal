# Natalie Booking Portal 💅

An appointment booking web application for Natalie Peck's nail services — built with a full-stack JavaScript stack (MERN) and deployed on [Railway](https://railway.app).

🌐 **Live Site:** [https://bookwithnatalie.up.railway.app]

---

## ✨ Features

- 🗓️ Users can view available time slots
- ✍️ Simple appointment booking flow
- 🔐 Secure user authentication (JWT-based)
- 👩‍🔧 Admin dashboard to:
  - Create/remove time slots
  - View and manage booked slots
- 📧 Email verification & booking confirmation
- 🤖 reCAPTCHA to prevent bot abuse
- 🔒 Rate limiting for login security

---

## 🛠 Tech Stack

| Frontend        | Backend           | DevOps      |
|-----------------|-------------------|-------------|
| React + Vite    | Node.js + Express | Railway     |
| React Router DOM| MongoDB Atlas     | GitHub CI   |
| Axios           | Mongoose          | Environment Variables |
| Google reCAPTCHA| Nodemailer        |             |
| Zxcvbn          | JWT               |             |

---

## 🧩 Folder Structure

/client # React frontend (Vite) ├── src │ ├── components │ ├── pages │ └── App.jsx

/server # Express backend ├── routes ├── controllers ├── models ├── index.js # Entry point


---

## 🚀 Getting Started (Local)

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/natalie-booking-portal.git
cd natalie-booking-portal

Create two .env files:
📦 /server/.env

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
RECAPTCHA_SECRET=your_recaptcha_secret


🌐 /client/.env

VITE_API_BASE_URL=http://localhost:5000


3. Start Development

# In /server
npm install
npm run dev

# In /client (new terminal)
npm install
npm run dev


👨‍💻 Built By

Will Woodruff
Student Developer, CS @ Cal State Northridge
🔒 Exploring cybersecurity and full-stack development
