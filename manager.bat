@echo off
title AZISUNT MALL - Command Center
cls
echo.
echo  ==========================================================
echo    AZISUNT.SHOP - GENERAL MANAGER COMMAND CENTER
echo  ==========================================================
echo.
echo  [0] START MALL SERVER (Port 3001)
echo  ----------------------------------------------------------
echo  [1] Open Manager Dashboard
echo  [2] Run Quality Control (Delete Broken Links/Out of Stock)
echo  [3] Start Trend Scout (US/UK Viral Hunting)
echo  [4] Batch Import from Temu (5 Products)
echo  [5] Batch Import from eMAG (5 Products)
echo  [6] Exit
echo.
set /p opt="Alege o actiune (0-6): "

if %opt%==0 (
    echo Pornind serverul pe portul 3001...
    start cmd /k "npm run dev"
    timeout /t 5
    start http://localhost:3001/manager
    goto :eof
)
if %opt%==1 start http://localhost:3001/manager
if %opt%==2 node agent-quality-control.js & pause
if %opt%==3 node trend-scout-agent.js & pause
if %opt%==4 node run-batch-import.js & pause
if %opt%==5 node mega-auto-import-emag.js "https://www.emag.ro/label-campaign/electro-weekend-24-27-aprilie-2026" "https://l.profitshare.ro/l/15748651" & pause
if %opt%==6 exit

goto :eof
