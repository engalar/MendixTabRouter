// / <reference types="vite/client" />
import React, { useState, ReactElement, createElement, useEffect, useCallback, useRef, useMemo } from "react";
import classNames from "classnames";
import Tabs from "antd/es/tabs";

import { usePatch } from "../hooks/usePatch";
import { TabRouterComponentProps } from "./TabRouterComponentProps";
import LoadingIcon from "./LoadingIcon";
import { useDependency } from "@wendellhu/redi/esm/react-bindings/reactHooks";
import { PlatformService } from "../api/PlatformService";

/**
 * transform page name
 * @param page page qualified name <ModuleName>/<PageName>
 * @returns key <ModuleName>/<PageName> -> <ModuleName>_<PageName>
 */
function encodePage(page: string): string {
    return page.replace(/\//g, "_").replace(/\./g, "_");
}

export default function TabRouterComponent(props: TabRouterComponentProps): ReactElement {
    const platformService = useDependency(PlatformService);
    // demo usage
    console.log(platformService.prefixValue);

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

    const setPageTitle = (title: string): void => {
        document.title = `LTC-${title}`;
        const titleElement = document.querySelector(".pagetitleltc");
        if (titleElement) {
            titleElement.innerHTML = title;
        }
    };

    const peek: PeekFunction = useCallback((page: string) => {
        if (page.endsWith("_Redirect.page.xml")) {
            return "hit";
        }
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
    }, []);

    const onChange = (newActiveKey: string | undefined): void => {
        setPageTitle(items.find(item => item.key === newActiveKey)?.label);
        // itemsRef
        setItems(items => {
            items.forEach(item => {
                if (item.key !== newActiveKey) {
                    delete item.icon;
                } else {
                    item.icon = (
                        <span className="mx-icon-lined mx-icon-refresh" onClick={() => refreshFn(item.key)}></span>
                    );
                }
            });
            return items;
        });
        setActiveKey(newActiveKey);
    };

    const onEdit = useCallback(
        (/* a.k.a. enclose(page)*/ key: React.MouseEvent | React.KeyboardEvent | string, action: "add" | "remove") => {
            // page=TestMachineApplication_TestMachineApplication_View_page_xml
            if (action === "add") {
                // add();
            } else {
                // remove
                let lastIndex = -1;
                itemsRef.current.forEach((item, i) => {
                    if (item.key === key) {
                        lastIndex = i - 1;
                    }
                });

                const removeIndex = itemsRef.current.findIndex(item => item.key === key);
                if (removeIndex >= 0) {
                    // openPages.splice(removeIndex, 1);
                    // setOpenPages(itemsRef.current.map(item => item.page));
                }

                const newPanes = itemsRef.current.filter(item => item.key !== key);
                let newActiveKey = itemsRef.current[lastIndex].key;
                if (newPanes.length) {
                    if (lastIndex >= 0) {
                        newActiveKey = newPanes[lastIndex].key;
                    } else {
                        newActiveKey = newPanes[0].key;
                    }
                }
                setItems(newPanes);
                itemsRef.current = newPanes;
                setOpenPages(itemsRef.current.map(item => item.page));
                onChange(newActiveKey);
            }
        },
        [activeKey, items, openPages]
    );

    const refreshFn = (key: string): void => {
        const index = itemsRef.current.findIndex(item => item.key === key);
        const item = itemsRef.current[index];
        const form = formMap.current.get(item.page);
        const param = Object.keys(form._context._mxidToObject).reduce((acc: any, key) => {
            acc[key] = form._context._mxidToObject[key].getGuid();
            return acc;
        }, {});
        mx.ui.openForm2(item.page, param, item.label, null, item.option, 0);
    };

    const onReady: OnReadyFunction = useCallback(
        (page: string, form: any, option: any) => {
            if (page.endsWith("_Redirect.page.xml")) {
                form.destroy();
                return;
            }
            formMap.current.get(page)?.destroy();
            formMap.current.set(page, form);
            ref.current?.querySelector(`#${tabsId}-panel-${encodePage(page)}`)!.appendChild(form.domNode);
            setItems(p => {
                const index = p.findIndex(item => item.key === encodePage(page));
                p.forEach(item => delete item.icon);
                // change page label in p
                p[index].label = form.title;
                p[index].option = option;
                p[index].page = page;
                // delete p[index].icon;
                p[index].icon = (
                    <span className="mx-icon-lined mx-icon-refresh" onClick={() => refreshFn(encodePage(page))}></span>
                );
                const preDisp = p[index].disp;
                if (preDisp) {
                    preDisp();
                    delete p[index].disp;
                }
                const disp = form.listen("close", () => {
                    if (itemsRef.current.length > items.length) {
                        const lastForm = formMap.current.get(itemsRef.current.slice(-1)[0].page);
                        if (lastForm) {
                            setTimeout(() => {
                                // lastForm.publish('close');
                                onEdit(itemsRef.current.slice(-1)[0].key, "remove");
                            }, 0);
                        }
                    } else {
                        onEdit(encodePage(page), "remove");
                    }
                });
                p[index].disp = disp;
                itemsRef.current = index >= 0 ? [...p] : p;
                return itemsRef.current;
            });
            setPageTitle(form.title);
            mx.ui.getContentForm().setSuspend(false);
        },
        [onEdit]
    );

    usePatch(peek, onReady);

    // https://ant.design/components/tabs-cn#tabitemtype
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

/* export class TabModel {
    private activeKey: string;
    // activeKey change event
    private onChange: (key: string) => void;
    private items: FormModel[] = [];
    private onEdit: (key: string, action: "add" | "remove") => void;
}

export class FormModel {
    // page name
    private page: string;
    // page key
    private key: string;
    // isActive
    private isActive: boolean;
    // title
    private title: string;
    // mx form
    private mxForm: any;
} */
