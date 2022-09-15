import { ParseResult } from './../Math/Parsing';
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
    parseResult: ParseResult;
    pos?: number;
    onlyResult: boolean;
    /**
     *
     */
    constructor(padScope: PadScope, parseResult: ParseResult, onlyResult: boolean, pos?: number) {
        super();
        this.padScope = padScope;
        this.parseResult = parseResult;
        this.pos = pos;
        this.onlyResult = onlyResult;
        // this.isLatex = isLatex;÷
    }

    toDOM(view: EditorView): HTMLElement {
        // div.addClass("eh")
        let el: HTMLElement;
        if(this.padScope.isValid) {

            el = renderMath(
                this.onlyResult?this.padScope.laTeX:this.padScope.noteLatex,
                this.parseResult.block
            );
            
            finishRenderMath();
            el.addClasses(["mathpad-inline"]);
        } else {
            const div = document.createElement("div");
            div.setText(this.padScope.error||"");
            el = div;
        }
        
        if(isNumber(this.pos)){
            el.addEventListener("click",()=>{
                this.pos && view.dispatch({selection: {anchor: this.pos}})
                console.log();
            });
        }

        return el;
    }
}

export class EmptyWidget extends WidgetType {
    toDOM(view: EditorView): HTMLElement {
        console.log("empty widget");
        const span = document.createElement("span");
        // span.setText("test")
        return span;
    }
}
