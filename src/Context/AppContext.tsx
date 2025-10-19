import { useState, createContext, type FC } from "react";
import type { ReactNode } from "react";
import type { AppProviderProps } from "../Types/AppTypes";

/*==============
    At the moment, this component only manages theme state,
    but it can be expanded in the future to include more global states
==================*/

//context creation using the defined type 
export const AppContext = createContext<AppProviderProps>({
    //default values for the context properties
    theme: "light",
    setTheme: () => {},
});

//Definition of the context provider component
const AppProvider: FC<{children: ReactNode}> = ({children}) => {
    const [theme, setTheme] = useState<string>("light");
    //returning the provider with the context values   
    return (
        <AppContext.Provider value={{theme, setTheme}}>
            {children}
        </AppContext.Provider>
    );
}

//Exportation of the provider component
export default AppProvider;