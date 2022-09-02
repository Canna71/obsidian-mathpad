import getSettings, { IMathpadSettings } from "src/MathpadSettings";

import { createEngine, Engine } from "src/Math/Engine";
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
import PadScope from "../Math/PadScope";

// import { Text } from "@codemirror/state";

export const resultField = StateField.define<DecorationSet>({
    create(state): DecorationSet {
        return Decoration.none;
    },
    update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
        
        const settings = getSettings();
        const builder = new RangeSetBuilder<Decoration>();
        const doc = transaction.state.doc;
        const engine = createEngine();
        const tree = syntaxTree(transaction.state);
        const caretPos = transaction.state.selection.ranges[0].from;
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
                            widget: new ResultWidget(res),
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
        syntaxTree(transaction.state).iterate({
            enter: (node: SyntaxNodeRef) => {
                if (node.name === "inline-code") {
                    let text = transaction.state.doc.sliceString(
                        node.from,
                        node.to
                    );
                    const caret = node.from <= caretPos && caretPos <= node.to;
                    try {
                        if (text.contains(":=")) {
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                widget: new ResultWidget(res),
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
                    widget: new ResultWidget(res),
                    block: false,
                    inclusive: true,
                })
            );
    }
}
