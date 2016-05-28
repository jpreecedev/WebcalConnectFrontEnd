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
    private labelId: string;
    private theLabel: string;

    constructor(elementRef: ElementRef) {
        this.nativeElement = elementRef.nativeElement;
    }

    @Input()
    public set date(val: string) {
        if (this.picker) {
            this.picker.setDate(val);
        }
        this.theDate = moment(val).format("ddd Do MMMM YYYY");
    }

    @Input()
    public set label(val: string){
        this.theLabel = val;
        this.labelId = val.replace(/ /g,'').toLowerCase();
    }

    @Output() dateChanged: EventEmitter<string> = new EventEmitter();

    ngOnInit() {
        var that = this;

        var picker = new Pikaday({
            field: this.nativeElement.getElementsByTagName("input")[0],
            onSelect: function (dt: Date) {
                var formatted = moment(dt).format("YYYY-MM-DD");
                that.dateChanged.emit(formatted);
            }
        });
        picker.setDate(moment(this.theDate).format("ddd Do MMMM YYYY"));
    }
}