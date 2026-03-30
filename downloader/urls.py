from django.urls import path
from .views import CreateJobView, JobDetailView, JobProgressView, PreviewView

urlpatterns = [
    path('jobs/', CreateJobView.as_view(), name='jobs'),
    path('jobs/<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('jobs/<int:pk>/progress/', JobProgressView.as_view(), name='job-progress'),
    path('preview/', PreviewView.as_view(), name='preview'),
]