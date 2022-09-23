export interface MathpadSettings {
    addRibbonIcon: boolean;
    showAtStartUp: boolean;
    preferBlock: boolean;
    evaluate: boolean;
    declarationStr: string;
    evaluateStr: string;
    evaluateNumericStr: string;
    evaluateSymbolicStr: string;
    inlinePostfix: string;
    latexPostfix: string;
    hidePrefix: string;
    plotGrid: boolean;
}   

export const DEFAULT_SETTINGS: MathpadSettings = {
    addRibbonIcon: true,
    showAtStartUp: true,
    preferBlock: true,
    evaluate: false,
    declarationStr: ":=",
    evaluateStr: "=?",
    evaluateNumericStr: "=~?",
    evaluateSymbolicStr: "==?",
    inlinePostfix:"-",
    latexPostfix:"$",
    hidePrefix: "%",
    plotGrid: false
}

// export default function getSettings() : IMathpadSettings{
//     return {
//         latex: false
//     }
// }
