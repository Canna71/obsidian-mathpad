import { MathpadSettings } from 'src/MathpadSettings';
import parse, { ParseResult, SLOT_VARIABLE_PREFIX } from "./Parsing";
import { createEngine } from "src/Math/Engine";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Engine } from "./Engine";
// import { ProcessOptions } from "./PadStack";s

const PLOT_PARSE = /plot\((.*)\)/m;
const PARAMS_RE = / *(\[[^\]].*\])| *([^[,]+) */gm;

export default class PadScope {
    private _input: string;
    private _inputLatex: string;
    // private _id: number;
    private _error?: string | undefined;
    private _plot: any = undefined;
    private _fn: ((...args: number[]) => number)[];
    private _scope: {
        vars: { [x: string]: string };
        funcs: { [x: string]: any };
    };

    // private _opts: ProcessOptions;

    private _subs: any;
    private _ident: boolean;
    private _parseResult: ParseResult;
    public get parseResult(): ParseResult {
        return this._parseResult;
    }

    public get ident(): boolean {
        return this._ident;
    }

    public get subs(): any {
        return this._subs;
    }


    public get scope(): {
        vars: { [x: string]: string };
        funcs: { [x: string]: any };
    } {
        return this._scope;
    }

    public get plot() {
        return this._plot;
    }

    public get fn(): ((...args: number[]) => number)[] {
        return this._fn;
    }

    public get error(): string | undefined {
        return this._error;
    }

    // public get id(): number {
    //     return this._id;
    // }

    //TODO: make it configurable
    // cfr: nerdamer.getCore().Settings.VALIDATION_REGEX
    // public get name(): string {
    //     return `S${this._id}`;
    // }

    public get inputLaTeX(): string {
        return this._inputLatex;
    }

    public get input(): string {
        return this._input;
    }

    private _expression: nerdamer.Expression;
    // public get expression(): nerdamer.Expression {
    //     return this._expression;
    // }

    private _resultTex = "";

    public get laTeX(): string {
        return this._resultTex;
    }

    private _text = "";
    public get text(): string {
        return this._text;
    }

    public get isValid(): boolean {
        return !!this._expression;
    }

    public get value(): any {
        return this._expression.valueOf();
    }

    public get noteText(): any {
        if(this.parseResult.isFnDec || this.parseResult.isVarDec || (this._input.trim()===this._text.trim())){
            return this._input;
        } else {
            return this._input + " = " + this._text;
        }
    }

    public get noteLatex(): any {
        if(this.parseResult.isFnDec || this.parseResult.isVarDec || (this._input.trim()===this._text.trim())){
            return this._inputLatex;
        } else {
            return this._inputLatex + " = " + this._resultTex;
        }
    }

    /**
     *
     */
    constructor() {}

    process(engine: Engine, parseResult: ParseResult): PadScope {
        try {
            // save processing options and scope
            this._input = parseResult.text;
            this._scope = engine.getScope();
            this._parseResult = parseResult;
            // this._opts = opts;
            // this._subs = subs;

            this._error = undefined;

            if (parseResult.isFnDec) {
                engine.setFunction(
                    parseResult.name,
                    parseResult.params,
                    parseResult.def
                );
                this._expression = engine.parse(parseResult.def);
                // this._resultTex = engine.parse(parseResult.def).toTeX();
            } else if (parseResult.isVarDec) {
                engine.setVar(parseResult.name, parseResult.def);
                this._expression = engine.parse(parseResult.def);
                // this._resultTex = engine.parse(parseResult.def).toTeX();

                // return this;
            } else {
                this._expression = engine.parse(parseResult.text);
                if ((this._expression as any).symbol?._plotme) {
                    this._plot = (this._expression as any).symbol?._plotme;
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (!(this._expression as any).isFraction()) {
                    // this will return the symbol itself, not the Expression
                    // this._expression = (this._expression as any).simplify();
                    if (parseResult.evaluate) {
                        this._expression = this._expression.evaluate();
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                // this._resultTex = (this._expression as any).toTeX(
                //     parseResult.evaluate ? "decimal" : undefined
                // );

                try {
                    this._fn = [this._expression.buildFunction()];
                } catch (ex) {
                    // probably it's a collection:
                    const tmp: ((...args: number[]) => number)[] = [];
 
                    if((this._expression as any).symbol?.elements?.length>0){
                        (this._expression as any).each((element: any) => {
                            tmp.push(engine.parse(element).buildFunction());
                        });
                    }

                    //
                    this._fn = tmp;
                }
            }

            this._resultTex = (this._expression as any).toTeX(
                parseResult.evaluate ? "decimal" : undefined
            );

        } catch (e) {
            this._error = e.toString();
            console.warn(e, this.input);
        }
        
        let inputText = this.input;
        if (this.plot) {
            const m = PLOT_PARSE.exec(inputText);
            if (m) {
                inputText = m[1];
                this._inputLatex = "plot(" + engine.toLatex(inputText) + ")";
            }
        } else {
            try{
                if(!(this.parseResult.isFnDec || this.parseResult.isVarDec)){
                    this._input= this.parseResult.text; 
                    this._inputLatex = engine.toLatex(this.parseResult.text);
                } else {
                    this._input = this.parseResult.name;
                    this._inputLatex = engine.toLatex(`${this.parseResult.name}`);
                    if(this.parseResult.isFnDec){
                        this._input+=`(${this.parseResult.params.join(", ")})`;
                        this._inputLatex = engine.toLatex(`${this.parseResult.name}(${this.parseResult.params.join(", ")})`)
                    }
                    this._input += ":=" + this.parseResult.def;
                    this._inputLatex += ":=" + engine.toLatex(this.parseResult.def);
                }
            } catch(ex){
                // console.log()
            }
        }
        if (this._expression) {
            const expr = this._expression.text(
                parseResult.evaluate ? "decimals" : "fractions"
            );

            // const decl = this.input.indexOf(":=");
            if (parseResult.isFnDec || parseResult.isVarDec) {
                this._ident = parseResult.def === expr;
            } else {
                this._ident = expr === this.input;
            }
            this._text = expr;
        }

        return this;  
    }

    getCodeBlock(settings: MathpadSettings) {

        const lines: string[] = [];
        for (const v in this.scope.vars) {
            const postfix = v.startsWith(SLOT_VARIABLE_PREFIX)?settings.inlinePostfix:"";
            lines.push(`${v}${settings.declarationStr}${this.scope.vars[v]}${postfix}`);
        }
        for (const f in this.scope.funcs) {
            // console.log(f,this.scope.funcs[f])
            const def = this.scope.funcs[f][2];
            lines.push(`${def.name}(${def.params.join(",")})${settings.declarationStr}${def.body}`);
        }
        let str = this.input;
        
        if (this.plot) {

            let m;
            if ((m = PLOT_PARSE.exec(this.input)) !== null) {
                const parList = m[1];
                let params = [];
                while ((m = PARAMS_RE.exec(parList)) !== null) {
                    // This is necessary to avoid infinite loops with zero-width matches
                    if (m.index === PARAMS_RE.lastIndex) {
                        PARAMS_RE.lastIndex++;
                    }
                    // m[1] is array
                    // m[2] is not array
                    params.push(m[1] || m[2]);
                }
                if (params[0].startsWith("[")) {
                    params = [params[0]];
                } else {
                    params = params.filter((p) => !p.startsWith("["));
                }
                this.plot.xDomain && params.push(`[${this.plot.xDomain?.toString()}]`);

                this.plot.xDomain && this.plot.yDomain && params.push(`[${this.plot.yDomain?.toString()}]`);

                str = `plot(${params.join(", ")})`;
            }
        }

        
        if(!this.parseResult.isFnDec && !this.parseResult.isVarDec){
            lines.push(`${str}${this.parseResult.evaluate ? settings.evaluateNumericStr : settings.evaluateSymbolicStr}`);
        }
        return lines.join("\n");
    }

    static parseCodeBlock(source: string, settings: MathpadSettings): PadScope[] | undefined {
        const lines = source.split("\n");
        const engine = createEngine();
        const ret: PadScope[] = [];
        lines.filter(line=>line.trim().length>0).forEach((line) => {

            const pr = parse(line, settings);

            // if(pr.isValid){
                // if(!(pr.isVarDec || pr.isFnDec)){
                    if(!pr.hide){
                        ret.push(new PadScope().process(engine,pr))
                    } else {
                        new PadScope().process(engine,pr)
                    }
                // } else {
                    // new PadScope().process(engine,pr)
                // }
            // }
            
        });

        return ret;
    }
}
