/**
 * @url /api/user/login
 */
module.exports = (req) => {
    if(JSON.parse(req.body)["phone"]) {
        return {
            "data": {
                "token": "@id"
            }
        }
    }
    return {
        "errmsg": "404", 
        "errno": 404
    }
};