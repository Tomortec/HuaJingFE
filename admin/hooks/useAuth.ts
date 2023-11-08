
import { createContext, useContext } from "react";

import { useCookies } from "./useCookies";

interface AuthContextType {
    auth?: string;
    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = () => {
    const [user, setUser] = useCookies("auth", null);

    const login = async (token: string) => {
        setUser(token);
        window.location.reload();
    }

    const logout = () => {
        setUser(null);
    }

    return createContext<AuthContextType>({
        auth: user,
        login,
        logout,
    });
};

export const useAuth = () => {
    return useContext(AuthContext());
}