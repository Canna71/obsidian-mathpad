import MathpadPlugin from "src/main";
import { App, PluginSettingTab, Setting } from "obsidian";


export class MathpadSettingsTab extends PluginSettingTab {
	plugin: MathpadPlugin;

	constructor(app: App, plugin: MathpadPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Mathpad Settings'});

        this.createToggle(containerEl, "Add Ribbon Icon",
            "Adds an icon to the ribbon to launch scan",
            "addRibbonIcon"
        );

        this.createToggle(containerEl, "Show Mathpad Sidebar",
        "Opens Mathpad sidebar at startup",
        "showAtStartUp"
    );

        this.createToggle(containerEl, "Default to LaTeX",
            "Inline expressions will be rendered in LaTeX blocks by default",
            "latex"
        );
        this.createToggle(containerEl, "Evaluate Results",
            "Evaluates expressions in order to obtain a numeric result",
            "evaluate"
        );

        this.createToggle(containerEl, "Plot Grid",
            "Displays grid lines in plots",
            "plotGrid"
        );
	}

    private createToggle(containerEl: HTMLElement, name: string, desc: string, prop: string) {
		new Setting(containerEl)
			.setName(name)
			.setDesc(desc)
			.addToggle(bool => bool
				.setValue((this.plugin.settings as any)[prop] as boolean)
				.onChange(async (value) => {
					(this.plugin.settings as any)[prop] = value;
					await this.plugin.saveSettings();
					this.display();
				})
			);
	}
}
