"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.GenerateMacro = void 0;
const kolmafia_1 = require("kolmafia");
const src_1 = require("libram/src");
const lib_1 = require("./lib");
function multiFight() {
    // Function taken from Aenimus for handling multifights. Not 
    //   entirely sure it's needed in modern mafia?
    while (kolmafia_1.inMultiFight())
        kolmafia_1.runCombat();
    if (kolmafia_1.choiceFollowsFight())
        kolmafia_1.visitUrl('choice.php');
}
class GenerateMacro {
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
    // Adds an optional if statement into the macro
    externalIf(condition, ...next) {
        return condition ? this.step(...next) : this;
    }
    // Add crit-seeking behavior when a ring is equipped
    addCrit(condition) {
        return condition ? this.skill(src_1.$skill `Furious Wallop`).skill(src_1.$skill `Precision Shot`) : this;
    }
    // Generic kill statement to end a fight; adding in extra hits to guarantee crit
    kill() {
        return this.externalIf(kolmafia_1.getProperty('boomBoxSong') === 'Total Eclipse of Your Meat', "skill Sing Along")
            .addCrit(kolmafia_1.equippedAmount(src_1.$item `mafia pointer finger ring`) > 0)
            .skill(src_1.$skill `Stuffed Mortar Shell`)
            .skill(src_1.$skill `Saucestorm`)
            .skill(src_1.$skill `Lunging Thrust Smack`)
            .skill(src_1.$skill `Saucegeyser`).repeat();
    }
    // Submit actually sends your macro to KOL after concatenating it.
    submit() {
        const final = this.toString();
        kolmafia_1.print(`Submitting macro: ${final}`);
        return kolmafia_1.visitUrl('fight.php?action=macro&macrotext=' + kolmafia_1.urlEncode(final), true, true);
    }
}
exports.GenerateMacro = GenerateMacro;
function main(initround, foe) {
    // Alright trying to set this stupid thing up now.
    const loc = kolmafia_1.myLocation();
    // == FREE FIGHT STUFF ====================================
    // Getting relevant free fight nonsense out of the way.
    // Kill time-spinner pranks right off.
    if (foe === src_1.$monster `time-spinner prank`)
        new GenerateMacro().kill().submit();
    //   Will start by handling prof copies. Currently lecturing Witchess or Kramco fights.
    if (kolmafia_1.myFamiliar() === src_1.$familiar `Pocket Professor`) {
        new GenerateMacro()
            .externalIf(loc === src_1.$location `The Neverending Party`, 'skill deliver your thesis!')
            .externalIf(foe === src_1.$monster `Witchess Bishop`, 'skill Lecture on Relativity')
            .externalIf(foe === src_1.$monster `Witchess Knight`, 'skill Lecture on Relativity')
            .externalIf(foe === src_1.$monster `sausage goblin`, 'skill Lecture on Relativity')
            .kill().submit();
    }
    // I use my NEP turns to become a bat.
    if (loc === src_1.$location `The Neverending Party`) {
        new GenerateMacro()
            .skill(src_1.$skill `Become a Bat`)
            .kill().submit();
    }
    // == BARF MOUNTAIN ====================================
    // Some barf mountain handling; mostly just embezzies --
    // Olfact the garbage tourist
    if (foe === src_1.$monster `garbage tourist`) {
        new GenerateMacro()
            .externalIf(kolmafia_1.haveEffect(src_1.$effect `On the Trail`) === 0, 'skill Transcendent Olfaction')
            .kill().submit();
    }
    // Embezzler handling; lots to do here.
    if (foe === src_1.$monster `Knob Goblin Embezzler`) {
        // Run first combat w/ Reanimator; do some unique stuff there.
        if (kolmafia_1.myFamiliar() === src_1.$familiar `Reanimated Reanimator`) {
            new GenerateMacro()
                .skill(src_1.$skill `7168`) // Reanimator Wink
                .skill(src_1.$skill `Digitize`) // Ensure you digitize on first combat
                .kill().submit();
        }
        new GenerateMacro()
            .externalIf(lib_1.getPropertyInt('spookyPuttyCopiesMade') < 5, 'use Spooky Putty Sheet')
            .externalIf(lib_1.getPropertyInt('_enamorangs') < 1, 'use LOV Enamorang')
            .externalIf(!lib_1.getPropertyBoolean('_cameraUsed'), 'use 4-d camera')
            .externalIf(lib_1.getPropertyInt('_sourceTerminalDigitizeMonsterCount') === 5, 'skill Digitize')
            .externalIf(loc === src_1.$location `The Briny Deeps`, 'use pulled green taffy')
            .externalIf(lib_1.getPropertyInt('_meteorShowerUses') < 5, 'skill Meteor Shower')
            .kill().submit();
    }
    // == EXCEPTIONS ====================================
    // Some more specific use cases here. ---------------
    // Shatterpunches for scarab beatles.
    if (foe === src_1.$monster `swarm of scarab beatles`) {
        new GenerateMacro().skill(src_1.$skill `Shattering Punch`).kill().submit();
    }
    // Chest x-rays for the hole in the sky.
    if (loc == src_1.$location `The Hole in the Sky`) {
        new GenerateMacro().skill(src_1.$skill `Chest X-Ray`).kill().submit();
    }
    // For elf phylum kills with Robort, use jokester's gun
    if (foe.phylum === src_1.$phylum `elf`) {
        new GenerateMacro().skill(src_1.$skill `Fire the Jokester's Gun`).kill().submit();
    }
    // Duplicate for distention/doghair pills at the end of the day
    if (loc === src_1.$location `Domed City of Grimacia` && foe.phylum === src_1.$phylum `dude`) {
        new GenerateMacro()
            .externalIf(lib_1.getPropertyInt('_sourceTerminalDuplicateUses') < 1, 'skill Duplicate')
            .externalIf(lib_1.getPropertyInt('_missileLauncherUsed') < 1, 'skill Asdon Martin: Missile Launcher')
            .kill().submit();
    }
    // If it's a free fight I encounter, I want to off it.
    if (foe.attributes.includes('FREE'))
        new GenerateMacro().kill().submit();
    // Handle free runs I guess.
    if (kolmafia_1.myFamiliar() === src_1.$familiar `Frumious Bandersnatch` && kolmafia_1.haveEffect(src_1.$effect `Ode to Booze`) > 0) {
        kolmafia_1.runaway();
    }
    // Finally, just kill anything else I encounter.
    new GenerateMacro().kill().submit();
    // Continuing in the event we hit a multi-fight.
    multiFight();
}
exports.main = main;
//# sourceMappingURL=combat.js.map