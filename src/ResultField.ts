import { createEngine } from 'src/Math/Engine';
import { ResultWidget } from "./ResultWidget";
import { syntaxTree } from "@codemirror/language";
import { IterMode, SyntaxNodeRef } from "@lezer/common";

import {
    Extension,
    RangeSetBuilder,
    StateField,
    Transaction,
} from "@codemirror/state";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";

// import { Text } from "@codemirror/state";

export const resultField = StateField.define<DecorationSet>({
    create(state): DecorationSet {
        return Decoration.none;
    },
    update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
        // if (transaction.changes.empty) {
        //     return oldState;
        // }
        // let process = true;
        // transaction.changes.iterChanges(((fromA: number, toA: number, fromB: number, toB: number, inserted: Text)=>{
        //     console.log(fromA,toA,fromB, toB, inserted);

        //     if(inserted.length && inserted.lines>1){
        //         process = true;
        //     }
        // }));
        // if(!process) return oldState;
        console.time("decorations");
        const builder = new RangeSetBuilder<Decoration>();
        const doc = transaction.state.doc;
        const engine = createEngine();
        for (let nl = 1; nl <= doc.lines; nl++) {
            const line = doc.line(nl);
            if(line.text.contains(":=")){
                try {
                    const fnDec = engine.tryParseFunc(line.text);
                    if(!fnDec) engine.tryParseVar(line.text);
                } catch(e){
                    console.log(e);
                    console.log(line.text);
                }
            }

            if (line.text.endsWith("=?")) {
                try{
                    const res = engine.parse(line.text.slice(0,-2))

                    builder.add(
                        line.to-1,
                        line.to,
                        Decoration.replace({
                            widget: new ResultWidget(res.text()),
                        })
                    );
                } catch(e){
                    console.log(e);
                    console.log(line.text);

                }

            }
        }
        console.timeEnd("decorations");
        // syntaxTree(transaction.state).iterate({
        //     enter: (node: SyntaxNodeRef)=>{

                // const text = transaction.state.doc.sliceString(node.from, node.to)
                //   if (node.("list")) {
                //     // Position of the '-' or the '*'.
                //     const listCharFrom = node.from - 2;
                //     builder.add(
                //       listCharFrom,
                //       listCharFrom + 1,
                //       Decoration.replace({
                //         widget: new ResultWidget("42"),
                //       })
                //     );
                //   }
                // console.log({...node});
        // console.log(node.type.name, transaction.state.doc.sliceString(node.from, node.to));
                // console.log(text);
                // if(node.type.name === "Document"){
                //     // console.log(JSON.stringify(node));
                // }
        // },
        // mode:IterMode.IncludeAnonymous
        // });
        // console.log("FINISH");

        return builder.finish();
    },
    provide(field: StateField<DecorationSet>): Extension {
        return EditorView.decorations.from(field);
    },
});
