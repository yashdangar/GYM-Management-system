# Gym Management System


## 🌟 Overview
A **Full-Stack Gym Management System** designed to streamline the operations of a fitness center.  This project is specifically tailored for administrators, enabling them to efficiently manage members, trainers, sales, attendance, and follow-ups. The system provides a seamless interface to ensure smooth operations and enhance productivity.

## ✨ Features

- **User Management**: Create, update, and delete user profiles.
- **Membership Plans**: Manage and customize membership plans.
- **Trainer Management**:Create, update, and delete Trainer profiles.
- **Attendance Tracking**: Track attendance.
- **Payment System**: Integrated system for membership payments.
- **Image Upload**: Upload user and trainer images using **Cloudinary Service**.
- **Invoice Generation**: Download Invoice of the payment.
- **Follow-Ups Management**: Streamline follow-ups with members to enhance engagement.

## 🔧 Technologies Used

### Frontend
- **React.js**: For building a responsive and dynamic user interface.
- **Tailwind CSS**: For styling the application.

### Backend
- **Node.js**: Backend runtime environment.
- **Express.js**: Framework for building RESTful APIs.

### Database
- **MongoDB**: For managing gym-related data.
- **Mongoose**: For seamless interaction with MongoDB.

### Other Tools
- **Cloudinary Storage**: For image hosting functionality.
- **Git & GitHub**: Version control and collaboration.

## ⚙️ Installation

### Prerequisites
- Node.js installed on your system.
- MongoDB set up locally or on a cloud service.
- Cloudinary account for image storage.

### 📋Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yashdangar/GYM-Management-system.git
   ```

2. Navigate to the project directory:
   ```bash
   cd GYM-Management-system
   ```

3. Install dependencies for backend:
   ```bash
   cd backend
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the backend directory and add the following:
   ```env
   MONGO_URL=
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   CLOUDINARY_API_ENV_VAR=
   CLOUDINARY_URL=
   SECRET_KEY=
   ```

5. Install dependencies for frontend:
   ```bash
   cd frontend
   npm install
   ```
6. Start the frontend server:
   ```bash
   npm run dev
   ```
   
7. Open the app in your browser at `http://localhost:5173`.

## Folder Structure
  ```
  .
  |-- backend       # Backend code (Node.js, Express, Mongoose)
    |-- config        # Configuration files (Cloudinary, database)
    |-- .env          # Environment variables
    |-- models        # MongoDB schemas
    |-- routes        # API routes
  |-- frontend      # Frontend code (React.js, Tailwind CSS)
  
  ```


## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add feature name"
   ```
4. Push your changes:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.


## 📞 Contact

If you have any questions or feedback, feel free to contact me:

- **Name**: Yash Dangar
- **Email**: yashdangar123@gmail.com
- **GitHub**: [@yashdangar](https://github.com/yashdangar)

---

Thank you for checking out this project! If you like it, don't forget to ⭐ the repository!

