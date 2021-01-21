import {
    useFamiliar, create, getClanName, myTurncount, drink, buy, useSkill, toInt, myLevel, haveEffect, toEffect,
    cliExecute, availableAmount, visitUrl, runChoice, getProperty, setProperty, print, abort, isUnrestricted,
    isOnline, myPrimestat, use, eat, mySpleenUse, spleenLimit, sweetSynthesis, chew, myInebriety, inebrietyLimit, 
    fullnessLimit, myFullness, equip, myMp, haveSkill, mpCost, restoreMp, myEffects, putShopUsingStorage, waitq, 
    refreshStatus, myHp, restoreHp, toSkill, splitString, myClass, myFamiliar, numericModifier, myMaxhp, equippedItem, canEquip, toSlot, equippedAmount, adv1, runCombat, reverseNumberology, guildStoreAvailable, chatPrivate, wait, putCloset, itemAmount, myAdventures, myHash, totalTurnsPlayed, max, maximize
  } from 'kolmafia';
  
import { $familiar, $familiars, $item, $items, $coinmaster, $effect, $effects, $skill, $slot, $slots, $location, $stat, $monster, $class } from 'libram/src';

// Check if you are in CS aftercore; true if yes, false if no
const inCSAftercore = getProperty("csServicesPerformed").split(",").length == 11;

const clanCache: { [index: string]: number } = {};

const kramco = $item`Kramco Sausage-o-Matic&trade;`;

export function farmMPA(turns: number) {
  // Calculates expected MPA of your first X turns of the day. Used
  //   to tabulate MPA of X potion over those turns.
  let normalTurn = 275; // Normal barf monster.
  let kgeTurn = 1025;   // KGE

  let advArray = [1025];

  // Turn #1 is always a KGE, via a fax.
  advArray.push(kgeTurn);

  // Add available spooky putty copies.
  
  getPropertyInt('spookyPuttyCopiesMade');

  return 1;

}

export function setClan(target: string) {
    // Script from bean to set a user's clan to something else
    if (getClanName() !== target) {
      if (clanCache[target] === undefined) {
        const recruiter = visitUrl('clan_signup.php');
        const clanRe = /<option value=([0-9]+)>([^<]+)<\/option>/g;
        let result;
        while ((result = clanRe.exec(recruiter)) !== null) {
          clanCache[result[2]] = parseInt(result[1], 10);
        }
      }
  
      visitUrl(`showclan.php?whichclan=${clanCache[target]}&action=joinclan&confirm=on&pwd`);
      if (getClanName() !== target) {
        abort(`failed to switch clans to ${target}. Did you spell it correctly? Are you whitelisted?`);
      }
    }
    return true;
}


export function ensureEffect(ef: Effect, turns = 1) {
  if (!tryEnsureEffect(ef, turns)) {
    abort('Failed to get effect ' + ef.name + '.');
  }
}

export function tryEnsureEffect(ef: Effect, turns = 1) {
  if (haveEffect(ef) < turns) {
    return cliExecute(ef.default) && haveEffect(ef) > 0;
  }
  return true;
}


export function getPropertyInt(name: string) {
  const str = getProperty(name);
  if (str === '') {
    throw `Unknown property ${name}.`;
  }
  return toInt(str);
}


export function getPropertyBoolean(name: string, default_: boolean | null = null) {
  // Helper functions from Bean re: 
  const str = getProperty(name);
  if (str === '') {
    if (default_ === null) abort(`Unknown property ${name}.`);
    else return default_;
  }
  return str === 'true';
}


export function setPropertyInt(name: string, value: number) {
  setProperty(name, value.toString());
}

export function useLimitedSkill(prop: string, currSkill: Skill, casts = 1) {
  // Function for using limited use skills if you hit a condition. I am
  //   using this to check properties before casting the skill. 
  if (getProperty(prop) === '0' || getProperty(prop) === "false"){
    if (haveSkill(currSkill))  return useSkill(currSkill, casts); // useSkill throws a boolean
  }
  return false; // False if it didn't hit it.
}

export function useLimitedItem(prop: string, currItem: Item, number = 1) {
  // Function for using limited use items if you hit a condition. I am
  //   using this to check properties before using the items. 
  if (getProperty(prop) === '0' || getProperty(prop) === "false"){
    if (availableAmount(currItem) > 0) return use(number, currItem); // use throws a boolean
  }
  return false; // False if it didn't hit it.
}

export function farmCastSkill(sk: Skill) {
  // Function that ensures you have enough of X skill to cover the whole farmday.
  while (haveEffect(toEffect(sk)) < calculateFarmingTurns()) {
    if (myMp() < mpCost(sk)) eat($item`magical sausage`); // sausage for regen!
    let currTurns = haveEffect(toEffect(sk));
    useSkill(sk, 1);
    if (currTurns === haveEffect(toEffect(sk))) {
      // This checks if your "useSkill" didn't work, and throws an error.
      throw(`ERROR: Your farmCastSkill module has failed on skill = ${sk}`);
    }
  }
}


// ====================================================================

