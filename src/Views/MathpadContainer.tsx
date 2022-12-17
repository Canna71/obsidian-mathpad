import { Input } from './Input';

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import PadSlotView from "./PadSlotView";
import PadSlot from "src/Math/PadSlot";
import { getNewStack, SlotStack, } from "src/Math/PadStack";
import { MathpadSettings } from 'src/MathpadSettings';

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
    history?: number;
}

const DEFAULTSTATE: MathPadState = {
    input: "",
    // stack: null,
    options: {
        evaluate: true
    }
}

function applyFnStr(fn: string, input: string) {
    return `${fn}(${input})`;
}


export const MathpadContainer = ({ onCopySlot, onChangeEvaluate, settings,  }:
    { onCopySlot: (slot: PadSlot, what: string) => void, 
        onChangeEvaluate: (value: boolean) => void,
        settings: MathpadSettings }

) => {

    const [state, setState] = useState({ ...DEFAULTSTATE });

    const { input, stack, options: { evaluate }, selected } = state;


    useEffect(() => {
        setState(state => ({
            ...state, stack: getNewStack(), options:
            {
                ...state.options,
                evaluate: settings.evaluate
            }
        }))
    }, []);

    const processInput = useCallback(() => {
        setState(state =>
            state.input.trim().length > 0 ?
                ({
                    ...state,
                    stack: state.stack?.addSlot(state.input, settings, { evaluate: state.options.evaluate }),
                    input: "",
                    history: undefined
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
        else if (e.code === "ArrowUp" || e.code === "ArrowDown") {
            const delta = e.code === "ArrowUp" ? -1 : 1;
            setState(state => {
                if (!state.stack || state.stack.isEmpty()) return state;
                let history = state.history;
                if (!history) {
                    if (delta < 0) history = state.stack?.getSLotByIndex(state.stack.items.length - 1).id
                    else history = state.stack?.getSLotByIndex(0).id
                } else {
                    let ix = state.stack?.getSlotIndexById(history);
                    ix = Math.clamp(ix + delta, 0, state.stack.items.length - 1);
                    history = state.stack.getSLotByIndex(ix).id;
                }
                const input = state.stack.getSlotById(history)?.input || "";
                return ({ ...state, history, input });
            });
        }
    }, [processInput]);

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setState(state => ({ ...state, input: e.target.value }));
    }, [])

    const onToggleEvaluate = useCallback(() => {
        setState(state => {
            onChangeEvaluate(!state.options.evaluate);
            return ({
                ...state,
                options: {
                    ...state.options,
                    evaluate: !state.options.evaluate
                }
            })
        });
    }, [onChangeEvaluate]);

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
            stack: state.stack?.removeSlot(changedId, {}, { evaluate: state.options.evaluate }),
            selected: state.selected === changedId ? undefined : state.selected,
            history: state.history === changedId ? undefined : state.history
        }))
    }, []);

    const onSlotCopied = useCallback((slot: PadSlot, what: string) => {
        if (what !== "text") {
            slot && setTimeout(() => onCopySlot(slot, what), 0);
        } else {
            setState(state => ({
                ...state,
                input: slot.text
            }))
        }
    }, [onCopySlot]);

    const applyFn = (fn: string) => useCallback(() => {

        setState(state => {
            if (!state.selected) return state;
            const slot = state.stack?.getSlotById(state.selected);
            if (!slot) return state;
            const input = slot?.input;
            const newInput = applyFnStr(fn, input);
            return ({
                ...state,
                stack: state.stack?.addSlot(newInput, settings, { evaluate: state.options.evaluate })
            })
        })
    }, [fn])

    const onSlotClicked = useCallback((changedId: number) => {
        setState(state => ({
            ...state,

            selected: changedId
        }))
    }, []);

    const clear = useCallback(() => {
        setState(state => ({
            ...state,
            stack: state.stack?.clear(),
            selected: undefined,
            history: undefined
        }))
    }, []);

    return (

        <div className="mathpad-container">
            <div className="toolbar">
                <button onClick={onToggleEvaluate} title={evaluate ? "numeric" : "symbolic"} >{evaluate ? "3" : "⒳"}</button>

                <button onClick={applyFn("diff")} title="derivate" disabled={!selected} >𝑓′</button>
                <button onClick={applyFn("integrate")} title="integrate" disabled={!selected}>∫</button>
                <button onClick={applyFn("solve")} title="solve" disabled={!selected}>𝒙=</button>
                <button onClick={applyFn("expand")} title="expand" disabled={!selected}>⋯</button>
                <button onClick={applyFn("simplify")} title="simplify" disabled={!selected}>()</button>
                <button onClick={clear} title={"clear stack"} >✕</button>


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

                </div>

            </div>
            <Input onKeyDown={onKeyDown} input={input} onChange={onChange} />
        </div>

    )
}


