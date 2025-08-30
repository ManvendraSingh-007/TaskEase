# PowerShell script for setting up Android build

Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

Write-Host "Installing Capacitor dependencies..." -ForegroundColor Green
npm install @capacitor/core @capacitor/android @capacitor/cli

Write-Host "Building Next.js app for production..." -ForegroundColor Green
npm run build

Write-Host "Initializing Capacitor..." -ForegroundColor Green
npx cap init TaskEase com.taskease.app --web-dir=out

Write-Host "Adding Android platform..." -ForegroundColor Green
npx cap add android

Write-Host "Copying web assets to Android..." -ForegroundColor Green
npx cap copy android

Write-Host "Syncing plugins..." -ForegroundColor Green
npx cap sync android

Write-Host "Opening Android Studio..." -ForegroundColor Green
npx cap open android

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "If Android Studio is installed, it should open automatically." -ForegroundColor Yellow
Write-Host "To build the APK in Android Studio:" -ForegroundColor Yellow
Write-Host "1. Go to Build -> Build Bundle(s) / APK(s) -> Build APK(s)" -ForegroundColor Yellow
Write-Host "2. Once built, find the APK in android/app/build/outputs/apk/debug/" -ForegroundColor Yellow
Write-Host "==============================================" -ForegroundColor Cyan