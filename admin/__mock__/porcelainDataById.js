/**
 * @url /adminApi/porcelainDataById
 */

module.exports = (req) => {
    const id = req.query.id;
    return {
        "id": id,
        "name": "@ctitle(2, 10)",
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
};