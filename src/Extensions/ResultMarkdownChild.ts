import functionPlot from "function-plot";
import { getMathpadSettings } from "src/main";
import { getPlotOptions } from "src/Views/Plot";
import PadScope from "src/Math/PadScope";
import { finishRenderMath, MarkdownRenderChild, renderMath } from "obsidian";

export class MathResult extends MarkdownRenderChild {
    padScope: PadScope;
    isLatex: boolean;
    plotWidth: number;

    constructor(
        containerEl: HTMLElement,
        padScope: PadScope,
        plotWidth: number,
        isLatex = true
    ) {
        super(containerEl);
        this.padScope = padScope;
        this.isLatex = isLatex;
        this.plotWidth = plotWidth;
        // this.containerEl = containerEl;
    }

    onload() {
        if (!this.padScope.plot) {
            const mathEl = renderMath(this.padScope.noteLatex, this.isLatex);

            finishRenderMath();
            mathEl.dataset.mathpadInput = this.padScope.input + "=?";
            this.containerEl.replaceWith(mathEl);
        } else {
            const plotEl = document.createElement("div");
            plotEl.addClass("mathpad-plot");

            const options = getPlotOptions(
                this.plotWidth,
                getMathpadSettings(),
                this.padScope
            );
            options.target = plotEl;
            functionPlot(options);
            this.containerEl.replaceWith(plotEl);
        }
    }
}
