# AMPaint

A cross-platform painting and drawing app built with React, Capacitor, and Ionic.

## Features
- Responsive canvas for drawing with touch and mouse
- Color picker with gradient selection
- Adjustable stroke width
- Save drawings to device (with native support via Capacitor)
- Clear canvas with animated effect
- Haptic feedback for save and clear actions

## Getting Started

### Prerequisites
- Node.js (v16 or later recommended)
- npm or yarn

### Install dependencies
```bash
npm install
```

### Run in development (web)
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Run on Android/iOS (with Capacitor)
```bash
# Sync your project
npx cap sync

# Open Android Studio or Xcode
npx cap open android
npx cap open ios
```

## Project Structure
- `src/components/` - React components (canvas, color picker, UI)
- `src/pages/` - Main app pages
- `public/` - Static assets
- `android/`, `ios/` - Native platform projects

## License
MIT
