
import axios from "axios";
import { PorcelainData, PorcelainCategoryMapper, UserData, PorcelainCategoryDescMapper } from "../interfaces";
import { toNumber } from "lodash";

/* ----------------- Login Module ------------------ */

export const requestVerificationCode = async (phoneNumber: string): Promise<boolean> => {
    if(!phoneNumber) return false;
    
    try {
        const result = await axios.post("/api/user/verification_code", {
            "phone": phoneNumber
        });
        console.log("requestVerificationCode", result.data);
        return result.status == 200;
    } catch(error) {
        console.error(error);
        return false;
    }
};

export const requestForLogginIn = async (phoneNumber: string, vcode: string): Promise<string> => {
    if(!phoneNumber || !vcode) return "";
    
    try {
        const result = await axios.post("/api/user/login", {
            "phone": phoneNumber,
            "code": vcode
        });
        const resultData = result.data;
        console.log("requestForLogginIn", resultData);
        const rawData = resultData["data"];
        return rawData["token"] || "";
    } catch(error) {
        console.error(error);
        return "";
    }
};

/* ----------------- User Management ------------------ */
interface RawUserData {
    id: number;
    phone: string;
    login_time: number;
    name: string;
    vip_level: number;
    sku_ids: string;
}
export const getAllUserData = async (token: string): Promise<UserData[]> => {
    if(!token) return [];
    try {
        // TMP: fetch all data without pagination
        const result = await axios.get("/admin/user/page", {
            headers: { "token": token },
            params: { "page_size": "1", "page_num": "1" }
        });
        const resultData = result.data;
        console.log("getAllUserData.total", resultData);
        const totalPages = resultData["data"]["total"] as number;
        if(totalPages > 0) {
            const result = await axios.get("/admin/user/page", {
                headers: { "token": token },
                params: { "page_size": totalPages.toString(), "page_num": "1" }
            });
            const resultData = result.data;
            console.log("getAllUserData", resultData);
            const rawData = resultData["data"]["data"] as RawUserData[];
            return rawData ? rawData.map((data) => ({
                id: data.id.toString(),
                phoneNumber: data.phone,
                lastLoginTime: new Date(data.login_time),
                name: data.name,
                level: data.vip_level,
                porcelainIds: data.sku_ids.split(",") || []
            } as UserData)) : [];
        }
        return [];
    } catch(error) {
        console.error(error);
        return [];
    }
};

const userManagementPost = async (
    url: string, data: any,
    token: string, user: UserData,
    /* DEVELOPMENT */ funcName?: string
): Promise<boolean> => {
    if(!token || !user) return false;
    try {
        const result = await axios.post(url, data, {
            headers: { "token": token }
        });
        console.log(funcName, result.data);
        return result.status == 200;
    } catch(error) {
        console.error(url, error);
        return false;
    }
};

export const createUser = async (token: string, user: UserData): Promise<boolean> => {
    return await userManagementPost("/admin/user/create", {
        "phone": user.phoneNumber,
        "name": user.name,
        "vip_level": user.level,
        "sku_ids": user.porcelainIds.join(",") || ""
    }, token, user, "createUser");
};

export const deleteUser = async (token: string, user: UserData): Promise<boolean> => {
    const id = toNumber(user.id);
    if(Number.isNaN(id)) return false;
    return await userManagementPost("/admin/user/delete", {
        "id": id
    }, token, user, "deleteUser");
};

export const updateUser = async (token: string, user: UserData): Promise<boolean> => {
    const id = toNumber(user.id);
    if(Number.isNaN(id)) return false;
    return await userManagementPost("/admin/user/update", {
        "id": id,
        "name": user.name,
        "vip_level": user.level,
        "sku_ids": user.porcelainIds.join(",") || ""    // TODO: ?
    }, token, user, "updateUser");
};

/* ----------------- Porcelain Management ------------------ */
interface RawPorcelainData {
    id: number;
    title: string;
    cover_img: string;
    image: string;
    category: number;
    years: string;
    bottom_desc: string;
    specification_desc: string;
    poster: string;
    threed_img?: string;
    threed_exposure?: string;
}
export const getAllPorcelainData = async (token: string): Promise<PorcelainData[]> => {
    if(!token) return [];
    try {
        const result = await axios.get("/admin/sku/list", {
            headers: { "token": token }
        });
        const resultData = result.data;
        console.log("getAllPorcelainData", resultData);
        const rawData = resultData["data"] as RawPorcelainData[];
        return rawData ? rawData.map((data) => ({
            id: data.id.toString(),
            name: data.title,
            age: data.years,
            classification: PorcelainCategoryDescMapper(data.category),
            bottomStamp: data.bottom_desc,
            sizeIntroduction: data.specification_desc,
            description: data.poster,
            images: [data.cover_img, ...data.image.split(",")],
            model: data.threed_img || "",
            exposure: data.threed_exposure || 1.0
        } as PorcelainData)) : [];
    } catch(error) {
        console.error(error);
        return [];
    }
};

