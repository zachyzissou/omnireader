import React, { useEffect, useState } from 'react';
import Card from './Card';

export interface OnboardingSettings {
  completed?: boolean;
  steps?: {
    accounts?: string[];
    feeds?: string[];
    notifications?: string[];
    advancedNotes?: string;
  };
}

export interface ConfigWizardProps {
  initialData?: OnboardingSettings;
  loading?: boolean;
  onComplete: (payload: OnboardingSettings) => Promise<void> | void;
  onCancel?: () => void;
}

type ToggleGroup = 'accounts' | 'feeds' | 'notifications';

const ACCOUNT_OPTIONS = [
  { value: 'spotify', label: 'Spotify' },
  { value: 'plex', label: 'Plex' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'podcast-directory', label: 'Podcast Directory' },
];

const FEED_OPTIONS = [
  { value: 'tech-news', label: 'Tech News RSS' },
  { value: 'music-blogs', label: 'Music Blogs RSS' },
  { value: 'podcast-opml', label: 'Podcast OPML' },
];

const NOTIFICATION_OPTIONS = [
  { value: 'email', label: 'Email Alerts' },
  { value: 'push', label: 'Push Notifications' },
  { value: 'digest', label: 'Daily Digest' },
];

const steps = [
  'Account Linking',
  'Feed Discovery',
  'Notification Preferences',
  'Advanced Settings',
];

const defaultState = {
  accounts: [] as string[],
  feeds: [] as string[],
  notifications: [] as string[],
  advancedNotes: '',
};

const ConfigWizard: React.FC<ConfigWizardProps> = ({ initialData, loading = false, onComplete, onCancel }) => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState(defaultState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialData) {
      return;
    }
    setFormData({
      accounts: initialData.steps?.accounts ?? [],
      feeds: initialData.steps?.feeds ?? [],
      notifications: initialData.steps?.notifications ?? [],
      advancedNotes: initialData.steps?.advancedNotes ?? '',
    });
  }, [initialData]);

  const toggleValue = (group: ToggleGroup, value: string) => {
    setFormData(prev => {
      const exists = prev[group].includes(value);
      const nextValues = exists
        ? prev[group].filter(item => item !== value)
        : [...prev[group], value];
      return {
        ...prev,
        [group]: nextValues,
      };
    });
  };

  const setAdvancedNotes = (value: string) => {
    setFormData(prev => ({ ...prev, advancedNotes: value }));
  };

  const handleBack = () => setCurrent(Math.max(current - 1, 0));

  const handlePrimary = async () => {
    if (current < steps.length - 1) {
      setCurrent(current + 1);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onComplete({
        completed: true,
        steps: {
          accounts: formData.accounts,
          feeds: formData.feeds,
          notifications: formData.notifications,
          advancedNotes: formData.advancedNotes,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save onboarding settings';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const renderToggleList = (items: { value: string; label: string }[], group: ToggleGroup) => (
    <div className="space-y-2">
      {items.map((item) => (
        <label key={item.value} className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded px-3 py-2">
          <span>{item.label}</span>
          <input
            type="checkbox"
            checked={formData[group].includes(item.value)}
            onChange={() => toggleValue(group, item.value)}
          />
        </label>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (current) {
      case 0:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Link Accounts</h2>
            {renderToggleList(ACCOUNT_OPTIONS, 'accounts')}
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Feed Discovery</h2>
            {renderToggleList(FEED_OPTIONS, 'feeds')}
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Notification Preferences</h2>
            {renderToggleList(NOTIFICATION_OPTIONS, 'notifications')}
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Advanced Settings</h2>
            <textarea
              placeholder="Custom filter rules, automation ideas, or integration notes"
              className="w-full border border-gray-200 dark:border-gray-700 rounded p-2 h-32"
              value={formData.advancedNotes}
              onChange={(e) => setAdvancedNotes(e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full">
        <Card className="w-full max-w-md text-center py-10">Loading configuration wizard…</Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full">
      <Card className="w-full max-w-md">
        {renderStep()}
        {error && (
          <p className="mt-4 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleBack}
            disabled={current === 0 || saving}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Back
          </button>
          <div className="flex space-x-2">
            {onCancel && (
              <button
                onClick={onCancel}
                disabled={saving}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handlePrimary}
              disabled={saving}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-60"
            >
              {saving ? 'Saving…' : current === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConfigWizard;
