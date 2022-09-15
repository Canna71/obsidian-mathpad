import { Input } from './Input';

import * as React from "react";
import { useCallback, useEffect, useState } from "react";




// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import Algebra from "nerdamer/Algebra";
// import Calculus from "nerdamer/Calculus";

// import Latex from "./Latex";
import PadSlotView from "./PadSlotView";
import PadSlot from "src/Math/PadSlot";
import {  getNewStack, SlotStack,  } from "src/Math/PadStack";
import { MathpadSettings } from 'src/MathpadSettings';
// import { registerHelper } from "codemirror";
// import codemirror from "codemirror";
// window.codemirror = codemirror;
// import CodeMirror from "codemirror";

// const codemirror = require("codemirror")
// window.codemirror = codemirror;
export interface MathpadContainerProps {
    nothing: string
}




interface MathPadOptions {
    evaluate: boolean;
}

interface MathPadState {
    input: string;
    stack?: SlotStack;
    options: MathPadOptions;
    selected?: number;
}

const DEFAULTSTATE: MathPadState = {
    input: "",
    // stack: null,
    options: {
        evaluate: true
    }
}

function applyFnStr(fn:string, input:string){
    return `${fn}(${input})`;
}


export const MathpadContainer = ({onCopySlot, settings}:
    {onCopySlot:(slot:PadSlot, what:string)=>void, settings: MathpadSettings}
    
    ) => {

    const [state, setState] = useState({ ...DEFAULTSTATE });

    const { input, stack, options: { evaluate }, selected } = state;
    

    useEffect(() => { 
        setState(state=>({...state, stack: getNewStack(), options:
        {
            ...state.options,
            evaluate: settings.evaluate
        }
        }))
    }, []);

    const processInput = useCallback(() => {
            setState(state => 
                state.input.trim().length>0 ?
                ({
                ...state,
                stack: state.stack?.addSlot(state.input, settings, { evaluate: state.options.evaluate }),
                input: ""
                })
                :
                state
            )
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
                stack: state.stack?.updateSlot(changedId, value, settings, { evaluate: state.options.evaluate })
            }))
        }, []);

    const onSlotClosed = useCallback((changedId: number) => {
        setState(state => ({
            ...state,
            stack: state.stack?.removeSlot(changedId, {}, { evaluate: state.options.evaluate })
        }))
    }, []);

    const onSlotCopied = useCallback((slot: PadSlot, what: string) => {
        slot && setTimeout(()=>onCopySlot(slot, what),0);
    }, [onCopySlot]);

    const applyFn = (fn:string) => useCallback(()=>{

        setState(state=>{
            if(!state.selected) return state;
            const slot = state.stack?.getSlotById(state.selected);
            if(!slot) return state;
            const input = slot?.input;
            const newInput = applyFnStr(fn,input);
            return ({
                ...state,
                stack: state.stack?.addSlot(newInput, settings, { evaluate: state.options.evaluate })
            })
        })
    },[fn])

    const onSlotClicked = useCallback((changedId: number) => {
        setState(state => ({
            ...state,
            
            selected:changedId
        }))
    }, []);

    return (

        <div className="mathpad-container">
            <div className="toolbar">
                <button onClick={onToggleEvaluate} title={evaluate ? "numeric" : "symbolic"} >{evaluate ? "3" : "⒳"}</button>
                <button onClick={applyFn("diff")} title="derivate" >f′</button>
                <button onClick={applyFn("integrate")} title="integrate" >∫</button>
                <button onClick={applyFn("solve")} title="solve" >x=?</button>
                <button onClick={applyFn("expand")} title="expand" >...</button>
                <button onClick={applyFn("simplify")} title="simplify" >()</button>


            </div>
            <div className="mathpad-scroller">
                <div className="mathpad-slots-container">
                    {
                        stack?.items.map((ms) => (
                            <PadSlotView key={ms.id} padSlot={ms}
                                onChanged={onSlotChanged}
                                onClosed={onSlotClosed}
                                onCopied={onSlotCopied}
                                onClicked={onSlotClicked}
                                selected={selected === ms.id}
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


