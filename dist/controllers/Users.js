"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../models/UserModel");
const status_1 = require("../services/status");
const checkLocation_1 = require("../services/checkLocation");
class UserController {
    getAllUsers(req, res, next) {
        UserModel_1.default
            .find({})
            .then((data) => {
            res.status(200).json({ data });
        })
            .catch((error) => {
            res.status(500).json({
                error: error.message,
                errorStack: error.stack
            });
            next(error);
        });
    }
    getUser(req, res, next) {
        UserModel_1.default
            .findOne(req.params)
            .then((data) => {
            res.status(200).json({ data });
        })
            .catch((error) => {
            res.status(500).json({
                error: error.message,
                errorStack: error.stack
            });
            next(error);
        });
    }
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(' In update USer :', req.body);
            let updatePayload = {};
            try {
                let isValid = checkLocation_1.default.isValidDistance(req.body.geoLocation.lat, req.body.geoLocation.lng);
                console.log('isValid  in controller:', isValid);
                if (req.body.status && req.body.geoLocation) {
                    if (req.body.status.toLocaleLowerCase() === 'present' && isValid) {
                        console.log('1');
                        const returnCurrentDate = () => {
                            let hrs = new Date().getHours();
                            let minutesPre = new Date().getMinutes() < 10 ? true : false;
                            let min = new Date().getMinutes();
                            let time = minutesPre ? hrs + ":0" + min : hrs + ":" + min;
                            return time;
                        };
                        let attendance = {
                            timestamp: new Date(),
                            monthNubmer: new Date().getMonth() + 1,
                            monthName: new Date().toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
                            year: new Date().getFullYear(),
                            date: new Date().getDate(),
                            dayNumber: new Date().getDay(),
                            dayName: new Date().toDateString().split(' ')[0],
                            time: returnCurrentDate(),
                            status: status_1.default.PRESENT
                        };
                        console.log('attendance :', attendance);
                        UserModel_1.default.update(req.params, { $push: { attendance: attendance } })
                            .then((update) => {
                            console.log('Updatd');
                            res.status(200).json({ success: true });
                        })
                            .catch((error) => {
                            res.status(500).json({
                                error: error.message,
                                errorStack: error.stack
                            });
                            next(error);
                        });
                    }
                    else {
                        throw 'Bad Request';
                    }
                } // main if
                else {
                    throw 'Bad Request';
                }
            }
            catch (err) {
                res.status(500).json({
                    error: err,
                });
            }
        });
    }
    createUser(req, res, next) {
        UserModel_1.default
            .findOne({
            email: req.body.email,
        })
            .then((data) => __awaiter(this, void 0, void 0, function* () {
            if (!data) {
                yield postUser(req.body.email);
            }
            else {
                res.status(200).json({ data });
            }
        }))
            .catch((error) => {
            res.status(500).json({
                error: error.message,
                errorStack: error.stack
            });
            next(error);
        });
        const postUser = (email) => __awaiter(this, void 0, void 0, function* () {
            UserModel_1.default
                .create({
                email: email
            })
                .then((data) => __awaiter(this, void 0, void 0, function* () {
                // let jwtToken = await Auth.mobileTokenGenerate(req.body.key);
                // res.status(200).json({ data: data, jwt: jwtToken });
                res.status(200).json({ data: data });
            }))
                .catch((error) => {
                res.status(500).json({
                    error: error.message,
                    errorStack: error.stack
                });
                next(error);
            });
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=Users.js.map