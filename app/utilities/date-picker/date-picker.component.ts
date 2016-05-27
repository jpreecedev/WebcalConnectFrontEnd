import {Component, Input, ElementRef} from "@angular/core";
declare var Pikaday: any;

@Component({
    selector: "date-picker",
    templateUrl: "./app/utilities/date-picker/date-picker.component.html",
    styleUrls: ["./app/utilities/date-picker/date-picker.css"]
})
export class DatePickerComponent {
    private theDate: string;
    private theLabel: string;
    private nativeElement: any;
    
    constructor(private _elementRef: ElementRef) {
        this.nativeElement = _elementRef.nativeElement;
    }
    
    @Input()
    public set date(value: string){
        this.theDate = value; 
    }
    
    @Input()
    public set label(value: string) {
        this.theLabel = value;
    }
}