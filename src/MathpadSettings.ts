export interface MathpadSettings {
    addRibbonIcon: boolean;
    showAtStartup: boolean;
    latex: boolean;
    evaluate: boolean;
    declarationStr: string;
    declarationNumeric: string;
    declarationSymbolic: string;
    evaluateStr: string;
    evaluateNumericStr: string;
    evaluateSymbolicStr: string;
    inlinePostfix: string;
    latexPostfix: string;
}   

export const DEFAULT_SETTINGS: MathpadSettings = {
    addRibbonIcon: true,
    showAtStartup: true,
    latex: true,
    evaluate: false,
    declarationStr: ":=",
    declarationNumeric: ":=~",
    declarationSymbolic: ":==",
    evaluateStr: "=?",
    evaluateNumericStr: "=~?",
    evaluateSymbolicStr: "==?",
    inlinePostfix:"-",
    latexPostfix:"$"
}

// export default function getSettings() : IMathpadSettings{
//     return {
//         latex: false
//     }
// }
