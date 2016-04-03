import {Component, Input} from "angular2/core";

@Component({
    selector: "spinner",
    templateUrl: "./app/utilities/spinner/spinner.component.html",
    styleUrls: ["./app/utilities/spinner/spinner.css"]
})
export class SpinnerComponent {  
    private isDelayedRunning: boolean = false;

    @Input()
    public set isRunning(value: boolean) {
        this.isDelayedRunning = value;
    }
}
