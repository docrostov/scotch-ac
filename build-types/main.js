"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.printHelp = void 0;
const kolmafia_1 = require("kolmafia");
const lib_1 = require("./lib");
function printHelp() {
    // Import package info
    var packageData = require('../package.json');
    kolmafia_1.print("=========================================");
    kolmafia_1.print(` >>>>>>>> ${packageData.name} v${packageData.version} `);
    kolmafia_1.print("=========================================");
    kolmafia_1.print("");
    kolmafia_1.print("scotchac king freed");
    kolmafia_1.print("   > Pull from hagnks and get aftercore prep flags done.");
}
exports.printHelp = printHelp;
function main(target) {
    target = target.toLowerCase();
    // This is just a control flow similar to Ezandora's.
    if (['king freed', 'kingfreed'].indexOf(target) >= 0) {
        lib_1.kingFreed();
        kolmafia_1.print("You're ready for aftercore!");
    }
    kolmafia_1.print("testing");
    if (['help', 'faq', 'assist'].indexOf(target) >= 0) {
        printHelp();
    }
    return "hello?";
}
exports.main = main;
//# sourceMappingURL=main.js.map