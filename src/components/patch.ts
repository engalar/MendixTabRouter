const old = mx.ui.openForm2;
const isRuntimeLoading = () => document.querySelector(".mx-incubator.mx-offscreen") == null;
const isIncubatorReady = () =>
    !isRuntimeLoading() && document.querySelector(".mx-incubator.mx-offscreen")!.childElementCount === 0;
/**
 *
 * @param cb
 * @returns null fallback to original function, undefined skip, else render to domNode
 */
export default function patch(peek: PeekFunction, onReady: OnReadyFunction) {
    const doPatch = () => {
        if (mx.ui.openForm2._tabRouter) {
            // throw new Error("TabRouter patch has already been applied");
            return () => {};
        }

        async function newFun(
            page: string,
            disposeObj: mx.ui.DisposeCallback,
            title: string,
            currentForm: any,
            option: mx.ui.Option,
            numberOfPagesToClose: number
        ) {
            const state = peek(page);
            switch (state) {
                case "skip":
                    return old(page, disposeObj, title, currentForm, option, numberOfPagesToClose);
                case "hit":
                case "miss":
                    if (isRuntimeLoading()) {
                        // post origin task
                        const doNext = () => {
                            if (!isIncubatorReady()) {
                                setTimeout(() => {
                                    doNext();
                                }, 500);
                                return;
                            }
                            mx.ui.openForm2(page, disposeObj, title, currentForm, option, numberOfPagesToClose);
                        };
                        // schedule next task
                        setTimeout(() => {
                            doNext();
                        }, 500);
                        // navigate to router page
                        return old("Module/Page_Router.page.xml", disposeObj, title, currentForm, option, 0);
                    }
                    option.location = "node";
                    option.domNode = document.querySelector(".mx-incubator.mx-offscreen")!;
                    const form = await old(page, disposeObj, title, currentForm, option, numberOfPagesToClose);
                    onReady(page, form);
                    return form;
            }
        }
        newFun._tabRouter = true;
        mx.ui.openForm2 = newFun;
    };

    doPatch();
    return () => {
        mx.ui.openForm2 = old;
    };
}
