import * as React from "react";
import Latex from "./Latex";
import PadSlot from "../Math/PadSlot";
import { useCallback, useState } from "react";
import Close from "../icons/close.svg";
import Plot from "./Plot";
import { MathpadContext } from "./MathpadView";
import SlotInput from "./SlotInput";
import Copy from "../icons/edit.svg";

// import { FunctionPlotOptions } from "function-plot/dist/types";
interface PadSlotViewState {
    edit: boolean;
}

const DEFAULT_SLOT_STATE: PadSlotViewState = {
    edit: false
}

const PadSlotView = ({ padSlot, onChanged, onClosed, onCopied }:
    {
        padSlot: PadSlot,
        onChanged: (id: number, value: string) => void,
        onClosed: (id: number) => void,
        onCopied: (id: number) => void,

    }) => {

    const [state, setState] = useState(DEFAULT_SLOT_STATE);
    const { edit } = state;

    const cxt = React.useContext(MathpadContext);

    const onMouseDown = useCallback(
        (e: React.MouseEvent) => {
            setState(state => {
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


    const onCopy = useCallback((e: React.MouseEvent) => {
        onCopied(padSlot.id)
    }, [padSlot.id])


    return (
        <div className="slot-container">
            <div className="slot-anchor">
                <div className="slot-name">{padSlot.name}</div>
            </div>
            <div className="slot-content">
                <SlotInput onMouseDown={onMouseDown} edit={edit}
                    onKeyDown={onKeyDown} onBlur={onBlur}
                    input={padSlot.input} inputLaTeX={padSlot.inputLaTeX}
                />
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
                            data: padSlot.fn.map(fn => ({
                                graphType: 'polyline',
                                fn: (scope: any) => fn(scope.x)
                            })),
                            target: "" // just to make tslint happy
                        }} />
                    </div>
                }

            </div>
            <div className="slot-actions">
                <a className="view-action mod-close-leaf" onClick={onClose}>
                    <Close />
                </a>
                <a className="view-action mod-close-leaf" onClick={onCopy}>
                    <Copy />
                </a>
            </div>

        </div>
    );
}

export default PadSlotView

