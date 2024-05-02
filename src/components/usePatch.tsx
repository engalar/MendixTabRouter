import { useEffect } from "react";
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
