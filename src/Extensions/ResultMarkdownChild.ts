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
    
            const mathEl = renderMath(
                this.padScope.noteLatex,
                this.isLatex
            );

            finishRenderMath();
            mathEl.dataset.mathpadInput=this.padScope.input+"=?";
            this.containerEl.replaceWith(mathEl);
        }
        
        
    }
}
