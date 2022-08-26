import { ProcessOptions } from './PadStack';
import nerdamer from "nerdamer";
require("nerdamer/Algebra");
require("nerdamer/Calculus");
require("nerdamer/Extra");
require("nerdamer/Solve");

const funRegex = /^([a-z_][a-z\d_]*)\(([a-z_,\s]*)\)\s*:=\s*(.+)$/i;
const varRegex = /^([a-z_][a-z\d_]*)\s*:=\s*(.+)$/i;
export default class PadSlot {

    private _input: string;
    private _inputLatex: string;
    private _id: number;
    private _error?: string | undefined;
    private _plot = false;
    private _fn:  ((...args: number[]) => number)[];

    public get plot() {
        return this._plot;
    }

    public get fn():  ((...args: number[]) => number)[] {
        return this._fn;
    }


    public get error(): string | undefined {
        return this._error;
    }






    public get id(): number {
        return this._id;
    }

    //TODO: make it configurable 
    // cfr: nerdamer.getCore().Settings.VALIDATION_REGEX
    public get name(): string {
        return `S${this._id}`;
    }


    public get inputLaTeX(): string {
        return this._inputLatex;
    }


    public get input(): string {
        return this._input;
    }


    private _expression: nerdamer.Expression;
    public get expression(): nerdamer.Expression {
        return this._expression;
    }


    private _resultTex = "";

    public get laTeX(): string {
        return this._resultTex;
    }

    /**
     *
     */
    constructor(id: number, input: string) {
        this._input = input;
        this._id = id;
    }

    process(scope = {}, opts: ProcessOptions): PadSlot {
        try {

            this._error = undefined;
            const fnDec = funRegex.exec(this.input);
            if (fnDec) {
                const name = fnDec[1];
                const params = fnDec[2].split(",").map(p => p.trim());
                const def = fnDec[3];
                console.log(name, params, def);
                this._expression = nerdamer(def);
                this._resultTex = name + "(" + params.map(param => nerdamer(param).toTeX()).join(",") +
                    ") := " + nerdamer(def).toTeX();
                // nerdamer.setVar(this.name, this._expression);
                (nerdamer as any).getVars("object")[this.name] = (this._expression as any).symbol.clone();

                return this;
            }
            const varDec = varRegex.exec(this.input);
            if (varDec) {
                const name = varDec[1];
                const def = varDec[2];
                this._expression = nerdamer(def);
                nerdamer.setVar(name, def);

                this._resultTex = name + " := " + nerdamer(def).toTeX();
                // nerdamer.setVar(this.name, this._expression.symbol);
                (nerdamer as any).getVars("object")[this.name] = (this._expression as any).symbol.clone();

                return this;
            }
            //TODO: determine when it's right to display the input as LaTeX
            // this._inputLatex = nerdamer(this.input).toTeX();
            this._expression = nerdamer(this.input, scope);
            if ((this._expression as any).symbol?._plotme) {
                this._plot = true;
            }
            // A martix will trow an exception if we try to simplify it
            if (opts.simplify) {
                try {
                    this._expression = nerdamer(`simplify(${this.input})`, scope);
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

            // console.log(this.expression);
            // if(this._expression.isNumber() && evaluate) {
            //     // this._resultTex = this.expression.toTeX("decimal");
            //     this._resultTex = this.expression.toDecimal();
            // } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this._resultTex = (this.expression as any).toTeX(opts.evaluate ? "decimal" : undefined);
            // }
            // if(this._expression.isNumber())
            //     this._expression = this._expression.toDecimal();

            // nerdamer.setVar(this.name, this._expression.symbol);
            //TODO: this won't work for collections!!
            // try{
            //     (nerdamer as any).getVars("object")[this.name] = (this._expression as any).symbol.clone();
            // } catch {
            //     (nerdamer as any).getVars("object")[this.name] = (this._expression as any).symbol;
            // }
            nerdamer.setVar(this.name, this.expression.valueOf());
            // this.expression.valueOf()
            try {
                const tmp:((...args: number[]) => number)[] = [];
                (this.expression as any).each((element:any)=>{
                    tmp.push(nerdamer(element).buildFunction());
                });
                // this._fn = this.expression.buildFunction();
                this._fn =  tmp;
            } catch(ex){
                console.error(ex);
            }
        } catch (e) {
            this._error = e.toString();
            console.warn(e);
        }
        return this;

    }

}
