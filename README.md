# 📚 Learning Management System (LMS)

A modern and interactive **Learning Management System (LMS)** designed to simplify online learning, assignment management, and collaboration between students and instructors.

The platform provides a centralized environment where users can access learning resources, manage assignments, collaborate, and stay updated through notifications.

## 🚀 Live Demo

**Live Application:** https://learning-amber-six.vercel.app/

## ✨ Key Features

### 👨‍🎓 Learning & User Management
- User Authentication and Authorization
- Secure JWT-based Login and Registration
- Protected Routes
- User-specific learning dashboard

### 📝 Assignment Management
- Create and manage assignments
- Submit learning assignments
- Upload assignment files
- Track assignment-related activities

### 🤝 Collaboration
- Collaborative learning environment
- Share learning resources
- Interactive communication features
- Real-time notifications

### 📖 Learning Tools
- Markdown-based Notes
- Organized learning content
- AI-powered learning features
- Improved learning experience through interactive tools

### 🔐 Security
- JWT-based Authentication
- Password Hashing using bcrypt
- Role-Based Access Control
- Protected API Endpoints
- Secure Backend Validation

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | JWT, bcrypt |
| File Storage | Cloudinary |
| Real-Time Features | Socket.IO |
| API | REST APIs |
| Deployment | Vercel, Render |
| Version Control | Git, GitHub |

## 📂 Project Architecture

The application follows a client-server architecture:

- **Frontend:** Handles the user interface, dashboards, learning resources, and user interactions.
- **Backend:** Manages APIs, authentication, assignment operations, and application logic.
- **Database:** MongoDB stores user information and application data.
- **Cloud Storage:** Cloudinary handles file storage.

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd skillforge
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Configure your frontend environment variables according to the project configuration.

Start the frontend:

```bash
npm run dev
```

### 4. Access the Application

Open your browser and visit the local development URL shown by Vite.

## 🌐 Deployment

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB |
| File Storage | Cloudinary |

**Live Project:** https://learning-amber-six.vercel.app/

## 🔮 Future Enhancements

- Advanced learning analytics
- Improved assignment tracking
- Enhanced AI-powered learning assistance
- Interactive progress dashboards
- Additional collaboration features

## 👩‍💻 Developer

**Manisha Pabolta**

Full Stack Developer | MERN Stack

- GitHub: [Add Your GitHub Profile]
- LinkedIn: [Add Your LinkedIn Profile]

---

⭐ If you find this project useful, consider giving it a star!

**Built with ❤️ to make learning smarter and more collaborative.**
