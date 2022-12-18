import * as React from "react";
import Latex from "./Latex";
import PadSlot from "../Math/PadSlot";
import { useCallback, useState } from "react";
import Close from "../icons/close.svg";
import { makePlot } from "./Plot";
import { MathpadContext } from "./MathpadView";
import SlotInput from "./SlotInput";
import Code from "../icons/code.svg";
import Input from "../icons/input.svg";
import Question from "../icons/question.svg";
import { SlotStack } from "src/Math/PadStack";
import { FunctionPlotOptions } from "function-plot/dist/types";
import Slider from "./Slider";
import { getMathpadSettings } from "src/main";

interface PadSlotViewState {
    edit: boolean;
}

const DEFAULT_SLOT_STATE: PadSlotViewState = {
    edit: false
}

const PadSlotView = ({ padSlot, onChanged, onClosed, onCopied, onClicked, selected }:
    {
        padSlot: PadSlot,
        onChanged: (id: number, value: string) => void,
        onClosed: (id: number) => void,
        onCopied: (slot: PadSlot, what: string) => void,
        onClicked: (id: number) => void,
        selected: boolean
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

    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === "Enter") {

            e.preventDefault();
            finishEdit(e.currentTarget.value);
        }
    }, []);

    const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {

        finishEdit(e.currentTarget.value);
    }, [finishEdit]);

    const onClose = useCallback((e: React.MouseEvent) => {
        onClosed(padSlot.id)
    }, [padSlot.id])

    const onClick = useCallback((e: React.MouseEvent) => {
        !selected && onClicked(padSlot.id)
    }, [padSlot.id, selected])

    const onCopy = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        onCopied(padSlot, e.currentTarget.dataset.copy || "code")
    }, [padSlot])

    const onCopyOutputAsText = useCallback((e: React.MouseEvent<HTMLElement>) => {
        if (!padSlot.error) {
            onCopied(padSlot, "text");
        }
    }, [padSlot])

    const handlePlotScaleChanhed = useCallback((opts: FunctionPlotOptions) => {
        padSlot.plot.xDomain = opts.xAxis?.domain?.map(n => n.toPrecision(3));
        padSlot.plot.yDomain = opts.yAxis?.domain?.map(n => n.toPrecision(3));
    }, []);

    const onSliderChange = useCallback((value:number)=>{
        const newValue = `${padSlot.parseResult.name}${getMathpadSettings().declarationStr}slider(${value}, ${padSlot.range[0].valueOf()}, ${padSlot.range[1].valueOf()})`
        setState(state => ({ ...state, edit: false }))
        onChanged(padSlot.id, newValue);
    },[padSlot.id , onChanged])

    const anchorClassNames = ["slot-anchor"];
    if (selected) {
        anchorClassNames.push("selected");
    }
    return (
        <div className="slot-container">
            <div className={anchorClassNames.join(" ")} onClick={onClick}>
                <div className="slot-name" >{SlotStack.getSlotVariableName(padSlot.id)}</div>
            </div>
            <div className="slot-content">

                <SlotInput onMouseDown={onMouseDown} edit={edit}
                    onKeyDown={onKeyDown} onBlur={onBlur}
                    input={padSlot.input} inputLaTeX={padSlot.inputLaTeX}
                />
                {
                    padSlot.range &&
                    <Slider 
                        value={padSlot.value} 
                        min={padSlot.range[0].valueOf()} 
                        max={padSlot.range[1].valueOf()} 
                        onChange={onSliderChange}
                    />
                }

                <div className="slot-result" onClick={onCopyOutputAsText}>
                    {
                        padSlot.error ?
                            <div className="slot-error">{padSlot.error}</div>
                            :
                            <Latex latex={padSlot.laTeX} block={true} />

                    }
                </div>
                {padSlot.plot && makePlot(cxt, padSlot, cxt.settings, handlePlotScaleChanhed)

                }

            </div>
            <div className="slot-actions">
                <a className="view-action mod-close-leaf" onClick={onClose}>
                    <Close />
                </a>
                {!padSlot.error && <a className="view-action mod-close-leaf" onClick={onCopy} data-copy="code" title="copy to code block" >
                    <Code />
                </a>}
                {!padSlot.error && <a className="view-action mod-close-leaf" onClick={onCopy} data-copy="input" title="copy input as LaTeX" >
                    <Input />
                </a>}
                {!padSlot.error && <a className="view-action mod-close-leaf" onClick={onCopy} data-copy="result" title="copy result as LaTeX">
                    <Question />
                </a>}
            </div>

        </div>
    );
}

export default PadSlotView

