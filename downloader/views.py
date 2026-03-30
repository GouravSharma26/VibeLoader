import os
import shutil
from django.conf import settings
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.decorators import api_view

from .models import DownloadJob
from .serializers import DownloadJobSerializer
from .tasks import start_download

class CreateJobView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = DownloadJobSerializer(data=request.data)
        if serializer.is_valid():
            job = serializer.save()
            start_download.delay(job.id)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request):
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

# --- STANDALONE FUNCTION (NOT INSIDE THE CLASS) ---
@api_view(['GET'])
def download_file_and_cleanup(request, pk):
    """
    Serves the file to the user and deletes it from the server 
    immediately after the transfer is complete.
    """
    job = get_object_or_404(DownloadJob, pk=pk)
    
    # Check if it's a playlist (ZIP) or single video
    if job.job_type == 'playlist' and job.zip_file_path:
        file_path = os.path.join(settings.MEDIA_ROOT, job.zip_file_path)
    elif job.videos.exists():
        file_path = os.path.join(settings.MEDIA_ROOT, job.videos.first().file_path)
    else:
        return Response({"error": "File not found in database"}, status=404)

    if os.path.exists(file_path):
        # Open the file for reading in binary mode
        file_handle = open(file_path, 'rb')
        response = FileResponse(file_handle)
        
        # This callback runs AFTER the user finishes downloading
        def cleanup():
            file_handle.close() 
            if os.path.exists(file_path):
                # If it's a zip, we might want to delete the whole temp folder
                if job.job_type == 'playlist':
                    folder_path = os.path.dirname(file_path)
                    if os.path.isdir(folder_path) and "playlist_" in folder_path:
                        shutil.rmtree(folder_path)
                
                # Delete the specific file if it's still there
                if os.path.exists(file_path):
                    os.remove(file_path)
                
                # Delete the record from DB so it's gone on refresh
                job.delete()
                print(f"CLEANED: Removed {file_path} and Job {pk}")

        response._resource_closers.append(cleanup)
        return response
    
    return Response({"error": "Physical file missing on server"}, status=404)