import { IMathpadSettings } from './../MathpadSettings';
// import { Input } from './../Views/Input';
import PadScope from "src/Math/PadScope";
import { EditorView, WidgetType } from "@codemirror/view";
import { finishRenderMath, renderMath } from "obsidian";
// import getSettings from "src/MathpadSettings";

export class ResultWidget extends WidgetType {
    // text: string;
    // isLatex: boolean;
    padScope: PadScope;
    settings: IMathpadSettings;
    /**
     *
     */
    constructor(padScope: PadScope, settings: IMathpadSettings) {
        super();
        this.padScope = padScope;
        this.settings = settings;
        // this.isLatex = isLatex;÷
    }

    toDOM(view: EditorView): HTMLElement {
        // div.addClass("eh")

        if (!this.settings.latex) {
            const span = document.createElement("span");
            span.innerText =
                this.padScope.input +
                (this.padScope.ident
                    ? ""
                    : " = " + this.padScope.expression?.text());
            return span;
        } else {
            // determine if
            const div = document.createElement("div");
            const mathEl = renderMath(
                this.padScope.inputLaTeX +
                    (this.padScope.ident ? "" : " = " + this.padScope.laTeX),
                true
            );

            div.appendChild(mathEl);
            finishRenderMath();
            return div;
        }
    }
}
