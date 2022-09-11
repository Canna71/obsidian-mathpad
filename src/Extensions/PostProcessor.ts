import { ParseResult } from './../Math/Parsing';
import { MathpadSettings } from 'src/MathpadSettings';
import { debounce, MarkdownPostProcessor, MarkdownPostProcessorContext } from "obsidian";
import { createEngine, Engine } from "src/Math/Engine";
import PadScope from "src/Math/PadScope";
import { MathResult } from "./ResultMarkdownChild";
import parse from 'src/Math/Parsing';


export const getPostPrcessor = (settings: MathpadSettings):MarkdownPostProcessor => {
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


function processCode(code: HTMLElement, engine: Engine, context: MarkdownPostProcessorContext, settings: MathpadSettings) {
    let text;
    if (code.nodeName === "CODE") {
        text = (code as any).innerText.trim();
    } else {
        text = code.dataset.mathpadInput;
    }

    const pr = parse(text, settings);
    if(pr.isValid){
        produceResult(pr, engine, context, code);
    }

}

function produceResult(parseResult: ParseResult, engine: Engine, context: MarkdownPostProcessorContext, code: HTMLElement) {
    const res = new PadScope().process(
        engine,
        parseResult
    );
    if(res.isValid){
        context.addChild(new MathResult(code, res, parseResult.latex));
    }
}

export default getPostPrcessor;
