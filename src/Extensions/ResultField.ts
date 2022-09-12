import parse, { ParseResult } from './../Math/Parsing';
import { MathpadSettings } from "src/MathpadSettings";

import { createEngine, Engine } from "src/Math/Engine";
import { ResultWidget } from "./ResultWidget";
import { syntaxTree } from "@codemirror/language";
import { IterMode, SyntaxNodeRef } from "@lezer/common";
import { StateEffect, EditorState } from "@codemirror/state";

import {
    Extension,
    RangeSetBuilder,
    StateField,
    Transaction,
} from "@codemirror/state";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";
import PadScope from "../Math/PadScope";

// import { Text } from "@codemirror/state";

export const resultField = StateField.define<DecorationSet>({
    create(state): DecorationSet {
        return Decoration.none;
    },

    update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
        const settings = transaction.state.field(mathpadConfigField);
        const builder = new RangeSetBuilder<Decoration>();
        // const doc = transaction.state.doc;
        const engine = createEngine();
        const tree = syntaxTree(transaction.state);
        const caretPos = transaction.state.selection.ranges[0].from;

        const nodeA = tree.resolve(caretPos, 1);
        const nodeB = tree.resolve(caretPos, -1);

        
        // we try to avoid recomputing if editing outside inline-code
        if (
            nodeA.name !== "inline-code" &&
            nodeB.name !== "inline-code" &&
            transaction.docChanged
        ) {
            return oldState.map(transaction.changes);
        }

        let oldDec = undefined as any;
        if(!transaction.docChanged){

            if(!transaction.selection || !transaction.selection.asSingle().main.empty){
                return oldState.map(transaction.changes);
            }
            // here we should simply toggle the "visibility" of the code 
            // depending on the caret position
            // const mapDec = oldState.iter()
            oldDec = oldState.iter();
        }
        // console.log("doing decorations:", nodeA.name, nodeB.name, transaction.docChanged, transaction.changes.empty, transaction.selection, transaction.effects.length);
        console.time("decorations-code");
        tree.iterate({
            enter: (node: SyntaxNodeRef) => {
                if (node.name === "inline-code") {
                    const text = transaction.state.doc.sliceString(
                        node.from,
                        node.to
                    );
                    const caret = node.from-1 <= caretPos && caretPos <= node.to;
                    let previousRes : PadScope | undefined;
                    if(!transaction.docChanged){
                        previousRes = oldDec?.value?.spec?.res
                    } else {
                        //  console.log("doc changed!")
                    }
                    const parseResult = parse(text,settings);
                    if(parseResult.isValid) {
                        try{ 
                            addDecoration(
                                engine,
                                parseResult,
                                builder,
                                caret,
                                node,
                                previousRes
                            );
                        } catch (e) {
                            console.log(e);
                            console.log(text);
                        }

                    }
                    oldDec && oldDec.next();
                }
            },
            mode: IterMode.IncludeAnonymous,
        });
        console.timeEnd("decorations-code");

        return builder.finish();
    },
    provide(field: StateField<DecorationSet>): Extension {
        return EditorView.decorations.from(field);
    },
});

function addDecoration(
   
    engine: Engine,
    parseResult: ParseResult,
    builder: RangeSetBuilder<Decoration>,
    caret: boolean,
    node: SyntaxNodeRef,
    previousRes?: PadScope
) {
    const res = previousRes || new PadScope().process(
        engine,
        parseResult
    );

    if (parseResult.latex) {
        builder.add(
            caret ? node.to : node.from,

            node.to,
            caret ? 
            Decoration.widget({
                widget: new ResultWidget(res, parseResult, node.from),
                block: true,
                side: 1,
                res
            }):
            Decoration.replace({
                widget: new ResultWidget(res, parseResult, node.from),
                block: true,
                inclusive: true,
                res
            })
        );
    } else { // inline
        if (!caret)
            builder.add(
                node.from,
                node.to,
                Decoration.replace({
                    widget: new ResultWidget(res, parseResult, node.from),
                    block: false,
                    inclusive: true,
                    res
                })
            );
    }
}

const setConfigEffect = StateEffect.define<MathpadSettings>();

export const mathpadConfigField = StateField.define<MathpadSettings>({
    create(state: EditorState): any {
        return {
            latex: true,
        };
    },
    update(
        oldState: MathpadSettings,
        transaction: Transaction
    ): MathpadSettings {
        let newState = oldState;

        for (const effect of transaction.effects) {
            if (effect.is(setConfigEffect)) {
                newState = { ...oldState, ...effect.value };
            }
        }

        return newState;
    },
});

export function setConfig(view: EditorView, config: MathpadSettings) {
    view.dispatch({
        effects: [setConfigEffect.of(config)],
    });
}
