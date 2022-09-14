/* eslint-disable @typescript-eslint/ban-types */
import { debounce, finishRenderMath, ItemView, MarkdownView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";

import { MathpadContainer } from "./MathpadContainer";


import { loadMathJax } from "obsidian";
import PadSlot from "src/Math/PadSlot";
import { MathpadSettings } from "src/MathpadSettings";
export const MATHPAD_VIEW = "mathpad-view";

export const MathpadContext = React.createContext<any>({});

export class MathpadView extends ItemView {
    settings: MathpadSettings;
    root: Root;
    state = {

    };



    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.settings = (this.app as any).plugins.plugins["obsidian-mathpad"].settings as MathpadSettings;
        this.state = {

        };
        this.icon = "sigma";
        this.onCopySlot = this.onCopySlot.bind(this);
    }

    getViewType() {
        return MATHPAD_VIEW;
    }

    getDisplayText() {
        return "Mathpad";
    }

    override onResize(): void {
        super.onResize();
        this.handleResize();
    }

    handleResize = debounce(() => {
        this.render();
    }, 300);


    onCopySlot(slot: PadSlot, what: string) {
        const str = slot.getCodeBlock(this.settings);
        const leaf = this.app.workspace.getMostRecentLeaf();
        if (!leaf) return;
        if (leaf.view instanceof MarkdownView) {
            const editor = leaf.view.editor;
            if (editor) {
                switch (what) {
                    case "input":
                        if (this.settings.preferBlock)
                            editor.replaceSelection(`$$${slot.inputLaTeX}$$`);
                        else
                            editor.replaceSelection(`$${slot.inputLaTeX}$`);
                        break;
                    case "result":
                        if (this.settings.preferBlock)
                            editor.replaceSelection(`$$${slot.laTeX}$$`);
                        else
                            editor.replaceSelection(`$${slot.laTeX}$`);
                        break;
                    default:
                        editor.replaceSelection(`
\`\`\`mathpad
${str}
\`\`\`
                        `)
                        break;
                }


            }
        } else {
            console.warn('Mathpad: Unable to determine current editor.');
            return;
        }


    }

    render() {

        this.root.render(
            <React.StrictMode>
                <MathpadContext.Provider value={{
                    width: this.contentEl.innerWidth,
                    settings: this.settings
                }}>
                    <MathpadContainer  {...this.state} onCopySlot={this.onCopySlot}
                        settings={this.settings}
                    />
                </MathpadContext.Provider>
            </React.StrictMode>
        );
    }



    async onOpen() {
        const { contentEl } = this;
        // contentEl.setText('Woah!');
        // this.titleEl.setText("Obsidian Janitor")	

        this.root = createRoot(contentEl/*.children[1]*/);
        await loadMathJax();
        await finishRenderMath();
        this.render();
        // const e = nerdamer('x^2+2*(cos(x)+x*x)');
        // const latex = e.toTeX();
        // console.log(latex);
        // const mathEl = renderMath(latex, true);
        // contentEl.appendChild(mathEl);
    }

    async onClose() {

        this.root.unmount();
    }
}
