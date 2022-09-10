import { createEngine } from "src/Math/Engine";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Engine } from "./Engine";
import { ProcessOptions } from "./PadStack";

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

    private _opts: ProcessOptions;

    private _subs: any;
    private _ident: boolean;
    public get ident(): boolean {
        return this._ident;
    }

    public get subs(): any {
        return this._subs;
    }

    public get opts(): ProcessOptions {
        return this._opts;
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

    /**
     *
     */
    constructor(input: string) {
        this._input = input;
    }

    process(engine: Engine, subs = {}, opts: ProcessOptions): PadScope {
        try {
            // save processing options and scope
            this._scope = engine.getScope();
            this._opts = opts;
            this._subs = subs;

            this._error = undefined;

            const fnDec = engine.tryParseFunc(this.input);
            
            if (fnDec) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { name, params, def } = fnDec;
                this._expression = engine.parse(def);
                this._resultTex =
                    /*name + "(" + params.map(param => engine.parse(param).toTeX()).join(",") +
                    ") := " + */ engine.parse(def).toTeX();
                // return this;
            } else {
                const varDec = engine.tryParseVar(this.input);
                
                if (varDec) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { name, def } = varDec;

                    this._expression = engine.parse(def);

                    this._resultTex = /* name + " := " + */ engine
                        .parse(def)
                        .toTeX();

                    // return this;
                } else {
                    this._expression = engine.parse(this.input, subs);
                    if ((this._expression as any).symbol?._plotme) {
                        this._plot = (this._expression as any).symbol?._plotme;
                    }
                    // A martix will trow an exception if we try to simplify it
                    if (opts.simplify) {
                        try {
                            this._expression = engine.parse(
                                `simplify(${this.input})`,
                                subs
                            );
                        } catch (e) {
                            //
                        }
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (!(this._expression as any).isFraction()) {
                        // this will return the symbol itself, not the Expression
                        // this._expression = (this._expression as any).simplify();
                        if (opts.evaluate) {
                            this._expression = this._expression.evaluate();
                        }
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    this._resultTex = (this._expression as any).toTeX(
                        opts.evaluate ? "decimal" : undefined
                    );

                    try {
                        this._fn = [this._expression.buildFunction()];
                    } catch (ex) {
                        // probably it's a collection:
                        const tmp: ((...args: number[]) => number)[] = [];
                        (this._expression as any).each((element: any) => {
                            tmp.push(engine.parse(element).buildFunction());
                        });
                        //
                        this._fn = tmp;
                    }
                }
            }
        } catch (e) {
            this._error = e.toString();
            console.warn(e, this.input);
        }
        let inputText = this.input;
        if(this.plot){
            const m = PLOT_PARSE.exec(inputText);
            if(m){
                inputText = m[1];
                this._inputLatex = "plot("+engine.toLatex(inputText)+")";
            }
        } else {
            this._inputLatex = engine.toLatex(inputText);
        }
        if (this._expression) {
            const expr = this._expression.text(opts.evaluate?"decimals":"fractions");
            const decl = this.input.indexOf(":=");
            if (decl > 0) {
                this._ident = this.input.substr(decl + 2) === expr;
            } else {
                this._ident = expr === this.input;
            }
            this._text = expr;
        }
        
        return this;
    }



    getCodeBlock() {
        const lines: string[] = [];
        for (const v in this.scope.vars) {
            lines.push(`${v}:=${this.scope.vars[v]}`);
        }
        for (const f in this.scope.funcs) {
            // console.log(f,this.scope.funcs[f])
            const def = this.scope.funcs[f][2];
            lines.push(`${def.name}(${def.params.join(",")}):=${def.body}`);
        }
        let str = this.input;

        if (this.plot) {
            // str = `plot(${str})`;
            //TODO: we shold inject the actual xDomain and yDomain
            // this will be easier to do when we'll have written a custom
            // plot function
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
                params.push(`[${this.plot.xDomain?.toString()}]`);
                params.push(`[${this.plot.yDomain?.toString()}]`);

                str = `plot(${params.join(", ")})`;
            }
        }
        lines.push(`${this.opts.evaluate ? "=" : "~"}${str}`);
        return lines.join("\n");
    }

    static parseCodeBlock(source: string): PadScope[] | undefined {
        const lines = source.split("\n");
        const engine = createEngine();
        const ret: PadScope[] = [];
        lines.forEach((line) => {
            if (line.startsWith("=") || line.startsWith("~")) {
                // process the input
                ret.push(
                    new PadScope(line.substring(1)).process(
                        engine,
                        {},
                        {
                            evaluate: line.startsWith("~"),
                        }
                    )
                );
            } else {
                new PadScope(line).process(engine, {}, {});
            }
        });

        return ret;
    }
}
