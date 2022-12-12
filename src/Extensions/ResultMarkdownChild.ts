import functionPlot from "function-plot";
import { getMathpadSettings } from "src/main";
import { getPlotOptions } from "src/Views/Plot";
import PadScope from "src/Math/PadScope";
import { finishRenderMath, MarkdownRenderChild, renderMath } from "obsidian";

export class MathResult extends MarkdownRenderChild {
    padScope: PadScope;
    block: boolean;
    plotWidth: number;

    constructor(
        containerEl: HTMLElement,
        padScope: PadScope,
        plotWidth: number,
        block = true
    ) {
        super(containerEl);
        this.padScope = padScope;
        this.block = block;
        this.plotWidth = plotWidth;
    }

    onload() {
        if (!this.padScope.plot) {
            const mathEl = this.makeLatex();
            this.containerEl.replaceWith(mathEl);
        } else {
            const wrapper = document.createElement("div");
            wrapper.appendChild(this.makeLatex(this.padScope.laTeX));
            const plotEl = document.createElement("div");
            plotEl.addClass("mathpad-plot");

            const options = getPlotOptions(
                this.plotWidth,
                getMathpadSettings(),
                this.padScope
            );
            options.target = plotEl;
            functionPlot(options);
            wrapper.appendChild(plotEl);
            this.containerEl.replaceWith(wrapper);
        }
    }

    private makeLatex(latex?: string) {
        const mathEl = renderMath(latex || this.padScope.noteLatex, this.block);

        finishRenderMath();
        mathEl.dataset.mathpadInput = this.padScope.input + "=?";
        return mathEl;
    }
}
