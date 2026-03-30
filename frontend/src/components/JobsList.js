import React, { useState, useEffect } from 'react';
import axios from 'axios';

function JobsList() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      // 1. Fetch the list of jobs! (No more username/password needed since we made it public)
      const response = await axios.get('http://127.0.0.1:8000/api/jobs/');
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs", error);
    }
  };

  useEffect(() => {
    // Fetch immediately on load
    fetchJobs();
    
    // Set up a timer to fetch updates every 3 seconds (Real-time polling!)
    const interval = setInterval(fetchJobs, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto mt-8 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Downloads</h2>
      
      {jobs.length === 0 ? (
        <p className="text-gray-500 text-center bg-white p-6 rounded-xl shadow-sm">No downloads yet. Paste a link above!</p>
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
            </div>
            
            {job.status === 'processing' && (
              <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full flex-shrink-0"></div>
            )}
            
            {job.status === 'done' && (
              <a 
                // FIXED: Removed the hardcoded /media/ so it doesn't double up!
                href={`http://127.0.0.1:8000${job.zip_file_path ? job.zip_file_path : (job.videos[0]?.file_path)}`} 
                download
                target="_blank"
                rel="noreferrer"
                className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-600 transition flex-shrink-0 text-center"
              >
                {job.job_type === 'playlist' && job.zip_file_path ? 'Download ZIP 📦' : 'Download File 🎬'}
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default JobsList;