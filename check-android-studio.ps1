# PowerShell script to check if Android Studio is installed

$possiblePaths = @(
    "${env:ProgramFiles}\Android\Android Studio\bin\studio64.exe",
    "${env:ProgramFiles(x86)}\Android\Android Studio\bin\studio64.exe",
    "${env:LOCALAPPDATA}\Programs\Android\Android Studio\bin\studio64.exe",
    "${env:USERPROFILE}\AppData\Local\Android\Sdk"
)

$found = $false

Write-Host "Checking for Android Studio installation..." -ForegroundColor Cyan

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        Write-Host "Android Studio found at: $path" -ForegroundColor Green
        $found = $true
        break
    }
}

if (-not $found) {
    Write-Host "Android Studio not found in common locations." -ForegroundColor Yellow
    Write-Host "To build the Android APK, you need to:" -ForegroundColor Yellow
    Write-Host "1. Download and install Android Studio from https://developer.android.com/studio" -ForegroundColor Yellow
    Write-Host "2. During installation, make sure to include the Android SDK" -ForegroundColor Yellow
    Write-Host "3. After installation, run the setup-android.ps1 script again" -ForegroundColor Yellow
    
    $response = Read-Host "Would you like to open the Android Studio download page? (y/n)"
    if ($response -eq 'y') {
        Start-Process "https://developer.android.com/studio"
    }
} else {
    Write-Host "You can proceed with building the Android APK." -ForegroundColor Green
    Write-Host "Run ./setup-android.ps1 to set up the Android project." -ForegroundColor Green
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")