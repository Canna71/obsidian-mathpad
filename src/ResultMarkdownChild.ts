import { MarkdownRenderChild } from "obsidian";

export class MathResult extends MarkdownRenderChild {
  

  text: string;

  constructor(containerEl: HTMLElement, text: string) {
    super(containerEl);

    this.text = text;
  }

  onload() {
    const resEl = this.containerEl.createSpan({
      text: this.text,
    });
    this.containerEl.replaceWith(resEl);
  }
}
