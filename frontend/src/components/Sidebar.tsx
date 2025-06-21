import React from 'react';
import { FaMusic, FaNewspaper, FaPodcast, FaVideo, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const items = [
    { icon: <FaMusic />, label: 'Music' },
    { icon: <FaNewspaper />, label: 'News' },
    { icon: <FaPodcast />, label: 'Podcasts' },
    { icon: <FaVideo />, label: 'Videos' },
  ];
  return (
    <aside
      className={`bg-white dark:bg-gray-900 shadow-lg transition-width duration-300 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex-1">
        <ul className="mt-4">
          {items.map((item) => (
            <li
              key={item.label}
              className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && <span className="ml-4">{item.label}</span>}
            </li>
          ))}
        </ul>
      </div>
      <button
        className="p-4 focus:outline-none"
        onClick={onToggle}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>
    </aside>
  );
};

export default Sidebar;
