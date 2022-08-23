import * as React from "react";
import Latex from "./Latex";
import PadSlot from "../PadSlot";

const PadSlotView = ({padSlot}:{padSlot: PadSlot}) => {
    return (
        <div>
            <div>{padSlot.input}</div>
            <Latex latex={padSlot.laTeX} />
        </div>
    );
}

export default PadSlotView
