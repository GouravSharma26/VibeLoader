import os
import zipfile
from celery import shared_task
from django.conf import settings
from .models import DownloadJob, VideoFile
from .utils.downloader import download_video, get_playlist_info
from django.utils import timezone

@shared_task
def start_download(job_id):
    try:
        job = DownloadJob.objects.get(id=job_id)
        job.status = 'processing'
        job.save()

        if job.job_type == 'single':
            result = download_video(url=job.url, format=job.format, quality=job.quality)
            clean_path = result['file'].replace('media/', '').replace('media\\', '')
            
            VideoFile.objects.create(
                job=job, title=result['title'], video_id=job.url.split('v=')[-1],
                status='done', file_path=clean_path
            )

        elif job.job_type == 'playlist':
            playlist = get_playlist_info(job.url)
            
            # Filter the videos to ONLY the ones the user selected!
            if job.selected_videos:
                videos_to_download = [v for v in playlist['videos'] if v['video_id'] in job.selected_videos]
            else:
                videos_to_download = playlist['videos']

            job.total_videos = len(videos_to_download)
            job.save()

            downloaded_files = [] # Keep track of files to zip

            for video in videos_to_download:
                result = download_video(url=video['url'], format=job.format, quality=job.quality)
                clean_path = result['file'].replace('media/', '').replace('media\\', '')
                
                VideoFile.objects.create(
                    job=job, title=video['title'], video_id=video['video_id'],
                    status='done', file_path=clean_path
                )
                
                downloaded_files.append(result['file']) # Add to our zip list
                job.downloaded_videos += 1
                job.save()

            # --- THE ZIP ENGINE ---
            if len(downloaded_files) > 1:
                zip_filename = f"playlist_job_{job.id}.zip"
                zip_filepath = os.path.join(settings.MEDIA_ROOT, 'zips', zip_filename)
                
                # Make sure the zips folder exists
                os.makedirs(os.path.dirname(zip_filepath), exist_ok=True)
                
                # Create the zip file
                with zipfile.ZipFile(zip_filepath, 'w') as zipf:
                    for file_path in downloaded_files:
                        # Add each file to the zip, removing the long folder path
                        zipf.write(file_path, os.path.basename(file_path))
                
                job.zip_file_path = f"zips/{zip_filename}"

        job.status = 'done'
        job.completed_at = timezone.now()
        job.save()

    except Exception as e:
        job.status = 'failed'
        job.error_message = str(e)
        job.save()