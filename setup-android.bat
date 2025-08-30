@echo off
echo Installing dependencies...
npm install

echo Installing Capacitor dependencies...
npm install @capacitor/core @capacitor/android @capacitor/cli

echo Building Next.js app for production...
npm run build

echo Initializing Capacitor...
npx cap init TaskEase com.taskease.app --web-dir=out

echo Adding Android platform...
npx cap add android

echo Copying web assets to Android...
npx cap copy android

echo Syncing plugins...
npx cap sync android

echo Opening Android Studio...
npx cap open android

echo ==============================================
echo Setup complete! Android Studio should open automatically.
echo To build the APK in Android Studio:
echo 1. Go to Build -^> Build Bundle(s) / APK(s) -^> Build APK(s)
echo 2. Once built, find the APK in android/app/build/outputs/apk/debug/
echo ==============================================