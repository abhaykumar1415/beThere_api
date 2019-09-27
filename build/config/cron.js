"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const TEST_CRON_INTERVAL = '* 1 * * * *';
/**
 * @export
 * @class Cron
 */
class Cron {
    /**
     * @private
     * @static
     * @memberof Cron
     */
    static testCron() {
        new cron_1.CronJob(TEST_CRON_INTERVAL, () => {
            console.log('Hello, I am Cron! Please see ../config/cron.ts');
        }, null, true);
    }
    /**
     * @static
     * @memberof Cron
     */
    static init() {
        // Cron.testCron();
    }
}
exports.default = Cron;
//# sourceMappingURL=cron.js.map