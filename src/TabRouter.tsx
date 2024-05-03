import { ReactElement, createElement, useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client';

import { TabRouterContainerProps } from "../typings/TabRouterProps";
import BadgeSample from "./components/BadgeSample";
import "./ui/TabRouter.css";

export function TabRouter(props: TabRouterContainerProps): ReactElement {
    const { prefixValue, style } = props;
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            const root = createRoot(ref.current);
            root.render(<BadgeSample className={props.class} style={style} prefixValue={prefixValue} />);
        }
    }, []);
    return <div ref={ref}></div>;
}
