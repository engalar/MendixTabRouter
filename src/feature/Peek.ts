import { Inject, Injector } from "@wendellhu/redi";
import { TabModel } from "src/model/TabModel";

function encodePage(page: string): string {
    return page.replace(/\//g, "_").replace(/\./g, "_");
}

interface Handler {
    setNext(handler: Handler): void;
    handle(input: string): PeekResult | undefined;
}

abstract class AbstractHandler implements Handler {
    private nextHandler: Handler | undefined;
    constructor(protected injector: Injector) {}

    setNext(handler: Handler): void {
        this.nextHandler = handler;
    }

    handle(input: string): PeekResult | undefined {
        if (this.nextHandler) {
            return this.nextHandler.handle(input);
        }
        return undefined;
    }
}

class HitHandler extends AbstractHandler {
    handle(input: string): PeekResult | undefined {
        if (input.endsWith("_Redirect.page.xml")) {
            return "hit";
        }
        return super.handle(input);
    }
}

class HandlerB extends AbstractHandler {
    handle(input: string): PeekResult | undefined {
        if (input.startsWith("ModuleLtcView/Login")) {
            return "skip";
        }
        return super.handle(input);
    }
}

class MissHandler extends AbstractHandler {
    handle(page: string): PeekResult | undefined {
        const tabModel = this.injector.get(TabModel);
        tabModel.activeKey$.next(encodePage(page));

        // TODO page is in pendingForms?
        // return Result.Hit

        // else return miss
        // TODO react: add tab page
        return "miss";
    }
}
export class PeekService {
    handler: HitHandler;
    constructor(@Inject(Injector) private _injector: Injector) {
        const handlerA = new HitHandler(_injector);
        const handlerB = new HandlerB(_injector);
        const handlerC = new MissHandler(_injector);
        handlerA.setNext(handlerB);
        handlerB.setNext(handlerC);
        this.handler = handlerA;
    }
    peek(input: string) {
        return this.handler.handle(input) || "skip";
    }
}
