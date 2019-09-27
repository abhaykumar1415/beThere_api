"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connections = require("../config/connection");
const mongoose_1 = require("mongoose");
const status_1 = require("../services/status");
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true
    },
    attendance: [
        {
            timestamp: {
                type: Date,
                default: new Date()
            },
            monthNubmer: {
                type: String,
                default: new Date().getMonth() + 1
            },
            monthName: {
                type: String,
                default: new Date().toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
            },
            year: {
                type: String,
                default: new Date().getFullYear()
            },
            date: {
                type: String,
                default: new Date().getDate()
            },
            dayNumber: {
                type: String,
                default: new Date().getDay()
            },
            dayName: {
                type: String,
                default: new Date().toDateString().split(' ')[0]
            },
            time: {
                type: String,
                default: new Date().getHours() + ":" + new Date().getMinutes()
            },
            status: {
                type: String,
                default: status_1.default.PRESENT
            }
        }
    ],
}, {
    collection: 'User',
    versionKey: false,
    timestamps: true
});
exports.default = connections.db.model('UserModel', UserSchema);
//# sourceMappingURL=UserModel.js.map