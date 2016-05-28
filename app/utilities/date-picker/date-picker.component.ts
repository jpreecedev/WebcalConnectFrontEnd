import {Component, Input, Output, EventEmitter, ElementRef, OnInit} from "@angular/core";
declare var Pikaday: any;

@Component({
    selector: "date-picker",
    templateUrl: "./app/utilities/date-picker/date-picker.component.html",
    styleUrls: ["./app/utilities/date-picker/date-picker.css"]
})
export class DatePickerComponent implements OnInit {

    private nativeElement: any;

    constructor(elementRef: ElementRef) {
        this.nativeElement = elementRef.nativeElement;
    }

    ngOnInit() {
        var that = this;
        var picker = new Pikaday({
            field: this.nativeElement.getElementsByTagName("input")[0],
            onSelect: function (dt: Date) {
                that.dateChanged.emit(dt);
            }
        });
    }

    @Input() date: Date;

    @Input() label: string;

    @Output() dateChanged: EventEmitter<Date> = new EventEmitter();
}