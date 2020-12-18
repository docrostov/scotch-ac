import {
    useFamiliar, getClanName, myTurncount, drink,
    cliExecute, availableAmount, visitUrl, runChoice, getProperty, setProperty, print, abort
  } from 'kolmafia';
  
import { $familiar, $item, $effect, $effects, $skill, $slot, $location, $stat, $monster, $class } from 'libram/src';

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
  
export function intro() {
    // This section begins your day; it's effectively a more
    //   compressed version of mafia's "breakfast" script. 
  
    if (getProperty('_scotchIntro') == '1') {
      // Exit the intro if you've already completed it.
      return "Intro already complete!";
    }
  
    // Ensure I'm in the right clan
    setClan('Bonus Adventures from Hell');

    // STEP 1: GAIN PASSIVE RESOURCES ======================

    // Harvest your daily sea jelly
    useFamiliar($familiar`space jellyfish`);
    visitUrl('place.php?whichplace=thesea&action=thesea_left2');
    
    // Visit the chateau potion bar; does this throw errors w/o chateau?
    visitUrl('place.php?whichplace=chateau&action=chateauDesk2');

    // Get your clan VIP swimming item
    cliExecute('swim item');

    // Check for a defective game grid token

    // Snag mainstat +XP% from the clan shower

    // Use infinite bacon machine & buy a print-screen button

    // Use etched hourglass for +5 adventures


  
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
    setProperty('_scotchIntro', '1');
    return "Intro completed."
  
}

export function farmPrep() {
    // This function does purchases to set up for farming

    // Purchase a dinseylandfill ticket, use it / get free FunFunds

    // Purchase robort drinks & feed them to robort

    // Set up mumming trunk nonsense

    // 
}

export function calculateFarmingTurns() {
    // Assess farming turns given available resources.

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