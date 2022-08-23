import nerdamer from "nerdamer";

export class PadSlot {

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
    constructor(input: string, context = {}) {
        this._input = input;
        this._expression = nerdamer(input, context);
        console.log(this.expression);
        this._resultTex = this.expression.toTeX();
    }

}
