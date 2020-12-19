export declare class GenerateMacro {
    components: string[];
    toString(): string;
    step(...nextSteps: string[]): this;
    mIf(condition: string, ...next: string[]): this;
    repeat(): this;
    skill(sk: Skill): this;
    item(it: Item): this;
    externalIf(condition: boolean, ...next: string[]): this;
    addCrit(condition: boolean): this;
    kill(): this;
    submit(): string;
}
export declare function main(initround: number, foe: Monster): void;
