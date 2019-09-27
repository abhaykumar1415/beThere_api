"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = require("../controllers/Users");
const express_1 = require("express");
/**
 * @export
 * @class UserRouter
 */
class UserRouter {
    constructor() {
        this.router = express_1.Router();
        this.routes();
    }
    /**
     * @memberof UserRouter
     */
    routes() {
        this.router.get('/', Users_1.default.getAllUsers);
        this.router.post('/', Users_1.default.createUser);
        this.router.put('/:_id', Users_1.default.updateUser);
    }
}
exports.default = UserRouter;
//# sourceMappingURL=UserRouter.js.map