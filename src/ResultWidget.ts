import { EditorView, WidgetType } from "@codemirror/view";

export class ResultWidget extends WidgetType {
    text: string;

    /**
     *
     */
    constructor(text: string) {
        super();
        this.text = text;
    }

    toDOM(view: EditorView): HTMLElement {
        const div = document.createElement("span");

        div.innerText = this.text;

        return div;
    }
}
