import parse, { ParseResult } from "./../Math/Parsing";
import { MathpadSettings } from "src/MathpadSettings";

import { createEngine, Engine } from "src/Math/Engine";
import { EmptyWidget, ResultWidget } from "./ResultWidget";
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

        // console.log("state", transaction);

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

        const okToProcess = transaction.effects.find(eff => eff.is(setConfigEffect));

        let oldDec = undefined as any;
        if (!transaction.docChanged) {
            if (
                (!transaction.selection ||
                !transaction.selection.asSingle().main.empty) && !okToProcess
            ) {
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
                    const caret =
                        node.from - 1 <= caretPos && caretPos <= node.to;
                    let previousRes: PadScope | undefined;
                    if (!transaction.docChanged) {
                        previousRes = oldDec?.value?.spec?.res;
                    } else {
                        //  console.log("doc changed!")
                    }
                    const parseResult = parse(text, settings);
                    
                    if (parseResult.isValid) {
                        try {
                            if(addDecoration(
                                engine,
                                parseResult,
                                builder,
                                caret,
                                node,
                                previousRes
                            )){
                                oldDec && oldDec.next();
                            }
                        } catch (e) {
                            console.log(e);
                            console.log(text);
                        }
                        // we need to do this inside this if, otherwise we are iterating also for normal "inline-code"!
                        // TODO: bug not when modifying a inline-code it gets the wrong previous result!!!
                        
                    }
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
    // let res: PadScope | undefined;
    // if (parseResult.latex || !caret) {
       const res = previousRes || new PadScope().process(engine, parseResult);
    // }
    if (previousRes) {
        console.log("reciclying preciousRes", previousRes.input);
    } else {
        console.log("processed ", parseResult.text);
    }
    if (parseResult.block && res) {
        builder.add(
            caret ? node.to : node.from,

            node.to,
            caret
                ? Decoration.widget({
                      widget: new ResultWidget(res, parseResult, node.from),
                      block: true,
                      side: 1,
                      res,
                  })
                : Decoration.replace({
                      widget: new ResultWidget(res, parseResult, node.from),
                      block: true,
                      inclusive: true,
                      res,
                  })
        );
    } else {
        // inline
        if (!caret && res){
            builder.add(
                node.from,
                node.to,
                Decoration.replace({
                    widget: new ResultWidget(res, parseResult, node.from),
                    block: false,
                    inclusive: true,
                    res,
                })
            );
        } else {
            builder.add(
                node.to,
                node.to,
                Decoration.widget({
                    widget: new EmptyWidget(),
                    block: false,
                    inclusive: false,
                    res,
                })
            )
        }

    }
    // return true means we used up the precious result
    return true;
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
