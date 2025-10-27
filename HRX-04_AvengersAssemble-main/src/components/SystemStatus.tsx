"use client";
import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface SystemStatusProps {
  userEmail: string;
}

interface StatusCheck {
  name: string;
  status: 'loading' | 'success' | 'error';
  message: string;
}

export default function SystemStatus({ userEmail }: SystemStatusProps) {
  const [statuses, setStatuses] = useState<StatusCheck[]>([
    { name: 'Leaderboard API', status: 'loading', message: 'Checking...' },
    { name: 'Progress API', status: 'loading', message: 'Checking...' },
    { name: 'Points API', status: 'loading', message: 'Checking...' },
    { name: 'Database Connection', status: 'loading', message: 'Checking...' }
  ]);

  const checkSystemStatus = useCallback(async () => {
    const newStatuses = [...statuses];

    // Check Leaderboard API
    try {
      const response = await fetch('/api/feature-5/leaderboard');
      if (response.ok) {
        newStatuses[0] = { name: 'Leaderboard API', status: 'success', message: 'Working correctly' };
      } else {
        newStatuses[0] = { name: 'Leaderboard API', status: 'error', message: 'Failed to load' };
      }
    } catch (error) {
      console.error('Leaderboard API error:', error);
      newStatuses[0] = { name: 'Leaderboard API', status: 'error', message: 'Connection error' };
    }

    // Check Progress API
    try {
      const response = await fetch(`/api/feature-5/progress?userEmail=${encodeURIComponent(userEmail)}&courseId=1`);
      if (response.ok) {
        newStatuses[1] = { name: 'Progress API', status: 'success', message: 'Working correctly' };
      } else {
        newStatuses[1] = { name: 'Progress API', status: 'error', message: 'Failed to load' };
      }
    } catch (error) {
      console.error('Progress API error:', error);
      newStatuses[1] = { name: 'Progress API', status: 'error', message: 'Connection error' };
    }

    // Check Points API
    try {
      const response = await fetch(`/api/feature-5/points?userEmail=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        newStatuses[2] = { name: 'Points API', status: 'success', message: 'Working correctly' };
      } else {
        newStatuses[2] = { name: 'Points API', status: 'error', message: 'Failed to load' };
      }
    } catch (error) {
      console.error('Points API error:', error);
      newStatuses[2] = { name: 'Points API', status: 'error', message: 'Connection error' };
    }

    // Check Database Connection (via a simple API call)
    try {
      const response = await fetch('/api/feature-5/leaderboard');
      if (response.ok) {
        newStatuses[3] = { name: 'Database Connection', status: 'success', message: 'Connected' };
      } else {
        newStatuses[3] = { name: 'Database Connection', status: 'error', message: 'Connection failed' };
      }
    } catch (error) {
      console.error('Database connection error:', error);
      newStatuses[3] = { name: 'Database Connection', status: 'error', message: 'Connection error' };
    }

    setStatuses(newStatuses);
  }, [userEmail, statuses]);

  useEffect(() => {
    checkSystemStatus();
  }, [checkSystemStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const allWorking = statuses.every(s => s.status === 'success');
  const hasErrors = statuses.some(s => s.status === 'error');

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md">
      <h3 className="text-lg font-semibold mb-4">System Status</h3>
      
      <div className="space-y-3 mb-4">
        {statuses.map((status, index) => (
          <div 
            key={index}
            className={`flex items-center justify-between p-3 rounded border ${getStatusColor(status.status)}`}
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(status.status)}
              <div>
                <p className="font-medium text-sm">{status.name}</p>
                <p className="text-xs text-gray-600">{status.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        {allWorking ? (
          <div className="text-green-600 font-medium">
            ✅ All systems operational
          </div>
        ) : hasErrors ? (
          <div className="text-red-600 font-medium">
            ❌ Some systems have issues
          </div>
        ) : (
          <div className="text-yellow-600 font-medium">
            ⚠️ Checking system status...
          </div>
        )}
      </div>

      <button
        onClick={checkSystemStatus}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Refresh Status
      </button>
    </div>
  );
} 