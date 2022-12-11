export interface MathpadSettings {
    addRibbonIcon: boolean;
    showAtStartUp: boolean;
    preferBlock: boolean;
    preferBlockForInline: boolean;
    preferBlockForCodeblock: boolean;
    evaluate: boolean;
    declarationStr: string;
    evaluateStr: string;
    evaluateNumericStr: string;
    evaluateSymbolicStr: string;
    inlinePostfix: string;
    latexPostfix: string;
    hidePrefix: string;
    plotGrid: boolean;
    plotWidth: number;
    plotDerivatives: boolean;
    precision: number;
}   

export const DEFAULT_SETTINGS: MathpadSettings = {
    addRibbonIcon: true,
    showAtStartUp: true,
    preferBlock: false,
    preferBlockForInline: false,
    preferBlockForCodeblock: true,
    evaluate: false,
    declarationStr: ":=",
    evaluateStr: "=?",
    evaluateNumericStr: "=~?",
    evaluateSymbolicStr: "==?",
    inlinePostfix:"-",
    latexPostfix:"$",
    hidePrefix: "%",
    plotGrid: false,
    plotWidth: 0,
    plotDerivatives: false,
    precision: 21
}

// export default function getSettings() : IMathpadSettings{
//     return {
//         latex: false
//     }
// }
