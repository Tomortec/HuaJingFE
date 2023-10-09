
export interface UserInfo {
    username: string;
    avatar: string;
    level: 0|1|2|3|4|5;
}

export interface CollectionInfo {
    id: string;
    title: string;
    age: string;
    classification: string;
    image: string;
}

export async function getUserInfo(): Promise<UserInfo> {
    return new Promise((resolve) => {
        resolve({
            username: "FOOBAR",
            avatar: "https://avataaars.io/?avatarStyle=Circle&topType=WinterHat3&accessoriesType=Blank&hatColor=PastelYellow&facialHairType=Blank&clotheType=CollarSweater&clotheColor=PastelYellow&eyeType=Dizzy&eyebrowType=UnibrowNatural&mouthType=Twinkle&skinColor=Yellow",
            level: 0
        });
    });
}

export async function getUserCollections(): Promise<CollectionInfo[]> {
    return new Promise((resolve) => {
        resolve([
            {
                id: "0",
                title: "花鸟纹四方瓶",
                age: "乾隆年间",
                classification: "彩粉瓷器",
                image: ""
            },
        ].concat(Array(6).fill(
            {
                id: "1",
                title: "标题",
                age: "乾隆年间",
                classification: "彩粉瓷器",
                image: ""
            }
        )));
    });
}