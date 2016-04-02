import {Component, Input, OnDestroy} from "angular2/core";

@Component({
    selector: "spinner",
    templateUrl: "./app/utilities/spinner/spinner.component.html",
    styleUrls: ["./app/utilities/spinner/spinner.css"]
})
export class SpinnerComponent implements OnDestroy {  
    private currentTimeout: number;
    private isDelayedRunning: boolean = false;

    @Input()
    public set isRunning(value: boolean) {
        if (!value) {
            this.cancelTimeout();
            this.isDelayedRunning = false;
            return;
        }

        if (this.currentTimeout) {
            return;
        }

        this.currentTimeout = setTimeout(
            () => {
                this.isDelayedRunning = value;
                this.cancelTimeout();
            }, 
            300);
    }

    public ngOnDestroy(): any {
        this.cancelTimeout();
    }

    private cancelTimeout(): void {
        clearTimeout(this.currentTimeout);
        this.currentTimeout = undefined;
    }
}
