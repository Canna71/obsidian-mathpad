export interface MathpadSettings {
    addRibbonIcon: boolean;
    showAtStartup: boolean;
    preferBlock: boolean;
    evaluate: boolean;
    declarationStr: string;
    // declarationNumeric: string;
    // declarationSymbolic: string;
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
    showAtStartup: true,
    preferBlock: true,
    evaluate: false,
    declarationStr: ":=",
    // declarationNumeric: ":=~",
    // declarationSymbolic: ":==",
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
