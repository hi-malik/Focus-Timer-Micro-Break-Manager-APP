# Focus Timer & Micro-Break Manager - SAAS

A modern, distraction-free Pomodoro-style timer web app built with Next.js, TypeScript, and Tailwind CSS. It helps you stay focused during work sessions and take restorative micro-breaks, with user authentication, session management, and premium features.

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

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) 15.4, [React](https://reactjs.org/) 19.1, [TypeScript](https://www.typescriptlang.org/) 5+
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with Credentials provider
- **Database**: [Prisma](https://www.prisma.io/) ORM with SQLite (dev) / PostgreSQL (prod)
- **Password Security**: [bcryptjs](https://github.com/dcodeIO/bcrypt.js/) for secure hashing
- **State Management**: React Hooks with localStorage persistence

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
```

**Important**: Never commit your `.env` file to version control. Use `.env.example` as a template.

### Database Setup
- **Development**: SQLite (automatically created)
- **Production**: PostgreSQL (recommended for production)

## 🏗️ Project Structure

```
focus-timer-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── auth/          # NextAuth endpoints
│   │   ├── sign-in/           # Sign-in page
│   │   ├── register/          # Registration page
│   │   ├── layout.tsx         # Root layout with auth providers
│   │   └── page.tsx           # Home page
│   ├── components/             # React components
│   │   ├── Timer.tsx          # Main timer component
│   │   ├── Header.tsx         # Navigation header with auth
│   │   ├── Modal.tsx          # Reusable modal
│   │   └── ThemeToggle.tsx    # Theme switching
│   ├── lib/                    # Utility functions
│   │   ├── prisma.ts          # Database client
│   │   └── analytics.ts       # Analytics helpers
│   └── generated/              # Generated Prisma client
├── prisma/                     # Database schema
│   ├── schema.prisma          # Prisma schema definition
│   └── migrations/            # Database migrations
├── public/                     # Static assets
├── .env.example               # Environment variables template
└── package.json                # Dependencies and scripts
```

## 🔐 Authentication Features

The app includes a complete authentication system:

- **User Registration**: Create new accounts with email/password
- **User Sign In**: Secure authentication with bcrypt password hashing
- **Session Management**: Persistent user sessions with NextAuth.js
- **Protected Routes**: Premium features gated behind authentication
- **Password Security**: Secure password hashing with bcryptjs

### Authentication Flow
1. Users can register with email and password
2. Passwords are securely hashed using bcryptjs
3. Sign-in validates credentials against the database
4. Sessions are managed by NextAuth.js
5. User state is available throughout the application

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
- Test your changes thoroughly
- Update documentation as needed
- Never commit sensitive information (use .env.example)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Authentication powered by [NextAuth.js](https://next-auth.js.org/)
- Database management with [Prisma](https://www.prisma.io/)

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the documentation
- Reach out to the maintainers

---

**Made with ❤️ for productivity and focus**
