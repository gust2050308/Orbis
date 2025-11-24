
export type AppProviderProps = {
    theme : string;
    setTheme : (theme: string) => void;
    isAuthUser: boolean;
    setIsAuthUser: (isAuth: boolean) => void;
}