import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const HEADERS = { 'ngrok-skip-browser-warning': 'true' };

function JobsList({ token }) {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/jobs/`, {
        headers: { ...HEADERS, Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs", error);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto mt-8 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Downloads</h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500 text-center bg-white p-6 rounded-xl shadow-sm">
          No downloads yet. Paste a link above!
        </p>
      ) : (
        jobs.map(job => (
          <div key={job.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
            <div className="overflow-hidden pr-4">
              <p className="font-bold text-gray-800 truncate" title={job.url}>{job.url}</p>
              <p className="text-sm text-gray-500 mt-1">
                <span className="bg-gray-100 px-2 py-1 rounded text-xs mr-2">{job.format.toUpperCase()}</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs mr-2">{job.quality}</span>
                Status: <span className={`font-semibold ${job.status === 'done' ? 'text-green-600' : job.status === 'failed' ? 'text-red-600' : 'text-blue-600'}`}>{job.status}</span>
              </p>
              {job.status === 'processing' && job.total_videos && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(job.downloaded_videos / job.total_videos) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{job.downloaded_videos}/{job.total_videos} videos</p>
                </div>
              )}
            </div>

            {job.status === 'processing' && (
              <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full flex-shrink-0"></div>
            )}

            {job.status === 'done' && (
              <a
                href={`${API_BASE_URL}/api/download-and-clean/${job.id}/`}
                target="_blank"
                rel="noreferrer"
                className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                {job.job_type === 'playlist' ? 'Download ZIP 📦' : 'Download File 🎬'}
              </a>
            )}

            {job.status === 'failed' && (
              <span className="text-red-500 font-bold text-sm">❌ Failed</span>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default JobsList;