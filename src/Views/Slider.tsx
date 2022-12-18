import { SliderComponent } from "obsidian";
import * as React from "react";
import { useEffect, useRef } from "react";

export interface SliderProps {
    value: number,
    min?: number,
    max?: number,
    step?: number | "any",
    onChange?: (value: number) => void,
    disabled?: boolean
}

const Slider = ({ value, onChange, min=0,max=100,step="any", disabled=false }: SliderProps) => {

    const el = useRef<HTMLElement>(null);
    useEffect(() => {
        if (el.current) {
            if (el.current?.firstChild) el.current.removeChild(el.current.firstChild);
            new SliderComponent(el.current)
            .setValue(value)
            .setDisabled(disabled)
            .setLimits(min, max, step)
            .onChange((value:number)=>{
                onChange && onChange(value)
            })
        }
        return () => { if (el.current?.firstChild) el.current.removeChild(el.current.firstChild) }
    }, [disabled, value, min, max, step, onChange])

    return <span className="mathpad-slider" ref={el} ></span>

}

export default Slider;
