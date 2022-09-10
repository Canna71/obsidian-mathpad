import { IMathpadSettings } from 'src/MathpadSettings';
import { debounce, MarkdownPostProcessor, MarkdownPostProcessorContext } from "obsidian";
import { createEngine, Engine } from "src/Math/Engine";
import PadScope from "src/Math/PadScope";
import { MathResult } from "./ResultMarkdownChild";


export const getPostPrcessor = (settings: IMathpadSettings):MarkdownPostProcessor => {
    return debounce((element: HTMLElement, context: MarkdownPostProcessorContext) => {
        console.log("running processor...", element,context.docId);
        // todo: debounce and then use context.containerEl
        const codes = (context as any).containerEl.querySelectorAll("p > code, div[data-mathpad-input]"); 
        const engine = createEngine();
        // const settings = getSettings();
        for (let index = 0; index < codes.length; index++) {
            const code = codes.item(index) as HTMLElement;
            processCode(code, engine, context, settings);
        }
    },100);
}

// const postProcessor:MarkdownPostProcessor = debounce((element: HTMLElement, context: MarkdownPostProcessorContext) => {
//     console.log("running processor...", element,context.docId);
//     // todo: debounce and then use context.containerEl
//     const codes = (context as any).containerEl.querySelectorAll("p > code, div[data-mathpad-input]"); 
//     const engine = createEngine();
//     // const settings = getSettings();
//     for (let index = 0; index < codes.length; index++) {
//         const code = codes.item(index) as HTMLElement;
//         processCode(code, engine, context, settings);
//     }
// },100);


function processCode(code: HTMLElement, engine: Engine, context: MarkdownPostProcessorContext, settings: IMathpadSettings) {
    let text;
    if (code.nodeName === "CODE") {
        text = (code as any).innerText.trim();
    } else {
        text = code.dataset.mathpadInput;
    }

    if (text.contains(":=")) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        produceResult(text, engine, context, code, settings);
    } else if (text.endsWith("=?")) {
        produceResult(text.slice(0, -2), engine, context, code, settings);
    }
}

function produceResult(text: any, engine: Engine, context: MarkdownPostProcessorContext, code: HTMLElement, settings: IMathpadSettings) {
    const res = new PadScope(text).process(
        engine,
        {},
        {
            evaluate: settings.evaluate,
        }
    );
    context.addChild(new MathResult(code, res, settings.latex));
}

export default getPostPrcessor;
