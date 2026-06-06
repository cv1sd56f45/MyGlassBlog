@echo off
chcp 65001 >nul 2>&1
title MyGlassBlog - Dev Server
echo ========================================
echo   MyGlassBlog - 毛玻璃风格个人博客
echo ========================================
echo.
cd /d "%~dp0"
if not exist node_modules (
    echo [INFO] 首次运行，正在安装依赖...
    call npm install
    echo.
)
echo [INFO] 启动开发服务器...
echo [INFO] 访问地址: http://localhost:3000
echo [INFO] 按 Ctrl+C 停止服务器
echo.
call npm run dev
pause
