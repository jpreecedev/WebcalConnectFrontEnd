import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { AddressBookService } from './address-book.service';
import { HttpService } from '../utilities/http.service';
import { ShowError } from '../utilities/messageBox';

export interface AddressBookEntry {
    id: number;
    name: string;
    address: string;
    email: string;
    secondaryEmail: string;
    isEditing: boolean;
}

@Component({
    templateUrl: './address-book.component.html',
    styleUrls: ['./styles.scss'],
    providers: [AddressBookService, HttpService]
})
export class AddressBookComponent implements OnInit {

    public paginationConfig = {
        id: 'addressBook',
        itemsPerPage: 10,
        currentPage: 1
    };

    private isRequesting: boolean;
    private isUpdating: boolean;
    private addressBookEntries: AddressBookEntry[];
    private filteredAddressBookEntries: AddressBookEntry[];
    private selectedAddressBookEntry: AddressBookEntry;
    private originalCopy: AddressBookEntry;

    private routeCustomer: string;
    private contactName: string;

    constructor(private service: AddressBookService, private activatedRoute: ActivatedRoute) {
        this.selectedAddressBookEntry = <AddressBookEntry>{};

        activatedRoute.params.subscribe(params => {
            let customer = params['customerName'];
            if (customer) {
                this.routeCustomer = customer;
            }
        });
    }

    ngOnInit() {
        this.isRequesting = true;
        this.service.getAddressBook().subscribe((response: Response) => {
            this.filteredAddressBookEntries = this.addressBookEntries = response.json();

            if (this.routeCustomer) {
                this.contactNameChanged(this.routeCustomer);
                this.contactName = this.routeCustomer;
            }
        },
            (error: any) => {
                this.isRequesting = false;
                ShowError('Unable to get address book, please try again later.', error);
            },
            () => {
                this.isRequesting = false;
            });
    }

    updateEntry(entry: AddressBookEntry) {
        this.isUpdating = true;
        this.service.updateEntry(entry).subscribe((response: Response) => {
            entry.isEditing = false;
        },
            (error: any) => {
                this.isUpdating = false;
                entry.isEditing = false;
                ShowError('Unable to update address book, please try again later.', error);
            },
            () => {
                this.isUpdating = false;
                entry.isEditing = false;
            });
    }

    cancel(entry: AddressBookEntry) {
        if (!this.originalCopy) {
            return;
        }
        entry.isEditing = false;
        entry.email = this.originalCopy.email;
        entry.secondaryEmail = this.originalCopy.secondaryEmail;
        this.updateEntry(this.originalCopy);
    }

    contactNameChanged(contactName: string): void {
        if (!contactName) {
            this.filteredAddressBookEntries = this.addressBookEntries;
            return;
        }

        this.filteredAddressBookEntries = this.addressBookEntries.filter((item: AddressBookEntry) => {
            if (!item.name) {
                return false;
            }
            return item.name.toLowerCase().indexOf(contactName.toLowerCase()) > -1;
        });
    }

    selectContactName(addressBookEntry: AddressBookEntry): void {
        this.originalCopy = JSON.parse(JSON.stringify(addressBookEntry));
        this.addressBookEntries.forEach(c => c.isEditing = false);
        addressBookEntry.isEditing = true;
    }

    onPageChange(number: number) {
        this.paginationConfig.currentPage = number;
    }
}
