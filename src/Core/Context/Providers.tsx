'use client'

import AuthProvider from './AuthContext';
import UserProvider from './UserContext';
import AppProvider from './AppContext';
import GoogleMapsProvider from '@/modules/Destinations/Views/GoogleMapsProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <AppProvider>
          <GoogleMapsProvider>
            {children}
          </GoogleMapsProvider>
        </AppProvider>
      </UserProvider>
    </AuthProvider>
  );
}