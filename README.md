# Focus Timer & Micro-Break Manager

A minimal, distraction-free Pomodoro-style timer web app built with Next.js, TypeScript, and Tailwind CSS. It helps you stay focused during work sessions and take restorative micro-breaks, with features for session tracking, dark mode, and PWA support.

## Demo

![App Demo](./demo.gif)

## Features

- Focus and Break timer with presets (25/45/90 min work, 5/10/15 min break)
- Custom durations gated behind Premium (placeholder paywall)
- Start, Pause/Resume, Reset, and Skip controls
- Session stats: counts of completed focus and break sessions (daily)
- Dark mode toggle (respects system preference)
- Settings modal for toggling sound, desktop notifications, and auto-start
- Keyboard shortcuts: Space = Start/Pause, S = Skip, R = Reset
- PWA ready: manifest.json and service worker stubs
- Analytics event stubs (console logging)
- Responsive and accessible UI

## Tech Stack

- [Next.js](https://nextjs.org/) 15.4
- [React](https://reactjs.org/) 19.1
- [TypeScript](https://www.typescriptlang.org/) 5+
- [Tailwind CSS](https://tailwindcss.com/) 4

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/hi-malik/Focus-Timer-Micro-Break-Manager-APP.git
   cd Focus-Timer-Micro-Break-Manager-APP/focus-timer-web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in development:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:3000`

## Production Build

```bash
npm run build
npm start
```

## Configuration

- **Premium features**: Enabled via placeholder paywall modal
- **Theme**: Stored in `localStorage` under `ft_theme`
- **State persistence**: Timer state and settings saved to `localStorage` under `ft_state_v1`

## Deployment

Deploy easily on Vercel by connecting this repository to your Vercel account. No additional environment variables are required for the basic functionality.

## Contributing

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License.
