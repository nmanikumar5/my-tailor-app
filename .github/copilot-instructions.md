# TailorApp - Copilot Coding Instructions

## Repository Overview

**TailorApp** is a React Native mobile application built with TypeScript. This is a cross-platform mobile app targeting both iOS and Android, currently in early development with organized folder structure but minimal implementation.

### High-Level Details
- **Project Type**: React Native mobile application
- **Size**: Small-to-medium codebase (~20 source files, organized structure)
- **Languages**: TypeScript (primary), JavaScript (config), Ruby (iOS deps), Java/Kotlin (Android)
- **Target Platforms**: iOS and Android
- **Main Frameworks**: React Native 0.81.4, React 19.1.0, TypeScript 5.8.3
- **Runtime**: Node.js >=20 required

## Build & Development Instructions

### Essential Setup Sequence
**ALWAYS** follow this exact order for successful setup:

1. **Install Node.js dependencies** (required first):
   ```bash
   npm install
   ```
   - Takes ~30 seconds
   - May show deprecation warnings for eslint@8.57.1, rimraf@3.0.2, inflight@1.0.6, glob@7.2.3 - these are safe to ignore
   - Must be run before any other commands

2. **For iOS development only** (if making iOS-specific changes):
   ```bash
   bundle install
   bundle exec pod install
   ```
   - Note: Ruby bundler may not be available in all environments
   - Only required when modifying native iOS dependencies
   - Run from project root, NOT from ios/ directory

### Core Development Commands

**Start Metro Dev Server**:
```bash
npm start
```
- Always required before running mobile apps
- Takes ~10 seconds to start
- Will show Metro welcome screen when ready
- Press Ctrl+C to stop

**Testing**:
```bash
npm test
```
- Uses Jest testing framework
- Takes ~2-3 seconds
- Currently has 1 test suite with 1 passing test
- No setup required

**Linting**:
```bash
npm run lint
```
- Uses ESLint with @react-native/eslint-config
- Takes ~5 seconds
- **Warning**: Shows TypeScript version compatibility warning (5.9.2 vs supported <5.6.0) - safe to ignore
- Will fail on actual linting errors

**Code Formatting Check**:
```bash
npx prettier --check .
```
- Currently shows 4 files with formatting issues (package.json, README.md, 2 iOS assets)
- Use `npx prettier --write .` to auto-fix
- Takes ~2-3 seconds

**Build Mobile Apps**:
```bash
npm run android  # For Android
npm run ios      # For iOS
```
- Requires Metro dev server running in separate terminal
- Requires Android SDK/emulator or iOS Simulator
- Takes 30-60 seconds for initial builds

### Known Issues & Workarounds

1. **TypeScript Version Warning**: ESLint shows unsupported TypeScript version warning - this is safe to ignore and doesn't affect functionality.

2. **Prettier Formatting**: Several files have formatting issues. Run `npx prettier --write .` before making changes to avoid formatting conflicts.

3. **Ruby Dependencies**: Bundle commands may fail in some environments. Only required for iOS native dependency changes.

4. **Metro Cache Issues**: If seeing unexpected build errors, clear Metro cache:
   ```bash
   npx react-native start --reset-cache
   ```

## Project Architecture & Layout

### Directory Structure
```
/
├── src/                    # Source code (TypeScript)
│   ├── components/         # Reusable UI components (empty - .gitkeep)
│   ├── screens/           # Screen components (empty - .gitkeep)
│   ├── services/          # API calls & external services (empty - .gitkeep)
│   ├── utils/             # Utility functions (empty - .gitkeep)
│   ├── types/             # TypeScript type definitions (empty - .gitkeep)
│   └── navigation/        # Navigation configuration (empty - .gitkeep)
├── __tests__/             # Jest test files
├── android/               # Android-specific native code & config
├── ios/                   # iOS-specific native code & config
├── App.tsx               # Main app entry point
└── index.js              # React Native entry point
```

### Key Configuration Files
- **package.json**: Dependencies and npm scripts
- **tsconfig.json**: TypeScript configuration (extends @react-native/typescript-config)
- **babel.config.js**: Babel configuration for React Native preset
- **metro.config.js**: Metro bundler configuration
- **jest.config.js**: Jest testing configuration (preset: 'react-native')
- **.eslintrc.js**: ESLint configuration (extends @react-native)
- **.prettierrc.js**: Prettier formatting rules
- **ios/Podfile**: iOS CocoaPods dependencies
- **android/build.gradle**: Android build configuration

### Main Entry Points
- **App.tsx**: Main React component using SafeAreaProvider and NewAppScreen template
- **index.js**: Registers the App component with React Native
- **__tests__/App.test.tsx**: Single test validating app renders correctly

### Dependencies to Note
- Uses React Native's new template with SafeAreaProvider
- Includes @react-native/new-app-screen for initial template UI
- TypeScript configuration includes all .ts/.tsx files, excludes node_modules and Pods

### Validation Steps
Before submitting changes, always run this sequence:
1. `npm test` - Ensure tests pass
2. `npm run lint` - Check for linting errors (ignore TypeScript version warning)
3. `npx prettier --check .` - Verify code formatting
4. `npm start` - Confirm Metro starts successfully

### File Structure Notes
- Source directories under `/src` are currently empty with .gitkeep placeholders
- Main app logic is in root `App.tsx` 
- Project uses React Native 0.81.4 template structure
- No CI/CD workflows configured
- Standard React Native .gitignore excludes node_modules, build artifacts, platform-specific files

## Development Guidelines

**For new features**: Add components in `/src/components`, screens in `/src/screens`, and utilities in `/src/utils`.

**For tests**: Follow existing pattern in `__tests__/` directory using Jest and React Test Renderer.

**For styling**: Uses React Native StyleSheet API. No external styling libraries currently configured.

**Trust these instructions**: Only perform additional exploration if information here is incomplete or incorrect. These instructions are validated and current.