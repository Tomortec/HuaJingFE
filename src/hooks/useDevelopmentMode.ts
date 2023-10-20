
interface DevelopmentModeData {
    isDevelopment: boolean;
    isTesting: boolean;
}

export const isDevelopmentMode = (): DevelopmentModeData => {
    return {
        isDevelopment: process.env.NODE_ENV == "development",
        isTesting: true
    }
};