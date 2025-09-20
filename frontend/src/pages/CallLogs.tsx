import React, { useState, useEffect } from 'react';
import { CallLogsTable } from '../components/logs/CallLogsTable';
import { getCallLogs } from '../utils/api';
import type { CallLog } from '../types';

export function CallLogs() {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCallLogs();
  }, []);

  const loadCallLogs = async () => {
    try {
      const logsData = await getCallLogs();
      setLogs(logsData);
    } catch (error) {
      console.error('Failed to load call logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading call logs...</div>
      </div>
    );
  }

  return (
    <div>
      <CallLogsTable logs={logs} />
    </div>
  );
}