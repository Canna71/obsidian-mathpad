
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

const NERDAMER_INITIAL_FUNCS = Object.keys(nerdamer.getCore().PARSER.functions);

interface MathPadOptions {
    evaluate: boolean;
}

interface MathPadState {
    input: string;
    stack: PadSlot[];
    options: MathPadOptions;
}

const DEFAULTSTATE : MathPadState = {
    input: "",
    stack: [],
    options: {
        evaluate: true
    }
}


export const MathpadContainer = () => { 

    const [state, setState] = useState(DEFAULTSTATE);

    const {input,stack,  options:{evaluate}} = state;
    // const [input, setInput] = useState("");
    // const [history, setHistory] = useState<PadSlot[]>([])
    const edRef = useRef<HTMLTextAreaElement>(null);
    // const [options, setOptions] = useState<MathPadOptions>({
    //     evaluate: true 
    // });

    const findNextId = useCallback(()=>{
        if(!stack.length) return "1";
        const maxId = Math.max(...stack.map(slot=>parseInt(slot.id)));
        console.log(maxId);
        return `${maxId+1}`;
    },[stack])

    const processInput = useCallback( () => {
        
       
        const pad = new PadSlot(findNextId(),input).process({},evaluate);
        setState({...state,
            stack:[...state.stack, pad],
            input: ""
        })
    },[state, setState, input, evaluate, findNextId]);
	
    const onKeyDown = useCallback((e:React.KeyboardEvent)=>{
        if(e.code === "Enter") {
            e.preventDefault();
            processInput();
        }
    },[processInput]);

    const onChange = useCallback((e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        setState({...state, input: e.target.value});
    },[state, setState])

    const onToggleEvaluate = useCallback( ()=>{
        setState({
            ...state, 
            options: {...state.options, 
                        evaluate:!evaluate}
                });
    },[setState, evaluate,setState]);

    const onSlotChanged = 
        useCallback((changedId:string, value:string)=>{

        const newStack = stack.map(
            (ms,i)=>ms.id===changedId ? 
            new PadSlot(ms.id,value):ms).map(slot=>slot.process({},evaluate));
        

        setState({
            ...state,
            stack: newStack
        })
    },[stack, state, setState]);



	return (
		<div className="mathpad-container">
            <div className="toolbar">
                <button onClick={onToggleEvaluate}>{evaluate?"Num":"Sym"}</button>
            </div>
			{
                stack.map((ms,i)=>(
                    <PadSlotView key={i} padSlot={ms} onChanged={onSlotChanged} />
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
