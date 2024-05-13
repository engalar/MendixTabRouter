const aspect = require("dojo/aspect");
const old = mx.ui.openForm2;
/**
 *
 * @param cb
 * @returns null fallback to original function, undefined skip, else render to domNode
 */
export default function patch(peek: PeekFunction, onReady: OnReadyFunction) {
    const doPatch = () => {
        if (mx.ui.openForm2._tabRouter) {
            throw new Error("TabRouter patch has already been applied");
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
                    return await old(page, disposeObj, title, currentForm, option, numberOfPagesToClose);
                case "hit":
                    // todo: need return cached form here?
                    // return null;
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

    let afterHandle: any = null;
    if (document.querySelector(".mx-incubator.mx-offscreen")!.childElementCount === 0) {
        doPatch();
    } else {
        afterHandle = aspect.after(mx.ui.getContentForm(), "onNavigation", doPatch);
    }
    return () => {
        afterHandle?.remove();
        mx.ui.openForm2 = old;
    };
}
