import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAppStore } from './store/app';
import { Layout } from './components/Layout';
import { ConfigWizard } from './components/ConfigWizard';
import { AuthPage } from './pages/Auth';
import { HomePage } from './pages/Home';
import { InboxPage } from './pages/Inbox';
import { SearchPage } from './pages/Search';
import { ItemPage } from './pages/Item';
import { FiltersPage } from './pages/Filters';
import { SettingsPage } from './pages/Settings';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: unknown) => {
        // Don't retry on auth errors
        if (error && typeof error === 'object' && 'message' in error) {
          const message = String(error.message);
          if (message.includes('401') || message.includes('403')) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  const { user, wizardCompleted, theme } = useAppStore();

  // Apply theme on app load
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {!wizardCompleted ? (
            <ConfigWizard onComplete={() => {}} />
          ) : !user ? (
            <AuthPage />
          ) : (
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/inbox" element={<InboxPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/items/:id" element={<ItemPage />} />
                <Route path="/filters" element={<FiltersPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          )}
        </div>
      </Router>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}

export default App;
