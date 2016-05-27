import {Component, Input, Output, EventEmitter, ElementRef} from "@angular/core";
declare var Pikaday: any;

@Component({
    selector: "date-picker",
    templateUrl: "./app/utilities/date-picker/date-picker.component.html",
    styleUrls: ["./app/utilities/date-picker/date-picker.css"]
})
export class DatePickerComponent {
        
    @Input() date: Date;    
    @Input() label: string;
    
    @Output() dateChanged: EventEmitter<Date> = new EventEmitter();
    
    fireChange(){
        this.dateChanged.emit(this.date);
    }
}