import * as React from "react";
import Latex from "./Latex";
import PadSlot from "../Math/PadSlot";
import { useCallback, useEffect, useRef, useState } from "react";
import Close from "../icons/close.svg";
import Plot from "./Plot";
import { MathpadContext } from "./MathpadView";
// import { FunctionPlotOptions } from "function-plot/dist/types";
interface PadSlotViewState {
    edit: boolean;
}

const DEFAULT_SLOT_STATE: PadSlotViewState = {
    edit: false
}

const PadSlotView = ({ padSlot, onChanged, onClosed }:
    {
        padSlot: PadSlot,
        onChanged: (id: number, value: string) => void,
        onClosed: (id: number) => void,
    }) => {

    const [state, setState] = useState(DEFAULT_SLOT_STATE);
    const { edit } = state;
    const txtRef = useRef<HTMLTextAreaElement>(null);

    const cxt = React.useContext(MathpadContext);

    const onMouseDown = useCallback(
        (e: React.MouseEvent) => {
            setState(state => {
                console.log(state.edit);
                return (state.edit ? state : {
                    ...state, edit: true
                });
            });
        },
        [],
    )

    const finishEdit = useCallback((value: string) => {
        setState(state => ({ ...state, edit: false }))
        onChanged(padSlot.id, value);
    }, [padSlot.id, onChanged]);

    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.code === "Enter") {

            e.preventDefault();
            finishEdit(e.currentTarget.value);
        }
    }, []);

    const onBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
        // console.log("blur")

        finishEdit(e.currentTarget.value);
    }, [finishEdit]);

    const onClose = useCallback((e: React.MouseEvent) => {
        onClosed(padSlot.id)
    }, [padSlot.id])

    useEffect(() => {
        if (txtRef.current) {
            txtRef.current.setSelectionRange(txtRef.current.value.length, txtRef.current.value.length);
            setTimeout(() => { txtRef.current?.focus() }, 0);
        }
    })


    return (
        <div className="slot-container">
            <div className="slot-anchor">
                <div className="slot-name">{padSlot.name}</div>
            </div>
            <div className="slot-content">
                <div className="slot-input" onMouseDown={onMouseDown}>
                    {edit ?
                        <textarea
                            className="mathpad-input"
                            rows={1} wrap="off"
                            defaultValue={padSlot.input}
                            onKeyDown={onKeyDown}
                            onBlur={onBlur}
                            ref={txtRef}
                        />
                        :
                        padSlot.inputLaTeX ?
                            <Latex latex={padSlot.inputLaTeX} />
                            :
                            <div className="plain-input">{padSlot.input}</div>
                    }

                </div>
                <div className="slot-result">
                    {
                        padSlot.error ?
                            <div className="slot-error">{padSlot.error}</div>
                            :
                            <Latex latex={padSlot.laTeX} />

                    }
                </div>
                <div>
                    <Plot options={{
                        width: cxt.width-20,
                        data: [
                            {
                                graphType: 'polyline',
                                fn: (scope: any) => padSlot.fn(scope.x),

                            }
                        ],
                        target: "" // just to make tslint happy
                    }} />
                </div>
            </div>
            <a className="view-action mod-close-leaf" onClick={onClose}>
                <Close />
            </a>
        </div>
    );
}

export default PadSlotView
