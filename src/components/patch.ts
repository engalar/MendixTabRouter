const old = mx.ui.openForm2;

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
