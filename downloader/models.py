from django.db import models
from django.contrib.auth.models import User

class DownloadJob(models.Model):
    JOB_TYPE = [('single', 'Single Video'), ('playlist', 'Playlist')]
    STATUS   = [('pending','Pending'),('processing','Processing'),
                ('done','Done'),('failed','Failed')]
    FORMAT   = [('mp4','MP4'),('mp3','MP3'),('webm','WebM')]
    QUALITY  = [('360p','360p'),('720p','720p'),('1080p','1080p')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    url               = models.URLField()
    job_type          = models.CharField(max_length=10, choices=JOB_TYPE)
    selected_videos   = models.JSONField(null=True, blank=True)
    status            = models.CharField(max_length=20, choices=STATUS, default='pending')
    format            = models.CharField(max_length=10, choices=FORMAT, default='mp4')
    quality           = models.CharField(max_length=10, choices=QUALITY, default='720p')
    total_videos      = models.IntegerField(null=True, blank=True)
    downloaded_videos = models.IntegerField(default=0)
    zip_file_path     = models.FileField(upload_to='zips/', null=True, blank=True)
    error_message     = models.TextField(blank=True)
    created_at        = models.DateTimeField(auto_now_add=True)
    completed_at      = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'Job {self.id} - {self.status}'


class VideoFile(models.Model):
    STATUS = [('pending','Pending'),('downloading','Downloading'),
              ('done','Done'),('failed','Failed')]

    job           = models.ForeignKey(DownloadJob, on_delete=models.CASCADE,
                                      related_name='videos')
    title         = models.CharField(max_length=500)
    video_id      = models.CharField(max_length=20)
    file_path     = models.FileField(upload_to='videos/', null=True, blank=True)
    file_size     = models.BigIntegerField(null=True, blank=True)
    duration      = models.IntegerField(null=True, blank=True)
    thumbnail_url = models.URLField(blank=True)
    status        = models.CharField(max_length=20, choices=STATUS, default='pending')
    created_at    = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title