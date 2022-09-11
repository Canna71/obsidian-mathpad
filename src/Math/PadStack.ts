import { IMathpadSettings } from 'src/MathpadSettings';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createEngine, Engine } from "./Engine";
import PadSlot from "./PadSlot";
import parse from './Parsing';

export interface ProcessOptions {
    evaluate?: boolean;
    simplify?: boolean;
}

const DEFAULT_OPTS: ProcessOptions = {
    evaluate: false,
    simplify: false,
};

export class SlotStack {
    engine: Engine;
    private _items: PadSlot[];
    public get items(): PadSlot[] {
        return this._items;
    }

    /**
     *
     */

    private constructor(engine: Engine, stack: PadSlot[]) {
        this.engine = engine;
        this._items = stack;
    }

    addSlot(
        input: string,
        settings: IMathpadSettings,
        options: ProcessOptions = {
            evaluate: false,
            simplify: false,
        }
    ) {
        const opts = { ...DEFAULT_OPTS, ...options };
        const slot = PadSlot.createSlot(
            this.engine,
            this.nextId(),
            input,
            settings,
            opts
        );
        // const pad = new PadSlot(nextId(stack), input).process(scope, opts);
        // this.stack = [...this.stack, slot];
        const newEngine = this.engine.clone();

        if (!slot.error && slot.isValid) {
            newEngine.setVar(
                SlotStack.getSlotVariableName(slot.id),
                slot.value 
            );
        }

        return new SlotStack(newEngine, [...this.items, slot]);
    }

    updateSlot(id: number, value: string, settings:IMathpadSettings, options: ProcessOptions) {
        // resetContext();
        const newEngine = createEngine();
        const newStack: PadSlot[] = [];
        this.items.forEach((slot) => {
            if (slot.id == id) {
                const pr = parse(value,settings);5
                if(pr.isValid){
                    slot = new PadSlot(slot.id).process(newEngine,pr) as PadSlot;
                }
            } else {
                slot.process(newEngine, slot.parseResult);
            }
            if (!slot.error && slot.isValid) {
                newEngine.setVar(
                    SlotStack.getSlotVariableName(slot.id),
                    slot.value
                );
            }
            newStack.push(slot);
        });

        return new SlotStack(newEngine, newStack);
    }
    removeSlot(id: number, scope = {}, options: ProcessOptions) {
        // resetContext();
        const newEngine = createEngine();
        const newStack: PadSlot[] = [];
        this.items.forEach((slot) => {
            if (slot.id !== id) {
                slot.process(newEngine, slot.parseResult);
                if (!slot.error && slot.isValid) {
                    newEngine.setVar(
                        SlotStack.getSlotVariableName(slot.id),
                        slot.value
                    );
                }

                newStack.push(slot);
            }
        });
        return new SlotStack(newEngine, newStack);
    }

    getSlotById(id: number) {
        return this.items.find((slot) => slot.id === id);
    }

    static getSlotVariableName(id: number) {
        return `$${id}`;
    }

    static create() {
        return new SlotStack(createEngine(), []);
    }

    private nextId() {
        if (!this.items.length) return 1;
        const maxId = Math.max(...this.items.map((slot) => slot.id));
        // console.log(maxId);
        return maxId + 1;
    }
}

export const getNewStack = () => {
    return SlotStack.create();
};
