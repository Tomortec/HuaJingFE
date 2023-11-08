

export interface UserData {
    readonly id: string;
    name: string;
    phoneNumber: string;
    level: number;
    porcelainIds?: string[];
    lastLoginTime?: Date;
}
export const defaultUserData: UserData = {
    id: "", name: "", phoneNumber: "",
    level: 0, porcelainIds: [], lastLoginTime: null
};

export interface PorcelainData {
    readonly id: string;
    name: string;
    age: string;

    classification?: string;
    bottomStamp?: string;
    sizeIntroduction?: string;
    description?: string;
    descriptionText?: string;

    images: string[];   
    
    model?: string;
    exposure?: number;
}
export const defaultPorcelainData: PorcelainData = {
    id: "", name: "", age: "",
    classification: "", bottomStamp: "",
    sizeIntroduction: "", description: "", descriptionText: "",
    images: [], model: "", exposure: 1
};

export const PorcelainCategoryMapper = (data: PorcelainData): number => {
    return {
        "": 0
    }[data.classification] || 0;
};

export const PorcelainCategoryDescMapper = (num: number): string => {
    return [""][num] || "";
};