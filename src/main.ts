import { print } from 'kolmafia';
import { kingFreed, dailies, farmPrep, runDiet, buffUp, 
         freeFights, barfMountain, nightCap, farmEquipBuilder} from './lib';

import { $item } from 'libram/src';


export function printHelp() {
  
  // Import package info like version # & name
  var packageData = require('../package.json');
  
  print("=========================================");
  print(` >>>>>>>> ${packageData.name} v${packageData.version} `);
  print("=========================================");
  print("");
  print("scotchac king freed");
  print("   > Pull from hagnks and get aftercore prep flags done.");
  print("scotchac farm");
  print("   > Run the farming module; does >600 turns of barf farming.");
}

export function main(target = '') {


  // Using a control flow to call scripts
  if (['king freed', 'kingfreed'].indexOf(target) >= 0) {
    kingFreed();
  } else if (['help', 'faq', 'assist', , ""].indexOf(target) >= 0){
    printHelp();
  } else if (['farm'].indexOf(target) >= 0){
    dailies();        // Daily actions
    farmPrep();       // Prep for barf farming
    runDiet();        // Diet management
    buffUp();         // Buff up for the whole day because I hate moods
    freeFights();     // Run all free fights
    barfMountain();   // Run barf mountain stuff
    nightCap();       // Nightcap it
  } else if (['buff'].indexOf(target) >= 0){
    buffUp();
  } else if (['freeFights'].indexOf(target) >= 0){
    freeFights();
  } else if (['level'].indexOf(target) >= 0){
    throw "Leveling not installed yet.";
  } else if (['equipTest'].indexOf(target) >=0) {
    farmEquipBuilder(1000,$item`Mer-Kin Gladiator Mask`);
  } else {
    throw "That command didn't work. Try 'help'."
  }

}