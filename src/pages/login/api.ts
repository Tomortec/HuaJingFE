
import axios from "axios";

export const requestVerificationCode = async (phoneNumber: string): Promise<boolean> => {
    if(!phoneNumber) return false;
    
    try {
        const result = await axios.post("/api/user/verification_code", {
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
export const requestForLoggingIn = async (phoneNumber: string, vcode: string): Promise<string> => {
    if(!phoneNumber || !vcode) return "";

    try {
        const result = await axios.post("/api/user/login", {
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