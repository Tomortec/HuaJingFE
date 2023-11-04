
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useCookies } from "./useCookies";

interface UserAuth {
    /** user token */
    user?: string;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = () => {
    // user token, not user id
    const [user, setUser] = useCookies("user", null);
    const navigate = useNavigate();

    const login = async (token: string) => {
        setUser(token);
        navigate("/");
    };

    const logout = () => {
        setUser(null);
        navigate("/", { replace: true });
    };

    // provides a default context
    return createContext<UserAuth>({
        user,
        login,
        logout,
    });
};

export const useAuth = () => {
    return useContext(AuthContext());
};