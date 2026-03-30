from rest_framework import serializers
from .models import DownloadJob, VideoFile

class VideoFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoFile
        fields = '__all__'

class DownloadJobSerializer(serializers.ModelSerializer):
    videos = VideoFileSerializer(many=True, read_only=True)

    class Meta:
        model = DownloadJob
        fields = '__all__'
        read_only_fields = ['user', 'status', 'downloaded_videos',
                           'total_videos', 'created_at', 'completed_at']