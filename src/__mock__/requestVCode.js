/**
 * @url /api/user/verification_code
 */
module.exports = (req) => {
    if(JSON.parse(req.body)["phone"]) {
        return {
            "errmsg": "OK",
            "errno": 200
        }
    }
    return {
        "errmsg": "404", 
        "errno": 404
    }
}