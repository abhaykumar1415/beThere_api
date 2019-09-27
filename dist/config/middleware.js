"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
/**
 * @export
 * @class Middleware
 */
class Middleware {
    /**
     * @static
     * @param {IServer} server
     * @memberof Middleware
     */
    static init(server) {
        server.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        server.app.use(bodyParser.json({ limit: '50mb' }));
        server.app.use(cookieParser());
        server.app.use(compression());
        server.app.use(helmet());
        server.app.use(cors());
        server.app.use('/apidoc', express.static(path.join(__dirname, '../../apidoc')));
        server.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS ');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,' +
                ' Content-Type, Accept,' +
                ' Authorization,' +
                ' Access-Control-Allow-Credentials');
            // res.header('Access-Control-Allow-Credentials', 'true');
            next();
        });
    }
}
exports.default = Middleware;
//# sourceMappingURL=middleware.js.map