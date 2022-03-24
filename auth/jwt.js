const jwt = require('jsonwebtoken')

const createToken = async ( UserId ) => {

    try {
        const token = await jwt.sign({
            UserId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 86400
        }, "assign")
        return token
    } catch (error) {
        console.error(`Error! creating jwt token ${error.message}`);
        throw error;
    }
}

const verifyToken = async (token) => {
    try {
        const decoded = await jwt.verify(token, "assign");
        return decoded
    } catch (error) {
        console.error(`Error! verifying jwt token ${error.message}`)
        throw error;
    }
}

module.exports = {
    createToken,
    verifyToken
}