import { IMathpadSettings } from "src/MathpadSettings";

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
        const doc = transaction.state.doc;
        const engine = createEngine();
        const tree = syntaxTree(transaction.state);
        const caretPos = transaction.state.selection.ranges[0].from;

        const nodeA = tree.resolve(caretPos, 1);
        const nodeB = tree.resolve(caretPos, -1);

        if (transaction.changes.empty) {
            console.log(transaction.state.selection.ranges[0]);
            // if(transaction.selection){
            //     return oldState;
            // }
            // if((transaction.state.selection.ranges[0].to!==0)
            // || caretPos!==0
            // ) {
            //     return oldState;
            // }
        }

        console.log(nodeA.name, nodeB.name);
        // !transaction.changes.empty &&
        if (
            nodeA.name !== "inline-code" &&
            nodeB.name !== "inlide-code" &&
            transaction.docChanged
        ) {
            return oldState.map(transaction.changes);
        }
        // eslint-disable-next-line no-constant-condition
        for (let nl = 1; false && nl <= doc.lines; nl++) {
            const line = doc.line(nl);
            const node = tree.resolve(line.from, 1);
            if (node.parent !== null) continue;

            if (line.text.contains(":=")) {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const res = new PadScope(line.text).process(
                        engine,
                        {},
                        {
                            evaluate: true,
                        }
                    );
                    // const res = engine.parse(line.text.slice(0,-2))
                    builder.add(
                        line.from,
                        line.to,
                        Decoration.mark({ class: "mathpad-declaration" })
                    );
                } catch (e) {
                    console.log("Excepyion in ResultField update:", e);
                    console.log(line.text);
                }
            }

            if (line.text.endsWith("=?")) {
                try {
                    const res = new PadScope(line.text.slice(0, -2)).process(
                        engine,
                        {},
                        {
                            evaluate: true,
                        }
                    );
                    // const res = engine.parse(line.text.slice(0,-2))

                    builder.add(
                        line.from,
                        line.to,
                        Decoration.replace({
                            widget: new ResultWidget(res, settings),
                        })
                    );

                    // builder.add(
                    //     line.to-1,
                    //     line.to,
                    //     Decoration.replace({
                    //         widget: new ResultWidget(res.expression.text()),
                    //     })
                    // );
                } catch (e) {
                    console.log(e);
                    console.log(line.text);
                }
            }
        }

        console.time("decorations-code");
        tree.iterate({
            enter: (node: SyntaxNodeRef) => {
                if (node.name === "inline-code") {
                    let text = transaction.state.doc.sliceString(
                        node.from,
                        node.to
                    );
                    const caret = node.from <= caretPos && caretPos <= node.to;
                    try {
                        if (text.contains(":=")) {
                            addDecoration(
                                text,
                                engine,
                                settings,
                                builder,
                                caret,
                                node
                            );
                        } else if (text.endsWith("=?")) {
                            text = text.slice(0, -2);
                            addDecoration(
                                text,
                                engine,
                                settings,
                                builder,
                                caret,
                                node
                            );
                        }
                    } catch (e) {
                        console.log(e);
                        console.log(text);
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
    text: string,
    engine: Engine,
    settings: IMathpadSettings,
    builder: RangeSetBuilder<Decoration>,
    caret: boolean,
    node: SyntaxNodeRef
) {
    const res = new PadScope(text).process(
        engine,
        {},
        {
            evaluate: true,
        }
    );

    if (settings.latex) {
        builder.add(
            caret ? node.to : node.from,

            node.to,

            Decoration.widget({
                widget: new ResultWidget(res, settings),
                block: true,
                side: 1,
            })
        );
    } else {
        if (!caret)
            builder.add(
                node.from,
                node.to,
                Decoration.replace({
                    widget: new ResultWidget(res, settings),
                    block: false,
                    inclusive: true,
                })
            );
    }
}

const setConfigEffect = StateEffect.define<IMathpadSettings>();

export const mathpadConfigField = StateField.define<IMathpadSettings>({
    create(state: EditorState): any {
        return {
            latex: true,
        };
    },
    update(
        oldState: IMathpadSettings,
        transaction: Transaction
    ): IMathpadSettings {
        let newState = oldState;

        for (const effect of transaction.effects) {
            if (effect.is(setConfigEffect)) {
                newState = { ...oldState, ...effect.value };
            }
        }

        return newState;
    },
});

export function setConfig(view: EditorView, config: IMathpadSettings) {
    view.dispatch({
        effects: [setConfigEffect.of(config)],
    });
}
