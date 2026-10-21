import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import ModelInsights from './pages/ModelInsights';
import WhatIfSimulator from './pages/WhatIfSimulator';
import History from './pages/History';

type Page = 'dashboard' | 'assessment' | 'model-insights' | 'whatif' | 'history' | 'analytics';

function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
      case 'analytics':
        return <Dashboard />;
      case 'assessment':
        return <Assessment />;
      case 'model-insights':
        return <ModelInsights />;
      case 'whatif':
        return <WhatIfSimulator />;
      case 'history':
        return <History />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
