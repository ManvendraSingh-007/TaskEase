# TaskEase - Next.js To-Do App with Android APK Support

TaskEase is a modern to-do list application built with Next.js and converted to an Android APK using Capacitor.

## Features

- Create, manage, and delete tasks
- Organize tasks by status (To Do, In Progress, Done)
- Multiple theme options (Light, Dark, Ocean, Sunset)
- Progressive Web App (PWA) support
- Android APK build support

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or later)
- npm or yarn
- Android Studio (for building the APK)
- Android SDK
- Java Development Kit (JDK)

## Getting Started

### Running the Web Application

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Android

1. Run the setup script (choose one based on your preference):
   
   **PowerShell (Recommended):**
   ```
   ./setup-android.ps1
   ```
   
   **Batch file (Legacy):**
   ```
   setup-android.bat
   ```

   This script will:
   - Install all required dependencies
   - Build the Next.js application
   - Initialize Capacitor
   - Add the Android platform
   - Copy web assets to Android
   - Open Android Studio (if installed)

2. In Android Studio:
   - Go to Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Once built, find the APK in `android/app/build/outputs/apk/debug/`

## Manual Setup (if not using the script)

1. Install dependencies:
   ```
   npm install
   npm install @capacitor/core @capacitor/android @capacitor/cli
   ```

2. Build the Next.js app:
   ```
   npm run build
   ```

3. Initialize Capacitor:
   ```
   npx cap init TaskEase com.taskease.app --web-dir=out
   ```

4. Add Android platform:
   ```
   npx cap add android
   ```

5. Copy web assets to Android:
   ```
   npx cap copy android
   ```

6. Open in Android Studio:
   ```
   npx cap open android
   ```

## Customization

- Edit `capacitor.config.ts` to change app ID, name, or other Capacitor settings
- Modify `public/manifest.webmanifest` for PWA settings
- Replace icons in `public/icons/` with your own app icons

## Troubleshooting

- If you encounter build issues in Android Studio, ensure you have the latest Android SDK and build tools installed
- For Next.js build errors, check that all dependencies are correctly installed
- If Android Studio doesn't open automatically, run the check script to verify your installation:
  ```
  ./check-android-studio.ps1
  ```
  This script will check if Android Studio is installed and provide guidance if it's not found
- For Capacitor issues, refer to the [Capacitor documentation](https://capacitorjs.com/docs)

## License

MIT