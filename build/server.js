"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router_1 = require("./router");
const middleware_1 = require("./config/middleware");
/**
 * @export
 * @class Server
 */
class Server {
    constructor() {
        this.app = express();
        this.app.use(function (req, res, next) {
            var allowedOrigins = ['http://localhost:3001', 'http://localhost:8081'];
            var origin = req.headers.origin;
            if (allowedOrigins.indexOf(origin) > -1) {
                res.setHeader('Access-Control-Allow-Origin', origin);
            }
            //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With, Cache-Control');
            // res.header('Access-Control-Allow-Credentials', true);
            return next();
        });
        // Cron.init();
        middleware_1.default.init(this);
        router_1.default.init(this);
    }
}
exports.Server = Server;
// export
exports.default = new Server().app;
//# sourceMappingURL=server.js.map