export function setProps() {
    // Function to set up relevant scotch-ac properties.
    setProperty('_scotchIntro', '0');
    setProperty('_scotchPrepped', '0');
    setProperty('_scotchBuffed', '0');

    // Set choice adventure defaults
    setProperty('choiceAdventure1201', '1'); // science tent; tentacle
    setProperty('choiceAdventure1222', '1'); // LOV; entry
    setProperty('choiceAdventure1223', '1'); // LOV; take first fight
    setProperty('choiceAdventure1224', '3'); // LOV; take earrings
    setProperty('choiceAdventure1225', '1'); // LOV; take second fight
    setProperty('choiceAdventure1226', '2'); // LOV; take fam weight
    setProperty('choiceAdventure1227', '1'); // LOV; take third fight
    setProperty('choiceAdventure1228', '1'); // LOV; take enamorang
    setProperty('choiceAdventure1310', '3'); // god lobster; take stats
    setProperty('choiceAdventure1322', '2'); // NEP entry; skip quest
    setProperty('choiceAdventure1324', '5'); // NEP normal NC; fight monster
}
  
export function kingFreed() {
    // Things to run after ending an ascension & entering
    //   aftercore. Lots of random nonsense.
  
    // Generate a runlog via scotchlog; only do it for runs 
    //   that are <1000 turns, though.
    if (myTurncount() < 1000) {
        cliExecute('scotchlog parse');
    }
  
    // Pull everything from hagnks
    cliExecute('pull all');
  
    // Enable auto-recovery
    setProperty('hpAutoRecovery', '0.8');
    setProperty('manaBurningThreshold', '-0.05');
  
}
  
