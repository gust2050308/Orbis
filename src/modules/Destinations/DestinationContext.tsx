import { createContext, useState, ReactNode } from 'react';
import { de } from 'zod/v4/locales';

interface DestinationContextProps {
    open : boolean;
    setOpen : (open: boolean) => void;
    idDestination: number;
    setIdDestination: (id: number) => void;
    refreshData: () => void
    refreshKey: number
    
}

export const DestinationContext = createContext<DestinationContextProps>({
    open: false,
    setOpen: () => {},
    refreshData: () => { },
    refreshKey: 0,
    idDestination: 0,
    setIdDestination: () => {}
});

const DestinationProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [idDestination, setIdDestination] = useState<number>(0);
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshData = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

  return <DestinationContext.Provider value={{
    open,
    setOpen,
    idDestination,
    setIdDestination,
    refreshData,
    refreshKey
}}>{children}</DestinationContext.Provider>;
}

export default DestinationProvider;