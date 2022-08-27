import * as React from "react";
import Latex from "./Latex";
import PadSlot from "../Math/PadSlot";

import Plot from "./Plot";
import { MathpadContext } from "./MathpadView";
import { MarkdownPostProcessorContext } from "obsidian";
// import { createSlot } from "src/Math/PadStack";
import { createRoot } from "react-dom/client";
import { createEngine } from "src/Math/Engine";

const codeBlockRegex = /^\s*(\w*):\s?(.*)\s*$/gm;

function parseSource(source: string){
    let m:RegExpExecArray|null;
    const ob:any = {};
    codeBlockRegex.lastIndex=0;
    while ((m = codeBlockRegex.exec(source)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === codeBlockRegex.lastIndex) {
            codeBlockRegex.lastIndex++;
        }
        
        // The result can be accessed through the `m`-variable.
    
            ob[m[1]] = m[2];

    }
    return ob;
}

export function processCodeBlock(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {

    const {input/*, expr*/} = parseSource(source);

    // const slot = createSlot(1,expr,{});
    // TODO: take processing options from source
    // const slot = new PadSlot(1, expr).process(createEngine(),{});
    const slot = PadSlot.createSlot(createEngine(), 1, input);

    //TODO: determine what to store in the codeblock
    // we should store the input and the variable declarations needed, ideally
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (slot as any)._input= input;

    const root = createRoot(el);
    root.render( 
        <React.StrictMode>
            <MathpadContext.Provider value={{
                width: 600
            }}>
                <DocView padSlot={slot} />
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
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

