
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
    try {
        const result = await axios.get("/api/user/info", {
            params: { "token": token }
        });
        const resultData = result["data"];
        const rawUserData = resultData["data"];

        // TODO: handle error
        return rawUserData ? {
            name: rawUserData.name,
            level: rawUserData.vip_level,
            porcelainIds: defaultUserData.porcelainIds,
            avatar: defaultUserData.avatar
        } : defaultUserData;
    } catch (e) { 
        console.error(e); 
        return defaultUserData;
    }
};

export const getCollectionsDataApiKey = "GET_COLLECTIONS_DATA";
export const getCollectionsData = async (token: string): Promise<CollectionData[]> => {
    try {
        const result = await axios.get("/api/user/my_sku", {
            params: { "token": token }
        });
        const resultData = result["data"];
        const rawData = resultData["data"] as RawCollectionData[];

        return rawData ? rawData.map((v) => ({
            id: v.id.toString(),
            title: v.title,
            image: v.cover_img
        } as CollectionData)) : [];
    } catch (e) { 
        console.error(e); 
        return [];
    }
};