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

### Admin Access
- **Role System**: Users have either `USER` or `ADMIN` roles
- **Protected Routes**: Admin dashboard only accessible to users with `ADMIN` role
- **Header Navigation**: Admin link appears in header for admin users
- **Server-Side Validation**: All admin actions verified server-side

### Admin Dashboard Location
- **URL**: `/admin` (only accessible to admin users)
- **Navigation**: Admin link appears in header when user has admin role
- **Access Control**: Non-admin users see "Access denied" message

### Making a User Admin
To access the admin dashboard, you need to make an existing user an admin:

1. **Using Prisma Studio**:
   ```bash
   npx prisma studio
   ```
   Then update the user's `role` field from `USER` to `ADMIN`

2. **Direct Database Update**:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'user@example.com';
   ```

3. **Using the Admin Dashboard**: Once you have one admin user, you can promote others through the dashboard

## 🏗️ Project Structure

```
focus-timer-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── admin/         # Admin API endpoints
│   │   │   │   └── users/     # User management APIs
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   └── register/      # User registration API
│   │   ├── admin/             # Admin dashboard page
│   │   ├── sign-in/           # Sign-in page
│   │   ├── register/          # Registration page
│   │   ├── layout.tsx         # Root layout with auth providers
│   │   └── page.tsx           # Home page
│   ├── components/             # React components
│   │   ├── Timer.tsx          # Main timer component
│   │   ├── Header.tsx         # Navigation header with auth & admin
│   │   ├── Modal.tsx          # Reusable modal
│   │   └── ThemeToggle.tsx    # Theme switching
│   ├── lib/                    # Utility functions
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Database client
│   │   └── analytics.ts       # Analytics helpers
│   ├── types/                  # TypeScript type definitions
│   │   └── next-auth.d.ts     # NextAuth type extensions
│   └── generated/              # Generated Prisma client
├── prisma/                     # Database schema
│   ├── schema.prisma          # Prisma schema with role system
│   └── migrations/            # Database migrations
├── public/                     # Static assets
├── .env.example               # Environment variables template
├── jest.config.js             # Jest configuration
├── jest.setup.ts              # Jest setup and mocks
└── package.json                # Dependencies and scripts
```

## 📧 Email Configuration

The app supports multiple email providers for password reset functionality:

### Supported Providers
- **Resend** (Recommended): Modern email API with excellent deliverability
- **SendGrid**: Enterprise-grade email service

### Environment Variables
```env
# Choose one email provider:
RESEND_API_KEY="your-resend-api-key"
# OR
SENDGRID_API_KEY="your-sendgrid-api-key"

# Email sender address
EMAIL_FROM="noreply@yourdomain.com"
```

### Email Features
- **Password Reset**: Secure token-based password reset
- **Email Templates**: Professional HTML email templates
- **Token Expiration**: Automatic token cleanup for security
- **Error Handling**: Graceful fallback when email services are unavailable

## 🚀 Production Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

### Database Migration (Production)
```bash
# Update DATABASE_URL to PostgreSQL
npx prisma migrate deploy
npx prisma generate
```

## 💰 Premium Features

- Custom focus and break durations
- Advanced analytics and insights
- Export session data
- Multiple timer presets
- Team collaboration features

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Test your changes thoroughly with `npm test`
- Update documentation as needed
- Never commit sensitive information (use .env.example)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Authentication powered by [NextAuth.js](https://next-auth.js.org/)
- Database management with [Prisma](https://www.prisma.io/)
- Testing with [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/)

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the documentation
- Reach out to the maintainers

---

**Made with ❤️ for productivity and focus**
