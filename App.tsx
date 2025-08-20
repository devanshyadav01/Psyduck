import { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ProjectCatalog } from './components/ProjectCatalog';
import { Leaderboard } from './components/Leaderboard';
import { ActivityTracker } from './components/ActivityTracker';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');

  const handleGetStarted = () => {
    setCurrentPage('dashboard');
  };

  const handleViewProjects = () => {
    setCurrentPage('projects');
  };

  const handleViewActivity = () => {
    setCurrentPage('activity');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onGetStarted={handleGetStarted} />;
      case 'dashboard':
        return <Dashboard onViewProjects={handleViewProjects} onViewActivity={handleViewActivity} />;
      case 'projects':
        return <ProjectCatalog />;
      case 'activity':
        return <ActivityTracker />;
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
}