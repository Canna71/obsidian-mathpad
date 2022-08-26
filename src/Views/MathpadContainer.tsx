import { Input } from './Input';

import * as React from "react";
import { useCallback, useEffect, useState } from "react";


// import nerdamer  from "nerdamer/all.min"
import nerdamer from "nerdamer";
require("nerdamer/Algebra");
require("nerdamer/Calculus");
require("nerdamer/Extra");
require("nerdamer/Solve");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import Algebra from "nerdamer/Algebra";
// import Calculus from "nerdamer/Calculus";

// import Latex from "./Latex";
import PadSlotView from "./PadSlotView";
import PadSlot from "src/Math/PadSlot";
import { addSlot, getNewStack, getSlotById, removeSlot, resetContext, updateSlot } from "src/Math/PadStack";
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

interface MathPadState {
    input: string;
    stack: PadSlot[];
    options: MathPadOptions;
}

const DEFAULTSTATE: MathPadState = {
    input: "",
    stack: [],
    options: {
        evaluate: true
    }
}


export const MathpadContainer = ({onCopySlot}:
    {onCopySlot:(slot:PadSlot)=>void}) => {

    const [state, setState] = useState({ ...DEFAULTSTATE, stack: getNewStack() });

    const { input, stack, options: { evaluate } } = state;
    // const [input, setInput] = useState("");
    // const [history, setHistory] = useState<PadSlot[]>([])
    // const [options, setOptions] = useState<MathPadOptions>({
    //     evaluate: true 
    // });
    // console.log(stack);

    useEffect(() => { 
        resetContext();
    }, []);

    const processInput = useCallback(() => {
        setState(state => ({
            ...state,
            stack: addSlot(state.stack, state.input, {}, { evaluate: state.options.evaluate }),
            input: ""
        }))
    }, []);

    const onKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.code === "Enter") {
            e.preventDefault();
            processInput();
        }
    }, [processInput]);

    const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setState(state => ({ ...state, input: e.target.value }));
    }, [])

    const onToggleEvaluate = useCallback(() => {
        setState(state => ({
            ...state,
            options: {
                ...state.options,
                evaluate: !state.options.evaluate
            }
        }));
    }, []);

    const onSlotChanged =
        useCallback((changedId: number, value: string) => {



            setState(state => ({
                ...state,
                stack: updateSlot(state.stack, changedId, value, {}, { evaluate: state.options.evaluate })
            }))
        }, []);

    const onSlotClosed = useCallback((changedId: number) => {
        setState(state => ({
            ...state,
            stack: removeSlot(state.stack, changedId, {}, { evaluate: state.options.evaluate })
        }))
    }, []);

    const onSlotCopied = useCallback((changedId: number) => {
        setState(state=>{
            const slot = getSlotById(state.stack, changedId);

            slot && onCopySlot(slot);
            return state;
        })

    }, []);

    return (

        <div className="mathpad-container">
            <div className="toolbar">
                <button onClick={onToggleEvaluate}>{evaluate ? "Num" : "Sym"}</button>
            </div>
            <div className="mathpad-scroller">
                <div className="mathpad-slots-container">
                    {
                        stack.map((ms) => (
                            <PadSlotView key={ms.id} padSlot={ms}
                                onChanged={onSlotChanged}
                                onClosed={onSlotClosed}
                                onCopied={onSlotCopied}
                            />
                        ))
                    }
                    {/* <input type="text" onKeyDown={onKeyDown}  value={input} onChange={onChange} /> */}
                    {/* <div ref={divRef}  ></div> */}

                </div>

            </div>
            <Input onKeyDown={onKeyDown} input={input} onChange={onChange} />
        </div>

    )
}


