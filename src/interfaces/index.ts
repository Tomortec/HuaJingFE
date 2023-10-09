
/* ----------------- PorcelainData ------------------ */

export interface PorcelainData {
    id: string;
    title: string;
    age: string;
    classification?: string;
    bottomStamp?: string;
    sizeIntroduction?: string;
    description?: string;
}

export type PlanePorcelainData = PorcelainData & {
    images: string[];
}

export type SolidPorcelainData = PorcelainData & {
    model: string;
    poster?: string; 
    exposure?: number;
}