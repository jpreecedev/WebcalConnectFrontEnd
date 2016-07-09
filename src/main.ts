/// <reference path="../typings/index.d.ts"/>

import { bootstrap } from "@angular/platform-browser-dynamic";
import { AppComponent } from "./app/app.component";
import { HTTP_PROVIDERS } from "@angular/http";
import { provide, enableProdMode } from "@angular/core";
import { ROUTER_PROVIDERS } from "@angular/router-deprecated";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { disableDeprecatedForms, provideForms } from "@angular/forms";
import { PaginationService } from "ng2-pagination";
import "./site.scss";

if (process.env.ENV === 'production') {
    enableProdMode();
}

bootstrap(AppComponent, [disableDeprecatedForms(), provideForms(), HTTP_PROVIDERS, ROUTER_PROVIDERS, PaginationService, provide(LocationStrategy, { useClass: HashLocationStrategy })])
