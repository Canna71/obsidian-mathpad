import { amendSettings } from 'src/Math/Parsing';
import { MathpadSettings } from 'src/MathpadSettings';
import parse from 'src/Math/Parsing';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Engine } from './Engine';
import PadScope from './PadScope';
import { ProcessOptions } from './PadStack';


export default class PadSlot extends PadScope {

   
    private _id: number;
    





    public get id(): number {
        return this._id;
    }

    /**
     *
     */
    constructor(id: number) {
        super();
        this._id = id;
    }

    static createSlot(engine:Engine, id: number, input: string, settings: MathpadSettings, options:ProcessOptions= {
        evaluate: false,
        simplify: false
    }) {
        const parseResult = parse(input, amendSettings(settings,options));
        return new PadSlot(id).process(engine,parseResult) as PadSlot;
    }



}
