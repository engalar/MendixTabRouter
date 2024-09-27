import { ReactElement, createElement } from "react";

import { parseInlineStyle } from "@mendix/pluggable-widgets-tools";

import TabRouterComponent from "./components/TabRouterComponent";
import { TabRouterComponentProps } from "./components/TabRouterComponentProps";
import { TabRouterPreviewProps } from "../typings/TabRouterProps";

function parentInline(node?: HTMLElement | null): void {
    // Temporary fix, the web modeler add a containing div, to render inline we need to change it.
    if (node && node.parentElement && node.parentElement.parentElement) {
        node.parentElement.parentElement.style.display = "inline-block";
    }
}

function transformProps(props: TabRouterPreviewProps): TabRouterComponentProps {
    return {
        className: props.className,
        style: parseInlineStyle(props.style),
        prefixValue: props.prefixValue
    };
}

export function preview(props: TabRouterPreviewProps): ReactElement {
    return (
        <div ref={parentInline}>
            <TabRouterComponent {...transformProps(props)}></TabRouterComponent>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/TabRouter.scss");
}
