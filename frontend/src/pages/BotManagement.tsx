import React, { useState, useEffect } from 'react';
import { BotForm } from '../components/bots/BotForm';
import  {BotTables}  from '../components/bots/BotTable';
import { createBot, getBots, updateBot, deleteBot } from '../utils/api';
import type { Bot, BotFormData } from '../types';

export function BotManagement() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [editingBot, setEditingBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
    
  useEffect(() => {
    loadBots();
  }, []);

  const loadBots = async () => {
    try {
      setError(null);
      const botsData = await getBots();
      setBots(Array.isArray(botsData) ? botsData : []);
    } catch (error) {
      console.error('Failed to load bots:', error);
      setError('Unable to connect to the backend server. Please ensure the server is running on http://localhost:3000');
      setBots([]); // Set empty array to prevent further issues
    } finally {
      setInitialLoad(false);
    }
  };

  const handleSubmit = async (formData: BotFormData, isUpdate: boolean) => {
    setLoading(true);
    setError(null);
    try {
      if (isUpdate && editingBot) {
        await updateBot(editingBot.uid, formData);
        await loadBots();
      } else {
       const newbot = await createBot(formData);
       setBots(prevBots => [...prevBots, newbot]);
      }
      setEditingBot(null);
    } catch (error) {
      console.error('Failed to save bot:', error);
      setError('Failed to save bot. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bot: Bot) => {
    setEditingBot(bot);
  };

  const handleDelete = async (uid: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteBot(uid);
      await loadBots();
    } catch (error) {
      console.error('Failed to delete bot:', error);
      setError('Failed to delete bot. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setEditingBot(null);
  };

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading bots...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg text-red-600 dark:text-red-400 text-center max-w-md">
          {error}
        </div>
        <button
          onClick={loadBots}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }
  if(!bots){
        setBots([]);
    }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {error && (
        <div className="lg:col-span-5 mb-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="text-red-800 dark:text-red-200">{error}</div>
          </div>
        </div>
      )}
      <div className="lg:col-span-2">
        <BotForm
          editingBot={editingBot}
          onSubmit={handleSubmit}
          onClear={handleClear}
          loading={loading}
        />
      </div>
      <div className="lg:col-span-3">
        <BotTables
          bots={bots}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  );
}