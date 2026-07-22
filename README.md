# easyBOOK 📖

**easyBOOK** is a modern, feature-rich personal finance and budget tracking mobile application built with **React Native (Expo)** and powered by a **Node.js / Express** REST API with **MongoDB**.

---

## 🌟 Key Features

### 👤 Secure Multi-User Scoping & Privacy
- **Per-User Data Isolation**: Accounts, avatars, and transaction records are dynamically scoped by the logged-in user's identity (`user_accounts_[email]`). Logging into a new account presents a clean, private workspace.
- **JWT Authentication**: Secure user registration, login, and token-based API authentication.

### 💳 Account & Balance Management
- **Custom Account Types**: Track Cash, Visa, MasterCard, and custom bank accounts.
- **Inline Account Editing & Removal**: Edit account name, balance, limit, and type directly from the details view.
- **Full Account Transaction Ledger**: View transaction history filtered by account, including **Income (+)**, **Expenses (-)**, and **Transfers (⇄)**.

### 📊 Dynamic Balance Modes
- **Monthly Balance Mode**: View income, expenses, and net balance strictly for the selected month.
- **Accumulated Balance Mode**: View accumulated totals from the beginning of the calendar year (January 1st) up to the selected month (or current date for the active month).

### 🏷️ Category Management
- **Custom Categories**: Create and organize custom income and expense categories with color pickers and Lucide icons.
- **Duplicate Prevention**: Case-insensitive protection against duplicate category names.

### 🎨 Design & User Experience
- **Premium Dark Mode UI**: Rich visual aesthetics with harmonious color palettes, rounded cards, and smooth micro-animations.
- **Safe Area & Notch Optimized**: Android and iOS layout adjustments for seamless display above navigation bars and status notches.

---

## 🛠️ Tech Stack

### Mobile App (Frontend)
- **Framework**: [React Native](https://reactnative.dev/) (Expo SDK 54)
- **Icons**: [Lucide React Native](https://lucide.dev/)
- **Storage**: `@react-native-async-storage/async-storage`
- **Image Handling**: `expo-image-picker`

### Server (Backend)
- **Runtime**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ORM)
- **Security**: `jsonwebtoken` (JWT), `bcryptjs`

---

## 📁 Project Structure

```
Project/Budget/
├── budget-tracker-mobile/        # React Native Expo Frontend Application
│   ├── assets/                   # App icons and graphics
│   ├── context/                  # AuthContext state management
│   ├── screens/                  # App screens (Dashboard, Balance, Profile, etc.)
│   ├── utils/                    # API helper utilities and networking
│   └── App.js                    # Root application router
└── budget-tracker-backend/       # Node.js / Express REST API Server
    ├── config/                   # Database connection settings
    ├── controllers/              # Business logic controllers
    ├── middleware/               # Auth & error handling middlewares
    ├── models/                   # Mongoose schemas (User, Category, Transaction)
    ├── routes/                   # API endpoint routes
    ├── .env                      # Environment variables
    └── server.js                 # Server entry point
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas connection string)
- [Expo Go App](https://expo.dev/go) installed on your mobile device (iOS/Android)

---

### 1️⃣ Setting Up the Backend Server

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd Project/Budget/budget-tracker-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create or update your `.env` file inside `budget-tracker-backend`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/easybook
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start the backend server:
   ```bash
   npm run dev
   # or
   node server.js
   ```
   *The server will start on `http://192.168.x.x:5000/api`.*

---

### 2️⃣ Setting Up the Mobile App

1. Open your terminal and navigate to the mobile app directory:
   ```bash
   cd Project/Budget/budget-tracker-mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API URL in `utils/api.js` to match your computer's local Wi-Fi IP address:
   ```javascript
   let DEFAULT_API_URL = 'http://YOUR_LOCAL_IP:5000/api';
   ```

4. Start the Expo development server:
   ```bash
   npx expo start
   ```

5. Scan the QR code using the **Expo Go** app on your iOS or Android phone to launch **easyBOOK**!

---

## 📝 License

Distributed under the MIT License.
