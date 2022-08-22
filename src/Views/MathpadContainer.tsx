
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";


import nerdamer  from "nerdamer/all.min"


// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import Algebra from "nerdamer/Algebra";
// import Calculus from "nerdamer/Calculus";

import { renderMath, finishRenderMath } from "obsidian";
export interface MathpadContainerProps {
	nothing: string
}

(global as any).nerdamer = nerdamer;

const Latex = ({latex}:{latex: string}) => {
    const divRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        const mathEl = renderMath(latex, true);
        divRef.current &&
        divRef.current.replaceChildren(mathEl);
        finishRenderMath();
    })

    return (<div ref={divRef}>

    </div>)
}

interface MathSlot {
    expression: string,
    result: string
}

export const MathpadContainer = () => { 

    const [input, setInput] = useState("");
    const [history, setHistory] = useState<MathSlot[]>([])

    const processInput = (input:string) => {
        const expression = nerdamer(input,{});
        console.log(expression);
        const result = expression.toTeX();
        setHistory([...history, {expression: input.toString(),result}]);
        setInput("");
    }
	
    const onKeyDown = useCallback((e:React.KeyboardEvent)=>{
        if(e.code === "Enter") {
            processInput(input);
        }
    },[input]);

    const onChange = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
        setInput(e.target.value)
    },[setInput])

	return (
		<div className="mathpad-container">
			{
                history.map((ms,i)=>(
                    <div key={i}>
                        <div>{ms.expression}</div>
                        <Latex latex={ms.result} />
                    </div>
                ))
            }
            <input type="text" onKeyDown={onKeyDown}  value={input} onChange={onChange} />
		</div>
	)
}
