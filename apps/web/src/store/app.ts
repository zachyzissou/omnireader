import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, User } from '../types';

interface AppStore extends AppState {
  // Actions
  setUser: (user: User | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  completeWizard: () => void;
  logout: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      sidebarCollapsed: false,
      theme: 'light',
      wizardCompleted: false,

      // Actions
      setUser: (user) => set({ user }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      completeWizard: () => set({ wizardCompleted: true }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'omnireader-app-store',
      partialize: (state) => ({
        theme: state.theme,
        wizardCompleted: state.wizardCompleted,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);