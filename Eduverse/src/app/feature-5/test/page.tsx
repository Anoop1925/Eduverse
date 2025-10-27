"use client";
import { useState } from 'react';
import ProgressTest from '@/components/ProgressTest';
import SystemStatus from '@/components/SystemStatus';

export default function TestPage() {
  const [userEmail, setUserEmail] = useState('test@example.com');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Feature-5 Test Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Status */}
          <div>
            <h2 className="text-xl font-semibold mb-4">System Status</h2>
            <SystemStatus userEmail={userEmail} />
          </div>

          {/* Progress Test */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Progress Test</h2>
            <ProgressTest 
              userEmail={userEmail}
              courseId={1}
              courseName="Introduction to AI"
              totalChapters={5}
            />
          </div>
        </div>

        {/* User Email Input */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Test Configuration</h3>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Test User Email:
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter test user email"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Change the email above to test with different users. Available test users: test@example.com, 1032221560@tcetmumbai.in, 1032220350@tcetmumbai.in, demo@user.com
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-4 text-blue-900">Testing Instructions</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Check the System Status to verify all APIs are working</li>
            <li>• Use the Progress Test to complete chapters and earn points</li>
            <li>• Visit the main Leaderboard page to see rankings</li>
            <li>• Try different user emails to test with various point totals</li>
            <li>• Complete all chapters in a course to earn bonus points</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 