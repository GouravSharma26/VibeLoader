import React from 'react';
import URLInputForm from './components/URLInputForm';
import JobsList from './components/JobsList';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* 1. Navigation Bar */}
      <nav className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
        <div className="font-extrabold text-2xl text-blue-600 tracking-tighter">
          YT<span className="text-gray-800">Grabber</span>
        </div>
        <div className="text-sm font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
          Free & Unlimited
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="bg-blue-600 text-white pt-20 pb-32 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 max-w-4xl mx-auto leading-tight">
          The Ultimate YouTube <br className="hidden md:block" /> Playlist Downloader
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Fetch single videos or entire playlists. Select exactly what you want, and download them all in one click as a neat ZIP file.
        </p>
      </header>

      {/* 3. Features Grid (Floating over the hero) */}
      <section className="px-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center -mt-20 relative z-10">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform transition hover:-translate-y-2">
          <div className="text-5xl mb-4">⚡</div>
          <h3 className="text-xl font-bold mb-2">No Login Needed</h3>
          <p className="text-gray-500">Completely free and open. Just paste your link and start downloading instantly without signing up.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform transition hover:-translate-y-2">
          <div className="text-5xl mb-4">🗂️</div>
          <h3 className="text-xl font-bold mb-2">Smart Playlists</h3>
          <p className="text-gray-500">Preview high-quality thumbnails and choose exactly which videos to keep before you download.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform transition hover:-translate-y-2">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-xl font-bold mb-2">ZIP Bundling</h3>
          <p className="text-gray-500">We automatically package your playlist selections into a single, organized ZIP file for you.</p>
        </div>
      </section>

      {/* 4. The Actual Tool Section */}
      <main className="py-20 px-4 bg-gray-50">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Ready to start?</h2>
          <p className="text-gray-500 mt-2 text-lg">Paste your link below to fetch your videos.</p>
        </div>
        
        {/* Your working components! */}
        <URLInputForm />
        <JobsList />
        
      </main>

      {/* 5. Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <div className="font-extrabold text-2xl text-white tracking-tighter mb-4">
          YT<span className="text-blue-500">Grabber</span>
        </div>
        <p>© 2026 YTGrabber. Built as a full-stack portfolio project.</p>
      </footer>
      
    </div>
  );
}

export default App;