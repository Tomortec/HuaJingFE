
import axios from "axios";
import {
    SolidPorcelainData,
    defaultSolidPorcelainData
} from "../../interfaces";

interface RawIndexPorcelainData {
    id: number;
}

const getSolidPorcelainIds = async (): Promise<string[]> => {
    const keyName = "SOLID_PORCELAINS";
    const getStoredIds = () => {
        try {
            const value = window.localStorage.getItem(keyName);
            if(value) return JSON.parse(value);
        } catch(error) {
            console.error(error);
            return null;
        }
    };

    const ids = getStoredIds();
    if(ids) return ids;
    else {
        try {
            const result = await axios.get("/api/index/square");
            const resultData = result["data"];
            const rawData = resultData["data"]["skus"] as RawIndexPorcelainData[];
            const ids = rawData.map((v) => v.id.toString());    
            window.localStorage.setItem(keyName, JSON.stringify(ids));
            return ids;
        } catch(error) {
            console.error(error);
            return null;
        }
    }
};

interface RawSolidPorcelainData {
    id: number;
    title: string;
    cover_img: string;
    category_desc: string;
    years: string;
    bottom_desc: string;
    specification_desc: string;
    poster: string;
    threed_img: string;
    threed_exposure: number;
}

const getSolidPorcelainData = async (id: string): Promise<SolidPorcelainData> => {
    if(!id) return defaultSolidPorcelainData;
    
    try {
        const result = await axios.get("/api/sku/detail", {
            params: { "sku_id": id }
        });
        const resultData = result["data"];

        const rawData = resultData["data"] as RawSolidPorcelainData;
        return rawData ? {
            id: rawData.id.toString(),
            title: rawData.title,
            age: rawData.years,
            classification: rawData.category_desc,
            bottomStamp: rawData.bottom_desc,
            sizeIntroduction: rawData.specification_desc,
            description: rawData.poster,
            model: rawData.threed_img,
            poster: rawData.cover_img,
            exposure: rawData.threed_exposure
        } : defaultSolidPorcelainData;    
    } catch(error) {
        console.error(error);
        return defaultSolidPorcelainData;
    }
};

export const getAllSolidPorcelainDataApiKey = "GET_ALL_SOLID_PORCELAIN_DATA";
export const getAllSolidPorcelainData = async (): Promise<SolidPorcelainData[]> => {
    try {
        const porcelainIds = await getSolidPorcelainIds();
        if(porcelainIds) {
            const solidPorcelainData: SolidPorcelainData[] = [];
            for await (let id of porcelainIds) {
                solidPorcelainData.push(await getSolidPorcelainData(id));
            }
            return solidPorcelainData.filter(Boolean) || [defaultSolidPorcelainData];
        } else {
            throw "Cannot get solid porcelain's ID !";
        }
    } catch(error) {
        console.error(error);
        return [defaultSolidPorcelainData];
    }
};