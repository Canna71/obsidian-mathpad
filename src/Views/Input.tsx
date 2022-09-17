import React from "react";
import { MathInput } from "./MathInput";

export interface InputProps {
    onKeyDown: (e: React.KeyboardEvent) => void,
    input: string,
    onChange: (e: React.ChangeEvent<HTMLElement>) => void,
}

export const Input: React.FC<InputProps> = ({
    onKeyDown,
    input,
    onChange
}) => {

    return <div className="current-input">
        <MathInput placeholder=">" className="mathpad-input" onKeyDown={onKeyDown} value={input} onChange={onChange}  />

    </div>;
}


