import { DEFAULT_SETTINGS, MathpadSettings } from "src/MathpadSettings";
import { addIcon, MarkdownView } from "obsidian";
// import { createEngine } from 'src/Math/Engine';
import {
    mathpadConfigField,
    resultField,
    setConfig,
} from "./Extensions/ResultField";
// import { MathResult } from './Extensions/ResultMarkdownChild';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MathpadView, MATHPAD_VIEW } from "./Views/MathpadView";
import {
    App,
    finishRenderMath,
    loadMathJax,
    Modal,
    Plugin,
    WorkspaceLeaf,
} from "obsidian";
import { MathpadSettingsTab } from "src/MathpadSettingTab";
import { processCodeBlock } from "./Views/DocView";
import PadScope from "./Math/PadScope";
import { getPostPrcessor } from "./Extensions/PostProcessor";

const sigma = `<path stroke="currentColor" fill="none" d="M78.6067 22.8905L78.6067 7.71171L17.8914 7.71171L48.2491 48.1886L17.8914 88.6654L78.6067 88.6654L78.6067 73.4866" opacity="1"  stroke-linecap="round" stroke-linejoin="round" stroke-width="6" />
`;

// Remember to rename these classes and interfaces!

let gSettings: MathpadSettings;

export function getMathpadSettings() { return gSettings; }
export default class MathpadPlugin extends Plugin {
    settings: MathpadSettings;
 
    async onload() {
        await this.loadSettings();

        this.registerView(MATHPAD_VIEW, (leaf) => new MathpadView(leaf));

        addIcon("sigma",sigma); 


        if (this.settings.addRibbonIcon) {
            // This creates an icon in the left ribbon.
            const ribbonIconEl = this.addRibbonIcon(
                "sigma",
                "Open Mathpad",
                (evt: MouseEvent) => {
                    this.activateView();
                }
            );
            // Perform additional things with the ribbon
            ribbonIconEl.addClass("mathpad-ribbon-class");
        }

        this.addCommand({
            id: "show-mathpad-view",
            name: "Show Mathpad Sidebar",
            callback: () => this.activateView(),
          });
         

        this.app.workspace.onLayoutReady(() => {
            if(this.settings.showAtStartup){
                this.activateView();
            }
        });

        this.registerCodeBlock();
        this.registerPostProcessor();
        this.registerEditorExtensions();

        this.app.workspace.on(
            "active-leaf-change",
            (leaf: WorkspaceLeaf | null) => {
                // console.log("active-leaf-change", leaf);
                if (leaf?.view instanceof MarkdownView) {
                    // @ts-expect-error, not typed
                    const editorView = leaf.view.editor.cm as EditorView;
                    setConfig(editorView, this.settings);
                }
            },
            this
        );

        this.app.workspace.on(
            "codemirror",
            (cm: CodeMirror.Editor) => {
                console.log("codemirror", cm);
            },
            this
        );

        this.addSettingTab(new MathpadSettingsTab(this.app, this));
    }

    onunload() {
        this.app.workspace.detachLeavesOfType(MATHPAD_VIEW);
    }

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
        gSettings = this.settings;
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async activateView() {
        this.app.workspace.detachLeavesOfType(MATHPAD_VIEW);

        await this.app.workspace.getRightLeaf(false).setViewState(
            {
                type: MATHPAD_VIEW,
                active: true,
            },
            { settings: this.settings }
        );

        this.app.workspace.revealLeaf(
            this.app.workspace.getLeavesOfType(MATHPAD_VIEW)[0]
        );
    }

    async registerCodeBlock() {
        await loadMathJax();
        await finishRenderMath();
        this.registerMarkdownCodeBlockProcessor(
            "mathpad",
            (source, el, ctx) => {
                processCodeBlock(source, el, this.settings, ctx);
            }
        );
    }

    async registerPostProcessor() {
        console.log("registerPostProcessor");
        // await loadMathJax();
        // await finishRenderMath();
        this.registerMarkdownPostProcessor(getPostPrcessor(this.settings));
    }

    async registerEditorExtensions() {
        this.registerEditorExtension([resultField, mathpadConfigField]);
    }
}
