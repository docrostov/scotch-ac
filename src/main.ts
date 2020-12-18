import {
  print,
} from 'kolmafia';

import { setProps, kingFreed} from './lib';

export function printHelp() {
  
  // Import package info
  var packageData = require('../package.json');
  
  print("=========================================");
  print(` >>>>>>>> ${packageData.name} v${packageData.version} `);
  print("=========================================");
  print("");
  print("scotchac king freed");
  print("   > Pull from hagnks and get aftercore prep flags done.")
}


export function main(target: string) {

  target = target.toLowerCase();
  // This is just a control flow similar to Ezandora's.
  if (['king freed', 'kingfreed'].indexOf(target) >= 0) {
    kingFreed();
    print("You're ready for aftercore!");
  }

  print("testing");

  if (['help', 'faq', 'assist'].indexOf(target) >= 0){
    printHelp();
  }

  return "hello?";
}