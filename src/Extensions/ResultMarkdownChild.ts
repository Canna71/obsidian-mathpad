import PadScope from "src/Math/PadScope";
import { finishRenderMath, MarkdownRenderChild, renderMath } from "obsidian";

export class MathResult extends MarkdownRenderChild {
    padScope: PadScope;
    isLatex: boolean;

    constructor(containerEl: HTMLElement, padScope: PadScope, isLatex = true) {
        super(containerEl);
        this.padScope = padScope;
        this.isLatex = isLatex;
    }

    onload() {
        

        if (!this.isLatex) {
            const span = this.containerEl.createSpan()

            span.innerText =
                this.padScope.input +
                (this.padScope.ident
                    ? ""
                    : " = " + this.padScope.text);
            span.dataset.mathpadInput=this.padScope.input+"=?";  
            this.containerEl.replaceWith(span);

        } else {
            const div = this.containerEl.createDiv();
            const mathEl = renderMath(
                this.padScope.inputLaTeX +
                    (this.padScope.ident ? "" : " = " + this.padScope.laTeX),
                true
            );

            // mathEl.dataset.input=this.padScope.input+"=?";
            
            div.appendChild(mathEl);
            finishRenderMath();
            div.dataset.mathpadInput=this.padScope.input+"=?";
            this.containerEl.replaceWith(div);
        }
        
        
    }
}
