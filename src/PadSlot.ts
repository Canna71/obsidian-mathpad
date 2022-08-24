import nerdamer from "nerdamer";
const funRegex = /^([a-z_][a-z\d_]*)\(([a-z_,\s]*)\)\s*:=\s*(.+)$/gi;
export default class PadSlot {

    private _input: string;
    private _inputLatex: string;

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
    constructor(input: string) {
        this._input = input;
    }

    process(scope={},evaluate=false): PadSlot {
        const fnDec = funRegex.exec(this.input);
        if(fnDec){
            const name = fnDec[1];
            const params = fnDec[2].split(",").map(p=>p.trim());
            const def = fnDec[3];
            console.log(name, params, def);
            nerdamer.setFunction(name, params, def);
            return this;
        }
        this._inputLatex = nerdamer(this.input).toTeX();
        try{
            this._expression = nerdamer(`simplify(${this.input})`, scope);
        } catch(e){
            this._expression = nerdamer(this.input, scope);
        }

        if(!(this._expression as any).isFraction()){
            // this will return the symbol itself, not the Expression
            // this._expression = (this._expression as any).simplify();
            if(evaluate){
                this._expression = this._expression.evaluate(); 
            }
        }  
 
        console.log(this.expression);
        // if(this._expression.isNumber() && evaluate) {
        //     // this._resultTex = this.expression.toTeX("decimal");
        //     this._resultTex = this.expression.toDecimal();
        // } else {
            this._resultTex = (this.expression as any).toTeX(evaluate?"decimal":undefined);
        // }
        // if(this._expression.isNumber())
        //     this._expression = this._expression.toDecimal();
        return this;
    }

}
