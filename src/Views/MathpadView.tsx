/* eslint-disable @typescript-eslint/ban-types */
import { debounce, finishRenderMath, ItemView, MarkdownView, Notice, View, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";

import { MathpadContainer } from "./MathpadContainer";


import { loadMathJax } from "obsidian";
import PadSlot from "src/Math/PadSlot";
// import { MathpadSettings } from "src/MathpadSettings";
import MathpadPlugin from "src/main";
import { MathpadSettings } from "src/MathpadSettings";
export const MATHPAD_VIEW = "mathpad-view";

export const MathpadContext = React.createContext<any>({});

function copyContent(view: View, content: string, block?: boolean) {

    if(block !==undefined){
        content = block ? `$$${content}$$`:`$${content}$`;   
    }


    if(view instanceof MarkdownView && view.getMode()==="source"){
        view.editor.replaceSelection(content);
    } else {
        navigator.clipboard.writeText(content);
        new Notice("Content copied to clipboard");
    }
}

export class MathpadView extends ItemView {
    // settings: MathpadSettings;
    root: Root;
    state = {

    };
    private _plugin: MathpadPlugin;
    



    constructor(leaf: WorkspaceLeaf, plugin: MathpadPlugin) {
        super(leaf);
        // this.settings = getMathpadSettings();
        this.state = {

        };
        this.icon = "sigma";
        this.onCopySlot = this.onCopySlot.bind(this);
        this._plugin = plugin;
        this.onChangeEvaluate = this.onChangeEvaluate.bind(this);
    }

    getViewType() {
        return MATHPAD_VIEW;
    }

    getDisplayText() {
        return "Mathpad";
    }

    public get settings(): MathpadSettings {
        return this._plugin.settings;
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
        
                switch (what) {
                    case "input":
                            copyContent(leaf.view, slot.inputLaTeX, this.settings.preferBlock);
                            break;
                    case "result":
                        copyContent(leaf.view, slot.laTeX, this.settings.preferBlock);

                    break;
                    default:
                        copyContent(leaf.view, `\`\`\`mathpad
${str}
\`\`\`
`)
                        break;
                }



    }

    render() {

        this.root.render(
            <React.StrictMode>
                <MathpadContext.Provider value={{
                    width: this.contentEl.innerWidth,
                    settings: this.settings
                }}>
                    <MathpadContainer  {...this.state} 
                        onCopySlot={this.onCopySlot}
                        onChangeEvaluate={this.onChangeEvaluate}
                        settings={this.settings}
                    />
                </MathpadContext.Provider>
            </React.StrictMode>
        );
    }



    async onOpen() {
        const { contentEl } = this;


        this.root = createRoot(contentEl/*.children[1]*/);
        await loadMathJax();
        await finishRenderMath();
        this.render();
        
    }

    async onClose() {

        this.root.unmount();
    }

    onChangeEvaluate(value: boolean) {
        this.settings.evaluate = value;
        this._plugin.saveSettings();
    }
}
