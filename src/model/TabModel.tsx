import { Subject } from "rxjs";
import { FormModel } from "./FormModel";

export class TabModel {
    private activeKey?: string;
    // activeKey change event
    private onChange?: (key: string) => void;
    private items: FormModel[] = [];
    private onEdit?: (key: string, action: "add" | "remove") => void;
    title$ = new Subject<string>();
}
