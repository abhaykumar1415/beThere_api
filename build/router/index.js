"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const UserRouter_1 = require("./UserRouter");
const JwtToken_1 = require("../services/JwtToken");
class Routes {
    /**
     * @param  {IServer} server
     * @returns void
     */
    static init(server) {
        const router = express.Router();
        server.app.use('/', router);
        server.app.use('/api/verify', JwtToken_1.default.verifyRequestAuth);
        server.app.use('/api/users', new UserRouter_1.default().router);
    }
}
exports.default = Routes;
//# sourceMappingURL=index.js.map