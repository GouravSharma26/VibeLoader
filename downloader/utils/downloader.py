import yt_dlp
import os
from django.conf import settings

# We will keep this variable here just in case we need it later, 
# but we are NOT using it in the options below.
COOKIE_PATH = os.path.join(settings.BASE_DIR, 'youtube_cookies.txt')

def get_video_info(url):
    """Get info about a single video without downloading"""
    ydl_opts = {
        'quiet': True,
        # NO COOKIES - We want to stay completely anonymous
        # 'cookiefile': COOKIE_PATH,  
        
        # THE ULTIMATE DISGUISE: Pretend to be a Smart TV
        'extractor_args': {'youtube': ['player_client=tv,mweb']}, 
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        return {
            'title': info.get('title'),
            'duration': info.get('duration'),
            'thumbnail': info.get('thumbnail'),
            'video_id': info.get('id'),
        }

def get_playlist_info(url):
    """Get list of all videos in a playlist without downloading"""
    ydl_opts = {
        'quiet': True,
        'extract_flat': True,  # don't download, just list
        # 'cookiefile': COOKIE_PATH,  
        'extractor_args': {'youtube': ['player_client=tv,mweb']}, 
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        videos = []
        for entry in info.get('entries', []):
            videos.append({
                'title': entry.get('title'),
                'video_id': entry.get('id'),
                'duration': entry.get('duration'),
                'thumbnail': entry.get('thumbnail'),
                'url': f"https://youtube.com/watch?v={entry.get('id')}"
            })
        return {
            'playlist_title': info.get('title'),
            'total_videos': len(videos),
            'videos': videos
        }

def download_video(url, format='mp4', quality='720p', output_dir='media/videos/'):
    """Download a single video"""
    os.makedirs(output_dir, exist_ok=True)

    if format == 'mp3':
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': f'{output_dir}/%(title)s.%(ext)s',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
            }],
            'quiet': True,
            # 'cookiefile': COOKIE_PATH,  
            'extractor_args': {'youtube': ['player_client=tv,mweb']}, 
        }
    else:
        quality_map = {'360p': '360', '720p': '720', '1080p': '1080'}
        q = quality_map.get(quality, '720')
        ydl_opts = {
            'format': f'bestvideo[height<={q}]+bestaudio/best[height<={q}]',
            'outtmpl': f'{output_dir}/%(title)s.%(ext)s',
            'merge_output_format': 'mp4',
            'quiet': True,
            # 'cookiefile': COOKIE_PATH,  
            'extractor_args': {'youtube': ['player_client=tv,mweb']}, 
        }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        return {
            'title': info.get('title'),
            'file': ydl.prepare_filename(info),
        }