import React, { useCallback, useEffect, useRef, useState } from 'react'
import functionPlot, { Chart } from 'function-plot'
import { FunctionPlotOptions, FunctionPlotDatum } from 'function-plot/dist/types';
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

export function getPlotOptions(width: number, settings:MathpadSettings, padScope: PadScope) : FunctionPlotOptions {
    
    const plotDerivatives = settings.plotDerivatives && (padScope.fn.length === padScope.dfn?.length);
    
    const data:FunctionPlotDatum[] = padScope.fn.map((fn,i) => ({
        graphType: 'polyline',
        fn: (scope: any) => fn(scope.x),
        derivative: plotDerivatives ? {
            fn: (scope: any) => padScope.dfn[i](scope.x),
            updateOnMouseMove: true
        } : undefined
    }))
    const dataPoints: FunctionPlotDatum[] = padScope.points.map((serie,i)=>(
        {
            graphType: 'scatter',
            fnType: 'points',
            points: serie
        }
    ))


    return ({
        width: width,
        grid: settings.plotGrid,
        data: data.concat(dataPoints),
        xAxis: padScope.plot.xDomain && padScope.plot.xDomain.length == 2 && { domain: padScope.plot.xDomain },
        yAxis: padScope.plot.yDomain && padScope.plot.yDomain.length == 2 && { domain: padScope.plot.yDomain },
        target: "", // just to make tslint happy
        
    });
}

export function makePlot(cxt: any, padScope: PadScope, settings: MathpadSettings, handlePlotScaleChanhed?: (opts: FunctionPlotOptions) => void): React.ReactNode {
    return <div className="mathpad-plot">
        <Plot 
        options={getPlotOptions(cxt.width - 20, settings, padScope)}
        onScaleChanged={handlePlotScaleChanhed}
        />
    </div>;
}
