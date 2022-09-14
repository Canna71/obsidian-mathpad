import * as React from "react";
import { renderMath, finishRenderMath } from "obsidian";

import { useEffect, useRef } from "react";


const Latex = ({latex, block}:{latex: string, block: boolean}) => {
    const divRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        const mathEl = renderMath(latex, block);
        divRef.current &&
        divRef.current.replaceChildren(mathEl);
        finishRenderMath();
    })

    return (<div ref={divRef}>

    </div>)
}

export default Latex;