export function dailies() {
    // This section begins your day; it's effectively a more
    //   compressed version of mafia's "breakfast" script. I
    //   am adding property comparisons whenever possible to
    //   try and make this stupid thing as error-proof as I 
    //   possibly can.
  
    if (getProperty('_scotchIntro') == '1') {
      // Exit the intro if you've already completed it.
      return "Intro already complete!";
    }

    if (getProperty('_scotchStartingTurncount') === "") {
      setProperty('_scotchStartingTurncount', `${myTurncount()}`);
    }
  
    // Ensure I'm in the right clan
    setClan('Bonus Adventures from Hell');

    // STEP 1: GAIN PASSIVE RESOURCES ======================

    // Harvest your daily sea jelly; check your old man, if needed
	  if ( myLevel() > 10 && getProperty("questS01OldGuy") == "unstarted" ){
      visitUrl("place.php?whichplace=sea_oldman&action=oldman_oldman",false);
    }

    if ( getProperty("questS01OldGuy") !== "unstarted"){
      if (!getPropertyBoolean("_seaJellyHarvested")){ 
        useFamiliar($familiar`space jellyfish`);
        visitUrl('place.php?whichplace=thesea&action=thesea_left2');
        runChoice(1);
      }
    }
    
    // Visit the chateau potion bar; does this throw errors w/o chateau?
    if (getPropertyBoolean('chateauAvailable') && !getPropertyBoolean('_chateauDeskHarvested')) {      
      visitUrl('place.php?whichplace=chateau&action=chateauDesk2');
    }

    // Get your clan VIP swimming item
    if (!getPropertyBoolean('_olympicSwimmingPoolItemFound')) cliExecute('swim item');

    // Apply crazy horse, even if it costs meat, because it's ideal for barf farming.
    if (getProperty('_horsery') !== 'crazy horse' ) cliExecute('horsery crazy');

    // Request cheesefax fortune stuff; not really -needed- but I like the shot at a skillbook.
    while(getPropertyInt("_clanFortuneConsultUses") < 3 && isOnline('3038166')) {
      cliExecute("fortune cheesefax portza bortman thick");
      cliExecute("waitq 5");
    }

    // Check for a defective game grid token
    if (!getPropertyBoolean('_defectiveTokenChecked')) {
      visitUrl('place.php?whichplace=arcade&action=arcade_plumber',false);
    }

    // Snag mainstat +XP% from the clan shower
    if (!getPropertyBoolean('_aprilShower')) cliExecute(`shower ${myPrimestat()}`);

    // Use infinite bacon machine & buy a print-screen button. Note that
    //   the IBM gives you 100 per day and the button costs 111; I have 
    //   roughly 30,000 bacon in reserve, so I have no real issue with 
    //   ignoring that 11 bacon overage, but YMMV.
    useLimitedItem('_baconMachineUsed', $item`infinite bacon machine`);
    if (!getPropertyBoolean('_internetPrintScreenButtonBought')) {
      buy($coinmaster`internet meme shop`, 1, $item`print screen button`);
    }

    // Use etched hourglass for +5 adventures
    useLimitedItem('_etchedHourglassUsed', $item`etched hourglass`);
  
    // STEP 2: MAKE CHOICES ================================
  
    // Add familiar weight to your cosplay saber
    if (availableAmount($item`Fourth of May Cosplay Saber`) > 0) {
      visitUrl('main.php?action=may4');
      runChoice(4);
    }
  
    // Set boombox to meat.
    if (getProperty('boomBoxSong') !== 'Total Eclipse of Your Meat') {
      cliExecute('boombox meat');
    }

    // STEP 3: SUMMONS =====================================
  
    // Tome summons; my old script had a big price-check thing,
    //   now I am literally just going to summon 3x fam jacks
    //   until I have time to do a full refactor here.
    while (getPropertyInt("_clipartSummons") < 3) {
      create(1, $item`Box of Familiar Jacks`);
    }

    // While you're at it, get your amulet coin
    useFamiliar($familiar`Cornbeefadon`);
    if (availableAmount($item`amulet coin`) === 0) use($item`Box of Familiar Jacks`);

    // Doing two deck summons; mana, mana. Reserve one for Robort feliz-fishing.
    while (getPropertyInt('_deckCardsDrawn') < 10){
      // This should, in theory, always get you to 10 deck draws. 
      if(!getProperty('_deckCardsSeen').includes('Island')) cliExecute('cheat island');
      if(!getProperty('_deckCardsSeen').includes('Ancestral Recall')) cliExecute('cheat ancestral recall');
    }

    // Visiting Looking Glass in clan VIP lounge
    if (getPropertyBoolean('_lookingGlass')) visitUrl('clan_viplounge.php?action=lookingglass&whichfloor=2');
    
    // Snagging three pocket wishes every day
    while (getPropertyInt('_genieWishesUsed') < 3) {
      cliExecute('genie wish for more wishes');
    }

    // Cast your summonables; I am comparing against preferences for these. That
    //   isn't always strictly required, but I've found that mafia occasionally
    //   grumbles if you try and cast something you can't, so this helps handle
    //   if you already used some of it and keep the script usable.
    useLimitedSkill('cocktailSummons',  $skill`Advanced Cocktailcrafting`);
    useLimitedSkill('reagentSummons', $skill`Advanced Saucecrafting`);
    useLimitedSkill('noodleSummons', $skill`Pastamastery`);
    useLimitedSkill('_candySummons', $skill`Summon Crimbo Candy`);
    useLimitedSkill('_perfectFreezeUsed', $skill`Perfect Freeze`);
    useLimitedSkill('_spaghettiBreakfast', $skill`Spaghetti Breakfast`);
    useLimitedSkill('_coldOne', $skill`Grab a Cold One`);
    useLimitedSkill('_incredibleSelfEsteemCast', $skill`Incredible Self-Esteem`);
    useLimitedSkill('_rhinestonesAcquired',  $skill`Acquire Rhinestones`);
    useLimitedSkill('_preventScurvy', $skill`Prevent Scurvy and Sobriety`);
    useLimitedSkill('_lunchBreak', $skill`Lunch Break`);

    // Use a few 1-per-day items. Once again, using the limitedUse syntax in a 
    //   tiny custom function. Thanks to Rev for recommending the pref change.
    useLimitedItem('_warbearBreakfastMachineUsed',$item`warbear breakfast machine`);
    useLimitedItem('_warbearSodaMachineUsed',$item`warbear soda machine`);
    useLimitedItem('_bagOfCandyUsed',$item`Chester's bag of candy`);
    useLimitedItem('_milkOfMagnesiumUsed',$item`milk of magnesium`);
    useLimitedItem('_glennGoldenDiceUsed',$item`Glenn's Golden Dice`);
    useLimitedItem('_fishyPipeUsed',$item`fishy pipe`);
    useLimitedItem('_trivialAvocationsGame',$item`Trivial Avocations board game`);
    useLimitedItem('_jackassPlumberGame',$item`Jackass Plumber home game`);
    useLimitedItem('_eternalCarBatteryUsed',$item`eternal car battery`);

    // There is currently no preference for Universal Seasoning.
    // use($item`Universal Seasoning`);

    // Daily voting. Requires Ezandora's Voting Booth script
    //   svn checkout https://github.com/Ezandora/Voting-Booth/trunk/Release/
    cliExecute('VotingBooth.ash');

    // Get daily bird
  	if ( availableAmount($item`bird-a-day calendar`) > 0 && !haveEffect($effect`blessing of the bird`) ) {
	    if ( !getPropertyBoolean("_canSeekBirds") ) {
        use($item`bird-a-day calendar`);
      }
    }
    // Set the property to bypass intro on next run.
    setProperty('_scotchIntro', '1');
    return "Intro completed.";
  
}

export function farmPrep() {
    // This function does purchases to set up for farming

    if (getProperty('_scotchPrepped') == '1') {
      // Exit the intro if you've already completed it.
      return "Farm prep already complete!";
    }

    // Purchase a dinseylandfill ticket, use it / get free FunFunds
    buy(1, $item`one-day ticket to Dinseylandfill`);
    use(1, $item`one-day ticket to Dinseylandfill`);
    
    // Get free funfunds from turning in park garbage. Like with BACON, I
    //   kind of always have some in reserve, so this basically always works,
    //   but I should probably add a check in here to ensure I have some.
	  visitUrl( "place.php?whichplace=airport_stench&intro=1" );
	  visitUrl( "place.php?whichplace=airport_stench&action=airport3_tunnels" );
    runChoice( 6 );

    // Set up mumming trunk meat drop on my robortender
    useFamiliar($familiar`Robortender`);
    cliExecute('mummery meat');
    
    // Purchase robort drinks & feed them to robort; need to compare ingredient 
    //   to the drink like old ash script, but for now I'm just going to be lazy.
    let roboDrinks = $items`newark,single entendre,drive-by shooting,bloody nora,feliz navidad`;
    
    for (const roboDrink of roboDrinks) {
      buy(1, roboDrink);
      cliExecute(`robo ${roboDrink}`); 
    }

    // Buy a 4-d camera.
    buy(1, $item`4-d camera`);

    // Buy some pulled green taffy
    buy(1, $item`pulled green taffy`);

    // Get bastille nonsense done with. Requires Ezandora's Bastille script.
    //   svn checkout https://github.com/Ezandora/Bastille/branches/Release/
    cliExecute('bastille babar draftsman gesture sharks');

    // Set the property to bypass farmPrep on next run.
    setProperty('_scotchPrepped', '1');
    return "Intro completed.";

}

