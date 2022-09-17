import React from "react";
import { useCallback, useEffect, useRef } from "react";



export const closeChars = new Map([
    ['{', '}'],
    ['[', ']'],
    ['(', ')']
]);

export const isCloseChar = new Map([
    ['}', true],
    [']', true],
    [')', true]
]);


export const MathInput: React.FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> = React.memo(props => {

    const txtRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (txtRef.current) {
            txtRef.current.setSelectionRange(txtRef.current.value.length, txtRef.current.value.length);
            // if(!props.placeholder)
            setTimeout(() => { txtRef.current?.focus() }, 0);
        }
    }, [])


    const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        const pos = e.currentTarget.selectionStart || 0;
        const val = [...e.currentTarget.value];

        const char = val.slice(pos - 1, pos)[0];
        const closeChar = closeChars.get(char);
        const inputType = (e.nativeEvent as InputEvent).inputType;
        const el = e.currentTarget;
        console.log(inputType)
        const nextchar = val.slice(pos, pos + 1)[0];

        if (inputType === "insertText" && closeChar && (!nextchar || nextchar === " " || isCloseChar.get(nextchar))) {
            val.splice(pos, 0, closeChar);

            e.currentTarget.value = val.join('');
            el.selectionEnd = pos;
        }

        if (inputType === "insertText" && isCloseChar.get(char)) {


            if (nextchar === char) {
                val.splice(pos, 1);

                el.value = val.join("");
                el.selectionEnd = pos;
            }
        }

        // deleteContentBackward, deleteContentForward
        if (inputType === "deleteContentBackward" || inputType === "deleteContentForward") {
            const removedChar = (props.value as string)?.at(pos);
            if (removedChar) {
                const closeChar = closeChars.get(removedChar)
                if (closeChar) {
                    // const nextChar = el.value[pos];
                    if (isCloseChar.get(nextchar)) {
                        val.splice(pos, 1);
                        el.value = val.join("");
                        el.selectionEnd = pos;
                    }
                }
            }

        }

        // propagate it
        props.onInput && props.onInput(e);
    }, [props.value]);

    return (
        <input type={"text"} {...props} onInput={handleInput} ref={txtRef} >
        </input>
    );

});
