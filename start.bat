@echo off
echo Starting VibeLoader...

:: Get the current directory automatically (no hardcoded paths!)
set PROJECT_DIR=%~dp0

:: Terminal 1 - Django
start "Django Server" cmd /k "cd /d %PROJECT_DIR% && venv\Scripts\activate && python manage.py runserver"

:: Terminal 2 - Celery
start "Celery Worker" cmd /k "cd /d %PROJECT_DIR% && venv\Scripts\activate && celery -A ytdownloader worker --loglevel=info --pool=solo"

:: Terminal 3 - Ngrok
start "Ngrok Tunnel" cmd /k "ngrok http 8000 --request-header-add ngrok-skip-browser-warning:true"

:: Terminal 4 - React
start "React Frontend" cmd /k "cd /d %PROJECT_DIR%frontend && npm start"

echo All servers starting...
echo Remember to update config.js with your new Ngrok URL!
pause