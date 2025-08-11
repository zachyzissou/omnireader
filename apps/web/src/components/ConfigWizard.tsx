import React, { useState } from 'react';
import Card from './Card';

export interface ConfigWizardProps {
  onComplete: () => void;
}

const ConfigWizard: React.FC<ConfigWizardProps> = ({ onComplete }) => {
  const steps = [
    'Account Linking',
    'Feed Discovery',
    'Notification Preferences',
    'Advanced Settings',
  ];

  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleNext = () => {
    if (current < steps.length - 1) {
      setCurrent(current + 1);
    } else {
      localStorage.setItem('wizardCompleted', 'true');
      onComplete();
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const renderStep = () => {
    switch (current) {
      case 0:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Link Accounts</h2>
            <div className="space-y-2">
              <button className="w-full p-2 bg-blue-600 text-white rounded">Link Spotify</button>
              <button className="w-full p-2 bg-green-600 text-white rounded">Link Plex</button>
              <button className="w-full p-2 bg-purple-600 text-white rounded">Link YouTube</button>
              <button className="w-full p-2 bg-yellow-600 text-white rounded">Select Podcast Directory</button>
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Feed Discovery</h2>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Tech News RSS
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Music Blogs RSS
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Podcast OPML
              </label>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Notification Preferences</h2>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Email Alerts
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Push Notifications
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Daily Digest
              </label>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Advanced Settings</h2>
            <textarea
              placeholder="Custom filter rules (JSON)"
              className="w-full border rounded p-2 h-32"
              onChange={(e) => handleChange('advanced', e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <Card className="w-full max-w-md">
        {renderStep()}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setCurrent(Math.max(current - 1, 0))}
            disabled={current === 0}
            className="p-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="p-2 bg-blue-500 text-white rounded"
          >
            {current === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ConfigWizard;
