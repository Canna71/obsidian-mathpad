import MathpadPlugin from "src/main";
import { App, PluginSettingTab } from "obsidian";

export class MathpadSettingsTab extends PluginSettingTab {
	plugin: MathpadPlugin;

	constructor(app: App, plugin: MathpadPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'TODO:'});


	}
}
