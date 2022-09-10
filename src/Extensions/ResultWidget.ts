import { IMathpadSettings } from './../MathpadSettings';
// import { Input } from './../Views/Input';
import PadScope from "src/Math/PadScope";
import { EditorView, WidgetType } from "@codemirror/view";
import { finishRenderMath, renderMath } from "obsidian";
import { isNumber } from 'util';
// import getSettings from "src/MathpadSettings";

export class ResultWidget extends WidgetType {
    // text: string;
    // isLatex: boolean;
    padScope: PadScope;
    settings: IMathpadSettings;
    pos?: number;
    /**
     *
     */
    constructor(padScope: PadScope, settings: IMathpadSettings, pos?: number) {
        super();
        this.padScope = padScope;
        this.settings = settings;
        this.pos = pos;
        // this.isLatex = isLatex;÷
    }

    toDOM(view: EditorView): HTMLElement {
        // div.addClass("eh")
        let el: HTMLElement;
        if (!this.settings.latex) {
            const span = document.createElement("span");
            span.innerText =
                this.padScope.input +
                (this.padScope.ident
                    ? ""
                    : " = " + this.padScope.expression?.text());
            el=span;
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
            el = div;
        }

        if(isNumber(this.pos)){
            el.addEventListener("click",()=>{
                view.dispatch({selection: {anchor: this.pos!}})
                console.log();
            });
        }

        return el;
    }
}
