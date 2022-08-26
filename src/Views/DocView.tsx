import * as React from "react";
import Latex from "./Latex";
import PadSlot from "../Math/PadSlot";

import Plot from "./Plot";
import { MathpadContext } from "./MathpadView";
import { MarkdownPostProcessorContext } from "obsidian";
import { createSlot } from "src/Math/PadStack";
import { createRoot } from "react-dom/client";



export function processCodeBlock(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {

    const pad = createSlot(1,source,{});

    const root = createRoot(el);
    root.render( 
        <React.StrictMode>
            <MathpadContext.Provider value={{
                width: 600
            }}>
                <DocView padSlot={pad} />
            </MathpadContext.Provider>
        </React.StrictMode>
    );
}


const DocView = ({ padSlot }:
    {
        padSlot: PadSlot

    }) => {


    const cxt = React.useContext(MathpadContext);



    return (
        <div className="slot-container">

            <div className="slot-content">
                {padSlot.input}

                <div className="slot-result">
                    {
                        padSlot.error ?
                            <div className="slot-error">{padSlot.error}</div>
                            :
                            <Latex latex={padSlot.laTeX} />

                    }
                </div>
                {padSlot.plot &&
                    <div>
                        <Plot options={{
                            width: cxt.width - 20,
                            data: padSlot.fn.map(fn=>({
                                graphType: 'polyline',
                                fn: (scope: any) => fn(scope.x)
                            })) ,
                            target: "" // just to make tslint happy
                        }} />
                    </div>
                }

            </div>
        </div>
    );
}

export default DocView

