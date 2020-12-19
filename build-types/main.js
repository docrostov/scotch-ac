"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.printHelp = void 0;
const kolmafia_1 = require("kolmafia");
const lib_1 = require("./lib");
function printHelp() {
    // Import package info like version # & name
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
    let t = target.toLowerCase();
    kolmafia_1.print("t");
    lib_1.dailies();
    lib_1.calculateFarmingTurns();
    lib_1.farmPrep();
    lib_1.runDiet();
    lib_1.buffUp();
    lib_1.freeFights();
    lib_1.barfMountain();
    lib_1.nightCap();
    // I want to make a control flow at some point but for now I just want something functional.
    // Using a control flow to call scripts
    // if (['king freed', 'kingfreed'].indexOf(t) >= 0) {
    //   kingFreed();
    //   return "You're ready for aftercore!";
    // } else if (['help', 'faq', 'assist', , ""].indexOf(t) >= 0){
    //   printHelp();
    // } else if (['farm'].indexOf(t) >= 0){
    //   throw "Farming not installed yet.";
    // } else if (['buff'].indexOf(t) >= 0){
    //   throw "Buffing not installed yet.";
    // } else if (['freeFights'].indexOf(t) >= 0){
    //   throw "Free Fights not installed yet.";
    // } else if (['level'].indexOf(t) >= 0){
    //   throw "Leveling not installed yet.";
    // } else {
    //   throw "That command didn't work. Try 'help'."
    // }
}
exports.main = main;
//# sourceMappingURL=main.js.map