import React, { useEffect, useRef } from "react";
import { newId } from "src/utils";
import Guppy from "../../node_modules/guppy-js/guppy";

export interface InputProps {
    onKeyDown:(e: React.KeyboardEvent) => void,
    input: string,
    onChange:(e: React.ChangeEvent<HTMLTextAreaElement>) => void,
}

export const Input: React.FC<InputProps> = ({
    onKeyDown,
    input,
    onChange
}) => {
    const edRef = useRef<HTMLDivElement>(null);

    const idRef = useRef<string>(newId());
    useEffect(()=>{
        
        const  g1 = new Guppy(idRef.current);
        g1.configure("buttons",[])
    },[])
 
    return <div className="current-input">
        {/* <textarea rows={1} id={idRef.current} className="mathpad-input" wrap="off" onKeyDown={onKeyDown} value={input} onChange={onChange} ref={edRef}>

        </textarea> */}
        <div id={idRef.current} className="mathpad-input-2"  ref={edRef}>

    </div>
    </div>;
}
