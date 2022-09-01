
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
import PadScope from '../Math/PadScope';

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
        console.time("decorations-lines");
        const builder = new RangeSetBuilder<Decoration>();
        const doc = transaction.state.doc;
        const engine = createEngine();
        const tree = syntaxTree(transaction.state);
        // eslint-disable-next-line no-constant-condition
        for (let nl = 1; false && nl <= doc.lines; nl++) {
            const line = doc.line(nl);
            const node = tree.resolve(line.from,1);
            if(node.parent !== null) continue;

            if(line.text.contains(":=")){

                try {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const res = new PadScope(line.text).process(engine,{},{
                        evaluate: true
                    });
                    // const res = engine.parse(line.text.slice(0,-2))
                    builder.add(
                        line.from,
                        line.to,
                        Decoration.mark({class: "mathpad-declaration"})
                    );
                    
                } catch(e){
                    console.log("Excepyion in ResultField update:",e);
                    console.log(line.text);
                }
            }

            if (line.text.endsWith("=?")) {
                try{
                    const res = new PadScope(line.text.slice(0,-2)).process(engine,{},{
                        evaluate: true
                    });
                    // const res = engine.parse(line.text.slice(0,-2))

                    builder.add(
                        line.from,
                        line.to,
                        Decoration.replace({
                            widget: new ResultWidget(res.inputLaTeX+" = "+res.laTeX, true),
                        })
                    );

                    // builder.add(
                    //     line.to-1,
                    //     line.to,
                    //     Decoration.replace({
                    //         widget: new ResultWidget(res.expression.text()),
                    //     })
                    // );
                } catch(e){
                    console.log(e);
                    console.log(line.text);

                }

            }
        }
        console.timeEnd("decorations-lines");


        syntaxTree(transaction.state).iterate({
            enter: (node: SyntaxNodeRef)=>{
                if(node.name === "inline-code"){
                    const text = transaction.state.doc.sliceString(node.from, node.to)
                    console.log(node.name, text);
                    if(text.contains(":=")){

                        try {
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            const res = new PadScope(text).process(engine,{},{
                                evaluate: true
                            });
                            // const res = engine.parse(line.text.slice(0,-2))

                            builder.add(
                                node.from,
                                node.to,
                                Decoration.mark({class: "mathpad-declaration"})
                            );

                            // builder.add(
                            //     node.from,
                            //     node.to,
                            //     Decoration.replace({
                            //         widget: new ResultWidget(res.inputLaTeX+" = "+res.laTeX, true),
                            //     })
                            // );           
                            
                        } catch(e){
                            console.log("Excepyion in ResultField update:",e);
                            console.log(text);
                        }
                    } else if(text.endsWith("=?")) {
                        try{
                            const res = new PadScope(text.slice(0,-2)).process(engine,{},{
                                evaluate: true
                            });
                            // const res = engine.parse(line.text.slice(0,-2))
        
                            builder.add(
                                node.from,
                                node.to,
                                Decoration.replace({
                                    widget: new ResultWidget(res.inputLaTeX+" = "+res.laTeX, true),
                                })
                            );
        
                        } catch(e){
                            console.log(e);
                            console.log(text);
        
                        }
                    }
                }

        },
        mode:IterMode.IncludeAnonymous
        });
        // console.log("FINISH");

        return builder.finish();
    },
    provide(field: StateField<DecorationSet>): Extension {
        return EditorView.decorations.from(field);
    },
});
