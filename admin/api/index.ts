
import { PorcelainData } from "../interfaces";

export const getPorcelainById = async (id: string) => {
    try {
        const result = await $.ajax("/adminApi/porcelainDataById", {
            method: "GET",
            data: $.param({ "id": id })
        });
        return result as PorcelainData;
    } catch(error) {
        console.error(error);
    }
};