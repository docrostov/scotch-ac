export declare class combatMacro {
    components: string[];
    toString(): string;
    step(...nextSteps: string[]): this;
    mIf(condition: string, ...next: string[]): this;
    repeat(): this;
    skill(sk: Skill): this;
    item(it: Item): this;
    kill(mode?: string): this;
    submit(): string;
}
export declare function main(initround: number, foe: Monster): void;
