"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const jwt_1 = require("../config/jwt");
const options = jwt_1.default;
const verifyRequestAuth = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token) {
        try {
            jwt.verify(token, jwt_1.default.secret.secretKey, (err, decoded) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Token is not valid'
                    });
                }
                else {
                    next();
                }
            });
        }
        catch (err) {
        }
    }
    else {
        return res.json({
            success: false,
            message: 'Token not found'
        });
    }
};
const Auth = { verifyRequestAuth };
exports.default = Auth;
//# sourceMappingURL=JwtToken.js.map