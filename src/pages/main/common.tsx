
import modelBgImage from "../../assets/home/image-home-model-bg.png";

export {
    modelBgImage
};

export interface ModelInfo { 
    title: string, image: string, 
    link: string, age: string, 
    classification: string,
    /**
     * if reversed, the image will be on the right
     */
    reversed: boolean
}
