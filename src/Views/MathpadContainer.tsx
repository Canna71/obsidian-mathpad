
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";


// import nerdamer  from "nerdamer/all.min"
import nerdamer  from "nerdamer";
require("nerdamer/Algebra");
require("nerdamer/Calculus");
require("nerdamer/Extra");
require("nerdamer/Solve");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import Algebra from "nerdamer/Algebra";
// import Calculus from "nerdamer/Calculus";

import Latex from "./Latex";
import { PadSlot } from "src/PadSlot";

import Guppy from "../../node_modules/guppy-js/guppy";
import styles from "../../styles.scss";

export interface MathpadContainerProps {
	nothing: string
}

(global as any).nerdamer = nerdamer;





export const MathpadContainer = () => { 

    const [input, setInput] = useState("");
    const [history, setHistory] = useState<PadSlot[]>([])
    const divRef = useRef<HTMLDivElement>(null);

    const processInput = (input:string) => {
        const pad = new PadSlot(input,{});
        setHistory([...history, pad]);
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

    useEffect(()=>{
        if(divRef.current) {
            const guppy = new Guppy("guppydiv");
            console.log(guppy); 
        }
    })

	return (
		<div className="mathpad-container">
			{
                history.map((ms,i)=>(
                    <div key={i}>
                        <div>{ms.input}</div>
                        <Latex latex={ms.laTeX} />
                    </div>
                ))
            }
            {/* <input type="text" onKeyDown={onKeyDown}  value={input} onChange={onChange} /> */}
            <div ref={divRef} id="guppydiv" style={{width:"400px"}} ></div>
		</div>
	)
}
