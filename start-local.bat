@echo off
cd /d "%~dp0"
echo Abrindo o site em http://localhost:4173
python -m http.server 4173
pause
