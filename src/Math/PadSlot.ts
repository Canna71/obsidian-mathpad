/* eslint-disable @typescript-eslint/no-explicit-any */
import { Engine } from './Engine';
import { ProcessOptions } from './PadStack';


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

    static createSlot(engine:Engine, id: number, input: string, scope:any={}, options:ProcessOptions= {
        evaluate: false,
        simplify: false
    }) {
        return new PadSlot(id, input).process(engine,scope, options);
    }

    process(engine: Engine, scope = {}, opts: ProcessOptions): PadSlot {
        try {

            this._error = undefined;
            const fnDec = funRegex.exec(this.input);
            if (fnDec) {
                const name = fnDec[1];
                const params = fnDec[2].split(",").map(p => p.trim());
                const def = fnDec[3];
                console.log(name, params, def);
                this._expression = engine.parse(def);
                this._resultTex = name + "(" + params.map(param => engine.parse(param).toTeX()).join(",") +
                    ") := " + engine.parse(def).toTeX();
                // nerdamer.setVar(this.name, this._expression);
                // (nerdamer as any).getVars("object")[this.name] = (this._expression as any).symbol.clone();
                engine.setFunction(name,params,def);
                engine.setVar(this.name, this.expression.valueOf());

                return this;
            }
            const varDec = varRegex.exec(this.input);
            if (varDec) {
                const name = varDec[1];
                const def = varDec[2];
                this._expression = engine.parse(def);
                engine.setVar(name, def);

                this._resultTex = name + " := " + engine.parse(def).toTeX();
                // nerdamer.setVar(this.name, this._expression.symbol);
                // (nerdamer as any).getVars("object")[this.name] = (this._expression as any).symbol.clone();
                engine.setVar(this.name, this.expression.valueOf());

                return this;
            }
            //TODO: determine when it's right to display the input as LaTeX
            // this._inputLatex = nerdamer(this.input).toTeX();
            this._expression = engine.parse(this.input, scope);
            if ((this._expression as any).symbol?._plotme) {
                this._plot = true;
            }
            // A martix will trow an exception if we try to simplify it
            if (opts.simplify) {
                try {
                    this._expression = engine.parse(`simplify(${this.input})`, scope);
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
            // this won't work for collections!!
            // try{
            //     (nerdamer as any).getVars("object")[this.name] = (this._expression as any).symbol.clone();
            // } catch {
            //     (nerdamer as any).getVars("object")[this.name] = (this._expression as any).symbol;
            // }
            engine.setVar(this.name, this.expression.valueOf());
            // this.expression.valueOf()
            try {
                this._fn = [this.expression.buildFunction()];
                
            } catch(ex){
                // probably it's a collection:
                const tmp:((...args: number[]) => number)[] = [];
                (this.expression as any).each((element:any)=>{
                    tmp.push(engine.parse(element).buildFunction());
                });
                // 
                this._fn =  tmp;
                
            }
        } catch (e) {
            this._error = e.toString();
            console.warn(e);
        }
        return this;

    }

}
