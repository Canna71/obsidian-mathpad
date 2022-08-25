import { ProcessOptions } from './PadStack';
import nerdamer from "nerdamer";
const funRegex = /^([a-z_][a-z\d_]*)\(([a-z_,\s]*)\)\s*:=\s*(.+)$/i;
const varRegex = /^([a-z_][a-z\d_]*)\s*:=\s*(.+)$/i;
export default class PadSlot {

    private _input: string;
    private _inputLatex: string;
    private _id: number;
 
    public get id(): number {
        return this._id;
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


    private _resultTex="";

    public get laTeX(): string {
        return this._resultTex;
    }

    /**
     *
     */
    constructor(id:number, input: string) {
        this._input = input;
        this._id = id;
    }

    process(scope={},opts:ProcessOptions): PadSlot {
        
        const fnDec = funRegex.exec(this.input);
        if(fnDec){
            const name = fnDec[1];
            const params = fnDec[2].split(",").map(p=>p.trim());
            const def = fnDec[3];
            console.log(name, params, def);
            nerdamer.setFunction(name, params, def);
            this._resultTex = name+"("+params.map(param=>nerdamer(param).toTeX()).join(",")+
                ") := " + nerdamer(def).toTeX();
            return this;
        }
        const varDec = varRegex.exec(this.input);
        if(varDec){
            const name = varDec[1];
            const def = varDec[2];
            nerdamer.setVar(name, def);
            this._resultTex = name + " := " + nerdamer(def).toTeX();
            return this;
        }
        //TODO: determine when it's right to display the input as LaTeX
        // this._inputLatex = nerdamer(this.input).toTeX();
        this._expression = nerdamer(this.input, scope);
        // A martix will trow an exception if we try to simplify it
        if(opts.simplify){
            try{
                this._expression = nerdamer(`simplify(${this.input})`, scope);
            } catch(e){
                //
            }
        }


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if(!(this._expression as any).isFraction()){
            // this will return the symbol itself, not the Expression
            // this._expression = (this._expression as any).simplify();
            if(opts.evaluate){
                this._expression = this._expression.evaluate(); 
            }
        }  
 
        // console.log(this.expression);
        // if(this._expression.isNumber() && evaluate) {
        //     // this._resultTex = this.expression.toTeX("decimal");
        //     this._resultTex = this.expression.toDecimal();
        // } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this._resultTex = (this.expression as any).toTeX(opts.evaluate?"decimal":undefined);
        // }
        // if(this._expression.isNumber())
        //     this._expression = this._expression.toDecimal();
        return this;
    }

}
