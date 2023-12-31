/**
 * @url /api/sku/detail
 */
/*
    return {
        "id": req.query.id,
        "title": "@ctitle(2, 10)",
        "age": "@ctitle(2, 8)",
        "classification": "@cword(4)",
        "bottomStamp": "@cword(4, 8)",
        "sizeIntroduction": "@csentence()",
        "description": "@cparagraph()",
        "images|1-6": [
            "https://placehold.co/600x400",
            "https://placehold.co/400",
            "https://placehold.co/600"
        ]
    }
*/
module.exports = (req) => {
    if(req.query.sku_id) {
        const models = [
            {
                "p": "https://z1.ax1x.com/2023/10/18/piPfy1e.png",
                "m": "https://testingmodels.blob.core.windows.net/models/HuaPing_03.glb"
            },
            {
                "p": "https://z1.ax1x.com/2023/10/18/piPf66H.png",
                "m": "https://testingmodels.blob.core.windows.net/models/HuaPing_01.glb"
            }
        ];
        const target = models[Math.floor(Math.random() * models.length)];
        return {
            "data": {
                "id": req.query.sku_id,
                "title": "@ctitle(2, 10)",
                "cover_img": target["p"],
                "image|1-6": [
                    "https://placehold.co/600x400",
                    "https://placehold.co/400x300",
                    "https://placehold.co/600"
                ],
                "category": "@integer(0, 4)",
                "category_desc": "@cword(4)", 
                "years": "@ctitle(2, 8)",
                "poster": "https://placehold.co/400x1200",
                "bottom_desc": "@cword(4, 8)",
                "threed_img": target["m"],
                "threed_exposure": "@float(0.1, 0.5)",
                "specification_desc": "@csentence()",
                "create_time": "2023-10-14T21:04:48+08:00", 
                "update_time": "2023-10-14T21:04:48+08:00"  
            }
        }
    }
    return {
        "errmsg": "404", 
        "errno": 404
    }
};