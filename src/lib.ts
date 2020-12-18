import {
    useFamiliar, getClanName, myTurncount, drink, buy, useSkill, toInt, myLevel, haveEffect,
    cliExecute, availableAmount, visitUrl, runChoice, getProperty, setProperty, print, abort, isUnrestricted, isOnline, myPrimestat, use
  } from 'kolmafia';
  
import { $familiar, $item, $coinmaster, $effect, $effects, $skill, $slot, $location, $stat, $monster, $class } from 'libram/src';

const clanCache: { [index: string]: number } = {};
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

// ====================================================================

export function setProps() {
    // Function to set up relevant scotch-ac properties.
    setProperty('_scotchIntro', '0');
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
    cliExecute('pull all')
  
    // Enable auto-recovery
    setProperty('hpAutoRecovery', '0.8');
    setProperty('manaBurningThreshold', '-0.05');
  
}
  
export function dailies() {
    // This section begins your day; it's effectively a more
    //   compressed version of mafia's "breakfast" script. 
  
    if (getProperty('_scotchIntro') == '1') {
      // Exit the intro if you've already completed it.
      return "Intro already complete!";
    }
  
    // Ensure I'm in the right clan
    setClan('Bonus Adventures from Hell');

    // STEP 1: GAIN PASSIVE RESOURCES ======================

    // Harvest your daily sea jelly; check your old man, if needed
	  if ( myLevel() > 10 && getProperty("questS01OldGuy") == "unstarted" ){
      visitUrl("place.php?whichplace=sea_oldman&action=oldman_oldman",false);
    }
    if ( getProperty("questS01OldGuy") !== "unstarted"){
      useFamiliar($familiar`space jellyfish`);
      visitUrl('place.php?whichplace=thesea&action=thesea_left2');
    }
    
    // Visit the chateau potion bar; does this throw errors w/o chateau?
    if (getPropertyBoolean('chateauAvailable') && !getPropertyBoolean('_chateauDeskHarvested') && isUnrestricted($item`Chateau Mantegna room key`)) {      
      visitUrl('place.php?whichplace=chateau&action=chateauDesk2');
    }

    // Get your clan VIP swimming item
    cliExecute('swim item');

    // Get your free crazy horse
    cliExecute('horsery crazy');

    // Request cheesefax fortune stuff 
    while(getPropertyInt("_clanFortuneConsultUses") < 3 && isOnline('3038166')) {
      cliExecute("fortune cheesefax portza bortman thick");
      cliExecute("waitq 5");
    }

    // Check for a defective game grid token
    visitUrl('place.php?whichplace=arcade&action=arcade_plumber');

    // Snag mainstat +XP% from the clan shower
    cliExecute(`shower ${myPrimestat()}`);

    // Use infinite bacon machine & buy a print-screen button
    use(1, $item`infinite bacon machine`);
    buy($coinmaster`internet meme shop`, 1, $item`print screen button`);

    // Use etched hourglass for +5 adventures
    use(1, $item`etched hourglass`);
  
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
  
    // Tome summons

    // Deck summons; mana, mana. Reserve one for Robort.
    cliExecute('cheat island');
    cliExecute('cheat ancestral recall');

    // Visiting Looking Glass in clan VIP lounge
    visitUrl('clan_viplounge.php?action=lookingglass&whichfloor=2');
    cliExecute('swim item');
    while (getPropertyInt('_genieWishesUsed') < 3) {
      cliExecute('genie wish for more wishes');
    }

    if (getPropertyInt('_candySummons') === 0) {
      useSkill(1, $skill`Summon Crimbo Candy`);
    }
    
    useSkill(1, $skill`Summon Rhinestones`);
    useSkill(1, $skill`Advanced Cocktailcrafting`);
    useSkill(1, $skill`Advanced Saucecrafting`);
    useSkill(1, $skill`Pastamastery`);
    useSkill(1, $skill`Spaghetti Breakfast`);
    useSkill(1, $skill`Grab a Cold One`);
    useSkill(1, $skill`Acquire Rhinestones`);
    useSkill(1, $skill`Prevent Scurvy and Sobriety`);
    useSkill(1, $skill`Perfect Freeze`);
    
    // Get daily bird
  	if ( availableAmount($item`bird-a-day calendar`) > 0 && !haveEffect($effect`blessing of the bird`) ) {
	    if ( !getPropertyBoolean("_canSeekBirds") ) {
        use($item`bird-a-day calendar`);
      }
    }
    // Set the property to bypass intro on next run.
    setProperty('_scotchIntro', '1');
    return "Intro completed."
  
}

export function farmPrep() {
    // This function does purchases to set up for farming

    // Purchase a dinseylandfill ticket, use it / get free FunFunds
    buy(1, $item`one-day ticket to Dinseylandfill`);
    use(1, $item`one-day ticket to Dinseylandfill`);

    // Purchase robort drinks & feed them to robort; need to compare ingredient to the drink like old ash script
    let roboDrinks = ['newark','single entendre', 'drive-by shooting', 'bloody nora'];
    
    roboDrinks.forEach(function (value) {
      buy(1, $item`${value}`);
      cliExecute(`robo ${value}`); 
    });

    // Set up mumming trunk nonsense


}

export function calculateFarmingTurns() {
    // Assess farming turns given available resources.

    return 610;

}

export function runDiet() {
    // Diet is relatively manual right now. Go full hobo for 
    //   food/booze, spend as much as you need on synth, go 
    //   transdermal smoke patches for spleen remainder.
    //   Eventually implement "value of adv" calculator and
    //   other options to help improve this. 

    // Check barrelprayer buff and utilize if it's good.

    // Use dirt julep on mime shotglass booze
    if (getPropertyBoolean("_mimeArmyShotglassUsed") != true) {
        if (drink($item`Dirt Julep`)) {
            setProperty("_mimeArmyShotglassUsed","true");
        }
    }
}

export function buffUp() {
    // This function buffs you up for meatfarming
    
    // Get "free" beach-head familiar buff
    ensureEffect($effect`Do I Know You From Somewhere?`);

    // Get witchess buff
    ensureEffect($effect`Puzzle Champ`);

    // Get clan "aggressive" buffs
    while (getPropertyInt('_poolGames') < 3) {
      ensureEffect($effect`Billiards Belligerence`);
    }
    
    // Get mad tea party buff

    // Get meat.enh buffs
    while (getPropertyInt('_sourceTerminalEnhanceUses') < 3) {
      ensureEffect($effect`meat.enh`);
    }

    // Get KGB buffs
    while (getPropertyInt('_kgbClicksUsed') > 3) {
      cliExecute('briefcase buff meat');
    }

    // Get defective game grid buff
    if (!getPropertyBoolean('_defectiveTokenUsed')) use(1, $item`defective Game Grid token`);

    // Get zatara meatsmith buff
    ensureEffect($effect`Meet the Meat`);

    // Summon otep'vekxen
    ensureEffect($effect`Preternatural Greed`);
    
    // Get ballpit buff
    ensureEffect($effect`Having a Ball!`);


}

export function freeFights() {

}

export function barfMountain() {

}

export function nightCap() {

}