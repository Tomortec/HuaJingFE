
export interface AuthData {
    id: string;
    phoneNumber: string;
}

export interface UserData {
    id: string;
    name: string;
    phoneNumber: string;
    level: 0|1|2|3|4|5;
    porcelainIds?: string[];
    lastLoginTime?: Date;
}

export interface PorcelainData {
    id: string;
    name: string;
    age: string;

    classification?: string;
    bottomStamp?: string;
    sizeIntroduction?: string;
    description?: string;

    images: string[];    
}