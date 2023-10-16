/**
 * @url /api/user/info
 */
module.exports = (req) => {
    if(req.query.token) {
        return {
            "data": {
                "id": 96972, 
                "phone": "@integer(10000000000, 19999999999)", 
                "token": "5a8058b0a2233d913be09df870f466e2", 
                "login_time": 1697205566,
                "name": "@cname", 
                "vip_level": "@integer(0, 2)", 
                "is_delete": 0, 
                "sku_ids": "3", 
                "create_time": "2023-10-13T13:32:16+08:00", 
                "update_time": "2023-10-13T14:40:11+08:00" 
            }
        }
    }
    return {
        "errmsg": "404",
        "errno": 404
    }
};