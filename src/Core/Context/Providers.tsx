'use client'

import UserProvider from './UserContext';
import AppProvider from './AppContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full h-full min-h-screen min-w-screen'>
      <UserProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </UserProvider>
    </div>
  );
}