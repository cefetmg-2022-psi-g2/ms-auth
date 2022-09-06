const bcryptjs = require("bcryptjs");
const bdHelper = require("framework");
const jwt = require("jsonwebtoken");

const authUtils = {
    login: (method,identifier, password) =>{
        return new Promise((resolve, reject) => {
            bdHelper.customQuery(`SELECT * FROM usuario WHERE ${method} = '${identifier}'`).then((result) => {
            if (result.length > 0){
                bcryptjs.compare(password, result[0].password).then((match) => {
                    if (match) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }).catch((err) => {
                    reject(err);
                })
            } 
            }).catch((err) => { 
               reject(err);
            });
        })
    },
    genJwt: (user) => {
        return jwt.sign({"payload":user}, process.env.SECRET, { expiresIn: '1h' });
    },
    decodeJwt: (token) => {
        return jwt.verify(token, process.env.SECRET);
    }
}

module.exports = authUtils;