
import axios from "axios";
import {
    SolidPorcelainData,
    defaultSolidPorcelainData
} from "../../interfaces";

interface RawIndexPorcelainData {
    id: number;
}

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

// TODO: what if the model is has changed
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

const getSolidPorcelainData = async (id: string): Promise<SolidPorcelainData> => {
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

export const getAllPorcelainData = async (): Promise<SolidPorcelainData[]> => {
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

// export async function getAllPorcelainData(): Promise<SolidPorcelainData[]> {
//     return new Promise((resolve) => {
//         resolve([
//             {
//                 id: "0",
//                 title: "花鸟纹四方瓶",
//                 age: "乾隆年间",
//                 model: require("../../assets/test-model/niu.glb"),
//                 exposure: 0.7,
//                 classification: "彩粉瓷器",
//                 bottomStamp: "大清乾隆年制",
//                 sizeIntroduction: "高：31cm 口径：8.5cm",
//             },
//             {
//                 id: "1",
//                 title: "青花瓷",
//                 age: "未知",
//                 model: require("../../assets/test-model/qinghuaci.glb"),
//                 exposure: 0.8
//             },
//             {
//                 id: "2",
//                 title: "青花瓷（glTF）",
//                 age: "未知",
//                 model: require("../../assets/test-model/qinghuaci.gltf"),
//                 exposure: 0.9
//             }
//         ]);
//     });
// }