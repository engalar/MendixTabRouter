declare namespace mx {
    namespace ui {
        type OpenForm2Function = ((
            page: string,
            dh: DisposeCallback,
            title: string,
            currentForm: any,
            option: Option,
            numberOfPagesToClose: number
        ) => Promise<any>) & { ["_tabRouter"]: boolean };
        interface DisposeCallback {
            [key: string]: { unsubscribe: () => void };
        }
        interface Option {
            location: "content" | "popup" | "node";
            domNode?: Element;
        }
        let openForm2: OpenForm2Function;

        let getContentForm: any;
    }
    namespace session {
        let sessionData: any;
    }
    let appUrl: string;
}
declare namespace mendix {
    interface Lang {
        getUniqueId(): string;
    }
    let lang: Lang;
}

declare namespace dijit {
    function getUniqueId(id: string): string;
}

/**
 * This is the type of the onReady function that can be passed to the openForm2 function.
 * @param page The name of the page that was opened.
 * @param form The form that was opened. If undefined, the page was opened yet before.
 */
type OnReadyFunction = (page: string, form?: any, option?: any) => void;

/**
 * hit 已经存在
 * miss 不存在
 * skip 跳过
 */
type PeekFunction = (page: string) => PeekResult;
type PeekResult = "hit" | "skip" | "miss";

// close page function

type CloseTabPageFunction = (numberOfPagesToClose: number) => number;
