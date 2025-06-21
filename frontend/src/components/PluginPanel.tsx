import React, { useEffect, useState } from 'react';

export interface PluginInfo {
  name: string;
  permissions: string[];
}

const PluginPanel: React.FC = () => {
  const [plugins, setPlugins] = useState<PluginInfo[]>([]);

  useEffect(() => {
    fetch('/api/plugins')
      .then(res => res.json())
      .then(data => setPlugins(data));
  }, []);

  return (
    <section className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Plugins</h2>
      <ul>
        {plugins.map((plugin) => (
          <li key={plugin.name} className="flex justify-between p-2 border rounded mb-1">
            <span>{plugin.name}</span>
            <span className="text-sm text-gray-500">{plugin.permissions.join(', ')}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PluginPanel;
