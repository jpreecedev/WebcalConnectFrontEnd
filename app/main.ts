/// <reference path="../typings/index.d.ts"/>
/// <reference path="../node_modules/@types/es6-promise/index.d.ts" />

import { bootstrap } from "@angular/platform-browser-dynamic";
import { AppComponent } from "./app.component";
import { HTTP_PROVIDERS } from "@angular/http";
import { provide } from "@angular/core";
import { ROUTER_PROVIDERS } from "@angular/router-deprecated";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { disableDeprecatedForms, provideForms } from "@angular/forms";
import { Angulartics2 } from "angulartics2/src/core/angulartics2.js";
import { PaginationService } from "ng2-pagination";

bootstrap(AppComponent, [disableDeprecatedForms(), provideForms(), HTTP_PROVIDERS, ROUTER_PROVIDERS, Angulartics2, PaginationService, provide(LocationStrategy, { useClass: HashLocationStrategy })])
