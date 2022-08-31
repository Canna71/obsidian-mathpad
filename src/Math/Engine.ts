import nerdamer from "nerdamer";
require("nerdamer/Algebra");
require("nerdamer/Calculus");
require("nerdamer/Extra");
require("nerdamer/Solve");

// for debugging purposes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).nerdamer = nerdamer;

// const NERDAMER_INITIAL_FUNCS = Object.keys(nerdamer.getCore().PARSER.functions);

const MY_VALIDATION_REGEX =
    /^[a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ∞$][0-9a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ$]*$/i;

const funRegex =
    /^([a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ∞$][0-9a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ$]*)\(([a-z_,\s]*)\)\s*:=\s*(.+)$/i;
const varRegex =
    /^([a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ∞$][0-9a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ$]*)\s*:=\s*(.+)$/i;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(nerdamer as any).set("VALIDATION_REGEX", MY_VALIDATION_REGEX);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function solve(expr: any, variable?: any): any {
    // console.log(a);
    const vars = nerdamer(expr).variables();
    if (!variable && vars.length === 1) {
        variable = vars[0];
    }
    return nerdamer.getCore().Solve.solve(expr, variable);
}

function markAsToPlot(...args: any[]) {
    // console.log(a);
    let fns = [];
    let i = 0;
    let ret;
    let xDomain = undefined;
    let yDomain = undefined;

    const utils = nerdamer.getCore().Utils;
    if (utils.isVector(args[i])) {
        // we have an array of functions to plot as first parameter
        fns = args[i];
    } else {
        while (args[i] && !utils.isVector(args[i])) {
            fns.push(args[i]);
            i++;
        }
        fns = utils.convertToVector(fns);
    }

    if (utils.isVector(args[i])) {
        // user provided xrange
        xDomain = args[i].elements.map((s: any) => s.valueOf());
        i++;
        if (utils.isVector(args[i])) {
            // user provided yrange
            yDomain = args[i].elements.map((s: any) => s.valueOf());
        }
    }

    if (fns.dimensions() === 1) {
        ret = fns.elements[0];
    } else {
        ret = fns;
    }
    ret._plotme = {
        xDomain,
        yDomain,
    };
    return ret;
}

nerdamer.register({
    name: "solve",
    numargs: [1, 2],
    visible: true,
    build: () => solve,
});

nerdamer.register({
    name: "plot",
    numargs: -1,
    visible: true,
    build: () => markAsToPlot,
});

nerdamer.register({
    name: "D",
    visible: true,
    numargs: [1, 3],
    build: function () {
        return nerdamer.getCore().Calculus.diff;
    },
});

nerdamer.register({
    name: "derivate",
    visible: true,
    numargs: [1, 3],
    build: function () {
        return nerdamer.getCore().Calculus.diff;
    },
});

const NERDAMER_INITIAL_FUNCS = { ...nerdamer.getCore().PARSER.functions };

export interface Engine {
    parse: (
        expression: nerdamer.ExpressionParam,
        subs?: { [name: string]: string },
        option?: keyof nerdamer.Options | (keyof nerdamer.Options)[],
        location?: nerdamer.int
    ) => nerdamer.Expression;

    setFunction: (
        function_name: string,
        param_array: string[],
        function_body: string
    ) => Engine;

    setVar: (name: string, value: string | number) => void;

    getScope: () => {
        vars: {
            [x: string]: string;
        };
        funcs: {
            [x: string]: any;
        };
    };

    tryParseFunc: (text: string) => {
        name: string;
        params: string[];
        def: string;
    } | undefined;

    tryParseVar: (text: string) => {
        name: string;
        def: string;
    } | undefined;

    toLatex: (expr: string) => string;
    clone: ()=>Engine
}

export interface Scope {
    vars: { [name: string]: string };
    funcs: { [name: string]: any };
}

export class NerdamerWrapper implements Engine {
    scope: Scope = {
        vars: {},
        funcs: {},
    };

    /**
     *
     */
    constructor() {
        this.resetContext();
    }

    resetContext = () => {
        nerdamer.clearVars();
        for (const f in nerdamer.getCore().PARSER.functions) {
            if (!NERDAMER_INITIAL_FUNCS[f]) {
                delete nerdamer.getCore().PARSER.functions[f];
            }
        }
    };

    parse = (
        expression: nerdamer.ExpressionParam,
        subs?: { [name: string]: string },
        option?: keyof nerdamer.Options | (keyof nerdamer.Options)[],
        location?: nerdamer.int
    ) => {
        // removes any variable or functions from the global objects that could
        // have been left around
        this.restoreScope();

        const expr = nerdamer(expression, subs, option, location);

        // Save the scope
        this.saveScope();

        return expr;
    };

    setFunction = (
        function_name: string,
        param_array: string[],
        function_body: string
    ) => {
        this.restoreScope();
        nerdamer.setFunction(function_name, param_array, function_body);
        this.saveScope();
        return this;
    };

    setVar = (name: string, value: string | number) => {
        this.restoreScope();
        nerdamer.setVar(name, value);
        this.saveScope();
    };

    getScope = () => {
        return {
            vars: { ...this.scope.vars },
            funcs: { ...this.scope.funcs },
        };
    };

    private saveScope() {
        this.scope.vars = (nerdamer as any).getVars("object");
        nerdamer.clearVars();
        for (const f in nerdamer.getCore().PARSER.functions) {
            if (!NERDAMER_INITIAL_FUNCS[f]) {
                this.scope.funcs[f] = nerdamer.getCore().PARSER.functions[f];
                delete nerdamer.getCore().PARSER.functions[f];
            }
        }
    }

    private restoreScope() {
        this.resetContext();
        // re-hydrate the ones in this scope
        Object.assign((nerdamer as any).getVars("object"), this.scope.vars);
        Object.assign(nerdamer.getCore().PARSER.functions, this.scope.funcs);
    }

    tryParseFunc = (text: string) => {
        const fnDec = funRegex.exec(text);
        if (fnDec) {
            const name = fnDec[1];
            const params = fnDec[2].split(",").map((p) => p.trim());
            const def = fnDec[3];
            
            this.setFunction(name, params, def);

            return { name, params, def };
        }
    };

    tryParseVar = (text:string) => {
        const varDec = varRegex.exec(text);
        if (varDec) {
            const name = varDec[1];
            const def = varDec[2];
            this.setVar(name, def);
           

            return {name,def};
        }
    }

    toLatex = (expr:string) => {
        return nerdamer.convertToLaTeX(expr);
    }

    clone = () => {
        const clone = new NerdamerWrapper();
        clone.scope = {
            vars: {...this.scope.vars},
            funcs: {...this.scope.funcs}
        }
        // re-hydrate the ones in this scope
        Object.assign((nerdamer as any).getVars("object"), clone.scope.vars);
        Object.assign(nerdamer.getCore().PARSER.functions, clone.scope.funcs);
        return clone;
    }
}

export function createEngine(): Engine {
    return new NerdamerWrapper();
}

(window as any).createEngine = createEngine;
