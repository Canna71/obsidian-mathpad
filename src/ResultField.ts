import { ResultWidget } from "./ResultWidget";
// import { syntaxTree } from "@codemirror/language";

import {
    Extension,
    RangeSetBuilder,
    StateField,
    Transaction,
} from "@codemirror/state";
import {
    Decoration,
    DecorationSet,
    EditorView,
    
} from "@codemirror/view";

import { Text } from "@codemirror/state"; 

export const resultField = StateField.define<DecorationSet>({
    create(state): DecorationSet {
        return Decoration.none;
    },
    update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
        if(transaction.changes.empty){
            return oldState;
        } 
        let process = false;
        transaction.changes.iterChanges(((fromA: number, toA: number, fromB: number, toB: number, inserted: Text)=>{
            console.log(fromA,toA,fromB, toB, inserted);
            
            if(inserted.length && inserted.lines>1){
                process = true;
            }
        }));
        if(!process) return oldState; 
        const builder = new RangeSetBuilder<Decoration>();
        console.log("START"); 
        const doc = transaction.state.doc;
                
                for(let nl=1;nl<=doc.lines;nl++){
                    const line = doc.line(nl);
                    if(line.text.endsWith("=")){
                        builder.add(line.to,line.to,Decoration.widget({
                            widget: new ResultWidget("Line: " + nl)
                        }))
                    }
                }
        // syntaxTree(transaction.state).iterate({
        //     enter(node: any) {
                

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
                // console.log(node.type.name);
                // console.log(text);
                // if(node.type.name === "Document"){
                //     // console.log(JSON.stringify(node));
                // }
            // },
        // });
        // console.log("FINISH");
 
        return builder.finish();
    },
    provide(field: StateField<DecorationSet>): Extension {
        return EditorView.decorations.from(field);
    },
});
