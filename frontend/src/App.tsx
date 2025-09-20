import React, { useState } from 'react';
import { Sidebar } from './components/layouts/Sidebar';
import { Header } from './components/layouts/Header';
import { BotManagement } from './pages/BotManagement';
import { CallLogs } from './pages/CallLogs';
import { useTheme } from './hooks/useTheme';
import type { Page } from './types';

function App() {
  const [activePage, setActivePage] = useState<Page>('bots');
  const { theme } = useTheme();

  const getPageTitle = () => {
    switch (activePage) {
      case 'bots':
        return 'Bot Management';
      case 'logs':
        return 'Call Logs';
      default:
        return 'Dashboard';
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'bots':
        return <BotManagement />;
      case 'logs':
        return <CallLogs />;
      default:
        return <BotManagement />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${theme}`}>
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      
      <div className="ml-64">
        <Header title={getPageTitle()} />
        
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;