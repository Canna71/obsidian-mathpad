import * as React from "react";
import { useEffect, useRef } from "react";
import Latex from "./Latex";

const SlotInput:React.FC<{
    onMouseDown: (e: React.MouseEvent) => void,
    edit: boolean,
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void,
    onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void,
    input: string,
    inputLaTeX?: string

}> = ({ onMouseDown, edit, onKeyDown, onBlur, input, inputLaTeX }) => {

    const txtRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (txtRef.current) {
            txtRef.current.setSelectionRange(txtRef.current.value.length, txtRef.current.value.length);
            setTimeout(() => { txtRef.current?.focus() }, 0);
        }
    })

    return (<div className="slot-input" onMouseDown={onMouseDown}>
        {edit ? 
        <textarea 
        className="mathpad-input" 
        rows={1} wrap="off"
        defaultValue={input} 
        onKeyDown={onKeyDown} 
        onBlur={onBlur} 
        ref={txtRef} /> 
        : 
        inputLaTeX ? 
            <Latex latex={inputLaTeX} /> 
            : 
            <div className="plain-input">{input}</div>}

    </div>);
}

export default SlotInput


