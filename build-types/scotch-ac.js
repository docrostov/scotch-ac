"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const kolmafia_1 = require("kolmafia");
const lib_1 = require("./lib");
function main(target) {
    // This is just a control flow similar to Ezandora's
    if (['king freed', 'kingfreed'].indexOf(target) >= 0) {
        lib_1.kingFreed();
        kolmafia_1.print("You're ready for aftercore!");
    }
}
exports.main = main;
//# sourceMappingURL=scotch-ac.js.map