export function calculateFarmingTurns() {
    // Assess farming turns given available resources. Currently
    //   just going to use an approximation; I'm making this a 
    //   function so that I can make it more effective later!

    return 650;

}


export function fillSpleen() {
  // Fills spleen point by point according to the priority of:
  //   #1: synthesis (until CalcFarmingTurns is hit)
  //   #2: beggin cologne (just one)
  //   #3: transdermal smoke patches
  while (mySpleenUse() < spleenLimit()) {

    let spleenLeft = spleenLimit() - mySpleenUse();

    // Adding "calculate the universe" handling in fillSpleen
    let calcsUsed = getPropertyInt("_universeCalculated");
    let calcsAvailable = getPropertyInt("skillLevel144");

    if (haveSkill($skill`Calculate the Universe`) && calcsAvailable > calcsUsed){
      // Numberology is for adventures (69). If I was bosskilling I would swap to 37.
      if (Object.keys(reverseNumberology(0,0)).includes("69")) cliExecute("numberology 69"); 
    }

    if (haveEffect($effect`Synthesis: Greed`) < calculateFarmingTurns()) {
      buy($item`sugar sheet`,2);
      cliExecute('create sugar chapeau');
      cliExecute('create sugar shillelagh');
      sweetSynthesis($item`sugar chapeau`,$item`sugar shillelagh`);

    } else if (haveEffect($effect`Eau d' Clochard`) < 10) {
      buy($item`beggin' cologne`,1);
      chew($item`beggin' cologne`,1);

    } else {
      buy($item`transdermal smoke patch`,spleenLeft);
      chew($item`transdermal smoke patch`,spleenLeft);

    }
  }
}

export function runDiet() {
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
      if (availableAmount($item`Dirt Julep`) < 1) buy($item`Dirt Julep`, 1);
      if (drink($item`Dirt Julep`)) setProperty("_mimeArmyShotglassUsed","true");
    }

    // Drink up!
    while (inebrietyLimit() - myInebriety() > 4) {
      
      ensureEffect($effect`Ode to Booze`);
      buy($item`Frosty's Frosty Mug`, 1);
      buy($item`jar of fermented pickle juice`, 1);
      drink($item`Frosty's Frosty Mug`,1);
      drink($item`jar of fermented pickle juice`, 1);
      
      fillSpleen();
    }

    // Drink up!
    while (fullnessLimit() - myFullness() > 4) {
      buy($item`Special Seasoning`,1);
      buy($item`Ol' Scratch's Salad Fork`, 1);
      buy($item`extra-greasy slider`, 1);
      eat($item`Ol' Scratch's Salad Fork`,1);
      eat($item`extra-greasy slider`, 1);
      
      fillSpleen();
    }

    // Finish filling drinks
    while (inebrietyLimit() - myInebriety() > 0) {
      equip($item`tuxedo shirt`);
      ensureEffect($effect`Ode to Booze`);
      buy($item`splendid martini`,1);
      drink($item`splendid martini`,1);
    }

    // TO-DO: add distention/doghair pills here ////////////////////////////////////////////////
}

