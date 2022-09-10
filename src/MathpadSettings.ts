export interface IMathpadSettings {
    addRibbonIcon: boolean;
    latex: boolean;
    evaluate: boolean;
}   

export const DEFAULT_SETTINGS: IMathpadSettings = {
    addRibbonIcon: true,
    latex: true,
    evaluate: false
}

// export default function getSettings() : IMathpadSettings{
//     return {
//         latex: false
//     }
// }
