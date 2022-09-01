import { EditorView, WidgetType } from "@codemirror/view";
import { finishRenderMath, renderMath } from "obsidian";

export class ResultWidget extends WidgetType {
    text: string;
    isLatex: boolean;

    /**
     *
     */
    constructor(text: string, isLatex=true) {
        super();
        this.text = text;
        this.isLatex = isLatex;
    }

    toDOM(view: EditorView): HTMLElement {
        const div = document.createElement("div");

        if(!this.isLatex){
            div.innerText = this.text;
        } else {
            const mathEl = renderMath(this.text, true);
            div.appendChild(mathEl);
            finishRenderMath();
        }

        return div;
    }
}
