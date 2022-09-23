import * as React from "react";
import Latex from "./Latex";
import PadSlot from "../Math/PadSlot";

import { makePlot } from "./Plot";
import { MathpadContext } from "./MathpadView";
import { MarkdownPostProcessorContext } from "obsidian";
// import { createSlot } from "src/Math/PadStack";
import { createRoot } from "react-dom/client";
import PadScope from "src/Math/PadScope";
import { MathpadSettings } from "src/MathpadSettings";


export function processCodeBlock(source: string, el: HTMLElement, settings: MathpadSettings, ctx: MarkdownPostProcessorContext) {
    
    const scopes = PadSlot.parseCodeBlock(source, settings);
    const containerWidth =   Math.clamp((ctx as any).containerEl.offsetWidth, 200,700) ;
    console.log("containerWidth",containerWidth);
    const plotWidth = settings.plotWidth > 0 ? settings.plotWidth : containerWidth


    // cm-contentContainer max-width
    const root = createRoot(el);
    root.render(
        <React.StrictMode>
            <MathpadContext.Provider value={{
                width: plotWidth,
                settings
            }}>
                {scopes?.map((padScope, i) => <DocView key={i} padScope={padScope} />)}
            </MathpadContext.Provider>
        </React.StrictMode>
    );
}


const DocView = ({ padScope }:
    {
        padScope: PadScope;

    }) => {


    const cxt = React.useContext(MathpadContext);



    return (
        <div className="slot-container">

            <div className="slot-content">

                {
                    padScope.error &&
                    <div className="slot-error">{padScope.error}</div>

                }
                {
                    !padScope.plot &&
                    <Latex latex={padScope.noteLatex} block={padScope.parseResult.block} />
                }
                {
                    padScope.plot &&
                    <Latex latex={padScope.laTeX} block={true} />
                }
                {padScope.plot &&
                    makePlot(cxt, padScope, cxt.settings)
                }

            </div>
        </div>
    );
}

export default DocView



