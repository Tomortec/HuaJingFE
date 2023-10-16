import axios from "axios";

export const requestVerificationCode = async (phoneNumber: string): Promise<boolean> => {
    try {
        const result = await axios.post("https://ebbfcf54-9301-4d66-8be8-5a20d7cf90f9.mock.pstmn.io/api/user/verification_code", {
            "phone": phoneNumber
        });
        return result.status == 200;
    } catch(error) {
        console.error(error);
        return false;
    }
};