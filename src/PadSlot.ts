import nerdamer from "nerdamer";

export default class PadSlot {

    private _input: string;
    public get input(): string {
        return this._input;
    }
    

    private _expression: nerdamer.Expression;
    public get expression(): nerdamer.Expression {
        return this._expression;
    }


    private _resultTex: string;

    public get laTeX(): string {
        return this._resultTex;
    }

    /**
     *
     */
    constructor(input: string, context = {}, evaluate=false) {
        this._input = input;
        this._expression = nerdamer(input, context);
        if(evaluate){
            this._expression = this._expression.evaluate();
            
        }
        console.log(this.expression);
        if(this._expression.isNumber() && evaluate) {
            this._resultTex = this.expression.toDecimal();
        } else {
            this._resultTex = this.expression.toTeX();
        }
        // if(this._expression.isNumber())
        //     this._expression = this._expression.toDecimal();
    }

}
