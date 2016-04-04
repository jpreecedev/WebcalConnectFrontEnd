import {Component, Input, ElementRef, OnInit} from 'angular2/core';

export type StyleType = "primary" | "secondary" | "default";
export type ButtonType = "submit" | "button";

//<animated-button [IsDisabled]="_isDisabled" (click)="clicked()"></animated-button>

@Component({
    selector: "animated-button",
    templateUrl: "./app/utilities/animated-button/animated-button.component.html",
    styleUrls: ["./app/utilities/animated-button/style.css"]
})
export class AnimatedButtonComponent {

    private _isDisabled: boolean = false;
    private _originalLabel: string = "Submit";
    private _label: string = "Submit";
    private _workingLabel: string = "Working...";
    private _type: StyleType = "primary";
    private _buttonType: ButtonType = "submit";
    private _domElement: Element;

    constructor(private _elementRef: ElementRef) {
        this._domElement = _elementRef.nativeElement;
    }

    @Input()
    public set Type(value: StyleType) {
        this._type = value;
    }

    @Input()
    public set ButtonType(value: ButtonType) {
        this._buttonType = value;
    }

    @Input()
    public set Label(value: string) {
        this._originalLabel = this._label = value;
    }
    
    @Input()
    public set WorkingLabel(value: string){
        this._workingLabel = value;
    }

    @Input()
    public set IsDisabled(value: boolean) {
        this._isDisabled = value;

        var button = this._domElement.querySelector("button");
        if (value) {
            button.setAttribute("disabled", "disabled");
            this._label = this._workingLabel;
        }
        else {
            button.removeAttribute("disabled");
            this._label = this._originalLabel;
        }
    }
}
