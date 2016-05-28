import {Component, Input, Output, EventEmitter, ElementRef, OnInit} from "@angular/core";
import moment from 'moment/moment';


@Component({
    selector: "date-picker",
    templateUrl: "./app/utilities/date-picker/date-picker.component.html",
    styleUrls: ["./app/utilities/date-picker/date-picker.css"]
})
export class DatePickerComponent implements OnInit {

    private nativeElement: any;
    private picker: Pikaday;
    private theDate: string;

    constructor(elementRef: ElementRef) {
        this.nativeElement = elementRef.nativeElement;
    }

    ngOnInit() {
        var that = this;
        
        var picker = new Pikaday({
            field: this.nativeElement.getElementsByTagName("input")[0],
            onSelect: function (dt: Date) {
                var formatted = moment(dt).format("YYYY-MM-DD");
                that.dateChanged.emit(formatted);
                that.theDate = formatted;
            }
        });
        picker.setDate(this.theDate);
    }

    @Input()
    public set date(val: string) {
        if (this.picker) {
            this.picker.setDate(val);
        }
        this.theDate = val;
    }

    @Input() label: string;

    @Output() dateChanged: EventEmitter<string> = new EventEmitter();
}