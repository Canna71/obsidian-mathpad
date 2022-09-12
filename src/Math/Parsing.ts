import { MathpadSettings } from 'src/MathpadSettings';

export interface ParseResult {
    text: string;
    evaluate: boolean;
    latex: boolean;
    isVarDec: boolean;
    isFnDec: boolean;
    isEval: boolean;
    isValid: boolean;
    name: string;
    def: string;
    params: string[];
}



export default function parse(text: string, settings: MathpadSettings) : ParseResult {
    // from text it should return a PadScope?
    // just a text to further parse?
    let retText=text;
    let evaluate = settings.evaluate;
    let latex = settings.latex;
    let isVarDec = false;
    let isFnDec = false;
    let isEval = false;
    let name = "";
    let params = [] as string[];
    let def = "";
    text = text.trim();

    if(text.endsWith(settings.inlinePostfix)){
        latex = false;
        text = text.slice(0, -settings.inlinePostfix.length).trimEnd();
    } else if (text.endsWith(settings.latexPostfix)) {
        latex = true;
        text = text.slice(0, -settings.latexPostfix.length).trimEnd();
    }

    
    let assign = "";

    if(text.endsWith(settings.evaluateNumericStr)
    ||
    text.endsWith(settings.evaluateSymbolicStr)
    || text.endsWith(settings.evaluateStr)
    ) {
        // evaluation
        isEval = true;


        if (text.endsWith(settings.evaluateNumericStr)) {
            evaluate = true;
            retText = text = text.slice(0, -settings.evaluateNumericStr.length);
        } else if (text.endsWith(settings.evaluateSymbolicStr)) {
            evaluate = false;
            retText = text = text.slice(0, -settings.evaluateSymbolicStr.length);
        } else {
            retText = text = text.slice(0, -settings.evaluateStr.length);
        }
    
    } else {
        // maybe declaration
        const fnDecRegEx = new RegExp("([a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ∞$][0-9a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ$]*)\\(([a-z_,\\s]*)\\)\\s*(" 
        + settings.declarationStr + "|" + settings.declarationNumeric + "|" + settings.declarationSymbolic +
        ")\\s*(.+)","i");
    
        const fnDec = fnDecRegEx.exec(text);

        if (fnDec) {
            name = fnDec[1];
            params = fnDec[2].split(",").map((p) => p.trim());
            assign = fnDec[3];
            def = fnDec[4];
            isFnDec = true;
            
            // this.setVar(name, def);
            // console.log(fnDec, name, def);
        } else {
    
            const varDecRegEx = new RegExp("([a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ∞$][0-9a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ$]*)\\s*(" 
            + settings.declarationStr + "|" + settings.declarationNumeric + "|" + settings.declarationSymbolic +
            ")\\s*(.+)","i");
        
            const varDec = varDecRegEx.exec(text);
            if(varDec){
                name=varDec[1];
                assign=varDec[2];
                def=varDec[3];
                isVarDec = true;
            }
        }

        if(assign === settings.declarationNumeric) {
            evaluate = true;
        } else if (assign === (settings.declarationSymbolic)){
            evaluate = false;
        }
    }

    


    return {
        text: retText,
        evaluate,
        latex,
        isVarDec,
        isFnDec,
        isEval,
        name,
        def,
        params,
        isValid: isVarDec || isFnDec || isEval
    }
}


export function amendSettings(settings: MathpadSettings, parseResult: any):MathpadSettings {
    return ({
        ...settings,
        latex: parseResult.latex || settings.latex,
        evaluate: parseResult.evaluate || settings.evaluate
    })
}
