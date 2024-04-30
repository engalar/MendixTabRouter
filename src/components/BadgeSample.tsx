import React, { useState, ReactElement, CSSProperties, createElement, useEffect, useCallback, useRef } from "react";
import classNames from "classnames";
import { Tabs } from "antd";

import patch from "./patch";

/**
 * page -> domNode or form or null
 */
export function usePatch(peek: PeekFunction, onReady: OnReadyFunction): void {
    useEffect(() => {
        const disp = patch(peek, onReady);
        return () => {
            disp();
        };
    }, [peek, onReady]);
}

export interface BadgeSampleProps {
    className?: string;
    prefixValue: string;
    style?: CSSProperties;
}

export function BadgeSample(props: BadgeSampleProps): ReactElement {
    const { className, style } = props;

    const ref = useRef<HTMLDivElement>(null);
    const [openPages, setOpenPages] = useState<string[]>([]);
    const [activeKey, setActiveKey] = useState<string>();
    const [items, setItems] = useState<any[]>([]);
    useEffect(() => {
        const cf = mx.ui.getContentForm();
        cf.closePage = async function closePage(
            numberOfPagesToClose: number,
            allowBackToInitialPage: boolean,
            hasPendingOpen: boolean
        ) {
            if (numberOfPagesToClose > 0) {
                // close tab page in openPages and items
                setOpenPages(p => {
                    p.splice(-numberOfPagesToClose, numberOfPagesToClose);
                    setActiveKey(p[p.length - 1]);
                    return [...p];
                });
                setItems(p => {
                    numberOfPagesToClose -= p.splice(-numberOfPagesToClose, numberOfPagesToClose).length;
                    return [...p];
                });
            }
            // cf.setSuspend(false);
            if (numberOfPagesToClose > 0) {
                // eslint-disable-next-line no-return-await
                await cf.__proto__.closePage.call(cf, numberOfPagesToClose, allowBackToInitialPage, hasPendingOpen);
            }
        };
        return () => {
            delete cf.closePage;
        };
    }, []);

    const peek: PeekFunction = useCallback(
        (page: string) => {
            if (!page.startsWith(props.prefixValue)) {
                return "skip";
            } else {
                let pageIndex = -1;
                setOpenPages(p => {
                    pageIndex = p.findIndex(item => item === page);
                    return p;
                });
                if (pageIndex >= 0) {
                    setActiveKey(page);

                    // undefined will skip normal behavior
                    return "hit";
                }

                // create new tab
                setItems((p: any[]) => [...p, { label: "", /* children: fragment, */ key: page }]);
                setActiveKey(page);
                setOpenPages((p: string[]) => [...p, page]);
                // force rerender

                return "miss";
            }
        },
        [props.prefixValue]
    );

    const onReady: OnReadyFunction = useCallback((page: string, form: any) => {
        ref.current?.querySelector(`.ant-tabs-tabpane.ant-tabs-tabpane-active`)!.appendChild(form.domNode);
        setItems(p => {
            const index = p.findIndex(item => item.key === page);
            // change page label in p
            p[index].label = form.title;
            return index >= 0 ? [...p] : p;
        });
        mx.ui.getContentForm().setSuspend(false);
    }, []);

    usePatch(peek, onReady);

    const onChange = (newActiveKey: string): void => {
        setActiveKey(newActiveKey);
    };

    const onEdit = useCallback(
        (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: "add" | "remove") => {
            if (action === "add") {
                // add();
            } else {
                // remove
                let newActiveKey = activeKey;
                let lastIndex = -1;
                items.forEach((item, i) => {
                    if (item.key === targetKey) {
                        lastIndex = i - 1;
                    }
                });

                const removeIndex = items.findIndex(item => item.key === targetKey);
                if (removeIndex >= 0) {
                    openPages.splice(removeIndex, 1);
                    setOpenPages(openPages);
                }

                const newPanes = items.filter(item => item.key !== targetKey);
                if (newPanes.length && newActiveKey === targetKey) {
                    if (lastIndex >= 0) {
                        newActiveKey = newPanes[lastIndex].key;
                    } else {
                        newActiveKey = newPanes[0].key;
                    }
                }
                setItems(newPanes);
                setActiveKey(newActiveKey);
            }
        },
        [activeKey, items, openPages]
    );

    return (
        <div ref={ref} className={classNames("widget-tabrouter", className)} style={style}>
            <Tabs
                hideAdd
                size="small"
                onChange={onChange}
                activeKey={activeKey}
                onEdit={onEdit}
                type="editable-card"
                items={items}
            />
        </div>
    );
}
