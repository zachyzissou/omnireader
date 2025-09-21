import React from 'react';
import Card from './Card';

interface DashboardCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, action, children }) => (
  <Card className="mb-4">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
    {children}
  </Card>
);

export default DashboardCard;
