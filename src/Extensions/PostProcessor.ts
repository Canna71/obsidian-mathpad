import { debounce, MarkdownPostProcessor, MarkdownPostProcessorContext } from "obsidian";
import { createEngine } from "src/Math/Engine";
import PadScope from "src/Math/PadScope";
import { MathResult } from "./ResultMarkdownChild";


const postProcessor:MarkdownPostProcessor = debounce((element: HTMLElement, context: MarkdownPostProcessorContext) => {
    console.log("running processor...", element,context.docId);
    // todo: debounce and then use context.containerEl
    const codes = (context as any).containerEl.querySelectorAll("p > code, div[data-mathpad-input]"); 
    const engine = createEngine();
    for (let index = 0; index < codes.length; index++) {
        const code = codes.item(index) as HTMLElement;
        let text;
        if(code.nodeName==="CODE"){
            text = (code as any).innerText.trim();
        } else {
            text = code.dataset.mathpadInput;
        }
        
        if (text.contains(":=")) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const res = new PadScope(text).process(
                engine,
                {},
                {
                    evaluate: true,
                }
            );
            context.addChild(new MathResult(code, res));
        } else if (text.endsWith("=?")) {
            const res = new PadScope(text.slice(0, -2)).process(
                engine,
                {},
                {
                    evaluate: true,
                }
            );
            context.addChild(new MathResult(code, res));
        }
    }
},100);

export default postProcessor;
