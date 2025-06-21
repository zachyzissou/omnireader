import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import FilterBuilder from './components/FilterBuilder';
import PluginPanel from './components/PluginPanel';
import ThemeSwitcher from './components/ThemeSwitcher';
import ConfigWizard from './components/ConfigWizard';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [wizardComplete, setWizardComplete] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('wizardCompleted') === 'true';
    setWizardComplete(completed);
  }, []);

  return (
    <div className="flex h-screen">
      {!wizardComplete ? (
        <ConfigWizard onComplete={() => setWizardComplete(true)} />
      ) : (
        <>
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
          <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-800 overflow-auto">
            <div className="flex justify-end mb-4">
              <ThemeSwitcher />
            </div>
            <FilterBuilder />
            <PluginPanel />
            {/* Further content cards go here */}
          </main>
        </>
      )}
    </div>
  );
}

export default App;