export function buffUp() {
    // This function buffs you up for meatfarming, both with castable 
    //   buffs, Buffbot stuff, 1/day buffs, etc.

    // Here are the AT buffs we -want- for barf farming.
    
    const wantedATBuffs: Effect[] = [
      $effect`Fat Leon's Phat Loot Lyric`,
      $effect`Polka of Plenty`,
      $effect`The Ballad of Richie Thingfinder`,
      $effect`Chorale of Companionship`,
    ]

    // Start by shrugging off unwanted AT buffs. myEffects() is an ASH
    //   array, so it needs to be handled a bit differently by taking
    //   the effect name out and converting it into an $effect`` via 
    //   dark and eldritch magick.
    for (const efName of Object.keys(myEffects())) {
      const currEffect = Effect.get(efName);
      if (toSkill(currEffect).class == $class`Accordion Thief`) {
        if (!(wantedATBuffs.includes(currEffect))) {
          cliExecute('shrug '+ currEffect.name);
        }
      }
    }

    // Attempt to get buffy rolling, then wait to give buffy to proc.
    if (haveEffect($effect`Carol of the Thrills`) < 400){
      cliExecute("send to buffy || 500 bull hell thrill jingle reptil tenaci empathy elemental polka phat");
      waitq(10);
      refreshStatus();
    }

    // Get "free" beach-head familiar buff, then use remaining combs.
    //   This script requires Veracity's beachComber, located here:
    // https://kolmafia.us/threads/beachcomber-fast-and-efficient-beach-combing.23993/
    ensureEffect($effect`Do I Know You From Somewhere?`);
    cliExecute('beachcomber 0');

    // Get witchess buff
    ensureEffect($effect`Puzzle Champ`);

    // Get clan "aggressive" buffs; probably fails if you don't have VIP access?
    while (getPropertyInt('_poolGames') < 3) {
      cliExecute('pool billiards');
    }
    
    // Get mad tea party buff
    ensureEffect($effect`Dances with Tweedles`)

    // Get meat.enh buffs
    while (getPropertyInt('_sourceTerminalEnhanceUses') < 3) cliExecute('terminal enhance meat.enh');

    // Get KGB buffs
    while (getPropertyInt('_kgbClicksUsed') < 21) cliExecute('briefcase buff meat');

    // Get defective game grid buff
    if (!getPropertyBoolean('_defectiveTokenUsed')) use(1, $item`defective Game Grid token`);

    // Get zatara meatsmith buff
    ensureEffect($effect`Meet the Meat`);

    // Summon otep'vekxen
    if (!getPropertyBoolean('demonSummoned') && !inCSAftercore) {
      buy($item`scroll of ancient forbidden unspeakable evil`,1);
      buy($item`thin black candle`,3);
      ensureEffect($effect`Preternatural Greed`);  
    }

    // Get ballpit buff
    ensureEffect($effect`Having a Ball!`);

    // Get the stat buff from Spacegate
    if (!getPropertyBoolean('_spacegateVaccine')) {
      print("YOU HAVE NOT YET INSTALLED THE SPACEGATE VACCINE!");
    }

    // Get triple-sized for stat purposes.
    equip($item`Powerful Glove`, $slot`acc1`);
    useSkill(1, $skill`CHEAT CODE: Triple Size`);

    // Do random things to increase your early stats.
    if (!getPropertyBoolean("telescopeLookedHigh")) cliExecute("telescope high");
    if (!getPropertyBoolean("_lyleFavored")) cliExecute("monorail buff");
    if (!getPropertyBoolean("_streamsCrossed")) cliExecute("crossstreams")

    // // Get bird buffs; do not re-favorite birds, fav bird is fine.
    // if (availableAmount($item`bird-a-day calendar`) > 0) {
    //   useSkill(7-getPropertyInt("_birdsSoughtToday"),$skill`seek out a bird`);
    // }

    // Get the daycare buff. Doing myst for +items/mp.
    if (!getPropertyBoolean('_daycareSpa')) cliExecute('daycare mysticality');

    // Max cast a few key farming skills.
    farmCastSkill($skill`Disco Leer`);
    farmCastSkill($skill`The Spirit of Taking`);
    farmCastSkill($skill`Leash of Linguini`);
    farmCastSkill($skill`Empathy of the Newt`);
    farmCastSkill($skill`Singer's Faithful Ocelot`);
    farmCastSkill($skill`The Polka of Plenty`);
    farmCastSkill($skill`Fat Leon's Phat Loot Lyric`);

    // Max cast skills that are not -that- useful, but are worth having on.
    farmCastSkill($skill`Get Big`);

    while (haveEffect($effect`Blood Bond`) < calculateFarmingTurns()) {
      if (myHp() < 1000) restoreHp(1000); // Restore if needed
      useSkill($skill`Blood Bond`,30);
    }

    while (haveEffect($effect`Blood Bubble`) < calculateFarmingTurns()) {
      if (myHp() < 1000) restoreHp(1000); // Restore if needed
      useSkill($skill`Blood Bubble`,30);
    }

    // Ensure you have asdon driving observantly all day. Requires Ezandora's
    //   asdonmartin script, I believe, although I'm not positive.
    while (haveEffect($effect`Driving Observantly`) < calculateFarmingTurns()) {
      cliExecute('asdonmartin drive observantly');
    }

    // Ensure you have turns of How to Avoid Scams all day.
    while (haveEffect($effect`How to Scam Tourists`) < calculateFarmingTurns()) {
      use($item`How to Avoid Scams`,10);
    }

    // Heal up so that you are ready for free fights. 
    restoreHp(myMaxhp());
}

