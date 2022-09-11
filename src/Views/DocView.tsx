import * as React from "react";
import Latex from "./Latex";
import PadSlot from "../Math/PadSlot";

import Plot from "./Plot";
import { MathpadContext } from "./MathpadView";
import { MarkdownPostProcessorContext } from "obsidian";
// import { createSlot } from "src/Math/PadStack";
import { createRoot } from "react-dom/client";
import PadScope from "src/Math/PadScope";
import { IMathpadSettings } from "src/MathpadSettings";
// import { createEngine } from "src/Math/Engine";

/* const codeBlockRegex = /^\s*(\w*):\s?(.*)\s*$/gm;

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
} */

export function processCodeBlock(source: string, el: HTMLElement, settings: IMathpadSettings, ctx: MarkdownPostProcessorContext) {

    // const {input/*, expr*/} = parseSource(source);

    // const slot = createSlot(1,expr,{});
    // TODO: take processing options from source
    // const slot = new PadSlot(1, expr).process(createEngine(),{});
    const scopes = PadSlot.parseCodeBlock(source, settings);


    //TODO: determine what to store in the codeblock
    // we should store the input and the variable declarations needed, ideally
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // (slot as any)._input= input;

    const root = createRoot(el);
    root.render( 
        <React.StrictMode>
            <MathpadContext.Provider value={{
                width: 600
            }}>
                {scopes?.map((padScope,i)=><DocView key={i} padScope={padScope} />) }
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

                <Latex latex={padScope.inputLaTeX + " " + (padScope.parseResult.evaluate?"=":"=") + " " + padScope.laTeX} />
         
                
                

               
                    {
                        padScope.error &&
                            <div className="slot-error">{padScope.error}</div>
                           
                    }
                
                {padScope.plot &&
                    <div>
                        <Plot options={{
                            width: cxt.width - 20,
                            data: padScope.fn.map(fn=>({
                                graphType: 'polyline',
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                fn: (scope: any) => fn(scope.x)
                            })) ,
                            xAxis: padScope.plot.xDomain && padScope.plot.xDomain.length==2 && {domain: padScope.plot.xDomain},
                            yAxis: padScope.plot.yDomain && padScope.plot.yDomain.length==2 && {domain: padScope.plot.yDomain},
                            target: "" // just to make tslint happy
                        }} 
                    
                        />
                    </div>
                }

            </div>
        </div>
    );
}

export default DocView

