import * as React from "react";
import Latex from "./Latex";
import PadSlot from "../Math/PadSlot";
import { useCallback, useEffect, useRef, useState } from "react";

interface PadSlotViewState {
    edit: boolean;
}

const DEFAULT_SLOT_STATE: PadSlotViewState = {
    edit: false
}

const PadSlotView = ({ padSlot, onChanged }: 
    { padSlot: PadSlot,
        onChanged: (id:number, value:string)=>void
    }) => {

    const [state, setState] = useState(DEFAULT_SLOT_STATE);
    const {edit} = state;
    const txtRef = useRef<HTMLTextAreaElement>(null);
    const onMouseDown = useCallback(
        (e: React.MouseEvent) => {
            setState(state=>{
                console.log(state.edit);
                return (state.edit ? state : {
                ...state,edit:true
                });
            });
        },
        [],
    )

    const finishEdit = useCallback((value:string)=>{
        setState(state=>({...state,edit:false}))
        onChanged(padSlot.id, value);
    },[padSlot.id,onChanged]);

    const onKeyDown = useCallback((e:React.KeyboardEvent<HTMLTextAreaElement>)=>{
        if(e.code === "Enter") {
            
            e.preventDefault();
            finishEdit(e.currentTarget.value);
        }
    },[]);

    const onBlur = useCallback((e:React.FocusEvent<HTMLTextAreaElement>)=>{
        // console.log("blur")

        finishEdit(e.currentTarget.value);
    },[finishEdit]);

    useEffect(()=>{
        if(txtRef.current){
            txtRef.current.setSelectionRange(txtRef.current.value.length, txtRef.current.value.length);
            setTimeout(()=>{txtRef.current?.focus()},0);
        }
    })

    return (
        <div className="slot-container">
            <div className="slot-input" onMouseDown={onMouseDown}>
                {edit?
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
                <Latex latex={padSlot.laTeX} />
            </div>
        </div>
    );
}

export default PadSlotView
