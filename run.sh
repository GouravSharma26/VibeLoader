#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -o errexit

# 1. Create the database tables in the cloud
python manage.py migrate

# 2. Start Celery worker in the background
celery -A ytdownloader worker --loglevel=info --pool=solo &

# 3. Start Gunicorn (The Web Server)
gunicorn ytdownloader.wsgi:application --bind 0.0.0.0:$PORT