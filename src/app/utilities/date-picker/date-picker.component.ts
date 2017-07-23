import { Component, Input, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';

import * as moment from 'moment';
import * as Pikaday from 'Pikaday';

@Component({
    selector: 'wc-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.css']
})
export class DatePickerComponent implements OnInit {

    @Output() dateChanged: EventEmitter<{}> = new EventEmitter();

    private nativeElement: any;
    private picker: any;
    public theDate: string;
    public labelId: string;
    public theLabel: string;

    constructor(elementRef: ElementRef) {
        this.nativeElement = elementRef.nativeElement;
    }

    @Input()
    public set date(val: string) {
        if (this.picker) {
            this.picker.setDate(val);
        }
        this.theDate = moment(val).format('ddd Do MMMM YYYY');
    }

    @Input()
    public set label(val: string) {
        this.theLabel = val;
        this.labelId = val.replace(/ /g, '').toLowerCase();
    }

    ngOnInit() {
        let that = this;

        let picker = new Pikaday({
            field: this.nativeElement.getElementsByTagName('input')[0],
            onSelect: function (dt: Date) {
                let formatted = moment(dt).format('YYYY-MM-DD');
                that.dateChanged.emit(formatted);
            }
        });
        picker.setDate(moment(this.theDate).format('ddd Do MMMM YYYY'));
    }
}
