import * as React from "react";
import Latex from "./Latex";
import { MathInput } from "./MathInput";

const SlotInput:React.FC<{
    onMouseDown: (e: React.MouseEvent) => void,
    edit: boolean,
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void,
    onBlur: (e: React.FocusEvent<HTMLElement>) => void,
    input: string,
    inputLaTeX?: string

}> = ({ onMouseDown, edit, onKeyDown, onBlur, input, inputLaTeX }) => {




    return (<div className="slot-input" onMouseDown={onMouseDown}>
        {edit ? 
        <MathInput 
        className="mathpad-input" 
        defaultValue={input} 
        onKeyDown={onKeyDown} 
        onBlur={onBlur}  
         /> 
        : 
        inputLaTeX ? 
            <Latex latex={inputLaTeX} block={true} /> 
            : 
            <div className="plain-input">{input}</div>}

    </div>);
}

export default SlotInput


