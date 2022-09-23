import React, { useCallback, useEffect, useRef, useState } from 'react'
import functionPlot, { Chart } from 'function-plot'
import { FunctionPlotOptions } from 'function-plot/dist/types';
import { debounce } from 'obsidian';
import PadScope from 'src/Math/PadScope';
import { MathpadSettings } from 'src/MathpadSettings';

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

        const [state] = useState(options);

        const handleScaleChanged = debounce(useCallback((options: FunctionPlotOptions)=>{
            onScaleChanged && onScaleChanged(options);
        },[onScaleChanged]),300);

        useEffect(() => {
            try {
                if (rootEl.current) {
                    Object.assign(state, options);
                    state.target = rootEl.current;

                    const chart: Chart = functionPlot(state);
                    chart.on("all:zoom", (_event) => {
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

export function makePlot(cxt: any, padScope: PadScope, settings: MathpadSettings, handlePlotScaleChanhed?: (opts: FunctionPlotOptions) => void): React.ReactNode {
    return <div className="mathpad-plot">
        <Plot options={{
            width: cxt.width - 20,
            grid: settings.plotGrid,
            data: padScope.fn.map(fn => ({
                graphType: 'polyline',
                fn: (scope: any) => fn(scope.x)
            })),
            xAxis: padScope.plot.xDomain && padScope.plot.xDomain.length == 2 && { domain: padScope.plot.xDomain },
            yAxis: padScope.plot.yDomain && padScope.plot.yDomain.length == 2 && { domain: padScope.plot.yDomain },
            target: "", // just to make tslint happy
            
        }} 
        onScaleChanged={handlePlotScaleChanhed}
        />
    </div>;
}
