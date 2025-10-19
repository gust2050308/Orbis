
//Defifine user type incomplete yet
export type User = {
    id: number;
    setId : (id: number) => void;
    username: string;
    setUsername?: (username: string) => void;
    email: string;
    setEmail: (email: string) => void;

    //the ""?"" indicates that the property is optional
    isAdmin?: boolean;
    setIsAdmin?: (isAdmin: boolean) => void;
    isUser?: boolean;
    setIsUser?: (isUser: boolean) => void;
    isGuest?: boolean;
    setIsGuest?: (isGuest: boolean) => void;
}

