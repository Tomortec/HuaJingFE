
/* ----------------- UserData ------------------ */

import userAvatar from "../assets/user/image-user-avatar.png"

export interface UserData {
    name: string;
    level: 0|1|2|3|4|5;
    porcelainIds?: string[];
    avatar?: string;
}
export const defaultUserData: UserData = {
    name: "用户", level: 0, porcelainIds: [], avatar: userAvatar
};

/* ----------------- PorcelainData ------------------ */

export interface PorcelainData {
    id: string;
    title: string;
    age: string;
    classification: string;
    bottomStamp: string;
    sizeIntroduction: string;
    description: string;
    descriptionText?: string;
}
export const defaultPorcelainData: PorcelainData = {
    id: "", title: "瓷器", age: "未知",
    classification: "未知", bottomStamp: "未知",
    sizeIntroduction: "未知", description: "未知",
    descriptionText: "未知"
};

/* ----------------- PlanePorcelainData ------------------ */

export type PlanePorcelainData = PorcelainData & {
    images: string[];
}
export const defaultPlanePorcelainData: PlanePorcelainData = {
    ...defaultPorcelainData,
    images: []
};

/* ----------------- SolidPorcelainData ------------------ */

export type SolidPorcelainData = PorcelainData & {
    model: string;
    poster?: string; 
    exposure?: number;
}
export const defaultSolidPorcelainData: SolidPorcelainData = {
    ...defaultPorcelainData,
    model: "", poster: "", exposure: 1.0
};

/* ----------------- CollectionData ------------------ */

/**
 * `CollectionData` is different from `PlanePorcelainData`.  
 * This type only contains basic data of `PlanePorcelainData`,
 * while `PorcelainData` is much more detailed
 */
export interface CollectionData {
    id: string;
    title: string;
    image: string;
}
export const defaultCollectionData: CollectionData = {
    ...defaultPorcelainData,
    image: ""
};