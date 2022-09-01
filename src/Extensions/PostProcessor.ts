import { debounce, MarkdownPostProcessor, MarkdownPostProcessorContext } from "obsidian";
import { createEngine } from "src/Math/Engine";
import PadScope from "src/Math/PadScope";
import { MathResult } from "./ResultMarkdownChild";


const postProcessor:MarkdownPostProcessor = debounce((element: HTMLElement, context: MarkdownPostProcessorContext) => {
    console.log("running processor...", element,context.docId);
    // todo: debounce and then use context.containerEl
    const codes = (context as any).containerEl.querySelectorAll("p > code");
    const engine = createEngine();
    for (let index = 0; index < codes.length; index++) {
        const code = codes.item(index) as HTMLElement;
        const text = (code as any).innerText.trim();
        if (text.contains(":=")) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const res = new PadScope(text).process(
                engine,
                {},
                {
                    evaluate: true,
                }
            );
            code.addClass("mathpad-declaration");
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
},10);

export default postProcessor;
