'use client'

import UserProvider from './UserContext';
import AppProvider from './AppContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </UserProvider>
  );
}