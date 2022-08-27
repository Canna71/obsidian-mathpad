
/* eslint-disable @typescript-eslint/no-explicit-any */





import { createEngine, Engine } from './Engine';
import PadSlot from './PadSlot';


export interface ProcessOptions {
    evaluate?: boolean;
    simplify?: boolean;
}

const DEFAULT_OPTS: ProcessOptions = {
    evaluate: false,
    simplify: false
}

export class SlotStack  {
    engine: Engine; 
    private _items: PadSlot[];
    public get items(): PadSlot[] {
        return this._items;
    }
    

    /**
     *
     */

    private constructor(engine: Engine, stack: PadSlot[]){
        this.engine = engine;
        this._items = stack;
    }

  

    addSlot(input: string, scope = {}, options: ProcessOptions = {
        evaluate: false,
        simplify: false
    })  {
        const opts = { ...DEFAULT_OPTS, ...options };
        const slot = PadSlot.createSlot(this.engine, this.nextId(),input,scope, opts);
        // const pad = new PadSlot(nextId(stack), input).process(scope, opts);
        // this.stack = [...this.stack, slot];
        return new SlotStack(this.engine, [...this.items, slot]);
    }

    updateSlot (id: number, value: string, scope = {}, options: ProcessOptions)  {
        // resetContext();
        const newEngine = createEngine();
        const newStack = this.items.map(
            (ms, i) => ms.id === id ?
                new PadSlot(ms.id, value) : ms).map(slot => slot.process(this.engine, scope, options));
        return new SlotStack(newEngine, newStack);

    }
    removeSlot(id: number, scope = {}, options: ProcessOptions) {
        // resetContext();
        const newEngine = createEngine();
        const newStack = this.items.filter(
            (ms, i) => ms.id !== id).map(slot => slot.process(this.engine, scope, options));
        return new SlotStack(newEngine, newStack);

    }

    getSlotById(id: number) {
        return this.items.find((slot) => slot.id === id);
    }

    static create(){
        return new SlotStack(createEngine(), []);
    }

    private nextId() {
        if (!this.items.length) return 1;
        const maxId = Math.max(...this.items.map(slot => slot.id));
        // console.log(maxId);
        return maxId + 1;
    }

}

export const getNewStack = () => {
    
    return SlotStack.create();
}



// export const createSlot = (id: number, input: string, scope:any={}, options:ProcessOptions= {
//     evaluate: false,
//     simplify: false
// }) => {
//     return new PadSlot(id, input).process(scope, options);
// }

// export const addSlot = (stack: PadSlot[], input: string, scope = {}, options: ProcessOptions = {
//     evaluate: false,
//     simplify: false
// }) => {
//     const opts = { ...DEFAULT_OPTS, ...options };
//     const pad = createSlot(nextId(stack),input,scope, opts);
//     // const pad = new PadSlot(nextId(stack), input).process(scope, opts);
//     return [...stack, pad];
// }



// export const removeSlot = (stack: PadSlot[], id: number, scope = {}, options: ProcessOptions) => {
//     resetContext();
//     const newStack = stack.filter(
//         (ms, i) => ms.id !== id).map(slot => slot.process(scope, options));
//     return newStack;
// }

// export const getSlotById = (stack: PadSlot[], id: number) => {
//     return stack.find((slot) => slot.id === id);
// }
