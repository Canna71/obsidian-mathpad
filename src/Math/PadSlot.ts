/* eslint-disable @typescript-eslint/no-explicit-any */
import { Engine } from './Engine';
import PadScope from './PadScope';
import { ProcessOptions } from './PadStack';


// const funRegex = /^([a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ∞$][0-9a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ$]*)\(([a-z_,\s]*)\)\s*:=\s*(.+)$/i;
// const varRegex = /^([a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ∞$][0-9a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ$]*)\s*:=\s*(.+)$/i;
export default class PadSlot extends PadScope {

   
    private _id: number;
    





    public get id(): number {
        return this._id;
    }

    /**
     *
     */
    constructor(id: number, input: string) {
        super(input);
        this._id = id;
    }

    static createSlot(engine:Engine, id: number, input: string, scope:any={}, options:ProcessOptions= {
        evaluate: false,
        simplify: false
    }) {
        return new PadSlot(id, input).process(engine,scope, options) as PadSlot;
    }



}
