'use client';

import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface InviteCodeProps {
  code: string;
  onReset: () => void;
}

export default function InviteCode({ code, onReset }: InviteCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-center mb-4">
          <FiCheck className="text-4xl text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          File Uploaded Successfully!
        </h3>
        <p className="text-sm text-gray-600">
          Share this invite code with the recipient
        </p>
      </div>

      <div className="bg-white border-2 border-blue-500 rounded-lg p-6">
        <p className="text-sm font-medium text-gray-600 mb-2">Invite Code</p>
        <div className="text-5xl font-bold text-blue-600 tracking-widest mb-4">
          {code}
        </div>
        <button
          onClick={handleCopy}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {copied ? (
            <>
              <FiCheck />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <FiCopy />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> This code can only be used once. After the file is downloaded, the code will become invalid and the file will be deleted from the server.
        </p>
      </div>

      <button
        onClick={onReset}
        className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
      >
        Upload Another File
      </button>
    </div>
  );
}
