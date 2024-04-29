import { ReactElement, createElement } from "react";

import { TabRouterContainerProps } from "../typings/TabRouterProps";
import { BadgeSample } from "./components/BadgeSample";
import "./ui/TabRouter.css";

export function TabRouter(props: TabRouterContainerProps): ReactElement {
    const { prefixValue, style } = props;

    return <BadgeSample className={props.class} style={style} prefixValue={prefixValue} />;
}
