import React, { useEffect, useRef } from 'react'
import functionPlot from 'function-plot'
import { FunctionPlotOptions } from 'function-plot/dist/types';

//cfr: https://mauriciopoppe.github.io/function-plot/

export interface FunctionPlotProps {
    options?: FunctionPlotOptions
}

export const Plot: React.FC<FunctionPlotProps> = 
    React.memo(({ options }:{options:FunctionPlotOptions}) => {
    const rootEl = useRef<HTMLDivElement>(null)

    useEffect(() => {
        try {
            if(rootEl.current){
                functionPlot({...options, target: rootEl.current });
            }
        } catch (e) { 
            //
        }
    })

    return (<div ref={rootEl} />)
}, () => false);

export default Plot;
