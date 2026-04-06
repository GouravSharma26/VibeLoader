import React from 'react';
import URLInputForm from './components/URLInputForm';
import JobsList from './components/JobsList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-600">VibeLoader 🎬</h1>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <URLInputForm />
        <JobsList />
      </div>
    </div>
  );
}

export default App;