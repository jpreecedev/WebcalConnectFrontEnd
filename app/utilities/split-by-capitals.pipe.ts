import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "splitByCapitals"
})
export class SplitByCapitalsPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) {
            return "";
        }
        return value.match(/[A-Z][a-z]+/g).join(" ");
    }
}
