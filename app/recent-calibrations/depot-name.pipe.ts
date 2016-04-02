import {Pipe} from "angular2/core";
import {RecentCalibration} from "./recent-calibrations.component";

@Pipe({
    name: "depotname"
})
export class DepotNamePipe {
    transform(value: Array<RecentCalibration>, [selectedDepot]: string[]): Array<RecentCalibration> {
        if (!value) {
            return undefined;
        }
        if (!selectedDepot) {
            return value;
        }
        return value.filter((item: RecentCalibration) => item.depotName === selectedDepot);
    }
}
