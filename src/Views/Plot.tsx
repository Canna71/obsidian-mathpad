import React, { useCallback, useEffect, useRef, useState } from 'react'
import functionPlot, { Chart } from 'function-plot'
import { FunctionPlotOptions } from 'function-plot/dist/types';
import { debounce } from 'obsidian';

//cfr: https://mauriciopoppe.github.io/function-plot/

export interface FunctionPlotProps {
    options?: FunctionPlotOptions,
    onScaleChanged?: (options: FunctionPlotOptions) => void
}

export const Plot: React.FC<FunctionPlotProps> =
    React.memo(({ options, onScaleChanged }:
        {
            options: FunctionPlotOptions,
            onScaleChanged: (options: FunctionPlotOptions) => void
        }) => {
        const rootEl = useRef<HTMLDivElement>(null);
        // const chartRef = useRef<Chart>(null);

        const [state] = useState(options);

        const handleScaleChanged = debounce(useCallback((options: FunctionPlotOptions)=>{
            onScaleChanged && onScaleChanged(options);
        },[onScaleChanged]),300);

        useEffect(() => {
            try {
                if (rootEl.current) {
                    Object.assign(state, options);
                    state.target = rootEl.current;

                    // functionPlot({...options, target: rootEl.current });
                    const chart: Chart = functionPlot(state);
                    chart.on("all:zoom", (_event) => {
                        // console.log(w);
                        handleScaleChanged(chart.options);
                    });
                }
            } catch (e) {
                //
            }
        }, [options, handleScaleChanged])

        return (<div ref={rootEl} />)
    }, () => false);

export default Plot;
