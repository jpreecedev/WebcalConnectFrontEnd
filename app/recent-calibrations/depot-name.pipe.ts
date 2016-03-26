import {Pipe, Input} from "angular2/core";
import {RecentCalibration} from "./recent-calibrations.component";

@Pipe({
    name: "depotname"
})
export class DepotNamePipe {
    transform(value: Array<RecentCalibration>, [selectedDepot]): Array<RecentCalibration> {
        if (!value){
            return null;
        }
        if (!selectedDepot){
            return value;
        }
        return value.filter((item) => item.depotName === selectedDepot);
    }
}