import { Injectable } from '@angular/core';
import { Response } from "@angular/http";
import { HttpService } from "../utilities/HttpService";
import { Observable } from "rxjs/Observable";
import { AppSettings } from "../app.settings";
import { ShowError, ShowMessage } from "../utilities/messageBox";
import { AddressBookEntry } from "./address-book.component";

@Injectable()
export class AddressBookService {

    constructor(private httpService: HttpService) {

    }

    getAddressBook(): Observable<Response> {
        return this.httpService.get(`${AppSettings.API_ENDPOINT}/addressbook/`);
    }

    updateEntry(entry: AddressBookEntry): Observable<Response> {
        return this.httpService.post(`${AppSettings.API_ENDPOINT}/addressbook/`, JSON.stringify(entry));
    }
}