export function farmEquipBuilder(meatDrop = 250, ...priorityItems: Item[]) { 
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
  const lepCalc = (Math.pow(220*baseWeight,0.5)+2*baseWeight-6)/100;

  let perPoundFamBonus = 0;

  // Modify fam bonus based on type of fam equipped
  if (myFamiliar() === $familiar`robortender`) {
    perPoundFamBonus = (lepCalc * 2.10)/baseWeight; // It's actually 2x, but +item is worth a tiny amount too.
  } else if (myFamiliar() === $familiar`hobo monkey`) {
    perPoundFamBonus = (lepCalc * 1.25)/baseWeight;
  } else if ($familiars`cornbeefadon, leprechaun`.includes(myFamiliar())) {
    // I need to add more lep familiars.
    perPoundFamBonus = (lepCalc * 1.00)/baseWeight;
  } 

  // Now let's try to assess equipment value. I am hardcoding in equips because
  //   I do not want the script to be running Maximizer all the time.
  let itemValue: { [index: string]: number } = {
    // FAMILIAR WEIGHT ITEMS
    'plexiglass pith helmet': 5*perPoundFamBonus*meatDrop,
    'crumpled felt fedora': 10*perPoundFamBonus*meatDrop,
    'Fourth of May cosplay saber': 10*perPoundFamBonus*meatDrop,
    "Great Wolf's beastly trousers": 10*perPoundFamBonus*meatDrop,
    'Belt of Loathing': 10*perPoundFamBonus*meatDrop,
    "Stephen's Lab Coat": 5*perPoundFamBonus*meatDrop,
    "Beach Comb": 5*perPoundFamBonus*meatDrop,
    "Amulet Coin": 10*perPoundFamBonus*meatDrop,

    // MEAT DROP ITEMS
    "wad of used tape": 0.30*meatDrop,
    "garbage sticker": 0.30*meatDrop,
    "Cloak of Dire Shadows": 0.30*meatDrop,
    "ring of the Skeleton Lord": 0.50*meatDrop + 10, // Adding a tiny boost due to item drop bonus
    "Wormwood Wedding Ring": 0.50*meatDrop,
    'carpe': 0.60*meatDrop,

    // MIXED ITEMS
    "latte lovers member's mug":  numericModifier($item`latte lovers member's mug`,"Familiar Weight")*perPoundFamBonus*meatDrop + numericModifier($item`latte lovers member's mug`,"Meat Drop")*meatDrop/100,

    // SPECIAL ITEMS
    'Pantsgiving': getPropertyInt('_pantsgivingFullness') > 2 ? 0.30*meatDrop : 950, // Always use until +3 fullness.
    'Enhanced Signal Receiver': getPropertyInt('_scotchFreeFights') === 1 ? 950 : 0, // Only run on free fight chain pre-PYEC.
    'ittah bittah hookah': getPropertyInt('_scotchFreeFights') === 1 ? 950 : 0, // Only run on free fight chain pre-PYEC.
    'mafia thumb ring': getPropertyInt('_scotchFreeFights') === 1 ? 0 : 150, // Only run outside of free fights.
    
    // EXTRA DROP ITEMS
    'Crown of Thrones': 700*0.2, // Using ~ 700 MPA from whosits at a ~20% rate.
    'mafia pointer finger ring': 2*meatDrop, // requires crit-killing, but basically best in slot.
    'lucky gold ring': 200, // LGR activations are weird and need to be spaded. Will closet sand dollars.
    "Mr. Screege's Spectacles": 170, // Some initial spading implies ~ 170 MPA from screege.
    "Mr. Cheeng's Spectacles": 100, // Cheeng's is much more questionable due to massive drop pool. Needs spading.
    
    // CRIMBO 2020 -- donated candy drop maximization
    // 'candy drive button': 950,
    // // 'fudgecycle': 900,
    // 'cane-mail shirt': 500,
    // 'peanut brittle shield': 900,
    // 'bakelite backpack': 500,
  }

  if (myClass() !== $class`Seal Clubber`) {
    // Non-SCs require cape + gun to utilize pointer ring; add as must-haves.
    itemValue['unwrapped knock-off retro superhero cape'] =  2*meatDrop;
    itemValue['love'] =  2*meatDrop; // +5 fam weight too
  }

  // Add priorityItems to the equipment selector with max value of 1000 MPA.
  priorityItems.forEach( function (value) {
    itemValue[value.name] = 1000;
  });
  
  // Iterate through the equipment selector item by item & equip if it is 
  //   better than the current equipment utilized. Have to reference the
  //   itemValue table with the Object.keys() thing.
  Object.keys(itemValue).forEach( function (value) {
    let currItem = $item`${value}`;
    let currVal = itemValue[value];
      
    // Set the slot we're looking at
    let possibleSlots = [toSlot(currItem)];
    if (possibleSlots.includes($slot`acc1`)) possibleSlots = $slots`acc1,acc2,acc3`;
    
    for (const currSlot of possibleSlots) {
      // No dupe items in barf setup right now.
      if (equippedAmount(currItem) > 0) break;
      
      let compItem = equippedItem(currSlot);
      let compVal = itemValue[compItem.name] ?? 0;
      
      // If you can equip it, and it's more valuable, and you have one... equip it.
      if (currVal > compVal && canEquip(currItem) && availableAmount(currItem) > 0) { 
        equip(currItem,currSlot);
        print(`Equipping ${currItem} with an observed value of ${currVal}`);
        print(`   =====> This replaces ${compItem} with an observed value of ${compVal}`);
        break;
      }
    }
    });

}

export function libramBurn() {
  // Pretty simple function that burns MP on librams.
  let minMPLeft = 500;
  while (myMp() - minMPLeft > mpCost($skill`Summon Candy Heart`)){
    if (getPropertyInt('_favorRareSummons') < 4) {
      useSkill($skill`Summon Party Favor`,1);
    } else {
      useSkill($skill`Summon Candy Heart`,1);
    }
  }
}

export function selectFamiliar(loc: Location) {
  // Function that selects the right familiar for free fights given
  //   submitted fights. Currently just returns fist turkey.
  return $familiar`Fist Turkey`;
}

export function kramcoPercent(){ 
  // Calculates the % chance of a Kramco. Stole this from Rev.
  let numberKramcosToday = getPropertyInt('_sausageFights')
  let kramcoNumber = 5+numberKramcosToday*3+Math.pow(Math.max(0,numberKramcosToday-5), 3);
  return Math.max(Math.min((totalTurnsPlayed() - getPropertyInt("_lastSausageMonsterTurn") + 1) / kramcoNumber,1.0),0.0);
}

