import { MathpadSettings } from 'src/MathpadSettings';

export interface ParseResult {
    text: string;
    evaluate: boolean;
    block: boolean | undefined;
    isVarDec: boolean;
    isFnDec: boolean;
    isEval: boolean;
    isValid: boolean;
    name: string;
    def: string;
    params: string[];
    hide: boolean;
}

export const SLOT_VARIABLE_PREFIX = "$";

export default function parse(text: string, settings: MathpadSettings) : ParseResult {
    // from text it should return a PadScope?
    // just a text to further parse?
    // let retText=text;
    let evaluate = settings.evaluate;
    let block = undefined;


    let isVarDec = false;
    let isFnDec = false;
    let isEval = false;
    let name = "";
    let params = [] as string[];
    let def = "";
    let hide = false;
    text = text.trim();

    if(text.startsWith(settings.hidePrefix)){
        text = text.slice(settings.hidePrefix.length).trimEnd();
        hide = true;
    }

    if(text.endsWith(settings.inlinePostfix)){
        block = false;
        text = text.slice(0, -settings.inlinePostfix.length).trimEnd();
    } else if (text.endsWith(settings.latexPostfix)) {
        block = true;
        text = text.slice(0, -settings.latexPostfix.length).trimEnd();
    }

    
    // let assign = "";

    if(text.endsWith(settings.evaluateNumericStr)
    ||
    text.endsWith(settings.evaluateSymbolicStr)
    || text.endsWith(settings.evaluateStr)
    ) {
        // evaluation
        isEval = true;


        if (text.endsWith(settings.evaluateNumericStr)) {
            evaluate = true;
            text = text.slice(0, -settings.evaluateNumericStr.length);
        } else if (text.endsWith(settings.evaluateSymbolicStr)) {
            evaluate = false;
            text = text.slice(0, -settings.evaluateSymbolicStr.length);
        } else {
            text = text.slice(0, -settings.evaluateStr.length);
        }
    
    } else {
        // maybe declaration
        const fnDecRegEx = new RegExp("([a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ∞$][0-9a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ$]*)\\(([a-z_,\\s]*)\\)\\s*(" 
        + settings.declarationStr +
        ")\\s*(.+)","i");
    
        const fnDec = fnDecRegEx.exec(text);

        if (fnDec) {
            name = fnDec[1];
            params = fnDec[2].split(",").map((p) => p.trim());
            def = fnDec[4];
            isFnDec = true;
            
        } else {
    
            const varDecRegEx = new RegExp("([a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ∞$][0-9a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ$]*)\\s*(" 
            + settings.declarationStr +
            ")\\s*(.+)","i");
        
            const varDec = varDecRegEx.exec(text);
            if(varDec){
                name=varDec[1];
                def=varDec[3];
                isVarDec = true;
            }
        }

       
    }

    


    return {
        text: text.trim(),
        evaluate,
        block,
        isVarDec,
        isFnDec,
        isEval,
        name,
        def,
        params,
        isValid: isVarDec || isFnDec || isEval,
        hide
    }
}


export function amendSettings(settings: MathpadSettings, parseResult: any):MathpadSettings {
    return ({
        ...settings,
        evaluate: parseResult.evaluate || settings.evaluate
    })
}
