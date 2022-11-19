import { MathpadSettings } from "src/MathpadSettings";

import { createEngine, Engine } from "./Engine";
import PadSlot from "./PadSlot";
import parse, { amendSettings, SLOT_VARIABLE_PREFIX } from "./Parsing";

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
        settings: MathpadSettings,
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
        const newEngine = this.engine.clone();

        if (!slot.error && slot.isValid) {
            newEngine.setVar(
                SlotStack.getSlotVariableName(slot.id),
                slot.value
            );
        }

        return new SlotStack(newEngine, [...this.items, slot]);
    }

    updateSlot(
        id: number,
        value: string,
        settings: MathpadSettings,
        options: ProcessOptions
    ) {
        // resetContext();
        const newEngine = createEngine();
        const newStack: PadSlot[] = [];
        this.items.forEach((slot) => {
            if (slot.id == id) {
                const pr = parse(value, amendSettings(settings,options));
                // if(pr.isValid){
                slot = new PadSlot(slot.id).process(newEngine, pr) as PadSlot;
                // }
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

    clear() {
        const newEngine = createEngine();
        const newStack: PadSlot[] = [];
        return new SlotStack(newEngine, newStack);
    }

    getSlotById(id: number) {
        return this.items.find((slot) => slot.id === id);
    }

    getSlotIndexById(id: number) {
        const item = this.items.find((slot) => slot.id === id);
        if(item)
            return this.items.indexOf(item);
        else 
            return -1;
    }

    getSLotByIndex(i: number) {
        return this.items[i];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    static getSlotVariableName(id: number) {
        return `${SLOT_VARIABLE_PREFIX}${id}`;
    }

    static create() {
        return new SlotStack(createEngine(), []);
    }

    private nextId() {
        if (!this.items.length) return 1;
        const maxId = Math.max(...this.items.map((slot) => slot.id));
        return maxId + 1;
    }
}

export const getNewStack = () => {
    return SlotStack.create();
};
