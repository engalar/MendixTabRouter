import { ReactElement, createElement } from "react";

import { parseInlineStyle } from "@mendix/pluggable-widgets-tools";

import { BadgeSample, BadgeSampleProps } from "./components/BadgeSample";
import { TabRouterPreviewProps } from "../typings/TabRouterProps";

function parentInline(node?: HTMLElement | null): void {
    // Temporary fix, the web modeler add a containing div, to render inline we need to change it.
    if (node && node.parentElement && node.parentElement.parentElement) {
        node.parentElement.parentElement.style.display = "inline-block";
    }
}

function transformProps(props: TabRouterPreviewProps): BadgeSampleProps {
    return {
        type: props.tabrouterType,
        bootstrapStyle: props.bootstrapStyle,
        className: props.className,
        clickable: false,
        style: parseInlineStyle(props.style),
        defaultValue: props.tabrouterValue ? props.tabrouterValue : "",
        value: props.valueAttribute
    };
}

export function preview(props: TabRouterPreviewProps): ReactElement {
    return (
        <div ref={parentInline}>
            <BadgeSample {...transformProps(props)}></BadgeSample>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/TabRouter.css");
}
