// import { Input } from './../Views/Input';
import  PadScope  from 'src/Math/PadScope';
import { EditorView, WidgetType } from "@codemirror/view";
import { finishRenderMath, renderMath } from "obsidian";

export class ResultWidget extends WidgetType {
    // text: string;
    isLatex: boolean;
    padScope: PadScope;

    /**
     *
     */
    constructor(padScope: PadScope, isLatex=true) {
        super();
        this.padScope = padScope;
        this.isLatex = isLatex;
    }

    toDOM(view: EditorView): HTMLElement {
        const div = document.createElement("div");
        div.addClass("eh")

        if(!this.isLatex){
            div.innerText = this.padScope.expression.text();
        } else {
            const mathEl = renderMath(this.padScope.inputLaTeX+" = "+this.padScope.laTeX, true);
            
            
            div.appendChild(mathEl);
            finishRenderMath();
        }

        return div;
    }
}
