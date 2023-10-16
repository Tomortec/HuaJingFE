
interface DevelopmentModeData {
    isDevelopment: boolean;
}

export const isDevelopmentMode = (): DevelopmentModeData => {
    return {
        isDevelopment: process.env.NODE_ENV == "development"
    }
};