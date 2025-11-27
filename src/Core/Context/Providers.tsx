'use client'

import AuthProvider from './AuthContext';
import UserProvider from './UserContext';
import AppProvider from './AppContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </UserProvider>
    </AuthProvider>
  );
}