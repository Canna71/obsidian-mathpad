
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";


// import nerdamer  from "nerdamer/all.min"
import nerdamer  from "nerdamer";
require("nerdamer/Algebra");
require("nerdamer/Calculus");
require("nerdamer/Extra");
require("nerdamer/Solve");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import Algebra from "nerdamer/Algebra";
// import Calculus from "nerdamer/Calculus";

// import Latex from "./Latex";
import PadSlotView from "./PadSlotView";
import PadSlot  from "src/PadSlot";
// import { registerHelper } from "codemirror";
// import codemirror from "codemirror";
// window.codemirror = codemirror;
// import CodeMirror from "codemirror";

// const codemirror = require("codemirror")
// window.codemirror = codemirror;
export interface MathpadContainerProps {
	nothing: string
}

(global as any).nerdamer = nerdamer;


interface MathPadOptions {
    evaluate: boolean;
}


export const MathpadContainer = () => { 

    const [input, setInput] = useState("");
    const [history, setHistory] = useState<PadSlot[]>([])
    const edRef = useRef<HTMLTextAreaElement>(null);
    const [options, setOptions] = useState<MathPadOptions>({
        evaluate: true
    });

    const processInput = (input:string, evaluate=false) => {
        const pad = new PadSlot(input,{},evaluate);
        setHistory([...history, pad]);
        setInput("");
    }
	
    const onKeyDown = useCallback((e:React.KeyboardEvent)=>{
        if(e.code === "Enter") {
            e.preventDefault();
            processInput(input, options.evaluate);
        }
    },[input, options.evaluate]);

    const onChange = useCallback((e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        setInput(e.target.value)
    },[setInput])

    const onToggleEvaluate = useCallback(()=>{
        setOptions({...options,evaluate:!options.evaluate});
    },[setOptions, options])

    useEffect(()=>{
        
    })

	return (
		<div className="mathpad-container">
            <div className="toolbar">
                <button onClick={onToggleEvaluate}>{options.evaluate?"Num":"Sym"}</button>
            </div>
			{
                history.map((ms,i)=>(
                    <PadSlotView key={i} padSlot={ms} />
                ))
            }
            {/* <input type="text" onKeyDown={onKeyDown}  value={input} onChange={onChange} /> */}
            {/* <div ref={divRef}  ></div> */}
            <textarea rows={1} 
                className="mathpad-input"
            wrap="off" onKeyDown={onKeyDown}  value={input} onChange={onChange}  ref={edRef}>

            </textarea>
		</div>
	)
}
