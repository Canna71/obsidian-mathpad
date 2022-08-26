import nerdamer from "nerdamer";
require("nerdamer/Algebra");
require("nerdamer/Calculus");
require("nerdamer/Extra");
require("nerdamer/Solve");

function markAsToPlot(exprOrList:any){
    // console.log(a);
    exprOrList._plotme=true;
    return exprOrList;
}

function solve(expr:any, variable?:any):any{
    // console.log(a);
    const vars = nerdamer(expr).variables();
    if(!variable && vars.length===1){
        variable = vars[0];
    }
    return nerdamer.getCore().Solve.solve(expr, variable);
}

nerdamer.register({
    name: "plot",
    numargs: -1, 
    visible: true,
    build: ()=>markAsToPlot
})

nerdamer.register({
    name: "solve",
    numargs: [1,2], 
    visible: true,
    build: ()=>solve
})

import  PadSlot from './PadSlot';

// const NERDAMER_INITIAL_FUNCS = Object.keys(nerdamer.getCore().PARSER.functions);
const NERDAMER_INITIAL_FUNCS = {...nerdamer.getCore().PARSER.functions};

export interface ProcessOptions {
    evaluate?: boolean;
    simplify?: boolean;
}

const DEFAULT_OPTS : ProcessOptions = {
    evaluate: false,
    simplify: false
}

export const resetContext = () => {
    nerdamer.clearVars();
    for(const f in nerdamer.getCore().PARSER.functions){
        if(!NERDAMER_INITIAL_FUNCS[f]){
            delete nerdamer.getCore().PARSER.functions[f];
        }
    }
}

export const getNewStack = ()=>{
    return [] as PadSlot[];
}

const nextId = (stack:PadSlot[]) => {
    if(!stack.length) return 1;
    const maxId = Math.max(...stack.map(slot=>slot.id));
    // console.log(maxId);
    return maxId+1;
}

export const addSlot = (stack:PadSlot[], input: string, scope={}, options:ProcessOptions={
    evaluate: false,
    simplify: false
}) => {
    const opts = {...DEFAULT_OPTS, ...options};
    const pad = new PadSlot(nextId(stack),input).process(scope,opts);
    return [...stack, pad];
}

export const updatePad = (stack:PadSlot[], id:number, value: string, scope={}, options:ProcessOptions) => {
    resetContext();
    const newStack = stack.map(
        (ms,i)=>ms.id===id ? 
        new PadSlot(ms.id,value):ms).map(slot=>slot.process(scope,options));
    console.log(newStack);
    return newStack;
}
 
export const removePad = (stack:PadSlot[], id:number, scope={}, options:ProcessOptions) => {
    resetContext();
    const newStack = stack.filter(
        (ms,i)=>ms.id!==id ).map(slot=>slot.process(scope,options));
    return newStack;
}
