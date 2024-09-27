import { ReactElement, createElement, useMemo, useEffect } from "react";

import { TabRouterContainerProps } from "../typings/TabRouterProps";
import TabRouterComponent from "./components/TabRouterComponent";
import "./ui/TabRouter.scss";
import { Injector } from "@wendellhu/redi";
import { connectInjector } from "@wendellhu/redi/react-bindings";
import { PlatformService } from "./api/PlatformService";
import { TabModel } from "./model/TabModel";
import UpdateTitle from "./feature/UpdateTitle";
import { PeekService } from "./feature/Peek";

export function TabRouter(props: TabRouterContainerProps): ReactElement {
    const [injector, App] = useMemo(() => {
        const injector = new Injector([
            [PlatformService, { useValue: new PlatformService(props.prefixValue) }],
            [TabModel],
            [PeekService]
        ]);
        // initialize
        injector.get(UpdateTitle);

        const App = connectInjector(() => <TabRouterComponent className={props.class} style={props.style} />, injector);
        return [injector, App];
    }, []);

    useEffect(() => {
        injector.get(PlatformService).prefixValue = props.prefixValue;
    }, [props.prefixValue]);

    return <App></App>;
}
