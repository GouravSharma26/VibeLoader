import React, { useState } from 'react';
import axios from 'axios';

function URLInputForm() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('720p');

  // --- New Phase 2 States ---
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState([]);

  // 1. Fetch the preview info first
  const handlePreview = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Calls the Django Preview API we built on Day 4
      const response = await axios.post('http://127.0.0.1:8000/api/preview/', { url: url });
      setPreviewData(response.data);

      // By default, auto-select all videos so the user doesn't have to click them all
      if (response.data.videos) {
        setSelectedVideos(response.data.videos.map(v => v.video_id));
      } else {
        setSelectedVideos([response.data.video_id]);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Couldn't fetch video info. Check the URL.");
    }
    setIsLoading(false);
  };

  // 2. Toggle video selection on/off when clicking a thumbnail
  const toggleVideo = (videoId) => {
    if (selectedVideos.includes(videoId)) {
      setSelectedVideos(selectedVideos.filter(id => id !== videoId)); // Remove
    } else {
      setSelectedVideos([...selectedVideos, videoId]); // Add
    }
  };

  // 3. Send the final download request
  const handleDownload = async () => {
    if (selectedVideos.length === 0) {
      alert("⚠️ Please select at least one video to download!");
      return;
    }

    try {
      const jobType = url.includes('playlist') ? 'playlist' : 'single';
      const response = await axios.post('http://127.0.0.1:8000/api/jobs/', {
        url: url,
        job_type: jobType,
        format: format,
        quality: quality,
        selected_videos: selectedVideos // <-- We will tell Django how to read this next!
      });

      alert(`✅ Success! Job ID: ${response.data.id} has started!`);
      setPreviewData(null); // Reset back to input screen
      setUrl('');
    } catch (error) {
      console.error(error);
      alert("❌ Oops! Something went wrong starting the download.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8">
      {/* View 1: If no preview data, show the URL input form */}
      {!previewData ? (
        <form onSubmit={handlePreview} className="bg-white p-8 rounded-xl shadow-md space-y-4 max-w-xl mx-auto border-t-4 border-blue-600">
          <div>
            <label className="block text-gray-800 text-lg font-bold mb-2">Paste YouTube URL</label>
            <p className="text-gray-500 text-sm mb-4">Supports single videos and full playlists!</p>
            <input
              type="url"
              required
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {isLoading ? '⏳ Fetching Video Info...' : 'Preview Videos 🔍'}
          </button>
        </form>
      ) : (
        /* View 2: If we DO have preview data, show the Selection Grid! */
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {previewData.playlist_title || "Video Preview"}
            </h2>
            <button onClick={() => setPreviewData(null)} className="text-red-500 font-bold hover:text-red-700 px-4 py-2 bg-red-50 rounded-lg">
              ✕ Cancel
            </button>
          </div>

          {/* Grid of Videos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-2">
            {(previewData.videos || [previewData]).map((video) => (
              <div
                key={video.video_id}
                onClick={() => toggleVideo(video.video_id)}
                className={`cursor-pointer border-2 rounded-xl p-3 transition-all transform hover:scale-105 ${
                  selectedVideos.includes(video.video_id) ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <img src={`https://i.ytimg.com/vi/${video.video_id}/mqdefault.jpg`} alt="thumbnail" className="w-full h-32 object-cover rounded-lg mb-3" />
                <p className="font-semibold text-sm text-gray-800 line-clamp-2 h-10">{video.title}</p>
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedVideos.includes(video.video_id)}
                    readOnly
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="ml-2 text-sm font-bold text-gray-600">
                    {selectedVideos.includes(video.video_id) ? 'Selected' : 'Select'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Download Settings & Submit */}
          <div className="bg-gray-50 border p-5 rounded-xl flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-gray-700 font-bold mb-2">Format</label>
              <select className="w-full px-4 py-3 border-2 rounded-lg bg-white" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="mp4">Video (MP4)</option>
                <option value="mp3">Audio Only (MP3)</option>
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-gray-700 font-bold mb-2">Quality</label>
              <select className="w-full px-4 py-3 border-2 rounded-lg bg-white" value={quality} onChange={(e) => setQuality(e.target.value)} disabled={format === 'mp3'}>
                <option value="360p">360p</option>
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </select>
            </div>
            <div className="flex-1 w-full">
              <button
                onClick={handleDownload}
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition shadow-lg"
              >
                Download Selected ({selectedVideos.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default URLInputForm;