@echo off
REM Run deploy.sh with Git Bash (avoids WSL bash)
set "GITBASH=C:\Program Files\Git\bin\bash.exe"
if not exist "%GITBASH%" (
  echo Git Bash not found at "%GITBASH%". Install Git for Windows or edit deploy.bat with the correct path.
  pause
  exit /b 1
)
cd /d "%~dp0"
"%GITBASH%" -l deploy.sh
pause
