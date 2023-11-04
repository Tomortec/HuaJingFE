
const cacheImage = async (src: string) => {
    return new Promise((resolve, reject) => {
        var image = new Image();
        image.src = src;
        image.onload = resolve;
        image.onerror = reject;
    });
};

export const useCacheImages = async (srcList: string[]) => {
    for(let src of srcList) {
        cacheImage(src);
    }
};