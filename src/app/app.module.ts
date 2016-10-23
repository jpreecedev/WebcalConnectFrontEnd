import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {AppComponent}  from './app.component';
import {AuthRouterOutletDirective} from './utilities/auth-router/auth-router.directive';
import {DatePickerComponent} from './utilities/date-picker/date-picker.component';
import {DepotNamePipe} from './utilities/pipes/depot-name.pipe';
import {SpinnerComponent} from './utilities/spinner/spinner.component';
import {WCButtonComponent} from './utilities/wc-button/wc-button.component';
import {FileUploadService} from './utilities/file-upload.service';

import {ROUTES} from './app.routes';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES)
    ],
  declarations: [
    AppComponent,
    AuthRouterOutletDirective,
    DatePickerComponent,
    DepotNamePipe,
    SpinnerComponent,
    WCButtonComponent,
    FileUploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
