'use client';

import { useState } from 'react';
import axios from 'axios';
import { FiDownload, FiLock } from 'react-icons/fi';

export default function FileDownload() {
  const [inviteCode, setInviteCode] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    if (!inviteCode || inviteCode.length !== 6) {
      setError('Please enter a valid 6-digit invite code');
      return;
    }

    setDownloading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.get(`/api/download?token=${inviteCode}`, {
        responseType: 'blob',
      });

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'download';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setInviteCode('');
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Invalid invite code or file not found');
      } else if (err.response?.status === 403) {
        setError('Invalid invite code');
      } else {
        setError('Download failed. Please try again.');
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setInviteCode(value);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FiLock className="mx-auto text-5xl text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Enter Invite Code
        </h3>
        <p className="text-sm text-gray-600">
          Enter the 6-digit code shared with you
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-2">
            Invite Code
          </label>
          <input
            id="inviteCode"
            type="text"
            value={inviteCode}
            onChange={handleCodeChange}
            placeholder="000000"
            maxLength={6}
            className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">File downloaded successfully!</p>
          </div>
        )}

        <button
          onClick={handleDownload}
          disabled={downloading || inviteCode.length !== 6}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center space-x-2 ${
            downloading || inviteCode.length !== 6
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {downloading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <FiDownload />
              <span>Download File</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Each invite code can only be used once. After downloading, the code becomes invalid.
        </p>
      </div>
    </div>
  );
}
