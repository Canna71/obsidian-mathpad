import * as React from "react";
import Latex from "./Latex";
import PadSlot from "../Math/PadSlot";
import { useCallback, useState } from "react";

interface PadSlotViewState {
    edit: boolean;
}

const DEFAULT_SLOT_STATE: PadSlotViewState = {
    edit: false
}

const PadSlotView = ({ padSlot, onChanged }: 
    { padSlot: PadSlot,
        onChanged: (id:string, value:string)=>void
    }) => {

    const [state, setState] = useState(DEFAULT_SLOT_STATE);
    const {edit} = state;

    const onMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if(!edit){
                setState({...state,edit:true});
            }
        },
        [setState,edit],
    )

    const onKeyDown = useCallback((e:React.KeyboardEvent<HTMLTextAreaElement>)=>{
        if(e.code === "Enter") {
            console.log("enter:", e);
            e.preventDefault();
            setState({...state,edit:false})
            onChanged(padSlot.id, e.currentTarget.value);
        }
    },[padSlot.id, onChanged, setState, state]);

    return (
        <div className="slot-container">
            <div className="slot-input" onMouseDown={onMouseDown}>
                {edit?
                    <textarea className="mathpad-input" rows={1} wrap="off" defaultValue={padSlot.input} onKeyDown={onKeyDown} />
                :
                    padSlot.inputLaTeX ?
                    <Latex latex={padSlot.inputLaTeX} />
                    :
                    padSlot.input
                }
                
            </div>
            <div className="slot-result">
                <Latex latex={padSlot.laTeX} />
            </div>
        </div>
    );
}

export default PadSlotView
