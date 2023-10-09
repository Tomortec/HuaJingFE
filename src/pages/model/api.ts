
import {
    SolidPorcelainData,
} from "../../interfaces";

export async function getAllPorcelainData(): Promise<SolidPorcelainData[]> {
    return new Promise((resolve) => {
        resolve([
            {
                id: "0",
                title: "花鸟纹四方瓶",
                age: "乾隆年间",
                model: require("../../assets/test-model/niu.glb"),
                exposure: 0.54,
                classification: "彩粉瓷器",
                bottomStamp: "大清乾隆年制",
                sizeIntroduction: "高：31cm 口径：8.5cm",
            },
            {
                id: "1",
                title: "青花瓷",
                age: "未知",
                model: require("../../assets/test-model/qinghuaci.glb"),
                exposure: 0.8
            },
            {
                id: "2",
                title: "青花瓷（glTF）",
                age: "未知",
                model: require("../../assets/test-model/qinghuaci.gltf"),
                exposure: 0.9
            }
        ]);
    });
}