
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useCookies } from "./useCookies";

interface UserAuth {
    user?: string,
    login: () => void,
    logout: () => void
}

const AuthContext = () => {
    const [user, setUser] = useCookies("user", null);
    const navigate = useNavigate();

    const login = () => {
        setUser("TEST-0");
        navigate("/user");
    };

    const logout = () => {
        setUser(null);
        navigate("/", { replace: true });
    };

    // provides a default context
    return createContext<UserAuth>({
        user: user,
        login: login,
        logout: logout
    });
};

export const useAuth = () => {
    return useContext(AuthContext());
};