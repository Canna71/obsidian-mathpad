import nerdamer from "nerdamer";
require("nerdamer/Algebra");
require("nerdamer/Calculus");
require("nerdamer/Extra");
require("nerdamer/Solve");

// for debugging purposes
(global as any).nerdamer = nerdamer;


const MY_VALIDATION_REGEX =
    /^[a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ∞$][0-9a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ$]*$/i;

const FNCALL_REGEX = /([a-z]*)\((.*)\)/i;

(nerdamer as any).set("VALIDATION_REGEX", MY_VALIDATION_REGEX);
nerdamer.set('PARSE2NUMBER', false);

export function setPrecision(precision: number){
    (nerdamer as any).set("PRECISION", Math.round(precision || 21));
}
export function setScientific(scientific: boolean) {
    (nerdamer as any).set("SCIENTIFIC",scientific || false);
}
setScientific(false);

function solve(expr: any, variable?: any): any {
    const vars = nerdamer(expr).variables();
    if (!variable && vars.length === 1) {
        variable = vars[0];
    }
    return nerdamer.getCore().Solve.solve(expr, variable);
}

function markAsToPlot(...args: any[]) {
    let fns = [];
    let i = 0;
    // let ret;
    let xDomain = undefined;
    let yDomain = undefined;

    const utils = nerdamer.getCore().Utils;
    // if (utils.isVector(args[i])) {
    //     // we have an array of functions to plot as first parameter
    //     fns = args[i];
    // } else {
        while (args[i] && (!utils.isVector(args[i]) || utils.isVector(args[i].elements[0])) ) {
            fns.push(args[i]);
            i++; 
        }
        // TODO: this will turn any list of points as first argument into
        fns = utils.convertToVector(fns);
    // }

    if (utils.isVector(args[i])) {
        // user provided xrange
        xDomain = args[i].elements.map((s: any) => s.valueOf());
        i++;
        if (utils.isVector(args[i])) {
            // user provided yrange
            yDomain = args[i].elements.map((s: any) => s.valueOf());
        }
    }

    // if (fns.dimensions() === 1) {
    //     ret = fns.elements[0];
    // } else {
        const ret = fns;
    // }
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

nerdamer.register({
    name: "slider",
    visible: true,
    numargs: [2,3],
    build: () => function (min_or_val:any, min_or_max:any, max:any) {
        const ret = min_or_val;
        ret._range = max ? [min_or_max, max] : [min_or_val, min_or_max];
        return ret;
    }
})

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


    toLatex: (expr: string) => string;
    clone: () => Engine;
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
        try {
            this.restoreScope();
            nerdamer.setFunction(function_name, param_array, function_body);
            this.saveScope();
        } catch (ex) {
            console.warn(ex);
        }
        return this;
    };

    setVar = (name: string, value: string | number) => {
        try {
            this.restoreScope();
            nerdamer.setVar(name, value);
            this.saveScope();
        } catch (ex) {
            console.warn(ex);
        }
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


    tolatexInternal = (expr: string) => {
        let ret = expr;
        
        try{
            ret = (nerdamer as any).convertToLaTeX(expr, {decimals:true});
        } catch(ex) {
            const m = FNCALL_REGEX.exec(expr);
            if(m){
                const fnName = m[1];
                const params = m[2];
                ret = fnName + "\\left(" + this.tolatexInternal(params) + "\\right)";
            }
            
        }
        return ret;
    }

    toLatex = (expr: string) => {
        this.restoreScope();
        const e = prepare_expression(expr);
        const ret = this.tolatexInternal(e);
        this.saveScope();
        return ret;
    };

    clone = () => {
        const clone = new NerdamerWrapper();
        clone.scope = {
            vars: { ...this.scope.vars },
            funcs: { ...this.scope.funcs },
        };
        // re-hydrate the ones in this scope
        Object.assign((nerdamer as any).getVars("object"), clone.scope.vars);
        Object.assign(nerdamer.getCore().PARSER.functions, clone.scope.funcs);
        return clone;
    };
}

export function createEngine(): Engine {
    return new NerdamerWrapper();
}


const prepare_expression = function (e: string) {
    /*
     * Since variables cannot start with a number, the assumption is made that when this occurs the
     * user intents for this to be a coefficient. The multiplication symbol in then added. The same goes for
     * a side-by-side close and open parenthesis
     */
    e = String(e);
    
    
    //replace multiple spaces with one space
    e = e.replace(/\s+/g, " ");

    //only even bother to check if the string contains e. This regex is painfully slow and might need a better solution. e.g. hangs on (0.06/3650))^(365)
    if (/e/gi.test(e)) {
        e = e.replace(/-*\d+\.*\d*e\+?-?\d+/gi, function (x) {
            return nerdamer.getCore().Utils.scientificToDecimal(x);
        });
    }
    //replace scientific numbers

    //allow omission of multiplication after coefficients
    e =
        e
            .replace(
                nerdamer.getCore().Settings.IMPLIED_MULTIPLICATION_REGEX,
                function (
                    str: string,
                    group1: string,
                    group2: string,
                    start: number
                ) {
                   
                    const first = str.charAt(start);
                    let before = "",
                        d = "*";
                    if (!first.match(/[+\-/*]/)) before = str.charAt(start - 1);
                    if (before.match(/[a-z]/i)) d = "";
                    return group1 + d + group2;
                }
            )
            .replace(/([a-z0-9_]+)/gi, function (_match: any, a: string) {
                if (
                    nerdamer.getCore().Settings.USE_MULTICHARACTER_VARS ===
                        false &&
                    !(a in nerdamer.getCore().PARSER.functions)
                ) {
                    if (!isNaN(a as any)) return a;
                    return a.split("").join("*");
                }
                return a;
            })
            //allow omission of multiplication sign between brackets
            .replace(/\)\(/g, ")*(") || "0";
    
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const e_org = e; //store the original
        e = e.replace(
            /([a-z0-9_]+)(\()|(\))([a-z0-9]+)/gi,
            function (_match, a, b, c, d) {
                const g1 = a || c,
                    g2 = b || d;
                if (g1 in nerdamer.getCore().PARSER.functions)
                    //create a passthrough for functions
                    return g1 + g2;
                return g1 + "*" + g2;
            }
        );
        //if the original equals the replace we're done
        if (e_org === e) break;
    }
    return e;
};
