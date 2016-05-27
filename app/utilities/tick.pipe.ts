﻿import {Pipe} from "@angular/core";

@Pipe({
    name: "tick"
})
export class TickPipe {
    transform(value: boolean): string {
        if (value) {
            return "&#10003;";
        } else {
            return "&#10007;";
        }
    }
}
