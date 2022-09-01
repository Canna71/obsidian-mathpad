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
        const div = this.containerEl.createDiv();

        if (!this.isLatex) {
            div.innerText =
                this.padScope.input + " = " + this.padScope.expression.text();
        } else {
            const mathEl = renderMath(
                this.padScope.inputLaTeX + " = " + this.padScope.laTeX,
                true
            );
            div.appendChild(mathEl);
            finishRenderMath();
        }

        this.containerEl.replaceWith(div);
    }
}
