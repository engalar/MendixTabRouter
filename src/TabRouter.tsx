import { ReactElement, createElement, useCallback } from "react";

import { TabRouterContainerProps } from "../typings/TabRouterProps";
import { BadgeSample } from "./components/BadgeSample";
import "./ui/TabRouter.css";

export function TabRouter(props: TabRouterContainerProps): ReactElement {
    const { tabrouterType, tabrouterValue, valueAttribute, onClickAction, style, bootstrapStyle } = props;
    const onClickHandler = useCallback(() => {
        if (onClickAction && onClickAction.canExecute) {
            onClickAction.execute();
        }
    }, [onClickAction]);

    return (
        <BadgeSample
            type={tabrouterType}
            bootstrapStyle={bootstrapStyle}
            className={props.class}
            clickable={!!onClickAction}
            defaultValue={tabrouterValue ? tabrouterValue : ""}
            onClickAction={onClickHandler}
            style={style}
            value={valueAttribute ? valueAttribute.displayValue : ""}
        />
    );
}
