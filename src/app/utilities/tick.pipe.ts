import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'wcTick'
})
export class TickPipe implements PipeTransform {
    transform(value: boolean): string {
        if (value) {
            return '&#10003;';
        } else {
            return '&#10007;';
        }
    }
}
