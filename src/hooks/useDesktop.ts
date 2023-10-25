
import { useMediaQuery, MediaQueryAllQueryable } from "react-responsive";

export const useDesktop = () => {
    const desktopQuery: MediaQueryAllQueryable = {
        minWidth: 768,
        screen: true,
        orientation: "landscape"
    };
    return useMediaQuery(desktopQuery);
};