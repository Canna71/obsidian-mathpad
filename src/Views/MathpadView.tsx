/* eslint-disable @typescript-eslint/ban-types */
import {  finishRenderMath, ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";

import { MathpadContainer } from "./MathpadContainer";


import { loadMathJax } from "obsidian";
export const MATHPAD_VIEW = "mathpad-view";

export const MathpadContext = React.createContext<any>({});

export class MathpadView extends ItemView {

	root: Root;
	state= {
	
	};



	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
		this.state = {
			
		};

	}

	getViewType() {
		return MATHPAD_VIEW;
	}

	getDisplayText() {
		return "Mathpad";
	}



	render() {
        
		this.root.render(
			<React.StrictMode>
				<MathpadContext.Provider value={{}}>
					<MathpadContainer  {...this.state} />
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
