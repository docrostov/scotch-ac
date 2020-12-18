"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const kolmafia_1 = require("kolmafia");
const lib_1 = require("./lib");
// Import package info
var packageData = require('../package.json');
function main(target) {
    // This is just a control flow similar to Ezandora's.
    if (['king freed', 'kingfreed'].indexOf(target) >= 0) {
        lib_1.kingFreed();
        kolmafia_1.print("You're ready for aftercore!");
    }
    if (['help', 'faq', 'assist'].indexOf(target) >= 0) {
        kolmafia_1.print("=========================================");
        kolmafia_1.print(` >>>>>>>> ${packageData.name} v${packageData.version} `);
        kolmafia_1.print("=========================================");
        kolmafia_1.print("");
        kolmafia_1.print("scotchac king freed");
        kolmafia_1.print("   > Pull from hagnks and get aftercore prep flags done.");
    }
}
exports.main = main;
//# sourceMappingURL=main.js.map