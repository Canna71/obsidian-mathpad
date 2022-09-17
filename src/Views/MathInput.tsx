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


export const MathInput: React.FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>> = React.memo(props => {

    const txtRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (txtRef.current) {
            // txtRef.current.setSelectionRange(txtRef.current.value.length, txtRef.current.value.length);
            // if(!props.placeholder)
            setTimeout(() => { txtRef.current?.focus() }, 0);
        }
    })


    const handleInput = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
        const pos = e.currentTarget.selectionStart || 0;
        const val = [...e.currentTarget.value];

        const char = val.slice(pos - 1, pos)[0];
        const closeChar = closeChars.get(char);


        if ((e.nativeEvent as InputEvent).inputType === "insertText" && closeChar) {
            val.splice(pos, 0, closeChar);
            const el = e.currentTarget
            e.currentTarget.value = val.join('');
            // setTimeout(()=>{
                el.selectionEnd = pos;
            // },0)
        } 
        
        if ((e.nativeEvent as InputEvent).inputType === "insertText" && isCloseChar.get(char)) {
            const nextchar = val.slice(pos, pos+1)[0];

            if(nextchar === char){
                val.splice(pos,1);
                const el = e.currentTarget

                el.value = val.join("");
                // setTimeout(()=>{
                    el.selectionEnd = pos;
                // },0)
            }
        }
        // propagate it
        props.onInput && props.onInput(e);
    }, []);
    
    return (
        <textarea rows={1} wrap="off" type={"text"} {...props}  onInput={handleInput} ref={txtRef} >
        </textarea>
    );

});
