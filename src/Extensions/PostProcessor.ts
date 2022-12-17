import { getMathpadSettings } from 'src/main';
import { ParseResult } from './../Math/Parsing';
import { MathpadSettings } from 'src/MathpadSettings';
import { debounce, MarkdownPostProcessor, MarkdownPostProcessorContext } from "obsidian";
import { createEngine, Engine } from "src/Math/Engine";
import PadScope from "src/Math/PadScope";
import { MathResult } from "./ResultMarkdownChild";
import parse from 'src/Math/Parsing';


export const getPostPrcessor = (settings: MathpadSettings):MarkdownPostProcessor => {
    return debounce((element: HTMLElement, context: MarkdownPostProcessorContext) => {
        // todo: debounce and then use context.containerEl
        const codes = (context as any).containerEl.querySelectorAll("code, div[data-mathpad-input], mjx-container[data-mathpad-input]"); 
        const engine = createEngine();
        // console.log(codes);
        for (let index = 0; index < codes.length; index++) {
            const code = codes.item(index) as HTMLElement;
            processCode(code, engine, context, settings);
        }
    },100);
}


function processCode(code: HTMLElement, engine: Engine, context: MarkdownPostProcessorContext, settings: MathpadSettings) {
    let text;
    if (code.nodeName === "CODE") {
        text = (code as any).innerText.trim();
    } else {
        text = code.dataset.mathpadInput;
    }
    
    // console.log("processCode " + text)
    const pr = parse(text, settings);
    
    if(pr.isValid){
        const containerWidth = Math.clamp((context as any).containerEl.offsetWidth,200,700);
        const plotWidth = settings.plotWidth>0?settings.plotWidth:containerWidth;
        produceResult(pr, engine, context, code, plotWidth);
    }

} 

function produceResult(parseResult: ParseResult, engine: Engine, context: MarkdownPostProcessorContext, code: HTMLElement, plotWidth: number) {
    const res = new PadScope().process(
        engine,
        parseResult
    );
    if(res.isValid){ 
        context.addChild(new MathResult(code, res, plotWidth, parseResult.block || getMathpadSettings().preferBlockForInline));
    }
}

export default getPostPrcessor;
