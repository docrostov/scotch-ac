import {
  print,
} from 'kolmafia';

import { setProps, kingFreed} from './lib';

export function printHelp() {
  
  // Import package info like version # & name
  var packageData = require('../package.json');
  
  print("=========================================");
  print(` >>>>>>>> ${packageData.name} v${packageData.version} `);
  print("=========================================");
  print("");
  print("scotchac king freed");
  print("   > Pull from hagnks and get aftercore prep flags done.");
}


export function main(target: string) {

  let t = target.toLowerCase();
  // This is just a control flow similar to Ezandora's, because I like it.
  if (['king freed', 'kingfreed'].indexOf(t) >= 0) {
    kingFreed();
    return "You're ready for aftercore!";
  } else if (['help', 'faq', 'assist', , ""].indexOf(t) >= 0){
    printHelp();
  } else if (['farm'].indexOf(t) >= 0){
    throw "Farming not installed yet.";
  } else if (['buff'].indexOf(t) >= 0){
    throw "Buffing not installed yet.";
  } else if (['freeFights'].indexOf(t) >= 0){
    throw "Free Fights not installed yet.";
  } else if (['level'].indexOf(t) >= 0){
    throw "Leveling not installed yet.";
  } else {
    throw "That command didn't work. Try 'help'."
  }

  return "The code should not get here, what the hell?";
}