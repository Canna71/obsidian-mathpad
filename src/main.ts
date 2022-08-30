import { resultField } from './ResultField';
import { MathResult } from './ResultMarkdownChild';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MathpadView, MATHPAD_VIEW } from './Views/MathpadView';
import { App, finishRenderMath, loadMathJax, Modal, Plugin } from 'obsidian';
import { MathpadSettingsTab } from 'src/MathpadSettingTab';
import { processCodeBlock } from './Views/DocView';

// Remember to rename these classes and interfaces!

interface MathpadPluginSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: MathpadPluginSettings = {
    mySetting: 'default'
}

export default class MathpadPlugin extends Plugin {
    settings: MathpadPluginSettings;

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
        // this.registerPostProcessor();
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
        this.registerMarkdownPostProcessor((element, context) => {
            console.log("running processor...", element)
            const lines = element.querySelectorAll("div");
      
            for (let index = 0; index < lines.length; index++) {
              const line = lines.item(index);
              const text = line.innerText.trim();
              if(text.endsWith("=")){
                context.addChild(new MathResult(line, "42"));
              }
            }
          });
    }

    async registerEditorExtensions() {
        this.registerEditorExtension(resultField);
    }
}






