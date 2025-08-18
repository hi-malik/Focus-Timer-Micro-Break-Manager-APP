# Focus Timer & Micro-Break Manager - SAAS

A modern, distraction-free Pomodoro-style timer web app built with Next.js, TypeScript, and Tailwind CSS. It helps you stay focused during work sessions and take restorative micro-breaks, with user authentication, session management, admin dashboard, and premium features.

## 🚀 Live Demo

[Coming Soon - Deploy to Vercel]

## ✨ Features

### Core Timer Features
- **Focus and Break Timer**: Preset durations (25/45/90 min work, 5/10/15 min break)
- **Custom Durations**: Premium feature for personalized timer settings
- **Smart Controls**: Start, Pause/Resume, Reset, and Skip with state persistence
- **Session Tracking**: Counts of completed focus and break sessions
- **Auto-start**: Seamless transition between focus and break phases

### User Experience
- **User Authentication**: Complete sign up, sign in, and personalized sessions
- **Session Management**: Secure user sessions with NextAuth.js
- **Dark Mode**: Toggle between light and dark themes
- **Settings Modal**: Configure sound, desktop notifications, and preferences
- **Keyboard Shortcuts**: Space = Start/Pause, S = Skip, R = Reset
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### Technical Features
- **PWA Ready**: Install as a desktop/mobile app
- **Real-time Notifications**: Desktop notifications for phase changes
- **Sound Effects**: Audio feedback for timer transitions
- **State Persistence**: Timer state and settings saved locally
- **Analytics Ready**: Event tracking infrastructure in place
- **Database Integration**: Prisma ORM with SQLite/PostgreSQL support
- **Comprehensive Testing**: Jest testing framework with React Testing Library

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) 15.4, [React](https://reactjs.org/) 19.1, [TypeScript](https://www.typescriptlang.org/) 5+
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with Credentials provider
- **Database**: [Prisma](https://www.prisma.io/) ORM with SQLite (dev) / PostgreSQL (prod)
- **Password Security**: [bcryptjs](https://github.com/dcodeIO/bcrypt.js/) for secure hashing
- **State Management**: React Hooks with localStorage persistence
- **Testing**: [Jest](https://jestjs.io/) with [React Testing Library](https://testing-library.com/)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hi-malik/Focus-Timer-Micro-Break-Manager-APP.git
   cd Focus-Timer-Micro-Break-Manager-APP/focus-timer-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser** at `http://localhost:3000`

## 🧪 Testing

The project includes comprehensive testing infrastructure:

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
- **Component Tests**: All React components are tested with React Testing Library
- **API Tests**: API endpoints are tested for proper functionality
- **Integration Tests**: End-to-end user flows are covered
- **Mocking**: Audio, notifications, and browser APIs are properly mocked

### Testing Stack
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **@swc/jest**: Fast TypeScript/JSX transformation
- **jsdom**: Browser environment simulation

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory by copying `.env.example`:

```env
# Database
DATABASE_URL="file:./dev.db"  # SQLite for development
# DATABASE_URL="postgresql://user:password@localhost:5432/dbname"  # PostgreSQL for production

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

**Important**: Never commit your `.env` file to version control. Use `.env.example` as a template.

### Database Setup
- **Development**: SQLite (automatically created)
- **Production**: PostgreSQL (recommended for production)

## 🔐 Authentication Features

The app includes a complete authentication system:

- **User Registration**: Create new accounts with email/password
- **User Sign In**: Secure authentication with bcrypt password hashing
- **OAuth Integration**: Google and GitHub sign-in options
- **Password Reset**: Secure password reset via email verification
- **Email Verification**: Token-based email verification system
- **Session Management**: Persistent user sessions with NextAuth.js
- **Protected Routes**: Premium features gated behind authentication
- **Password Security**: Secure password hashing with bcryptjs
- **Role-Based Access Control**: User and admin roles with secure permissions

### Authentication Flow
1. Users can register with email/password or use OAuth providers
2. Passwords are securely hashed using bcryptjs
3. Sign-in validates credentials against the database
4. Sessions are managed by NextAuth.js
5. User state is available throughout the application

### Password Reset Flow
1. User requests password reset from sign-in page
2. System generates secure reset token and stores in database
3. Reset link is sent to user's email with verification token
4. User clicks link and enters new password
5. Token is verified and password is updated securely

## 👑 Admin Dashboard

The app includes a comprehensive admin dashboard for user management and system oversight:

### Admin Features
- **User Management**: View all registered users with detailed information
- **Role Management**: Promote users to admin or demote to regular user
- **User Actions**: Delete user accounts (with safety checks)
- **System Metrics**: Real-time counts of users, OAuth accounts, and active sessions
- **Access Control**: Admin-only access with role-based permissions
- **Security Features**: Prevents admins from demoting themselves or deleting their own account
- **Search**: Filter users by name or email.
- **Pagination**: Browse users in pages of 10.

### Admin Access
- **Role System**: Users have either `