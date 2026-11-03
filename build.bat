@echo off
call npm install
call npm run dist
echo.
echo Done. Your .exe files are in the dist folder.
pause
