from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from .models import DownloadJob
from .serializers import DownloadJobSerializer
from .tasks import start_download

class CreateJobView(APIView):
    # CHANGED: Now anyone can use the API!
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = DownloadJobSerializer(data=request.data)
        if serializer.is_valid():
            # CHANGED: No longer requiring a user to save
            job = serializer.save()
            start_download.delay(job.id)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request):
        # CHANGED: Get the last 10 jobs (since there's no specific user anymore)
        jobs = DownloadJob.objects.all().order_by('-created_at')[:10]
        serializer = DownloadJobSerializer(jobs, many=True)
        return Response(serializer.data)

class JobDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        job = get_object_or_404(DownloadJob, pk=pk)
        serializer = DownloadJobSerializer(job)
        return Response(serializer.data)

class JobProgressView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        job = get_object_or_404(DownloadJob, pk=pk)
        total = job.total_videos or 1
        percent = int((job.downloaded_videos / total) * 100)
        return Response({
            'id': job.id,
            'status': job.status,
            'total_videos': job.total_videos,
            'downloaded_videos': job.downloaded_videos,
            'percent': percent,
            'error_message': job.error_message,
        })

class PreviewView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        url = request.data.get('url')
        if not url:
            return Response({'error': 'URL is required'}, status=400)
        try:
            from .utils.downloader import get_playlist_info, get_video_info
            if 'playlist' in url:
                data = get_playlist_info(url)
            else:
                data = get_video_info(url)
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=400)