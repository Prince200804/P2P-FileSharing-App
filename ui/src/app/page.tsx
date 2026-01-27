'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import FileDownload from '@/components/FileDownload';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload');

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            PeerLink
          </h1>
          <p className="text-lg text-gray-600">
            Secure Peer-to-Peer File Sharing
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setActiveTab('download')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'download'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Download File
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'upload' ? <FileUpload /> : <FileDownload />}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Secure file sharing with 6-digit PIN authentication</p>
          <p className="mt-2">Max file size: 500MB</p>
        </div>
      </div>
    </main>
  );
}
