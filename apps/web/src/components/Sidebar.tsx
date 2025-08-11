import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaInbox, 
  FaSearch, 
  FaFilter, 
  FaCog, 
  FaChevronLeft, 
  FaChevronRight 
} from 'react-icons/fa';

export interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  
  const navItems = [
    { icon: <FaHome />, label: 'Home', path: '/' },
    { icon: <FaInbox />, label: 'Inbox', path: '/inbox' },
    { icon: <FaSearch />, label: 'Search', path: '/search' },
    { icon: <FaFilter />, label: 'Filters', path: '/filters' },
    { icon: <FaCog />, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex-1">
        <div className="p-4">
          {!collapsed && (
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              OmniReader
            </h2>
          )}
        </div>
        <nav className="mt-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!collapsed && <span className="ml-3">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700">
        <button
          className="w-full p-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