export function afterAdventure(){
  // Generalized after-adventure script

  // Fill extra pantsgiving fullness
  if (fullnessLimit() - myFullness() > 0) {
    buy($item`Jumping Horseradish`,1);
    buy($item`Special Seasoning`,1);
    eat($item`Jumping Horseradish`);
  }

  // Make sure I don't die.
  if (myHp() < 100) restoreHp(1000);
  if (myMp() < 50) restoreMp(200);

  // If you're >15 turns into the farming day & Kramco% is > 30%, use Kramco.
  if (myTurncount() - getPropertyInt('_scotchStartingTurncount') > 15) {
    if (kramcoPercent() > 0.30 && equippedAmount(kramco) === 0) farmEquipBuilder(250,kramco);
    if (kramcoPercent() < 0.30 && equippedAmount(kramco) > 0) farmEquipBuilder(250);
  }



  // TO-DO
  // Use Kramco if probability is > 50 and you've spent >10 turns. 
  // Use protopack if a ghost is up
  // Place digitizes in wanderer zones?
  

}

export function adventureHere(loc: Location, fam = $familiar`none`){
  // Just submits an adv1 and also allows you to do an afterAdventure
  //   script. Also changes your familiar, if required. You could
  //   potentially refactor this to run the outfitSelector every 
  //   combat 
  if (fam === $familiar`none`) fam = selectFamiliar(loc);
  if (myFamiliar() !== fam) useFamiliar(fam);
  adv1(loc,-1,'');
  afterAdventure();
}

export function freeFights() {
  // This property should be 2 if it's done, 1 if in-progress, undefined start of day.
  if (getProperty('_scotchFreeFights') == '2') return "You've finished your free fights";
  setProperty('_scotchFreeFights', '1');

  // Start out with your starter equip; free fight stuff.  
  farmEquipBuilder(25);

  // Let's start out with LOV.
  if (!getPropertyBoolean('_loveTunnelUsed')) {
    adventureHere($location`The Tunnel of L.O.V.E.`);
  }

  // Let's do machine elf fights now.
  while (getPropertyInt("_machineTunnelsAdv") < 5) {
    adventureHere($location`The Deep Machine Tunnels`,$familiar`Machine Elf`);
  }

  // Now let's do Witchess to ensure the Professor has enough XP for a thesis. 
  while (getPropertyInt("_witchessFights") < 5) {

    // Swap to professor for the last fight.
    if (getPropertyInt("_witchessFights") === 1) {
      useFamiliar($familiar`Pocket Professor`);
      equip($item`Pocket Professor memory chip`);
    }

    visitUrl("campground.php?action=witchess");
    visitUrl("choice.php?whichchoice=1181&option=1" );
    visitUrl(`choice.php?whichchoice=1182&option=1&piece=${$monster`Witchess Knight`.id}&pwd=${myHash()}`,false);
    runCombat()
  }

  // Let's do God Lobster combats now.
  while (getPropertyInt("_godLobsterFights") < 3) {
    useFamiliar($familiar`God Lobster`);
    visitUrl('main.php?fightgodlobster=1'); // Very straightforward URL!
    runCombat();
    visitUrl('choice.php'); // Ensuring I hit the choice.
    runChoice(2); // Should default to stats due to setProps
  }

  // Let's do NEP now. Put on cloake for batform.
  farmEquipBuilder(100, $item`Vampyric Cloake`);

  while (getPropertyInt('_neverendingPartyFreeTurns') < 10) {
    if (getPropertyInt('_neverendingPartyFreeTurns') === 1) {
      // Swap to prof for my thesis.
      adventureHere($location`The Neverending Party`, $familiar`Pocket Professor`);
    }
    adventureHere($location`The Neverending Party`, $familiar`Artistic Goth Kid`);
  }

  // Powdered madness farming.
  useFamiliar($familiar`red-nosed snapper`);

  // Evoke eldritch horror & visit the science tent.
  if (!getPropertyBoolean('_eldritchTentacleFought')) {
    visitUrl('place.php?whichplace=forestvillage&action=fv_scientist');
    runChoice(-1);
    runCombat();
  }

  useSkill($skill`Evoke Eldritch Horror`, 1);
  runCombat();

  // Use hot tub to heal if you encounter the weird boss monster.
  if (haveEffect($effect`Feeling Insignificant`)){
    cliExecute('hottub');
  }

  // Finally, summon seals.
  if (myClass() === $class`Seal Clubber` && guildStoreAvailable()){
    buy($item`figurine of a wretched-looking seal`,10);
    buy($item`seal-blubber candle`,10);

    farmEquipBuilder(25,$item`old dry bone`);

    // This is 10 for me, but may be less if you have never done the SC nemesis quest!
    while (getPropertyInt('_sealsSummoned') < 10) {
      use($item`figurine of a wretched-looking seal`);
      runCombat();
    }
  }

  farmEquipBuilder(25);

  // Script will swap familiars here.
  while (getPropertyInt('_snojoFreeFights') < 10) {
    adventureHere($location`The X-32-F Combat Training Snowman`);
  }

  // Closet all bowling balls to ensure you can adventure in bowling alley.
  if (availableAmount($item`Bowling Ball`) > 0) {
    putCloset(availableAmount($item`Bowling Ball`), $item`Bowling Ball`);
  }

  // Need to add in drunk pygmy support into combat.ts w/ extra banishes before I
  //   actually use this in the script.
  // buy($item`Bowl of Scorpions`,11);
  // farmEquipBuilder(0,$item`Kremlin's Greatest Briefcase`);
  // while (getPropertyInt('_drunkPygmyBanishes') < 11) {
  //   adventureHere($location`The Hidden Bowling Alley`);
  // }

  libramBurn();
  use($item`Platinum Yendorian Express Card`);

  // Set the property to bypass farmPrep on next run.
  setProperty('_scotchFreeFights', '2');
  return "Free fights are complete.";

}

