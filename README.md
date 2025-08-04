# 📦 Subscription Tracker

A simple and effective web application to help users manage their recurring subscriptions. Built with React, Node.js, Express, and MySQL, this full-stack app lets users track active services, monitor renewal dates, and stay financially organized — all from one place.

---

## 🚀 Features

- 🔐 **User Authentication** — Secure login and signup with session-based cookie authentication  
- 📅 **Subscription Management** — Add, edit, delete, or cancel subscriptions with ease  
- 🔔 **Upcoming Renewals** — View all subscriptions that are about to renew soon   
- ✅ **Role-Based Access Control** — Admin and user views are securely separated  
- 💾 **MySQL + Sequelize ORM** — Clean database modeling with JavaScript-based queries  
- 💡 **Simple UI** — Clean, responsive design built with React and inline styles  
- ⚙️ **RESTful API** — Backend built using Express.js with modular MVC architecture  

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Axios (withCredentials for auth)
- React Router DOM
- CSS (inline styling)

**Backend:**
- Node.js
- Express.js
- Sequelize ORM
- MySQL

**Security & Auth:**
- Cookie-based sessions
- Role-based access control
- Password hashing

---

## 📁 Project Structure

📦 subscription-tracker

<pre><code>``` 📦 subscription-tracker ├── backend │ ├── controllers/ │ ├── models/ │ ├── routes/ │ └── server.js ├── frontend │ └── src/ │ ├── pages/ │ ├── components/ │ └── API/ ├── .env └── README.md ```</code></pre>




---

## 📦 Installation

### ⚙️ Backend Setup
```bash
cd backend
npm install
npm run dev

cd frontend
npm install
npm run dev

VITE_API_BASE_URL=http://localhost:3000

🧪 Future Improvements
Reminder notifications via email or dashboard
Analytics on spending by category
Subscription filtering and search
Visual dashboards and charts
Mobile-friendly layout improvements

📜 License
This project is open-source and available under the MIT License.

🙌 Acknowledgements
This project was built as part of a full-stack learning journey to understand user authentication, REST APIs, ORM, and frontend/backend integration using modern JavaScript tools.


