/* eslint-disable @typescript-eslint/no-unused-vars */
import { MathpadView, MATHPAD_VIEW } from './src/Views/MathpadView';
import { App, Modal, Plugin } from 'obsidian';
import { MathpadSettingsTab } from 'src/MathpadSettingTab';

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

        this.app.workspace.onLayoutReady(()=>{
            this.activateView();
        })

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
}




