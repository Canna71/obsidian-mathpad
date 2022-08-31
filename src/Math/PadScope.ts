import { createEngine } from 'src/Math/Engine';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Engine } from './Engine';
import { ProcessOptions } from './PadStack';


export default class PadScope {
    private _input: string;
    private _inputLatex: string;
    // private _id: number;
    private _error?: string | undefined;
    private _plot:any = undefined;
    private _fn:  ((...args: number[]) => number)[];
    private _scope: { vars: { [x: string]: string; }; funcs: { [x: string]: any; }; };
    
    
    private _opts: ProcessOptions;
    
    
    private _subs: any;
    public get subs(): any {
        return this._subs;
    }
    
    public get opts(): ProcessOptions {
        return this._opts;
    }
    
    public get scope(): { vars: { [x: string]: string; }; funcs: { [x: string]: any; }; } {
        return this._scope;
    }
    
    public get plot() {
        return this._plot;
    }

    public get fn():  ((...args: number[]) => number)[] {
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
            this._inputLatex = engine.toLatex(this.input);

            const fnDec = engine.tryParseFunc(this.input)
            if(fnDec){
                const {name,params,def} = fnDec;
                this._expression = engine.parse(def);
                this._resultTex = name + "(" + params.map(param => engine.parse(param).toTeX()).join(",") +
                    ") := " + engine.parse(def).toTeX();
                return this;
            }

            const varDec = engine.tryParseVar(this.input);
            if (varDec) {
                const {name,def} = varDec;

                this._expression = engine.parse(def);

                this._resultTex = name + " := " + engine.parse(def).toTeX();

                return this;
            }
            //TODO: determine when it's right to display the input as LaTeX
            this._expression = engine.parse(this.input, subs);
            if ((this._expression as any).symbol?._plotme) {
                this._plot = (this._expression as any).symbol?._plotme;
            }
            // A martix will trow an exception if we try to simplify it
            if (opts.simplify) {
                try {
                    this._expression = engine.parse(`simplify(${this.input})`, subs);
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
            // engine.setVar(this.name, this.expression.valueOf());
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

    plotParse = /plot\((.*)\)/m
    paramsRefex = / *(\[[^\]].*\])| *([^[,]+) */mg

    getCodeBlock() {
        const lines : string[] = [];
        for(const v in this.scope.vars){
            lines.push(`${v}:=${this.scope.vars[v]}`);
        }
        for(const f in this.scope.funcs){
            // console.log(f,this.scope.funcs[f])
            const def = this.scope.funcs[f][2];
            lines.push(`${def.name}(${def.params.join(",")}):=${def.body}`);
        }
        let str = this.input;

        

        if(this.plot){
            // str = `plot(${str})`;
            //TODO: we shold inject the actual xDomain and yDomain
            // this will be easier to do when we'll have written a custom
            // plot function
            let m;
            if ((m = this.plotParse.exec(this.input)) !== null) {
                const parList = m[1];
                let params=[];
                while (( m = this.paramsRefex.exec(parList)) !== null) {
                    // This is necessary to avoid infinite loops with zero-width matches
                    if (m.index === this.paramsRefex.lastIndex) {
                        this.paramsRefex.lastIndex++;
                    }
                    // m[1] is array
                    // m[2] is not array
                    params.push(m[1] || m[2]);
                }
                if(params[0].startsWith("[")){
                    params = [params[0]];
                } else {
                    params = params.filter(p=>!p.startsWith("["));
                }
                params.push(`[${this.plot.xDomain?.toString()}]`);
                params.push(`[${this.plot.yDomain?.toString()}]`);

                str = `plot(${params.join(", ")})`;
            }

            
        }
        lines.push(
           `${this.opts.evaluate ? "=":"~"}${str}`
        )
        return lines.join("\n");
    }

    static parseCodeBlock(source: string) : PadScope | undefined {
        const lines = source.split("\n");
        const engine = createEngine();
        let ret: PadScope | undefined = undefined;
        lines.forEach(line=>{
            if(line.startsWith("=")||line.startsWith("~")){
                // process the input
                ret = new PadScope(line.substring(1)).process(engine,{},{
                    evaluate: line.startsWith("=")
                })
            } else {
                new PadScope(line).process(engine,{},{})
            }
        })

        return ret;
    }     

}
