
import axios from "axios";
import { 
    PlanePorcelainData,
    defaultPlanePorcelainData
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

export const getPorcelainData = async (id: string): Promise<PlanePorcelainData> => {
    if(!id) return defaultPlanePorcelainData;
    
    try {
        const result = await axios.get("/api/sku/detail", {
            params: { "sku_id": id }
        });
        const resultData = result["data"];

        globalThis.log.info(resultData);
        const rawData = resultData["data"] as RawCollectionData;
        return rawData ? {
            id: rawData.id.toString(),
            title: rawData.title,
            age: rawData.years,
            classification: rawData.category_desc,
            bottomStamp: rawData.bottom_desc,
            sizeIntroduction: rawData.specification_desc,
            description: rawData.poster,
            images: [rawData.cover_img, ...rawData.image]
        } : defaultPlanePorcelainData;
    } catch(e) { 
        globalThis.log.error(e); 
        return defaultPlanePorcelainData;
    }
};