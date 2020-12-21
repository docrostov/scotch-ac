import {
    inMultiFight,
    runCombat,
    visitUrl,
    urlEncode,
    availableAmount,
    myLocation,
    myFamiliar,
    haveEffect,
    runaway,
    choiceFollowsFight,
    print,
    equippedAmount,
    getProperty,
    useSkill,
    throwItem,
} from 'kolmafia';
import { $skill, $familiar, $effect, $location, $monster, $item, $phylum } from 'libram/src';
import { getPropertyInt, getPropertyBoolean } from './lib'


function multiFight() {
    // Function taken from Aenimus for handling multifights. Not 
    //   entirely sure it's needed in modern mafia?
    while (inMultiFight()) runCombat();
    if (choiceFollowsFight()) visitUrl('choice.php');
}

export class GenerateMacro {
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
    components: string[] = [];

    // Within a class you can define different methods, similar to how
    //   you build classes in Python. Here we let it combine those 
    //   components we just defined to convert it to a single string.
    toString() {
        return this.components.join(';');
    }

    // The "step" function concatenates steps together, I think. Using
    //   concat on an array just adds a new element to the array.
    step(...nextSteps: string[]) {
        this.components = this.components.concat(nextSteps.filter(s => s.length > 0));
        return this;
    }

    // Instantiate an if statement in proper macro form. 
    mIf(condition: string, ...next: string[]) {
        return this.step(`if ${condition}`)
            .step(...next)
            .step('endif');
    }

    // Repeat the last step in your macro.
    repeat() {
        return this.step('repeat');
    }

    // Return a hasskill statement using mIf
    skill(sk: Skill){
        // This filters out some skill detritius that Mafia doesn't use.
        const name = sk.name.replace('%fn, ','');
        return this.mIf(`hasskill ${name}`, `skill ${name}`);
    }

    // Uses an item, but only if you actually have it.
    item(it: Item) {
        if (availableAmount(it) > 0) {
            return this.step(`use ${it.name}`);
        } else return this;
    }

    // Adds an optional if statement into the macro
    externalIf(condition: boolean, ...next: string[]) {
        return condition ? this.step(...next) : this;
    }

    // Add crit-seeking behavior when a ring is equipped
    addCrit(condition: boolean) {
        return condition ? this.skill($skill`Furious Wallop`).skill($skill`Precision Shot`) : this;
    }

    // Generic kill statement to end a fight; adding in extra hits to guarantee crit
    kill() {
        return this.externalIf(getProperty('boomBoxSong') === 'Total Eclipse of Your Meat',"skill Sing Along")
            .addCrit(equippedAmount($item`mafia pointer finger ring`) > 0)
            .skill($skill`Stuffed Mortar Shell`)
            .skill($skill`Saucestorm`)
            .skill($skill`Lunging Thrust Smack`)
            .skill($skill`Saucegeyser`).repeat();
    }
    
    // Submit actually sends your macro to KOL after concatenating it.
    submit() {
        const final = this.toString();
        print(`Submitting macro: ${final}`);
        return visitUrl('fight.php?action=macro&macrotext=' + urlEncode(final), true, true);
    }
    
}

export function main(initround: number, foe: Monster) {
    // Alright trying to set this stupid thing up now.
    const loc = myLocation();

    // == FREE FIGHT STUFF ====================================
    // Getting relevant free fight nonsense out of the way.

    // Kill time-spinner pranks right off.
    if (foe === $monster`time-spinner prank`) new GenerateMacro().kill().submit();
    
    //   Will start by handling prof copies. Currently lecturing Witchess or Kramco fights.
    if (myFamiliar() === $familiar`Pocket Professor`) {
        new GenerateMacro()
            .externalIf(loc === $location`The Neverending Party`, 'skill deliver your thesis!')
            .externalIf(foe === $monster`Witchess Bishop`, 'skill Lecture on Relativity')
            .externalIf(foe === $monster`Witchess Knight`, 'skill Lecture on Relativity')
            .externalIf(foe === $monster`sausage goblin`, 'skill Lecture on Relativity')
            .kill().submit();
    }
    
    // I use my NEP turns to become a bat.
    if (loc === $location`The Neverending Party`) {
        new GenerateMacro()
            .skill($skill`Become a Bat`)
            .kill().submit();
        }
        
    // == BARF MOUNTAIN ====================================
    // Some barf mountain handling; mostly just embezzies --

    // Olfact the garbage tourist
    if (foe === $monster`garbage tourist`) {
        new GenerateMacro()
            .externalIf(haveEffect($effect`On the Trail`) === 0,'skill Transcendent Olfaction')
            .kill().submit();
    }

    // Embezzler handling; lots to do here.
    if (foe === $monster`Knob Goblin Embezzler`) {
        // Run first combat w/ Reanimator; do some unique stuff there.
        if (myFamiliar() === $familiar`Reanimated Reanimator`) {
            new GenerateMacro()
                .skill($skill`7168`) // Reanimator Wink
                .skill($skill`Digitize`) // Ensure you digitize on first combat
                .kill().submit();
        }
        new GenerateMacro()
            .externalIf(getPropertyInt('spookyPuttyCopiesMade') < 5,'use Spooky Putty Sheet')
            .externalIf(getPropertyInt('_enamorangs') < 1,'use LOV Enamorang')
            .externalIf(!getPropertyBoolean('_cameraUsed'), 'use 4-d camera')
            .externalIf(getPropertyInt('_sourceTerminalDigitizeMonsterCount') === 5, 'skill Digitize')
            .externalIf(loc === $location`The Briny Deeps`, 'use pulled green taffy')
            .externalIf(getPropertyInt('_meteorShowerUses') < 5, 'skill Meteor Shower')
            .kill().submit();
    }

    // == EXCEPTIONS ====================================
    // Some more specific use cases here. ---------------
    
    // Shatterpunches for scarab beatles.
    if (foe === $monster`swarm of scarab beatles`) {
        new GenerateMacro().skill($skill`Shattering Punch`).kill().submit();
    }

    // Chest x-rays for the hole in the sky.
    if (loc == $location`The Hole in the Sky`){
        new GenerateMacro().skill($skill`Chest X-Ray`).kill().submit();
    }

    // For elf phylum kills with Robort, use jokester's gun
    if (foe.phylum === $phylum`elf`) {
        new GenerateMacro().skill($skill`Fire the Jokester's Gun`).kill().submit();
    }
    
    // Duplicate for distention/doghair pills at the end of the day
    if (loc === $location`Domed City of Grimacia` && foe.phylum === $phylum`dude`) {
        new GenerateMacro()
            .externalIf(getPropertyInt('_sourceTerminalDuplicateUses') < 1, 'skill Duplicate')
            .externalIf(getPropertyInt('_missileLauncherUsed') < 1, 'skill Asdon Martin: Missile Launcher')
            .kill().submit();
    }

    // If it's a free fight I encounter, I want to off it.
    if (foe.attributes.includes('FREE')) new GenerateMacro().kill().submit();
    
    // Handle free runs I guess.
    if (myFamiliar() === $familiar`Frumious Bandersnatch` && haveEffect($effect`Ode to Booze`) > 0) {
        runaway();
    }

    // Finally, just kill anything else I encounter.
    new GenerateMacro().kill().submit();

    // Continuing in the event we hit a multi-fight.
    multiFight();

}