const porcelainManagementPost = async (
    url: string, data: any,
    token: string, porcelain: PorcelainData,
    headers?: any,
    /* DEVELOPMENT */ funcName?: string
): Promise<boolean> => {
    if(!token || !porcelain) return false;
    try {
        const result = await axios.post(url, data, {
            headers: {
                "token": token,
                ...headers
            }
        });
        console.log(funcName, result.data);
        return result.status == 200;
    } catch(error) {
        console.error(url, error);
        return false;
    }
};

export const createPorcelain = async (token: string, porcelain: PorcelainData): Promise<boolean> => {
    return await porcelainManagementPost("/admin/sku/create", {
        "title": porcelain.name,
        "category": PorcelainCategoryMapper(porcelain),
        "years": porcelain.age,
        "poster": porcelain.description || "",
        "bottom_desc": porcelain.bottomStamp || "",
        "specification_desc": porcelain.sizeIntroduction || "",
        "threed_img": porcelain.model || "",
        "threed_exposure": (porcelain.exposure || 0).toString()
    }, token, porcelain, {}, "createPorcelain");
};

export const deletePorcelain = async (token: string, porcelain: PorcelainData): Promise<boolean> => {
    const id = toNumber(porcelain.id);
    if(Number.isNaN(id)) return false;
    return await porcelainManagementPost("/admin/sku/delete", {
        "id": id
    }, token, porcelain, {}, "deletePorcelain");
};

export const updatePorcelain = async (token: string, porcelain: PorcelainData): Promise<boolean> => {
    const id = toNumber(porcelain.id);
    if(Number.isNaN(id)) return false;
    return await porcelainManagementPost("/admin/sku/update", {
        "id": id,
        "title": porcelain.name,
        "category": PorcelainCategoryMapper(porcelain),
        "years": porcelain.age,
        "poster": porcelain.description || "",
        "bottom_desc": porcelain.bottomStamp || "",
        "specification_desc": porcelain.sizeIntroduction || "",
        "threed_img": porcelain.model || "",
        "threed_exposure": (porcelain.exposure || 1).toString()
    }, token, porcelain, {}, "updatePorcelain");
};

const checkLocalBlobRegx = /^blob:(?<origin>[\w\+]+:\/\/(?=.{1,254}(?::|$))(?:(?!\d|-)(?![a-z0-9\-]{1,62}-(?:\.|:|$))[a-z0-9\-]{1,63}\b(?!\.$)\.?)+(:\d+)?)\/(?<uuid>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;
/**
 * @warning reload data before calling this function
 * to prevent local URLs in data of updating to DB
 */
export const updatePorcelainImage = async (token: string, porcelain: PorcelainData): Promise<boolean> => {
    const id = toNumber(porcelain.id);
    if(Number.isNaN(id)) return false;
    const images = porcelain.images.filter((url) => {
        !checkLocalBlobRegx.test(url)
    });
    return await porcelainManagementPost("/admin/sku/update_image", {
        "id": id,
        "cover_img": images[0] || "",
        "images": images.slice(1) || []
    }, token, porcelain, {}, "updatePorcelainImage");
};

/**
 * @param replaceImages whether replace the whole `images` property with newly uploaded images' urls
 * @warning replace **local files(local blob)** in `images` property autoly
 */
export const uploadPorcelainImage = async (
    token: string, 
    porcelain: PorcelainData, 
    files: File[],
    options: {
        replaceImages?: boolean,
        isDescription?: boolean,
    } = { replaceImages: false, isDescription: false  }
): Promise<PorcelainData> => {
    const id = toNumber(porcelain.id);
    if(Number.isNaN(id) || !files) return porcelain; // return original one
    
    const uploadedImages: string[] = [];
    for await (let file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await axios.post("/admin/file/upload", formData, {
            headers: {
                "token": token,
                "Content-Type": "multipart/form-data"
            }
        });
        console.log("uploadPorcelainImage", result.data);
        uploadedImages.push(result.data["data"]["filePath"] || "");
    }

    const localBlobFilteredImages = porcelain.images.filter((url) =>
        !checkLocalBlobRegx.test(url)
    );
    if(options.isDescription) {
        return Object.assign({}, porcelain, {
            description: uploadedImages.filter(Boolean)[0] || "",
        });
    }
    return Object.assign({}, porcelain, {
        images: options.replaceImages ? uploadedImages.filter(Boolean) : 
            [...localBlobFilteredImages, ...uploadedImages.filter(Boolean)]
    });
};

/**
 * @warning replace `porcelain`'s `model` property
 */
export const uploadPorcelainModel = async (
    token: string,
    porcelain: PorcelainData,
    model: File
): Promise<PorcelainData> => {
    const id = toNumber(porcelain.id);
    if(Number.isNaN(id) || !model) return porcelain; // return original one

    const formData = new FormData();
    formData.append("file", model);
    const result = await axios.post("/admin/file/upload", formData, {
        headers: {
            "token": token,
            "Content-Type": "multipart/form-data"
        }
    });
    console.log("uploadPorcelainModel", result.data);
    const filePath = result.data["data"]["filePath"] || "";
    if(filePath) {
        return Object.assign({}, porcelain, {
            model: filePath
        });
    } else {
        return porcelain;
    }
};