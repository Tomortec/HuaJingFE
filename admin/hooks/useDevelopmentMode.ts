
interface DevelopmentModeData {
    isDevelopment: boolean;
}

export const useDevelopmentMode = (): DevelopmentModeData => {
    return {
        isDevelopment: process.env.NODE_ENV == "development"
    }
};