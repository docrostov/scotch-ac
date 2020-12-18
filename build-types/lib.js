"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buffUp = exports.runDiet = exports.getPropertyBoolean = exports.calculateFarmingTurns = exports.farmPrep = exports.intro = exports.kingFreed = exports.setProps = exports.setClan = void 0;
const kolmafia_1 = require("kolmafia");
const src_1 = require("libram/src");
const clanCache = {};
function setClan(target) {
    // Script from bean to set a user's clan to something else
    if (kolmafia_1.getClanName() !== target) {
        if (clanCache[target] === undefined) {
            const recruiter = kolmafia_1.visitUrl('clan_signup.php');
            const clanRe = /<option value=([0-9]+)>([^<]+)<\/option>/g;
            let result;
            while ((result = clanRe.exec(recruiter)) !== null) {
                clanCache[result[2]] = parseInt(result[1], 10);
            }
        }
        kolmafia_1.visitUrl(`showclan.php?whichclan=${clanCache[target]}&action=joinclan&confirm=on&pwd`);
        if (kolmafia_1.getClanName() !== target) {
            kolmafia_1.abort(`failed to switch clans to ${target}. Did you spell it correctly? Are you whitelisted?`);
        }
    }
    return true;
}
exports.setClan = setClan;
function setProps() {
    // Function to set up relevant scotch-ac properties.
    kolmafia_1.setProperty('_scotchIntro', '0');
}
exports.setProps = setProps;
function kingFreed() {
    // Things to run after ending an ascension & entering
    //   aftercore. Lots of random nonsense.
    // Generate a runlog via scotchlog; only do it for runs 
    //   that are <1000 turns, though.
    if (kolmafia_1.myTurncount() < 1000) {
        kolmafia_1.cliExecute('scotchlog parse');
    }
    // Pull everything from hagnks
    kolmafia_1.cliExecute('pull all');
    // Enable auto-recovery
    kolmafia_1.setProperty('hpAutoRecovery', '0.8');
    kolmafia_1.setProperty('manaBurningThreshold', '-0.05');
}
exports.kingFreed = kingFreed;
function intro() {
    // This section begins your day; it's effectively a more
    //   compressed version of mafia's "breakfast" script. 
    if (kolmafia_1.getProperty('_scotchIntro') == '1') {
        // Exit the intro if you've already completed it.
        return "Intro already complete!";
    }
    // Ensure I'm in the right clan
    setClan('Bonus Adventures from Hell');
    // STEP 1: GAIN PASSIVE RESOURCES ======================
    // Harvest your daily sea jelly
    kolmafia_1.useFamiliar(src_1.$familiar `space jellyfish`);
    kolmafia_1.visitUrl('place.php?whichplace=thesea&action=thesea_left2');
    // Visit the chateau potion bar; does this throw errors w/o chateau?
    kolmafia_1.visitUrl('place.php?whichplace=chateau&action=chateauDesk2');
    // Get your clan VIP swimming item
    kolmafia_1.cliExecute('swim item');
    // Check for a defective game grid token
    // Snag mainstat +XP% from the clan shower
    // Use infinite bacon machine & buy a print-screen button
    // Use etched hourglass for +5 adventures
    // STEP 2: MAKE CHOICES ================================
    // Add familiar weight to your cosplay saber
    if (kolmafia_1.availableAmount(src_1.$item `Fourth of May Cosplay Saber`) > 0) {
        kolmafia_1.visitUrl('main.php?action=may4');
        kolmafia_1.runChoice(4);
    }
    // Set boombox to meat.
    if (kolmafia_1.getProperty('boomBoxSong') !== 'Total Eclipse of Your Meat') {
        kolmafia_1.cliExecute('boombox meat');
    }
    // STEP 3: SUMMONS =====================================
    // Tome summons
    // Deck summons; mana, mana. Reserve one for Robort.
    // Pocket wishes
    // Summon rhinestones
    // Prevent scurvy/sobriety
    // Summon crimbo candy
    // Grab a cold one
    // Perfect freeze
    // Advanced cocktailcrafting
    // Pastamastery
    // Saucecrafting
    // Holiday Fun
    // Set the property to bypass intro on next run.
    kolmafia_1.setProperty('_scotchIntro', '1');
    return "Intro completed.";
}
exports.intro = intro;
function farmPrep() {
    // This function does purchases to set up for farming
    // Purchase a dinseylandfill ticket, use it / get free FunFunds
    // Purchase robort drinks & feed them to robort
    // Set up mumming trunk nonsense
    // 
}
exports.farmPrep = farmPrep;
function calculateFarmingTurns() {
    // Assess farming turns given available resources.
}
exports.calculateFarmingTurns = calculateFarmingTurns;
function getPropertyBoolean(name, default_ = null) {
    // Helper functions from Bean re: 
    const str = kolmafia_1.getProperty(name);
    if (str === '') {
        if (default_ === null)
            kolmafia_1.abort(`Unknown property ${name}.`);
        else
            return default_;
    }
    return str === 'true';
}
exports.getPropertyBoolean = getPropertyBoolean;
function runDiet() {
    // Diet is relatively manual right now. Go full hobo for 
    //   food/booze, spend as much as you need on synth, go 
    //   transdermal smoke patches for spleen remainder.
    //   Eventually implement "value of adv" calculator and
    //   other options to help improve this. 
    // Check barrelprayer buff and utilize if it's good.
    // Use dirt julep on mime shotglass booze
    if (getPropertyBoolean("_mimeArmyShotglassUsed") != true) {
        if (kolmafia_1.drink(src_1.$item `Dirt Julep`)) {
            kolmafia_1.setProperty("_mimeArmyShotglassUsed", "true");
        }
    }
}
exports.runDiet = runDiet;
function buffUp() {
    // This function buffs you up for meatfarming
    // Get "free" beach-head familiar buff
    // Get witchess buff
    // Get clan "aggressive" buffs
    // Get mad tea party buff
    // Get meat.enh buffs
    // Get KGB buffs
    // Get defective game grid buff
    // Get zatara meatsmith buff
    // Summon otep'vekxen
    // Get ballpit buff
}
exports.buffUp = buffUp;
//# sourceMappingURL=lib.js.map