import { useEffect } from "react";
import patch from "./patch";
const peekSymbol = Symbol("usePatchPeek");
const onReadySymbol = Symbol("usePatchOnReady");

patch(
    (page: string) => {
        // @ts-ignore
        const _peek = window[peekSymbol];
        if (!_peek) {
            return "hit";
        }
        return _peek(page);
    },
    (page, form) => {
        // @ts-ignore
        const _onReady = window[onReadySymbol];
        if (_onReady) {
            _onReady(page, form);
        }
    }
);

/**
 * page -> domNode or form or null
 */

export function usePatch(peek: PeekFunction, onReady: OnReadyFunction): void {
    useEffect(() => {
        // @ts-ignore
        const _peek = window[peekSymbol];
        // @ts-ignore
        const _onReady = window[onReadySymbol];
        if (!_peek) {
            // @ts-ignore
            window[peekSymbol] = peek;
            // @ts-ignore
            window[onReadySymbol] = onReady;
        }
        return () => {
            // @ts-ignore
            window[peekSymbol] = null;
            // @ts-ignore
            window[onReadySymbol] = null;
        };
    }, [peek, onReady]);
}
