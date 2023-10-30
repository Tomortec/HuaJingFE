
import { useState } from "react";
import Cookies from "js-cookie";

export const useCookies = (
    key: string, 
    defaultValue: any,
    options?: Cookies.CookieAttributes
) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const value = Cookies.get(key);
            if(value) {
                return JSON.parse(value);
            } else {
                Cookies.set(key, JSON.stringify(defaultValue), options);
                return defaultValue;
            }
        } catch(error) {
            globalThis.log.error(error);
            return defaultValue;
        }
    });

    const setValue = (newValue: any) => {
        try {
            Cookies.set(key, JSON.stringify(newValue), options);
        } catch(error) {
            globalThis.log.error(error);
        }
    }

    return [storedValue, setValue];
};