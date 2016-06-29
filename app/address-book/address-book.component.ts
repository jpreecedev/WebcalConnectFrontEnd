import { Component, OnInit } from '@angular/core';
import { Response } from "@angular/http";
import { AddressBookService } from "./address-book.service";
import { HttpService } from "../utilities/HttpService";
import { PaginatePipe, PaginationService, PaginationControlsCmp } from "ng2-pagination";
import { ShowError, ShowMessage } from "../utilities/messageBox";
import { WCButtonComponent } from "../utilities/wc-button/wc-button.component";
import { SpinnerComponent } from "../utilities/spinner/spinner.component";

export interface AddressBookEntry {
    id: number;
    name: string;
    address: string;
    email: string;
    secondaryEmail: string;
}

@Component({
    templateUrl: "app/address-book/address-book.component.html",
    styleUrls: ["app/address-book/styles.css"],
    providers: [AddressBookService, HttpService, PaginationService],
    directives: [SpinnerComponent, PaginationControlsCmp, WCButtonComponent],
    pipes: [PaginatePipe]
})
export class AddressBookComponent implements OnInit {

    private isRequesting: boolean;
    private isUpdating: boolean;
    private addressBookEntries: AddressBookEntry[];

    private page: number = 1;

    constructor(private service: AddressBookService) {

    }

    ngOnInit() {
        this.isRequesting = true;
        this.service.getAddressBook().subscribe((response: Response) => {
            this.addressBookEntries = response.json();
        },
        (error: any) => {
            this.isRequesting = false;
            ShowError("Unable to get address book, please try again later.", error);
        },
        () => {
            this.isRequesting = false;
        });
    }

    updateEntry(entry: AddressBookEntry) {
        this.isUpdating = true;
        this.service.updateEntry(entry).subscribe((response: Response) => {

        },
        (error: any) => {
            this.isUpdating = false;
            ShowError("Unable to update address book, please try again later.", error);
        },
        () => {
            this.isUpdating = false;
        });
    }

}