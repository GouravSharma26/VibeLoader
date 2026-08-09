# VibeLoader 🎬

VibeLoader is a full-stack YouTube video and playlist downloader built with Django and React. It allows users to paste YouTube URLs, preview video thumbnails, select specific videos from playlists, choose their desired format and quality, and download them seamlessly.

## Features ✨

- **Single Video & Playlist Support:** Download individual YouTube videos or entire playlists.
- **Preview Before Download:** Get a visual preview of videos and selectively choose which ones to download.
- **Format & Quality Options:** Download in Video (MP4) or Audio Only (MP3) across multiple resolutions (360p, 720p, 1080p).
- **Background Processing:** Uses Celery for robust background downloading, ensuring the UI remains responsive.
- **Live Progress Tracking:** The frontend polls and displays real-time download progress for your jobs.
- **Auto-Cleanup:** Automatically cleans up downloaded files from the server after the user fetches them.

## Tech Stack 🛠️

- **Frontend:** React, TailwindCSS, Axios
- **Backend:** Django, Django REST Framework
- **Task Queue:** Celery
- **Other Utilities:** yt-dlp (for extraction)

## Prerequisites 📦

Ensure you have the following installed on your system:
- Python 3.x
- Node.js & npm
- A message broker like Redis or RabbitMQ (for Celery)

## Getting Started 🚀

### The Easy Way (Windows)
If you are on Windows, simply double-click the included `start.bat` file from the project root. This script will automatically:
1. Start the Django Server
2. Start the Celery Worker
3. Start an Ngrok Tunnel (for exposing the API if needed)
4. Start the React Frontend

### Manual Setup

#### 1. Backend Setup (Django)
```bash
# Navigate to the project root
cd ytdownloader

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the Django server
python manage.py runserver
```

#### 2. Celery Setup
In a new terminal (with the virtual environment activated), start the Celery worker:
```bash
# On Windows
celery -A ytdownloader worker --loglevel=info --pool=solo

# On macOS/Linux
celery -A ytdownloader worker --loglevel=info
```

#### 3. Frontend Setup (React)
In another new terminal:
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```
The frontend will open automatically in your browser at `http://localhost:3000`.

## Architecture & API 🔌

- `POST /api/jobs/`: Create a new download job.
- `GET /api/jobs/`: List all recent download jobs and their progress.
- `POST /api/preview/`: Fetch video/playlist metadata for preview.
- `GET /api/download-and-clean/<id>/`: Download the finished file (ZIP for playlists, MP4/MP3 for singles) and trigger server cleanup.

## Contributing 🤝

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
