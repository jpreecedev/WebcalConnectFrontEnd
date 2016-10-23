import { Pipe, PipeTransform } from '@angular/core';
import { CalibrationDue } from '../../calibrations-due/calibrations-due.component';

@Pipe({
    name: 'wcDepotName'
})
export class DepotNamePipe implements PipeTransform {
    transform(value: Array<CalibrationDue>, selectedDepot: string): Array<CalibrationDue> {
        if (!value) {
            return undefined;
        }
        if (!selectedDepot) {
            return value;
        }
        if (selectedDepot === '- All -') {
            return value;
        }
        return value.filter((item: CalibrationDue) => item.depotName === selectedDepot);
    }
}
