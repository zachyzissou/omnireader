import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import FilterBuilder from './components/FilterBuilder';
import PluginPanel from './components/PluginPanel';
import ThemeSwitcher from './components/ThemeSwitcher';
import ConfigWizard from './components/ConfigWizard';
import DashboardCard from './components/DashboardCard';
import FeedPlaceholder from './components/FeedPlaceholder';
import { FaMusic, FaNewspaper, FaPodcast, FaVideo } from 'react-icons/fa';
import type { FeedItemMap } from './types/feeds';
import type { OnboardingSettings } from './components/ConfigWizard';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [wizardSettings, setWizardSettings] = useState<OnboardingSettings | null>(null);
  const [wizardLoading, setWizardLoading] = useState(true);
  const [wizardError, setWizardError] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [feeds, setFeeds] = useState<FeedItemMap>({ music: [], news: [], podcasts: [], videos: [] });
  const [feedsError, setFeedsError] = useState<string | null>(null);

  const loadFeeds = useCallback(async () => {
    try {
      const response = await fetch('/api/feeds');
      if (!response.ok) {
        throw new Error('Failed to load feeds');
      }
      const data = await response.json();
      setFeeds({
        music: data.music ?? [],
        news: data.news ?? [],
        podcasts: data.podcasts ?? [],
        videos: data.videos ?? [],
      });
      setFeedsError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load feeds';
      setFeedsError(message);
    }
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings/onboarding');
        if (response.status === 404) {
          setWizardSettings({ completed: false });
          setWizardError(null);
          setShowWizard(true);
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to load onboarding settings');
        }
        const payload = await response.json();
        setWizardSettings(payload.value ?? { completed: false });
        setWizardError(null);
        setShowWizard(!(payload.value?.completed ?? false));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load onboarding settings';
        setWizardError(message);
        setShowWizard(true);
      } finally {
        setWizardLoading(false);
      }
    };

    fetchSettings();
    void loadFeeds();

    if (typeof window === 'undefined') {
      return () => {};
    }

    const interval = window.setInterval(() => {
      void loadFeeds();
    }, 60000);
    return () => window.clearInterval(interval);
  }, [loadFeeds]);

  const handleWizardComplete = async (payload: OnboardingSettings) => {
    const response = await fetch('/api/settings/onboarding', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: payload }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message || 'Failed to store onboarding settings');
    }
    const saved = await response.json();
    setWizardSettings(saved.value ?? payload);
    setShowWizard(false);
  };

  const reopenWizard = () => {
    setShowWizard(true);
  };

  const wizardCompleted = wizardSettings?.completed ?? false;

  return (
    <div className="flex h-screen">
      {showWizard ? (
        <ConfigWizard
          initialData={wizardSettings ?? undefined}
          loading={wizardLoading}
          onComplete={handleWizardComplete}
          onCancel={() => {
            if (wizardCompleted) {
              setShowWizard(false);
            }
          }}
        />
      ) : (
        <>
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
          <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-800 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <div
                className="text-sm text-red-500 min-h-[1.25rem]"
                role={wizardError ? 'alert' : undefined}
              >
                {wizardError ?? ''}
              </div>
              <div className="flex items-center space-x-3">
                <ThemeSwitcher />
                <button
                  onClick={reopenWizard}
                  className="px-3 py-2 bg-indigo-500 text-white rounded"
                >
                  Reopen Onboarding
                </button>
              </div>
            </div>
            {feedsError && (
              <div className="mb-4 text-sm text-amber-600 dark:text-amber-400" role="alert">
                {feedsError}
              </div>
            )}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-4">
                <DashboardCard
                  title="Latest Music Drops"
                  description="Recently ingested releases from Spotify and Apple Music"
                  action={
                    <button
                      onClick={() => void loadFeeds()}
                      className="text-sm text-indigo-600 dark:text-indigo-300"
                    >
                      Refresh
                    </button>
                  }
                >
                  <FeedPlaceholder
                    icon={<FaMusic />}
                    title="MusicFetcher"
                    items={feeds.music}
                    emptyCopy="No releases synced yet. Link Spotify or Apple Music to start tracking."
                  />
                </DashboardCard>
                <DashboardCard
                  title="Smart Filters"
                  description="Tune how OmniFeed highlights incoming content"
                >
                  <FilterBuilder />
                </DashboardCard>
                <DashboardCard
                  title="News Highlights"
                  description="Top headlines detected by RSS feeds and NewsAPI"
                >
                  <FeedPlaceholder
                    icon={<FaNewspaper />}
                    title="RSSIngestor"
                    items={feeds.news}
                  />
                </DashboardCard>
              </div>
              <aside className="space-y-4">
                <DashboardCard title="Plugins" description="Enabled data sources and integrations">
                  <PluginPanel />
                </DashboardCard>
                <DashboardCard title="Podcasts" description="New episodes ready to queue">
                  <FeedPlaceholder icon={<FaPodcast />} title="PodcastTracker" items={feeds.podcasts} />
                </DashboardCard>
                <DashboardCard title="YouTube" description="Fresh uploads from your subscriptions">
                  <FeedPlaceholder icon={<FaVideo />} title="YouTubeSubscriptions" items={feeds.videos} />
                </DashboardCard>
              </aside>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
