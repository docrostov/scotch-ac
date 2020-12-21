"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nightCap = exports.barfMountain = exports.freeFights = exports.farmEquipBuilder = exports.buffUp = exports.runDiet = exports.fillSpleen = exports.calculateFarmingTurns = exports.farmPrep = exports.dailies = exports.kingFreed = exports.setProps = exports.farmCastSkill = exports.useLimitedItem = exports.useLimitedSkill = exports.setPropertyInt = exports.getPropertyBoolean = exports.getPropertyInt = exports.tryEnsureEffect = exports.ensureEffect = exports.setClan = void 0;
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
function ensureEffect(ef, turns = 1) {
    if (!tryEnsureEffect(ef, turns)) {
        kolmafia_1.abort('Failed to get effect ' + ef.name + '.');
    }
}
exports.ensureEffect = ensureEffect;
function tryEnsureEffect(ef, turns = 1) {
    if (kolmafia_1.haveEffect(ef) < turns) {
        return kolmafia_1.cliExecute(ef.default) && kolmafia_1.haveEffect(ef) > 0;
    }
    return true;
}
exports.tryEnsureEffect = tryEnsureEffect;
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
function setPropertyInt(name, value) {
    kolmafia_1.setProperty(name, value.toString());
}
exports.setPropertyInt = setPropertyInt;
function useLimitedSkill(prop, currSkill, casts = 1) {
    // Function for using limited use skills if you hit a condition. I am
    //   using this to check properties before casting the skill. 
    if (kolmafia_1.getProperty(prop) === '0' || kolmafia_1.getProperty(prop) === "false") {
        if (kolmafia_1.haveSkill(currSkill))
            return kolmafia_1.useSkill(currSkill, casts); // useSkill throws a boolean
    }
    return false; // False if it didn't hit it.
}
exports.useLimitedSkill = useLimitedSkill;
function useLimitedItem(prop, currItem, number = 1) {
    // Function for using limited use items if you hit a condition. I am
    //   using this to check properties before using the items. 
    if (kolmafia_1.getProperty(prop) === '0' || kolmafia_1.getProperty(prop) === "false") {
        if (kolmafia_1.availableAmount(currItem) > 0)
            return kolmafia_1.use(number, currItem); // use throws a boolean
    }
    return false; // False if it didn't hit it.
}
exports.useLimitedItem = useLimitedItem;
function farmCastSkill(sk) {
    // Function that ensures you have enough of X skill to cover the whole farmday.
    while (kolmafia_1.haveEffect(kolmafia_1.toEffect(sk)) < calculateFarmingTurns()) {
        if (kolmafia_1.myMp() < kolmafia_1.mpCost(sk))
            kolmafia_1.eat(src_1.$item `magical sausage`); // sausage for regen!
        let currTurns = kolmafia_1.haveEffect(kolmafia_1.toEffect(sk));
        kolmafia_1.useSkill(sk, 1);
        if (currTurns === kolmafia_1.haveEffect(kolmafia_1.toEffect(sk))) {
            // This checks if your "useSkill" didn't work, and throws an error.
            throw (`ERROR: Your farmCastSkill module has failed on skill = ${sk}`);
        }
    }
}
exports.farmCastSkill = farmCastSkill;
// ====================================================================
function setProps() {
    // Function to set up relevant scotch-ac properties.
    kolmafia_1.setProperty('_scotchIntro', '0');
    kolmafia_1.setProperty('_scotchPrepped', '0');
    kolmafia_1.setProperty('_scotchBuffed', '0');
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
    //   compressed version of mafia's "breakfast" script. I
    //   am adding property comparisons whenever possible to
    //   try and make this stupid thing as error-proof as I 
    //   possibly can.
    if (kolmafia_1.getProperty('_scotchIntro') == '1') {
        // Exit the intro if you've already completed it.
        return "Intro already complete!";
    }
    // Ensure I'm in the right clan
    setClan('Bonus Adventures from Hell');
    // STEP 1: GAIN PASSIVE RESOURCES ======================
    // Harvest your daily sea jelly; check your old man, if needed
    if (kolmafia_1.myLevel() > 10 && kolmafia_1.getProperty("questS01OldGuy") == "unstarted") {
        kolmafia_1.visitUrl("place.php?whichplace=sea_oldman&action=oldman_oldman", false);
    }
    if (kolmafia_1.getProperty("questS01OldGuy") !== "unstarted") {
        if (!getPropertyBoolean("_seaJellyHarvested")) {
            kolmafia_1.useFamiliar(src_1.$familiar `space jellyfish`);
            kolmafia_1.visitUrl('place.php?whichplace=thesea&action=thesea_left2');
            kolmafia_1.runChoice(1);
        }
    }
    // Visit the chateau potion bar; does this throw errors w/o chateau?
    if (getPropertyBoolean('chateauAvailable') && !getPropertyBoolean('_chateauDeskHarvested')) {
        kolmafia_1.visitUrl('place.php?whichplace=chateau&action=chateauDesk2');
    }
    // Get your clan VIP swimming item
    if (!getPropertyBoolean('_olympicSwimmingPoolItemFound'))
        kolmafia_1.cliExecute('swim item');
    // Apply crazy horse, even if it costs meat, because it's ideal for barf farming.
    kolmafia_1.cliExecute('horsery crazy');
    // Request cheesefax fortune stuff; not really -needed- but I like the shot at a skillbook.
    while (getPropertyInt("_clanFortuneConsultUses") < 3 && kolmafia_1.isOnline('3038166')) {
        kolmafia_1.cliExecute("fortune cheesefax portza bortman thick");
        kolmafia_1.cliExecute("waitq 5");
    }
    // Check for a defective game grid token
    if (!getPropertyBoolean('_defectiveTokenChecked')) {
        kolmafia_1.visitUrl('place.php?whichplace=arcade&action=arcade_plumber', false);
    }
    // Snag mainstat +XP% from the clan shower
    if (!getPropertyBoolean('_aprilShower'))
        kolmafia_1.cliExecute(`shower ${kolmafia_1.myPrimestat()}`);
    // Use infinite bacon machine & buy a print-screen button. Note that
    //   the IBM gives you 100 per day and the button costs 111; I have 
    //   roughly 30,000 bacon in reserve, so I have no real issue with 
    //   ignoring that 11 bacon overage, but YMMV.
    useLimitedItem('_baconMachineUsed', src_1.$item `infinite bacon machine`);
    kolmafia_1.buy(src_1.$coinmaster `internet meme shop`, 1, src_1.$item `print screen button`);
    // Use etched hourglass for +5 adventures
    useLimitedItem('_etchedHourglassUsed', src_1.$item `etched hourglass`);
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
    // Tome summons; my old script had a big price-check thing,
    //   now I am literally just going to summon 3x fam jacks
    //   until I have time to do a full refactor here.
    while (getPropertyInt("_clipartSummons") < 3) {
        kolmafia_1.create(1, src_1.$item `Box of Familiar Jacks`);
    }
    // While you're at it, get your amulet coin
    kolmafia_1.useFamiliar(src_1.$familiar `Cornbeefadon`);
    kolmafia_1.use(src_1.$item `Box of Familiar Jacks`);
    // Doing two deck summons; mana, mana. Reserve one for Robort feliz-fishing.
    while (getPropertyInt('_deckCardsDrawn') < 10) {
        // This should, in theory, always get you to 10 deck draws. 
        if (!kolmafia_1.getProperty('_deckCardsSeen').includes('Island'))
            kolmafia_1.cliExecute('cheat island');
        if (!kolmafia_1.getProperty('_deckCardsSeen').includes('Ancestral Recall'))
            kolmafia_1.cliExecute('cheat ancestral recall');
    }
    // Visiting Looking Glass in clan VIP lounge
    if (getPropertyBoolean('_lookingGlass'))
        kolmafia_1.visitUrl('clan_viplounge.php?action=lookingglass&whichfloor=2');
    // Snagging three pocket wishes every day
    while (getPropertyInt('_genieWishesUsed') < 3) {
        kolmafia_1.cliExecute('genie wish for more wishes');
    }
    // Cast your summonables; I am comparing against preferences for these. That
    //   isn't always strictly required, but I've found that mafia occasionally
    //   grumbles if you try and cast something you can't, so this helps handle
    //   if you already used some of it and keep the script usable.
    useLimitedSkill('cocktailSummons', src_1.$skill `Advanced Cocktailcrafting`);
    useLimitedSkill('reagentSummons', src_1.$skill `Advanced Saucecrafting`);
    useLimitedSkill('noodleSummons', src_1.$skill `Pastamastery`);
    useLimitedSkill('_candySummons', src_1.$skill `Summon Crimbo Candy`);
    useLimitedSkill('_perfectFreezeUsed', src_1.$skill `Perfect Freeze`);
    useLimitedSkill('_spaghettiBreakfast', src_1.$skill `Spaghetti Breakfast`);
    useLimitedSkill('_coldOne', src_1.$skill `Grab a Cold One`);
    useLimitedSkill('_incredibleSelfEsteemCast', src_1.$skill `Incredible Self-Esteem`);
    useLimitedSkill('_rhinestonesAcquired', src_1.$skill `Acquire Rhinestones`);
    useLimitedSkill('_preventScurvy', src_1.$skill `Prevent Scurvy and Sobriety`);
    // Use a few 1-per-day items. Once again, using the limitedUse syntax in a 
    //   tiny custom function. Thanks to Rev for recommending the pref change.
    useLimitedItem('_warbearBreakfastMachineUsed', src_1.$item `warbear breakfast machine`);
    useLimitedItem('_warbearSodaMachineUsed', src_1.$item `warbear soda machine`);
    useLimitedItem('_bagOfCandyUsed', src_1.$item `Chester's bag of candy`);
    useLimitedItem('_milkOfMagnesiumUsed', src_1.$item `milk of magnesium`);
    useLimitedItem('_glennGoldenDiceUsed', src_1.$item `Glenn's Golden Dice`);
    useLimitedItem('_fishyPipeUsed', src_1.$item `fishy pipe`);
    // There is currently no preference for Universal Seasoning.
    kolmafia_1.use(src_1.$item `Universal Seasoning`);
    // Daily voting. Requires Ezandora's Voting Booth script
    //   svn checkout https://github.com/Ezandora/Voting-Booth/trunk/Release/
    kolmafia_1.cliExecute('VotingBooth.ash');
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
    if (kolmafia_1.getProperty('_scotchPrepped') == '1') {
        // Exit the intro if you've already completed it.
        return "Farm prep already complete!";
    }
    // Purchase a dinseylandfill ticket, use it / get free FunFunds
    kolmafia_1.buy(1, src_1.$item `one-day ticket to Dinseylandfill`);
    kolmafia_1.use(1, src_1.$item `one-day ticket to Dinseylandfill`);
    // Get free funfunds from turning in park garbage. Like with BACON, I
    //   kind of always have some in reserve, so this basically always works,
    //   but I should probably add a check in here to ensure I have some.
    kolmafia_1.visitUrl("place.php?whichplace=airport_stench&intro=1");
    kolmafia_1.visitUrl("place.php?whichplace=airport_stench&action=airport3_tunnels");
    kolmafia_1.runChoice(6);
    // Set up mumming trunk meat drop on my robortender
    kolmafia_1.useFamiliar(src_1.$familiar `Robortender`);
    kolmafia_1.cliExecute('mummery meat');
    // Purchase robort drinks & feed them to robort; need to compare ingredient 
    //   to the drink like old ash script, but for now I'm just going to be lazy.
    let roboDrinks = ['newark', 'single entendre', 'drive-by shooting', 'bloody nora'];
    roboDrinks.forEach(function (value) {
        kolmafia_1.buy(1, src_1.$item `${value}`);
        kolmafia_1.cliExecute(`robo ${value}`);
    });
    // Get bastille nonsense done with. Requires Ezandora's Bastille script.
    //   svn checkout https://github.com/Ezandora/Bastille/branches/Release/
    kolmafia_1.cliExecute('bastille babar draftsman gesture sharks');
    // Set the property to bypass farmPrep on next run.
    kolmafia_1.setProperty('_scotchPrepped', '1');
    return "Intro completed.";
}
exports.farmPrep = farmPrep;
function calculateFarmingTurns() {
    // Assess farming turns given available resources. Currently
    //   just going to use an approximation; I'm making this a 
    //   function so that I can make it more effective later!
    return 635;
}
exports.calculateFarmingTurns = calculateFarmingTurns;
function fillSpleen() {
    // Fills spleen point by point according to the priority of:
    //   #1: synthesis (until CalcFarmingTurns is hit)
    //   #2: beggin cologne (just one)
    //   #3: transdermal smoke patches
    while (kolmafia_1.mySpleenUse() < kolmafia_1.spleenLimit()) {
        let spleenLeft = kolmafia_1.spleenLimit() - kolmafia_1.mySpleenUse();
        if (kolmafia_1.haveEffect(src_1.$effect `Synthesis: Greed`) < calculateFarmingTurns()) {
            kolmafia_1.buy(src_1.$item `sugar sheet`, 2);
            kolmafia_1.cliExecute('create sugar chapeau');
            kolmafia_1.cliExecute('create sugar shillelagh');
            kolmafia_1.sweetSynthesis(src_1.$item `sugar chapeau`, src_1.$item `sugar shillelagh`);
        }
        else if (kolmafia_1.haveEffect(src_1.$effect `Eau d' Clochard`) < 10) {
            kolmafia_1.buy(src_1.$item `beggin' cologne`, 1);
            kolmafia_1.chew(src_1.$item `beggin' cologne`, 1);
        }
        else {
            kolmafia_1.buy(src_1.$item `transdermal smoke patch`, spleenLeft);
            kolmafia_1.chew(src_1.$item `transdermal smoke patch`, spleenLeft);
        }
    }
}
exports.fillSpleen = fillSpleen;
function runDiet() {
    // Diet is relatively manual right now. Go full hobo for 
    //   food/booze, spend as much as you need on synth, go 
    //   transdermal smoke patches for spleen remainder.
    //   Eventually implement "value of adv" calculator and
    //   other options to help improve this. 
    // Start by filling spleen up.
    fillSpleen();
    // Check barrelprayer buff and utilize if it's good.
    // Use dirt julep on mime shotglass booze
    if (getPropertyBoolean("_mimeArmyShotglassUsed") != true) {
        if (kolmafia_1.drink(src_1.$item `Dirt Julep`))
            kolmafia_1.setProperty("_mimeArmyShotglassUsed", "true");
    }
    // Drink up!
    while (kolmafia_1.inebrietyLimit() - kolmafia_1.myInebriety() > 4) {
        ensureEffect(src_1.$effect `Ode to Booze`);
        kolmafia_1.buy(src_1.$item `Frosty's Frosty Mug`, 1);
        kolmafia_1.buy(src_1.$item `jar of fermented pickle juice`, 1);
        kolmafia_1.drink(src_1.$item `Frosty's Frosty Mug`, 1);
        kolmafia_1.drink(src_1.$item `jar of fermented pickle juice`, 1);
        fillSpleen();
    }
    // Drink up!
    while (kolmafia_1.fullnessLimit() - kolmafia_1.myFullness() > 4) {
        kolmafia_1.buy(src_1.$item `Special Seasoning`, 1);
        kolmafia_1.buy(src_1.$item `Ol' Scratch's Salad Fork`, 1);
        kolmafia_1.buy(src_1.$item `extra-greasy slider`, 1);
        kolmafia_1.eat(src_1.$item `Ol' Scratch's Salad Fork`, 1);
        kolmafia_1.eat(src_1.$item `extra-greasy slider`, 1);
        fillSpleen();
    }
    kolmafia_1.equip(src_1.$item `tuxedo shirt`);
    // Finish filling drinks
    while (kolmafia_1.inebrietyLimit() - kolmafia_1.myInebriety() > 0) {
        ensureEffect(src_1.$effect `Ode to Booze`);
        kolmafia_1.buy(src_1.$item `splendid martini`, 1);
        kolmafia_1.drink(src_1.$item `splendid martini`, 1);
    }
    // TO-DO: add distention/doghair pills here ////////////////////////////////////////////////
}
exports.runDiet = runDiet;
function buffUp() {
    // This function buffs you up for meatfarming, both with castable 
    //   buffs, Buffbot stuff, 1/day buffs, etc.
    // Here are the AT buffs we -want- for barf farming.
    const wantedATBuffs = [
        src_1.$effect `Fat Leon's Phat Loot Lyric`,
        src_1.$effect `Polka of Plenty`,
        src_1.$effect `The Ballad of Richie Thingfinder`,
        src_1.$effect `Chorale of Companionship`,
    ];
    // Start by shrugging off unwanted AT buffs. myEffects() is an ASH
    //   array, so it needs to be handled a bit differently by taking
    //   the effect name out and converting it into an $effect`` via 
    //   dark and eldritch magick.
    for (const efName of Object.keys(kolmafia_1.myEffects())) {
        const currEffect = Effect.get(efName);
        if (kolmafia_1.toSkill(currEffect).class == src_1.$class `Accordion Thief`) {
            if (!(wantedATBuffs.includes(currEffect))) {
                kolmafia_1.cliExecute('shrug ' + currEffect.name);
            }
        }
    }
    // Attempt to get buffy rolling, then wait to give buffy to proc.
    kolmafia_1.cliExecute("send to buffy || 500 bull hell thrill jingle reptil tenaci empathy elemental polka phat");
    kolmafia_1.waitq(10);
    kolmafia_1.refreshStatus();
    // Get "free" beach-head familiar buff, then use remaining combs.
    //   This script requires Veracity's beachComber, located here:
    // https://kolmafia.us/threads/beachcomber-fast-and-efficient-beach-combing.23993/
    ensureEffect(src_1.$effect `Do I Know You From Somewhere?`);
    kolmafia_1.cliExecute('beachcomber 0');
    // Get witchess buff
    ensureEffect(src_1.$effect `Puzzle Champ`);
    // Get clan "aggressive" buffs; probably fails if you don't have VIP access?
    while (getPropertyInt('_poolGames') < 3) {
        kolmafia_1.cliExecute('pool billiards');
    }
    // Get mad tea party buff
    ensureEffect(src_1.$effect `Dances with Tweedles`);
    // Get meat.enh buffs
    while (getPropertyInt('_sourceTerminalEnhanceUses') < 3)
        kolmafia_1.cliExecute('terminal enhance meat.enh');
    // Get KGB buffs
    while (getPropertyInt('_kgbClicksUsed') < 21)
        kolmafia_1.cliExecute('briefcase buff meat');
    // Get defective game grid buff
    if (!getPropertyBoolean('_defectiveTokenUsed'))
        kolmafia_1.use(1, src_1.$item `defective Game Grid token`);
    // Get zatara meatsmith buff
    ensureEffect(src_1.$effect `Meet the Meat`);
    // Summon otep'vekxen
    ensureEffect(src_1.$effect `Preternatural Greed`);
    // Get ballpit buff
    ensureEffect(src_1.$effect `Having a Ball!`);
    // Get triple-sized for stat purposes.
    kolmafia_1.useSkill(1, src_1.$skill `CHEAT CODE: Triple Size`);
    // Get bird buffs; do not re-favorite birds, fav bird is fine.
    if (kolmafia_1.availableAmount(src_1.$item `bird-a-day calendar`) > 0) {
        kolmafia_1.useSkill(7 - getPropertyInt("_birdsSoughtToday"), src_1.$skill `seek out a bird`);
    }
    // Get the daycare buff. Doing myst for +items/mp.
    if (getPropertyBoolean('_daycareToday') && !getPropertyBoolean('_daycareSpa'))
        kolmafia_1.cliExecute('daycare mysticality');
    // Max cast a few key farming skills.
    farmCastSkill(src_1.$skill `Disco Leer`);
    farmCastSkill(src_1.$skill `The Spirit of Taking`);
    farmCastSkill(src_1.$skill `Leash of Linguini`);
    farmCastSkill(src_1.$skill `Empathy of the Newt`);
    farmCastSkill(src_1.$skill `Singer's Faithful Ocelot`);
    farmCastSkill(src_1.$skill `The Polka of Plenty`);
    farmCastSkill(src_1.$skill `Fat Leon's Phat Loot Lyric`);
    // Max cast skills that are not -that- useful, but are worth having on.
    farmCastSkill(src_1.$skill `Get Big`);
    while (kolmafia_1.haveEffect(src_1.$effect `Blood Bond`) < calculateFarmingTurns()) {
        if (kolmafia_1.myHp() < 1000)
            kolmafia_1.restoreHp(1000); // Restore if needed
        kolmafia_1.useSkill(src_1.$skill `Blood Bond`, 30);
    }
    while (kolmafia_1.haveEffect(src_1.$effect `Blood Bubble`) < calculateFarmingTurns()) {
        if (kolmafia_1.myHp() < 1000)
            kolmafia_1.restoreHp(1000); // Restore if needed
        kolmafia_1.useSkill(src_1.$skill `Blood Bubble`, 30);
    }
    // Ensure you have asdon driving observantly all day. Requires Ezandora's
    //   asdonmartin script, I believe, although I'm not positive.
    while (kolmafia_1.haveEffect(src_1.$effect `Driving Observantly`) < calculateFarmingTurns()) {
        kolmafia_1.cliExecute('asdonmartin drive observantly');
    }
    // Ensure you have turns of How to Avoid Scams all day.
    while (kolmafia_1.haveEffect(src_1.$effect `How to Scam Tourists`) < calculateFarmingTurns()) {
        kolmafia_1.use(src_1.$item `How to Avoid Scams`, 10);
    }
    // Heal up so that you are ready for free fights. 
    kolmafia_1.restoreHp(kolmafia_1.myMaxhp());
}
exports.buffUp = buffUp;
function farmEquipBuilder(meatDrop = 250, ...priorityItems) {
    // This is an equipment builder I can use to ensure my character is 
    //   equipping the right stuff for each part of my farm script. I 
    //   have based this partly on how Dictator's farm script builds his
    //   loadouts, but it is a bit more compact.
    // Essentially, the script assigns a "score" for each item. I am using
    //   rough approximation of the equipment's net MPA. Monster base drop
    //   is modified with the meatDrop parameter. The script will add all
    //   "priority items" into the value array with very high values to
    //   ensure they're always picked. 
    // For free fights, I set meatDrop = 0. This isn't strictly true, but
    //   it's close enough, as 90% of free fights either have enough meat
    //   to hit the 1000 meat free fight cap or so little that meat% equip
    //   is just not worth wearing. Value of familiar weight is based on
    //   accessing myFamiliar() to determine if you have a meat fam. 
    // As I get better at JS, I expect I will try to update with better 
    //   valuation calculators on different equipment. For now, this is
    //   basically fine though. 
    // Example calls:
    //   farmEquipBuilder(69,$item`Kramco Sausage-o-Matic&trade;`)
    //   farmEquipBuilder(1000,$item`Mer-Kin Gladiator Mask`)
    // First off, code in the lep meat drop calc.
    const baseWeight = 20 + 5 + 5 + 5 + 5 + 20; // base 20 + leash + empathy + sympathy + beach buff + witchess
    const lepCalc = (Math.pow(220 * baseWeight, 0.5) + 2 * baseWeight - 6) / 100;
    let perPoundFamBonus = 0;
    // Modify fam bonus based on type of fam equipped
    if (kolmafia_1.myFamiliar() === src_1.$familiar `robortender`) {
        perPoundFamBonus = (lepCalc * 2.00) / baseWeight;
    }
    else if (kolmafia_1.myFamiliar() === src_1.$familiar `hobo monkey`) {
        perPoundFamBonus = (lepCalc * 1.25) / baseWeight;
    }
    else if (src_1.$familiars `cornbeefadon, leprechaun`.includes(kolmafia_1.myFamiliar())) {
        // I need to add more lep familiars.
        perPoundFamBonus = (lepCalc * 1.00) / baseWeight;
    }
    // Now let's try to assess equipment value. I am hardcoding in equips because
    //   I do not want the script to be running Maximizer all the time.
    let itemValue = {
        // FAMILIAR WEIGHT ITEMS
        'plexiglass pith helmet': 5 * perPoundFamBonus * meatDrop,
        'crumpled felt fedora': 10 * perPoundFamBonus * meatDrop,
        'Fourth of May cosplay saber': 10 * perPoundFamBonus * meatDrop,
        "Great Wolf's beastly trousers": 10 * perPoundFamBonus * meatDrop,
        'Belt of Loathing': 10 * perPoundFamBonus * meatDrop,
        "Stephen's Lab Coat": 5 * perPoundFamBonus * meatDrop,
        "Beach Comb": 5 * perPoundFamBonus * meatDrop,
        "Amulet Coin": 5 * perPoundFamBonus * meatDrop,
        // MEAT DROP ITEMS
        "wad of used tape": 0.30 * meatDrop,
        "garbage sticker": 0.30 * meatDrop,
        "Cloak of Dire Shadows": 0.30 * meatDrop,
        "ring of the Skeleton Lord": 0.50 * meatDrop + 10,
        "Wormwood Wedding Ring": 0.50 * meatDrop,
        'carpe': 0.60 * meatDrop,
        // MIXED ITEMS
        "latte lovers member's mug": kolmafia_1.numericModifier(src_1.$item `latte lovers member's mug`, "Familiar Weight") * perPoundFamBonus * meatDrop + kolmafia_1.numericModifier(src_1.$item `latte lovers member's mug`, "Meat Drop") * meatDrop / 100,
        // SPECIAL ITEMS
        'Pantsgiving': getPropertyInt('_pantsgivingFullness') > 2 ? 0.30 * meatDrop : 950,
        'Enhanced Signal Receiver': getPropertyInt('_scotchFreeFights') === 1 ? 950 : 0,
        'ittah bittah hookah': getPropertyInt('_scotchFreeFights') === 1 ? 950 : 0,
        'mafia thumb ring': getPropertyInt('_scotchFreeFights') === 1 ? 0 : 150,
        // EXTRA DROP ITEMS
        'Crown of Thrones': 700 * 0.2,
        'mafia pointer finger ring': 2 * meatDrop,
        'lucky gold ring': 200,
        "Mr. Screege's Spectacles": 170,
        "Mr. Cheeng's Spectacles": 100,
        // CRIMBO 2020 -- donated candy drop maximization
        'candy drive button': 950,
        'fudgecycle': 900,
        'cane-mail shirt': 500,
        'peanut-brittle shield': 900,
        'bakelite backpack': 500,
    };
    if (kolmafia_1.myClass() !== src_1.$class `Seal Clubber`) {
        // Non-SCs require cape + gun to utilize pointer ring; add as must-haves.
        itemValue['unwrapped knock-off retro superhero cape'] = 2 * meatDrop;
        itemValue['love'] = 2 * meatDrop; // +5 fam weight too
    }
    // Add priorityItems to the equipment selector with max value of 1000 MPA.
    priorityItems.forEach(function (value) {
        itemValue[value.name] = 1000;
    });
    // Iterate through the equipment selector item by item & equip if it is 
    //   better than the current equipment utilized. Have to reference the
    //   itemValue table with the Object.keys() thing.
    Object.keys(itemValue).forEach(function (value) {
        let tryEquip = false;
        while (!tryEquip) {
            let currItem = src_1.$item `${value}`;
            let currVal = itemValue[value];
            // Set the slot we're looking at
            let currSlot = [kolmafia_1.toSlot(currItem)];
            if (currSlot.includes(src_1.$slot `acc1`))
                currSlot = src_1.$slots `acc1, acc2, acc3`;
            currSlot.forEach(function (cSlot) {
                var _a;
                let compItem = kolmafia_1.equippedItem(cSlot);
                let compVal = (_a = itemValue[compItem.name]) !== null && _a !== void 0 ? _a : 0;
                // If you can equip it, and it's more valuable, then equip it.
                if (currVal > compVal && kolmafia_1.canEquip(currItem))
                    tryEquip = kolmafia_1.equip(currItem, currSlot);
            });
            // At this point you've checked the whole loop. End it.
            tryEquip = true;
        }
    });
}
exports.farmEquipBuilder = farmEquipBuilder;
function freeFights() {
    //   _scotchFreeFight
    kolmafia_1.print("Free fights are not yet implemented.");
}
exports.freeFights = freeFights;
function barfMountain() {
    kolmafia_1.print("Barf mountain is not yet implemented.");
}
exports.barfMountain = barfMountain;
function nightCap() {
    kolmafia_1.print("Nightcap is not yet implemented.");
}
exports.nightCap = nightCap;
//# sourceMappingURL=lib.js.map