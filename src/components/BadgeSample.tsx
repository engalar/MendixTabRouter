// / <reference types="vite/client" />
import React, { useState, ReactElement, createElement, useEffect, useCallback, useRef, useMemo } from "react";
import classNames from "classnames";
import { Tabs } from "antd";

import { usePatch } from "./usePatch";
import { BadgeSampleProps } from "./BadgeSampleProps";
import LoadingIcon from "./LoadingIcon";

function encodePage(page: string): string {
    return page.replace(/\//g, "_").replace(/\./g, "_");
}

export default function BadgeSample(props: BadgeSampleProps): ReactElement {
    const tabsId = useMemo(() => dijit.getUniqueId("tabs"), []);
    const { className, style } = props;
    const formMap = useRef<Map<string, any>>(new Map<string, any>());

    const ref = useRef<HTMLDivElement>(null);
    const [openPages, setOpenPages] = useState<string[]>([]);
    const [activeKey, setActiveKey] = useState<string>();
    const [items, setItems] = useState<any[]>([]);
    const itemsRef = useRef<any[]>([]);
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
                    itemsRef.current = [...p];
                    return itemsRef.current;
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
            // FIXME: 硬编码
            if (page.startsWith("ModuleLtcView/Login")) {
                return "skip";
            } else {
                let pageIndex = -1;
                setOpenPages(p => {
                    pageIndex = p.findIndex(item => item === page);
                    return p;
                });
                if (pageIndex >= 0) {
                    setActiveKey(encodePage(page));
                    setItems(p => {
                        p[pageIndex].icon = <LoadingIcon />;
                        itemsRef.current = [...p];
                        return itemsRef.current;
                    });

                    // undefined will skip normal behavior
                    return "hit";
                }

                // create new tab
                setItems((p: any[]) => {
                    itemsRef.current = [
                        ...p,
                        { label: "", /* children: fragment, */ key: encodePage(page), icon: <LoadingIcon /> }
                    ];
                    return itemsRef.current;
                });
                setActiveKey(encodePage(page));
                setOpenPages((p: string[]) => [...p, page]);
                // force rerender

                return "miss";
            }
        },
        [props.prefixValue]
    );

    const onEdit = useCallback(
        (page: React.MouseEvent | React.KeyboardEvent | string, action: "add" | "remove") => {
            //page=TestMachineApplication_TestMachineApplication_View_page_xml
            if (action === "add") {
                // add();
            } else {
                // remove
                let newActiveKey = activeKey;
                let lastIndex = -1;
                itemsRef.current.forEach((item, i) => {
                    if (item.key === page) {
                        lastIndex = i - 1;
                    }
                });

                const removeIndex = itemsRef.current.findIndex(item => item.key === page);
                if (removeIndex >= 0) {
                    openPages.splice(removeIndex, 1);
                    setOpenPages(openPages);
                }

                const newPanes = itemsRef.current.filter(item => item.key !== page);
                if (newPanes.length && newActiveKey === page) {
                    if (lastIndex >= 0) {
                        newActiveKey = newPanes[lastIndex].key;
                    } else {
                        newActiveKey = newPanes[0].key;
                    }
                }
                setItems(newPanes);
                itemsRef.current = newPanes;
                setActiveKey(newActiveKey);
            }
        },
        [activeKey, items, openPages]
    );

    const onReady: OnReadyFunction = useCallback((page: string, form: any) => {
        formMap.current.get(page)?.destroy();
        formMap.current.set(page, form);
        ref.current?.querySelector(`#${tabsId}-panel-${encodePage(page)}`)!.appendChild(form.domNode);
        setItems(p => {
            const index = p.findIndex(item => item.key === encodePage(page));
            // change page label in p
            p[index].label = form.title;
            delete p[index].icon;
            const preDisp = p[index].disp;
            if (preDisp) {
                preDisp();
                delete p[index].disp;
            }
            const disp = form.listen('close', () => {
                onEdit(encodePage(page), 'remove');
            });
            p[index].disp = disp;
            itemsRef.current = index >= 0 ? [...p] : p;
            return itemsRef.current;
        });
        mx.ui.getContentForm().setSuspend(false);
    }, [onEdit]);

    usePatch(peek, onReady);

    const onChange = (newActiveKey: string): void => {
        setActiveKey(newActiveKey);
    };

    return (
        <div ref={ref} className={classNames("widget-tabrouter", className)} style={style}>
            <Tabs
                id={tabsId}
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
