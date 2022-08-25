import  PadSlot from './PadSlot';

// const NERDAMER_INITIAL_FUNCS = Object.keys(nerdamer.getCore().PARSER.functions);

export interface ProcessOptions {
    evaluate?: boolean;
    simplify?: boolean;
}

const DEFAULT_OPTS : ProcessOptions = {
    evaluate: false,
    simplify: false
}

const nextId = (stack:PadSlot[]) => {
    if(!stack.length) return "$1";
    const maxId = Math.max(...stack.map(slot=>parseInt(slot.id)));
    console.log(maxId);
    return `${maxId+1}`;
}

export const addSlot = (stack:PadSlot[], input: string, scope={}, options:ProcessOptions={
    evaluate: false,
    simplify: false
}) => {
    const opts = {...DEFAULT_OPTS, ...options};
    const pad = new PadSlot(nextId(stack),input).process(scope,opts);
    return [...stack, pad];
}

export const updatePad = (stack:PadSlot[], id:string, value: string, scope={}, options:ProcessOptions) => {
    const newStack = stack.map(
        (ms,i)=>ms.id===id ? 
        new PadSlot(ms.id,value):ms).map(slot=>slot.process(scope,options));
    
    return newStack;
}
