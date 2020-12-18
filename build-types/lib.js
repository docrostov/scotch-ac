"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nightCap = exports.barfMountain = exports.freeFights = exports.buffUp = exports.runDiet = exports.calculateFarmingTurns = exports.farmPrep = exports.dailies = exports.kingFreed = exports.setProps = exports.getPropertyBoolean = exports.getPropertyInt = exports.setClan = void 0;
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
function getPropertyInt(name) {
    const str = kolmafia_1.getProperty(name);
    if (str === '') {
        throw `Unknown property ${name}.`;
    }
    return kolmafia_1.toInt(str);
}
exports.getPropertyInt = getPropertyInt;
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
// ====================================================================
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
function dailies() {
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
    if (kolmafia_1.myLevel() > 10 && kolmafia_1.getProperty("questS01OldGuy") == "unstarted") {
        kolmafia_1.visitUrl("place.php?whichplace=sea_oldman&action=oldman_oldman", false);
    }
    if (kolmafia_1.getProperty("questS01OldGuy") !== "unstarted") {
        kolmafia_1.useFamiliar(src_1.$familiar `space jellyfish`);
        kolmafia_1.visitUrl('place.php?whichplace=thesea&action=thesea_left2');
    }
    // Visit the chateau potion bar; does this throw errors w/o chateau?
    if (getPropertyBoolean('chateauAvailable') && !getPropertyBoolean('_chateauDeskHarvested') && kolmafia_1.isUnrestricted(src_1.$item `Chateau Mantegna room key`)) {
        kolmafia_1.visitUrl('place.php?whichplace=chateau&action=chateauDesk2');
    }
    // Get your clan VIP swimming item
    kolmafia_1.cliExecute('swim item');
    // Get your free crazy horse
    kolmafia_1.cliExecute('horsery crazy');
    // Request cheesefax fortune stuff 
    while (getPropertyInt("_clanFortuneConsultUses") < 3 && kolmafia_1.isOnline('3038166')) {
        kolmafia_1.cliExecute("fortune cheesefax portza bortman thick");
        kolmafia_1.cliExecute("waitq 5");
    }
    // Check for a defective game grid token
    kolmafia_1.visitUrl('place.php?whichplace=arcade&action=arcade_plumber');
    // Snag mainstat +XP% from the clan shower
    kolmafia_1.cliExecute(`shower ${kolmafia_1.myPrimestat()}`);
    // Use infinite bacon machine & buy a print-screen button
    kolmafia_1.use(1, src_1.$item `infinite bacon machine`);
    kolmafia_1.buy(src_1.$coinmaster `internet meme shop`, 1, src_1.$item `print screen button`);
    // Use etched hourglass for +5 adventures
    kolmafia_1.use(1, src_1.$item `etched hourglass`);
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
    // Visiting Looking Glass in clan VIP lounge
    kolmafia_1.visitUrl('clan_viplounge.php?action=lookingglass&whichfloor=2');
    kolmafia_1.cliExecute('swim item');
    while (getPropertyInt('_genieWishesUsed') < 3) {
        kolmafia_1.cliExecute('genie wish for more wishes');
    }
    if (getPropertyInt('_candySummons') === 0) {
        kolmafia_1.useSkill(1, src_1.$skill `Summon Crimbo Candy`);
    }
    kolmafia_1.useSkill(1, src_1.$skill `Summon Rhinestones`);
    kolmafia_1.useSkill(1, src_1.$skill `Advanced Cocktailcrafting`);
    kolmafia_1.useSkill(1, src_1.$skill `Advanced Saucecrafting`);
    kolmafia_1.useSkill(1, src_1.$skill `Pastamastery`);
    kolmafia_1.useSkill(1, src_1.$skill `Spaghetti Breakfast`);
    kolmafia_1.useSkill(1, src_1.$skill `Grab a Cold One`);
    kolmafia_1.useSkill(1, src_1.$skill `Acquire Rhinestones`);
    kolmafia_1.useSkill(1, src_1.$skill `Prevent Scurvy and Sobriety`);
    kolmafia_1.useSkill(1, src_1.$skill `Perfect Freeze`);
    // Get daily bird
    if (kolmafia_1.availableAmount(src_1.$item `bird-a-day calendar`) > 0 && !kolmafia_1.haveEffect(src_1.$effect `blessing of the bird`)) {
        if (!getPropertyBoolean("_canSeekBirds")) {
            kolmafia_1.use(src_1.$item `bird-a-day calendar`);
        }
    }
    // Set the property to bypass intro on next run.
    kolmafia_1.setProperty('_scotchIntro', '1');
    return "Intro completed.";
}
exports.dailies = dailies;
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
    return 610;
}
exports.calculateFarmingTurns = calculateFarmingTurns;
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
function freeFights() {
}
exports.freeFights = freeFights;
function barfMountain() {
}
exports.barfMountain = barfMountain;
function nightCap() {
}
exports.nightCap = nightCap;
//# sourceMappingURL=lib.js.map