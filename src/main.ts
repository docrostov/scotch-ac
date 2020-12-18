import {
  print,
} from 'kolmafia';

import { setProps, kingFreed} from './lib';


export function main(target: string) {
  // This is just a control flow similar to Ezandora's
  if (['king freed', 'kingfreed'].indexOf(target) >= 0) {
    kingFreed();
    print("You're ready for aftercore!");
  }
}