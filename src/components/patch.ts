const originOpenForm2Fn = mx.ui.openForm2;

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

        async function widgetOpenForm2Fn(
            page: string,
            disposeObj: mx.ui.DisposeCallback,
            title: string,
            currentForm: any,
            option: mx.ui.Option,
            numberOfPagesToClose: number
        ): Promise<any> {
            const pageMetaUrl = mx.appUrl + "pages/zh_CN/" + page + "?" + mx.session.sessionData.cachebust;
            // fetch pageMetaUrl and get xml content
            const response = await fetch(pageMetaUrl);
            const xmlData = await response.text();
            const match = xmlData.match(/<m:layout\s+path='([^']+)'/);
            const popupList = [
                "Atlas_Core/PopupLayout",
                "DeepLink/ModalPopupLayout",
                "BizzomateTokenReplacer/BizzomateTokenReplacer_Popup",
                "Encryption/PopupLayout",
                "MxModelReflection/PopupLayout",
                "MxModelReflection/ModelReflectionPopup"
            ];
            if (match && popupList.map(d => d + ".layout.xml").includes(match[1])) {
                return originOpenForm2Fn(page, disposeObj, title, currentForm, option, numberOfPagesToClose);
            }
            // reg extract
            const state = peek(page);
            switch (state) {
                case "skip":
                    return originOpenForm2Fn(page, disposeObj, title, currentForm, option, numberOfPagesToClose);
                case "hit":
                case "miss":
                    option.location = "node";
                    option.domNode = document.querySelector(".mx-incubator.mx-offscreen")!;
                    const form = await originOpenForm2Fn(
                        page,
                        disposeObj,
                        title,
                        currentForm,
                        option,
                        numberOfPagesToClose
                    );
                    onReady(page, form, option);
                    return form;
            }
        }
        widgetOpenForm2Fn._tabRouter = true;
        mx.ui.openForm2 = widgetOpenForm2Fn;
    };

    doPatch();
    return () => {
        mx.ui.openForm2 = originOpenForm2Fn;
    };
}
