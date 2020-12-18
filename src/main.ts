import {
  print,
} from 'kolmafia';

import { setProps, kingFreed} from './lib';

// Import package info
var packageData = require('../package.json');


export function main(target: string) {
  // This is just a control flow similar to Ezandora's.
  if (['king freed', 'kingfreed'].indexOf(target) >= 0) {
    kingFreed();
    print("You're ready for aftercore!");
  }

  if (['help', 'faq', 'assist'].indexOf(target) >= 0){
    print("=========================================");
    print(` >>>>>>>> ${packageData.name} v${packageData.version} `);
    print("=========================================");
    print("");
    print("scotchac king freed");
    print("   > Pull from hagnks and get aftercore prep flags done.")
  }
}