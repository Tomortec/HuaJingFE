
import axios from "axios";

import { 
    UserData, 
    defaultUserData, 

    CollectionData
} from "../../interfaces";

interface RawCollectionData {
    id: number;
    title: string;
    cover_img: string;
    image: string[];
    category_desc: string;
    years: string;
    bottom_desc: string;
    specification_desc: string;
    poster: string;
}

export const getUserDataApiKey = "GET_USER_DATA";
export const getUserData = async (token: string): Promise<UserData> => {
    if(!token) return defaultUserData;

    try {
        const result = await axios.get("/api/user/info", {
            headers: { "token": token }
        });
        const resultData = result["data"];

        globalThis.log.info("getUserData", resultData);
        const rawUserData = resultData["data"];

        return rawUserData ? {
            name: rawUserData.name,
            level: rawUserData.vip_level,
            porcelainIds: defaultUserData.porcelainIds,
            avatar: defaultUserData.avatar
        } : defaultUserData;
    } catch (e) { 
        globalThis.log.error(e); 
        return defaultUserData;
    }
};

export const getCollectionsDataApiKey = "GET_COLLECTIONS_DATA";
export const getCollectionsData = async (token: string): Promise<CollectionData[]> => {
    if(!token) return [];

    try {
        const result = await axios.get("/api/user/my_sku", {
            headers: { "token": token }
        });
        const resultData = result["data"];

        globalThis.log.info("getCollectionsData", resultData);
        const rawData = resultData["data"] as RawCollectionData[];

        return rawData ? rawData.map((v) => ({
            id: v.id.toString(),
            title: v.title,
            image: v.cover_img
        } as CollectionData)) : [];
    } catch (e) { 
        globalThis.log.error(e); 
        return [];
    }
};