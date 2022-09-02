// import { Input } from './../Views/Input';
import PadScope from "src/Math/PadScope";
import { EditorView, WidgetType } from "@codemirror/view";
import { finishRenderMath, renderMath } from "obsidian";
import getSettings from "src/MathpadSettings";

export class ResultWidget extends WidgetType {
    // text: string;
    // isLatex: boolean;
    padScope: PadScope;
    settings: import("/Users/gcannata/Documents/Obsidian Vault/Dev Vault/Dev/.obsidian/plugins/mathpad/src/MathpadSettings").IMathpadSettings;

    /**
     *
     */
    constructor(padScope: PadScope) {
        super();
        this.padScope = padScope;
        this.settings = getSettings();
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
