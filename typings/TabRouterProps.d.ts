/**
 * This file was generated from TabRouter.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue } from "mendix";
import { Big } from "big.js";

export type BootstrapStyleEnum = "default" | "primary" | "success" | "info" | "inverse" | "warning" | "danger";

export type TabrouterTypeEnum = "badge" | "label";

export interface TabRouterContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    valueAttribute?: EditableValue<string | Big>;
    tabrouterValue: string;
    bootstrapStyle: BootstrapStyleEnum;
    tabrouterType: TabrouterTypeEnum;
    onClickAction?: ActionValue;
}

export interface TabRouterPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    valueAttribute: string;
    tabrouterValue: string;
    bootstrapStyle: BootstrapStyleEnum;
    tabrouterType: TabrouterTypeEnum;
    onClickAction: {} | null;
}
