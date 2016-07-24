/// <reference path='../typings/index.d.ts'/>

import { bootstrap } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app/app.component';
import { HTTP_PROVIDERS } from '@angular/http';
import { provide, enableProdMode } from '@angular/core';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { PaginationService } from 'ng2-pagination';
import { JwtHelper } from './app/utilities/JwtHelper';

if (process.env.ENV === 'build') {
    enableProdMode();
}

bootstrap(AppComponent, [
    disableDeprecatedForms(),
    provideForms(),
    ...HTTP_PROVIDERS,
    ...ROUTER_PROVIDERS,
    PaginationService,
    JwtHelper,
    provide(LocationStrategy, {
        useClass: HashLocationStrategy
    })
])
.catch(err => console.error(err));
