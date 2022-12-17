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

        new Setting(containerEl)
			.setName("Add Ribbon Icon")
			.setDesc("Adds an icon to the ribbon to open Mathpad sidebar")
			.addToggle(bool => bool
				.setValue(this.plugin.settings.addRibbonIcon)
				.onChange(async (value) => {
					this.plugin.settings.addRibbonIcon = value;
					await this.plugin.saveSettings();
                    if(value){
                        this.plugin.addIcon();
                    } else {
                        this.plugin.removeIcon();
                    }
					this.display();
				})
			);


        this.createToggle(containerEl, "Show Mathpad Sidebar",
        "Opens Mathpad sidebar at startup",
        "showAtStartUp"
    );

        this.createToggle(containerEl, "Copy as Block LaTeX",
            "Prefer LaTeX blocks when copying from sidebar",
            "preferBlock"
        );

        this.createToggle(containerEl, "Prefer Block LaTeX for inline",
            "Prefer LaTeX blocks when rendering inline mathpad code",
            "preferBlockForInline"
        );

        this.createToggle(containerEl, "Prefer Block LaTeX for code blocks",
            "Prefer LaTeX blocks when rendering mathpad code blocks",
            "preferBlockForCodeblock"
        );

        this.createToggle(containerEl, "Evaluate Results",
            "Evaluates expressions in order to obtain a numeric result",
            "evaluate"
        );

        this.createToggle(containerEl, "Plot Grid",
            "Displays grid lines in plots",
            "plotGrid"
        );

        new Setting(containerEl)
        .setName("Plot Width")
        .setDesc("Width of plots inside notes")
        .addText(tc=>tc
            .setValue(this.plugin.settings.plotWidth.toString())
            .onChange(async (value)=>{
                const num = Number(value) ;
                this.plugin.settings.plotWidth = num || 0;
                await this.plugin.saveSettings();
                
            })
            .inputEl.type="number"
            );
        this.createToggle(containerEl, "Plot Tangents",
            "Plots tangents to functions",
            "plotDerivatives"
        );

        new Setting(containerEl)
        .setName("Precision")
        .setDesc("Number of decimals in numeric results")
        .addText(tc=>tc
            .setValue(this.plugin.settings.precision.toString())
            .onChange(async (value)=>{
                const num = Number(value) ;
                this.plugin.settings.precision = num || 21;
                await this.plugin.saveSettings();
            })
            .inputEl.type="number"
            );

        this.createToggle(containerEl, "Scientific Notation",
            "Represents numbers in scientific notation if appropriate",
            "scientific"
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
