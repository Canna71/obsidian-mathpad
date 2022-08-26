import React, { useRef } from "react";

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
    const edRef = useRef<HTMLTextAreaElement>(null);


    return <div className="current-input">
        <textarea rows={1} className="mathpad-input" wrap="off" onKeyDown={onKeyDown} value={input} onChange={onChange} ref={edRef}>

        </textarea>
    </div>;
}
