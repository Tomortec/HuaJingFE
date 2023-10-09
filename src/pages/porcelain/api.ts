
import {
    PlanePorcelainData,
} from "../../interfaces";

export async function getPorcelainData(): Promise<PlanePorcelainData> {
    return new Promise((resolve) => {
        resolve({
            id: "0",
            title: "花鸟纹四方瓶",
            age: "乾隆年间",
            images: [
                "https://images.pexels.com/photos/5683351/pexels-photo-5683351.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
                "https://images.pexels.com/photos/18418020/pexels-photo-18418020.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
                "https://images.pexels.com/photos/15590299/pexels-photo-15590299.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"    
            ],
            classification: "彩粉瓷器",
            bottomStamp: "大清乾隆年制",
            sizeIntroduction: "高：31cm 口径：8.5cm",
        });
    });
}