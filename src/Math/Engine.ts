import nerdamer from "nerdamer";
require("nerdamer/Algebra");
require("nerdamer/Calculus");
require("nerdamer/Extra");
require("nerdamer/Solve");

// for debugging purposes
(global as any).nerdamer = nerdamer;

// const NERDAMER_INITIAL_FUNCS = Object.keys(nerdamer.getCore().PARSER.functions);
const NERDAMER_INITIAL_FUNCS = { ...nerdamer.getCore().PARSER.functions };

export const resetContext = () => {
    nerdamer.clearVars();
    for (const f in nerdamer.getCore().PARSER.functions) {
        if (!NERDAMER_INITIAL_FUNCS[f]) {
            delete nerdamer.getCore().PARSER.functions[f];
        }
    }
}

function solve(expr: any, variable?: any): any {
    // console.log(a);
    const vars = nerdamer(expr).variables();
    if (!variable && vars.length === 1) {
        variable = vars[0];
    }
    return nerdamer.getCore().Solve.solve(expr, variable);
}


function markAsToPlot(exprOrList: any) {
    // console.log(a);
    exprOrList._plotme = true;
    return exprOrList;
}



nerdamer.register({
    name: "solve",
    numargs: [1, 2],
    visible: true,
    build: () => solve
});

nerdamer.register({
    name: "plot",
    numargs: -1,
    visible: true,
    build: () => markAsToPlot
});

nerdamer.register({
    name: 'D',
    visible: true,
    numargs: [1, 3],
    build: function () { return nerdamer.getCore().Calculus.diff; }
});

nerdamer.register({
    name: 'derivate',
    visible: true,
    numargs: [1, 3],
    build: function () { return nerdamer.getCore().Calculus.diff; }
});

export interface Engine {
    parse: (
        expression: nerdamer.ExpressionParam,
        subs?: { [name: string]: string },
        option?: keyof nerdamer.Options | (keyof nerdamer.Options)[],
        location?: nerdamer.int)=> nerdamer.Expression
    
    setFunction: (function_name: string, param_array: string[], function_body: string) => Engine

    setVar: (name: string, value: string | number) => void
}


export function createEngine(){
    console.log("creating engine...")
    resetContext();

    return (
        {
            parse: (expression: nerdamer.ExpressionParam,
                subs?: { [name: string]: string },
                option?: keyof nerdamer.Options | (keyof nerdamer.Options)[],
                location?: nerdamer.int) => nerdamer(expression, subs, option, location),
            
            setFunction: (function_name: string, param_array: string[], function_body: string) => {
                nerdamer.setFunction(function_name, param_array,function_body)
                return this;
            },
                
            setVar: (name: string, value: string | number) => {
                nerdamer.setVar(name, value);
            }
         }
    )
}

