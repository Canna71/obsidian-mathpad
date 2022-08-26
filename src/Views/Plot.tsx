import React, { useEffect, useRef, useState } from 'react'
import functionPlot from 'function-plot'
import { FunctionPlotOptions } from 'function-plot/dist/types';

//cfr: https://mauriciopoppe.github.io/function-plot/

export interface FunctionPlotProps {
    options?: FunctionPlotOptions
}

export const Plot: React.FC<FunctionPlotProps> = 
    React.memo(({ options }:{options:FunctionPlotOptions}) => {
    const rootEl = useRef<HTMLDivElement>(null)

    const [state] = useState(options);

    useEffect(() => {
        try {
            if(rootEl.current){
                Object.assign(state, options);
                state.target = rootEl.current;
                // functionPlot({...options, target: rootEl.current });
                functionPlot(state);
            }
        } catch (e) { 
            //
        }
    },[options])

    return (<div ref={rootEl} />)
}, () => false);

export default Plot;
