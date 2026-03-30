#!/usr/bin/env bash

# Start Celery worker in the background
celery -A ytdownloader worker --loglevel=info --pool=solo &

# Start Gunicorn (Django) in the foreground
gunicorn ytdownloader.wsgi:application --bind 0.0.0.0:$PORT