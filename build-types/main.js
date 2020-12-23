"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.printHelp = void 0;
const kolmafia_1 = require("kolmafia");
const lib_1 = require("./lib");
const src_1 = require("libram/src");
function printHelp() {
    // Import package info like version # & name
    var packageData = require('../package.json');
    kolmafia_1.print("=========================================");
    kolmafia_1.print(` >>>>>>>> ${packageData.name} v${packageData.version} `);
    kolmafia_1.print("=========================================");
    kolmafia_1.print("");
    kolmafia_1.print("scotchac king freed");
    kolmafia_1.print("   > Pull from hagnks and get aftercore prep flags done.");
    kolmafia_1.print("scotchac farm");
    kolmafia_1.print("   > Run the farming module; does >600 turns of barf farming.");
}
exports.printHelp = printHelp;
function main(target = '') {
    // Using a control flow to call scripts
    if (['king freed', 'kingfreed'].indexOf(target) >= 0) {
        lib_1.kingFreed();
    }
    else if (['help', 'faq', 'assist', , ""].indexOf(target) >= 0) {
        printHelp();
    }
    else if (['farm'].indexOf(target) >= 0) {
        lib_1.dailies(); // Daily actions
        lib_1.farmPrep(); // Prep for barf farming
        lib_1.runDiet(); // Diet management
        lib_1.buffUp(); // Buff up for the whole day because I hate moods
        lib_1.freeFights(); // Run all free fights
        lib_1.barfMountain(); // Run barf mountain stuff
        lib_1.nightCap(); // Nightcap it
    }
    else if (['buff'].indexOf(target) >= 0) {
        lib_1.buffUp();
    }
    else if (['props'].indexOf(target) >= 0) {
        lib_1.setProps();
    }
    else if (['freeFights'].indexOf(target) >= 0) {
        lib_1.freeFights();
    }
    else if (['level'].indexOf(target) >= 0) {
        throw "Leveling not installed yet.";
    }
    else if (['equipSea'].indexOf(target) >= 0) {
        lib_1.farmEquipBuilder(1000, src_1.$item `Mer-Kin Gladiator Mask`);
    }
    else if (['equipBarf'].indexOf(target) >= 0) {
        lib_1.farmEquipBuilder(250);
    }
    else if (['equipFree'].indexOf(target) >= 0) {
        lib_1.farmEquipBuilder(25);
    }
    else if (['kramco'].indexOf(target) >= 0) {
        kolmafia_1.print(`Your % chance of a Kramco is currently ${lib_1.kramcoPercent()}`);
    }
    else {
        throw "That command didn't work. Try 'help'.";
    }
}
exports.main = main;
//# sourceMappingURL=main.js.map