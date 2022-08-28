
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
        this.engine.setVar(SlotStack.getSlotVariableName(slot.id), slot.expression.valueOf());

        return new SlotStack(this.engine, [...this.items, slot]);
    }

    updateSlot (id: number, value: string, scope = {}, options: ProcessOptions)  {
        // resetContext();
        const newEngine = createEngine();
        const newStack:PadSlot[] = [];
        this.items.forEach(slot =>{
            if(slot.id == id) {
                slot = new PadSlot(slot.id, value);
            }
            slot.process(newEngine,scope,options);
            newEngine.setVar(SlotStack.getSlotVariableName(slot.id), slot.expression.valueOf());
            newStack.push(slot);
        })
        
        return new SlotStack(newEngine, newStack);

    }
    removeSlot(id: number, scope = {}, options: ProcessOptions) {
        // resetContext();
        const newEngine = createEngine();
        const newStack:PadSlot[] = [];
        this.items.forEach(slot =>{
            if(slot.id !== id) {
                slot.process(newEngine,scope,options);
                newEngine.setVar(SlotStack.getSlotVariableName(slot.id), slot.expression.valueOf());
                newStack.push(slot);
            }
        })
        return new SlotStack(newEngine, newStack);
    }

    getSlotById(id: number) {
        return this.items.find((slot) => slot.id === id);
    }

    static getSlotVariableName(id: number) {
        return `$${id}`;
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

