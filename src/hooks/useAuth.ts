
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useCookies } from "./useCookies";

interface UserAuth {
    /** user token */
    user?: string;
    login: () => void;
    logout: () => void;
}

const AuthContext = () => {
    // user token, not user id
    const [user, setUser] = useCookies("user", null);
    const navigate = useNavigate();

    const login = async () => {
        const token = "TEST-0";
        setUser(token);
        navigate("/user");
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