import { WithDependency } from "@wendellhu/redi/esm/react-bindings/reactDecorators";
import { TabModel } from "src/model/TabModel";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class UpdateTitle {
    constructor(@WithDependency(TabModel) tabModel: TabModel) {
        tabModel.title$.subscribe(title => {
            document.title = `LTC-${title}`;
            const titleElement = document.querySelector(".pagetitleltc");
            if (titleElement) {
                titleElement.innerHTML = title;
            }
        });
    }
}
