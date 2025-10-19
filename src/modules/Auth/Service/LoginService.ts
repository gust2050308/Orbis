import { LogInFormType } from "../Types/FormTypes";
import { useContext } from "react";
import { UserContext } from "@/Core/Context/UserContext";

export function useLogin() {

    const {setId, setUsername, setEmail, setIsAdmin, setIsUser, setIsGuest} = useContext(UserContext);

    async function Login(data: LogInFormType) {
        
    }

    return{Login};
}