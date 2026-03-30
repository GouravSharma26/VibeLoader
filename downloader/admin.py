from django.contrib import admin
from .models import DownloadJob, VideoFile

admin.site.register(DownloadJob)
admin.site.register(VideoFile)
