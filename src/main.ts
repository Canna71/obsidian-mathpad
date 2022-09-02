import { IMathpadSettings } from 'src/MathpadSettings';
import { MarkdownView } from 'obsidian';
// import { createEngine } from 'src/Math/Engine';
import { mathpadConfigField, resultField, setConfig } from './Extensions/ResultField';
// import { MathResult } from './Extensions/ResultMarkdownChild';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MathpadView, MATHPAD_VIEW } from './Views/MathpadView';
import { App, finishRenderMath, loadMathJax, Modal, Plugin, WorkspaceLeaf } from 'obsidian';
import { MathpadSettingsTab } from 'src/MathpadSettingTab';
import { processCodeBlock } from './Views/DocView';
import PadScope from './Math/PadScope';
import { getPostPrcessor } from './Extensions/PostProcessor';
 
// Remember to rename these classes and interfaces!



const DEFAULT_SETTINGS: IMathpadSettings = {
    latex: true
}

export default class MathpadPlugin extends Plugin {
    settings: IMathpadSettings;

    async onload() {
        await this.loadSettings();

        this.registerView(
            MATHPAD_VIEW,
            (leaf) => new MathpadView(leaf)
        );

        // This creates an icon in the left ribbon.
        const ribbonIconEl = this.addRibbonIcon('dice', 'Open Mathpad', (evt: MouseEvent) => {
            this.activateView();
        });
        // Perform additional things with the ribbon
        ribbonIconEl.addClass('my-plugin-ribbon-class');

        this.app.workspace.onLayoutReady(() => {
            this.activateView();
        })

        this.registerCodeBlock();
        this.registerPostProcessor();
        this.registerEditorExtensions();

        // if (this.app.workspace.layoutReady) {
        //     this.activateView();
        // } else {
        //     this.registerEvent(
        //         this.app.workspace.on('something',
        //             () => {
        //                 console.log('something');
        //                 this.activateView();
        //             }
        //         )
        //     );
        // }

        this.app.workspace.on("active-leaf-change",(leaf: WorkspaceLeaf | null) =>{
            // console.log("active-leaf-change", leaf);
            if(leaf?.view instanceof MarkdownView){
                // @ts-expect-error, not typed
                const editorView = leaf.view.editor.cm as EditorView;
                setConfig(editorView,this.settings);
            }
        }, this);

        this.app.workspace.on("codemirror",(cm: CodeMirror.Editor) =>{
            console.log("codemirror", cm);
        }, this)

        this.app.scope
    }

    onunload() {
        this.app.workspace.detachLeavesOfType(MATHPAD_VIEW);
    }

    

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async activateView() {
        this.app.workspace.detachLeavesOfType(MATHPAD_VIEW);

        await this.app.workspace.getRightLeaf(false).setViewState({
            type: MATHPAD_VIEW,
            active: true,
        });

        this.app.workspace.revealLeaf(
            this.app.workspace.getLeavesOfType(MATHPAD_VIEW)[0]
        );
    }
 
    async registerCodeBlock() {
        await loadMathJax();
        await finishRenderMath();
        this.registerMarkdownCodeBlockProcessor("mathpad", (source, el, ctx) => {

            processCodeBlock(source,el,ctx);
        });
    }


    async registerPostProcessor() {
        console.log("registerPostProcessor")
        // await loadMathJax();
        // await finishRenderMath();
        this.registerMarkdownPostProcessor(getPostPrcessor(this.settings));
    }

    async registerEditorExtensions() {
        this.registerEditorExtension([resultField, mathpadConfigField]);
    }

   
}






