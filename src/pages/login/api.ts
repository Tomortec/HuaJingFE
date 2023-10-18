
import axios from "axios";
import { isDevelopmentMode } from "../../hooks/useDevelopmentMode";

const baseURL = isDevelopmentMode().isDevelopment ? "https://ebbfcf54-9301-4d66-8be8-5a20d7cf90f9.mock.pstmn.io" : "";

export const requestVerificationCode = async (phoneNumber: string): Promise<boolean> => {
    try {
        const result = await axios.post(baseURL + "/api/user/verification_code", {
            "phone": phoneNumber
        });
        return result.status == 200;
    } catch(error) {
        console.error(error);
        return false;
    }
};

/**
 * 
 * @param phoneNumber 
 * @param vcode 
 * @returns user token if everything goes well
 */
export const requestForLoggingIn = async (phoneNumber: string, vcode: number): Promise<string> => {
    try {
        const result = await axios.post(baseURL + "/api/user/login", {
            "phone": phoneNumber,
            "code": vcode
        });
        const resultData = result.data;

        // TODO: handle error
        const rawData = resultData["data"];
        return rawData["token"] || "";
    } catch(error) {
        console.error(error);
        return "";
    }
};