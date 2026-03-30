from django.urls import path
from .views import (
    CreateJobView, JobDetailView, JobProgressView, 
    PreviewView, download_file_and_cleanup # <--- Add this
)

urlpatterns = [
    path('jobs/', CreateJobView.as_view(), name='job-list'),
    path('jobs/<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('jobs/<int:pk>/progress/', JobProgressView.as_view(), name='job-progress'),
    path('preview/', PreviewView.as_view(), name='preview'),
    path('download-and-clean/<int:pk>/', download_file_and_cleanup, name='download-cleanup'),
]