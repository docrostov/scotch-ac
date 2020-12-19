"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.combatMacro = void 0;
const kolmafia_1 = require("kolmafia");
const src_1 = require("libram/src");
function multiFight() {
    // Function taken from Aenimus for handling multifights. Not 
    //   entirely sure it's needed in modern mafia?
    while (kolmafia_1.inMultiFight())
        kolmafia_1.runCombat();
    if (kolmafia_1.choiceFollowsFight())
        kolmafia_1.visitUrl('choice.php');
}
class combatMacro {
    constructor() {
        // Basing this off of Bean's implementation of Aen's macro building
        //   functionality from aen-cocoabo-farming on GitHub. I have never
        //   built a class before, so I'm going to comment as I try to
        //   understand what's going on here.
        //
        // Some example usages:
        //   Kill a monster w/ guaranteed crit
        //     - > new Macro().skill($skill`Sing Along`).kill('crit').submit();
        //   Apply copiers, then kill
        //     - > new Macro().copiers().kill()
        // By default macroBuilder constructors are string components.
        this.components = [];
    }
    // Within a class you can define different methods, similar to how
    //   you build classes in Python. Here we let it combine those 
    //   components we just defined to convert it to a single string.
    toString() {
        return this.components.join(';');
    }
    // The "step" function concatenates steps together, I think. Using
    //   concat on an array just adds a new element to the array.
    step(...nextSteps) {
        this.components = this.components.concat(nextSteps.filter(s => s.length > 0));
        return this;
    }
    // Instantiate an if statement in proper macro form. 
    mIf(condition, ...next) {
        return this.step(`if ${condition}`)
            .step(...next)
            .step('endif');
    }
    // Repeat the last step in your macro.
    repeat() {
        return this.step('repeat');
    }
    // Return a hasskill statement using mIf
    skill(sk) {
        // This filters out some skill detritius that Mafia doesn't use.
        const name = sk.name.replace('%fn, ', '');
        return this.mIf(`hasskill ${name}`, `skill ${name}`);
    }
    // Uses an item, but only if you actually have it.
    item(it) {
        if (kolmafia_1.availableAmount(it) > 0) {
            return this.step(`use ${it.name}`);
        }
        else
            return this;
    }
    // Generic kill statement to end a fight; adding optional option
    //   that enables crit-killing when desirable to do so.
    kill(mode) {
        if (mode === 'crit') {
            // Only try to crit-kill if you're wearing the ring...
            if (kolmafia_1.equippedAmount(src_1.$item `mafia pointer finger ring`) > 1) {
                return this.skill(src_1.$skill `Furious Wallop`)
                    .skill(src_1.$skill `Precision Shot`)
                    .skill(src_1.$skill `Saucegeyser`).repeat();
            }
        }
        // If you don't have the ring/crit equipped, just kill it.
        return this.skill(src_1.$skill `Stuffed Mortar Shell`)
            .skill(src_1.$skill `Saucestorm`)
            .skill(src_1.$skill `Saucegeyser`).repeat();
    }
    // Submit actually sends your macro to KOL after concatenating it.
    submit() {
        const final = this.toString();
        kolmafia_1.print(`Submitting macro: ${final}`);
        return kolmafia_1.visitUrl('fight.php?action=macro&macrotext=' + kolmafia_1.urlEncode(final), true, true);
    }
}
exports.combatMacro = combatMacro;
function main(initround, foe) {
    // Alright trying to set this stupid thing up now.
    const loc = kolmafia_1.myLocation();
    // Bean's is pretty elegant; mine is going to be much more manual. 
    //   Will start by handling prof copies.
    if (kolmafia_1.myFamiliar() === src_1.$familiar `Pocket Professor`) {
        if (loc === src_1.$location `The Neverending Party`) {
            new combatMacro()
                .skill(src_1.$skill `deliver your thesis!`) // Feynmantron, deliver your thesis!
                .kill()
                .submit();
        }
        else {
            if (foe === src_1.$monster `Witchess Bishop` || foe === src_1.$monster `Witchess Knight`) {
                new combatMacro()
                    .skill(src_1.$skill `Sing Along`)
                    .skill(src_1.$skill `Lecture on Relativity`)
                    .kill()
                    .submit();
            }
        }
    }
    // I use my NEP turns to become a bat.
    if (loc === src_1.$location `The Neverending Party`) {
        new combatMacro()
            .skill(src_1.$skill `Become a Bat`)
            .kill().submit();
    }
    // If it's a free fight I encounter, I want to off it.
    if (foe.attributes.includes('FREE'))
        new combatMacro().kill().submit();
    // Handle free runs I guess.
    if (kolmafia_1.myFamiliar() === src_1.$familiar `Frumious Bandersnatch` && kolmafia_1.haveEffect(src_1.$effect `Ode to Booze`) > 0) {
        kolmafia_1.runaway();
    }
    // Continuing in the event we hit a multi-fight.
    multiFight();
}
exports.main = main;
//# sourceMappingURL=combat.js.map