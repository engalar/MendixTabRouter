import { ReactElement, createElement } from "react";

import { TabRouterContainerProps } from "../typings/TabRouterProps";
import TabRouterComponent from "./components/TabRouterComponent";
import "./ui/TabRouter.scss";

export function TabRouter(props: TabRouterContainerProps): ReactElement {
    const { prefixValue, style } = props;

    return <TabRouterComponent className={props.class} style={style} prefixValue={prefixValue} />;
}
