import { Component, Input } from '@angular/core';

@Component({
    selector: 'wc-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.css']
})
export class SpinnerComponent {
    private isDelayedRunning: boolean = false;

    @Input()
    public set isRunning(value: boolean) {
        this.isDelayedRunning = value;
    }
}