export function barfMountain() {
  // Alright, let's farm barf mountain I guess. Start out by requesting a KGE.
  //   Code stolen from bean's HCCS script: https://github.com/phulin/bean-hccs/

  if (!getPropertyBoolean('_photocopyUsed')){   
    chatPrivate('cheesefax', 'Knob Goblin Embezzler');
    for (let i = 0; i < 2; i++) {
      wait(10);
      cliExecute('fax receive');
      if (getProperty('photocopyMonster') === 'Knob Goblin Embezzler') break;
      // otherwise got the wrong monster, put it back.
      cliExecute('fax send');
    }
  }

  // With the KGE requested and around, time to prep for barf. First fight
  //   includes our buddy the reanimator for +3 KGEs. 
  useFamiliar($familiar`Reanimated Reanimator`);
  farmEquipBuilder(1000);

  // Ensure you have digitize
  if (![getProperty('sourceTerminalEducate1'), getProperty('sourceTerminalEducate2')].includes('digitize.edu')){
    cliExecute('terminal educate digitize');
  }

  // Fight that first KGE.
  if (!getPropertyBoolean('_photocopyUsed')){
    use(1, $item`photocopied monster`);
  }

  // Use a free run in the bowling alley first.
  useFamiliar($familiar`Pair of Stomping Boots`);
  adventureHere($location`The Hidden Bowling Alley`, $familiar`Pair of Stomping Boots`);

  // Now switch to Robort for the rest of the day.
  useFamiliar($familiar`Robortender`);
  farmEquipBuilder(1000);

  // Now fight the chateau KGE. Again, heavily stolen from Bean.
  if (!getPropertyBoolean('_chateauMonsterFought')) {
    const chateauText = visitUrl('place.php?whichplace=chateau', false);
    const match = chateauText.match(/alt="Painting of an? ([^(]*) .1."/);
    if (match && match[1] === 'Knob Goblin Embezzler') {
      visitUrl('place.php?whichplace=chateau&action=chateau_painting', false);
      runCombat();
    } else {
      throw 'Wrong painting.';
    }
  }

  // Now fight your spooky putty chain. Should only break when KGE 
  while (itemAmount($item`Spooky Putty Monster`) > 0) {
    use(1, $item`Spooky Putty Monster`);
  }

  // Now fight your 4-d camera KGE
  if (itemAmount($item`shaking 4-d camera`) > 0) {
    use(1, $item`shaking 4-d camera`);
  }

  // Now fight your first digitized KGE, who should be showing up in the sea!
  if (getPropertyInt('_sourceTerminalDigitizeMonsterCount') === 0 && getPropertyInt('_sourceTerminalDigitizeUses') === 1 ) {
    farmEquipBuilder(1000, $item`Mer-kin gladiator mask`);
    adventureHere($location`The Briny Deeps`,$familiar`Robortender`);
  }
  
  farmEquipBuilder(1000);

  // Now fight the envyfish egg KGE
  if (itemAmount($item`envyfish egg`) > 0) {
    use(1, $item`envyfish egg`);
  }

  farmEquipBuilder(250);

  // Now fight the semirare KGE, if you aren't in CS aftercore
  if (!inCSAftercore) {
    if (!getPropertyBoolean("_freePillKeeperUsed")) {
      cliExecute("pillkeeper semirare");
      adventureHere($location`Cobb's Knob Treasury`, $familiar`Robortender`);
    }
  }

  // Now go fight in barf until you're out of adventures!
  while (myAdventures() > 1) {
    adventureHere($location`Barf Mountain`, $familiar`Robortender`);
    if (getPropertyInt('_pantsgivingFullness') > 2) farmEquipBuilder(250);
  }

  //TO-DO
  // Add a grimacia map

}

export function nightCap() {
  // Really simplistic nightcap
  cliExecute('breakfast');
  useFamiliar($familiar`Stooper`);
  ensureEffect($effect`Ode to Booze`);
  buy($item`splendid martini`,1);
  drink($item`splendid martini`,1);
  
  ensureEffect($effect`Ode to Booze`);
  buy($item`Frosty's Frosty Mug`, 1);
  buy($item`jar of fermented pickle juice`, 1);
  drink($item`Frosty's Frosty Mug`,1);
  drink($item`jar of fermented pickle juice`, 1);
  
  fillSpleen();

  useFamiliar($familiar`Left-Hand Man`);
  maximize('advs', false);

  buy($item`resolution: be more adventurous`,5);
  use($item`resolution: be more adventurous`,5);

  buy($item`chocolate seal-clubbing club`,3);
  use($item`chocolate seal-clubbing club`,3);
}