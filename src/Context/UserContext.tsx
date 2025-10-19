import { createContext, useState, type FC } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../Types/UserTypes';

//creation of the user context with default values
export const UserContext = createContext<User>({
    id: 0,
    setId: () => {},
    username: '',
    setUsername: () => {},
    email: '',
    setEmail: () => {},
    /*
        Here is not necesary to initialize the optional properties
        but we can do it if we want to have default values, is left as guest user,
        to indicate that by default there is no authenticated user
    */ 
    isGuest: true,
});

const UserProvider: FC<{children: ReactNode}> = ({children}) => {
    const [id, setId] = useState<number>(0);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isUser, setIsUser] = useState<boolean>(false);
    const [isGuest, setIsGuest] = useState<boolean>(true);
    return (
        <UserContext.Provider
            value={{
                id,
                setId,
                username,
                setUsername,
                email,
                setEmail,
                isAdmin,
                setIsAdmin,
                isUser,
                setIsUser,
                isGuest,
                setIsGuest
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider