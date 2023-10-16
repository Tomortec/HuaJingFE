
import { createContext } from "react";

import { AuthData } from "../interfaces";

export interface AuthContextType {
    auth?: AuthData;
    login: (data: AuthData) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    auth: null,
    login(data) { },
    logout() { },
});