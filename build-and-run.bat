@echo off
chcp 65001 >nul 2>&1
title MyGlassBlog - Build & Preview
echo ========================================
echo   MyGlassBlog - 构建并预览
echo ========================================
echo.
cd /d "%~dp0"
echo [INFO] 正在构建生产版本...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] 构建失败！
    pause
    exit /b 1
)
echo.
echo [INFO] 构建成功，启动预览服务器...
echo [INFO] 访问地址: http://localhost:3100
echo.
call npx next start -p 3100
pause
