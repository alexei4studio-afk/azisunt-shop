@echo off
title AZISUNT MALL - Command Center
cls
echo.
echo  ==========================================================
echo    AZISUNT.SHOP - GENERAL MANAGER COMMAND CENTER
echo  ==========================================================
echo.
echo  [1] Open Manager Dashboard (Port 3001)
echo  [2] Open Manager Dashboard (Port 3000)
echo  [3] Run Quality Control Agent (Check Photos/Links)
echo  [4] Start Trend Scout (US/UK Viral Hunting)
echo  [5] Batch Import from Temu (5 Products)
echo  [6] Batch Import from eMAG (5 Products)
echo  [7] Exit
echo.
set /p opt="Alege o actiune (1-7): "

if %opt%==1 start http://localhost:3001/manager
if %opt%==2 start http://localhost:3000/manager
if %opt%==3 node agent-quality-control.js & pause
if %opt%==4 node trend-scout-agent.js & pause
if %opt%==5 node run-batch-import.js & pause
if %opt%==6 node mega-auto-import-emag.js "https://www.emag.ro/label-campaign/electro-weekend-24-27-aprilie-2026" "https://l.profitshare.ro/l/15748651" & pause
if %opt%==7 exit

goto :eof
