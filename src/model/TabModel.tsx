/* eslint-disable @typescript-eslint/no-useless-constructor */
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { FormModel } from "./FormModel";

export class TabModel {
    activeKey$ = new BehaviorSubject<string | undefined>(undefined);
    // activeKey change event
    private onChange?: (key: string) => void;
    private items: FormModel[] = [];
    private onEdit?: (key: string, action: "add" | "remove") => void;
    title$: Observable<string>;
    readyForms$ = new BehaviorSubject<FormModel[]>([]);
    pendingForms$ = new BehaviorSubject<FormModel[]>([]);
    constructor() {
        // title$ derive from activeKey$
        this.title$ = new Observable(observer => {
            this.activeKey$.subscribe(key => {
                // TODO find title by key
                observer.next(key);
            });
        });

        // TODO activeKey$ change we need remove other tab icon and add active tab icon
    }
    doClose(numberOfPagesToClose: number) {
        // close pending first, then ready form

        // remain the number of pages to close
        return numberOfPagesToClose - 1;
    }
}
