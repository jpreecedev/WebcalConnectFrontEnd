import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Ng2PaginationModule } from 'ng2-pagination';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalibrationsDueComponent } from './calibrations-due/calibrations-due.component';
import { GenerateEmailComponent } from './generate-email/generate-email.component';
import { InspectionDataComponent } from './inspection-data/inspection-data.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { RecentCalibrationsComponent } from './recent-calibrations/recent-calibrations.component';
import { QCCheckComponent } from './qc-check/qc-check.component';
import { CentreCheckComponent } from './centre-check/centre-check.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { ManageAccessComponent } from './manage-access/manage-access.component';
import { SoftwareLicensesComponent } from './software-licenses/software-licenses.component';
import { StatusReportComponent } from './status-report/status-report.component';
import { DetailedExceptionsComponent } from './detailed-exceptions/detailed-exceptions.component';
import { DirectUploadComponent } from './direct-upload/direct-upload.component';

import { DatePickerComponent } from './utilities/date-picker/date-picker.component';
import { DepotNamePipe } from './utilities/pipes/depot-name.pipe';
import { TickPipe } from './utilities/tick.pipe';
import { SplitByCapitalsPipe } from './utilities/split-by-capitals.pipe';
import { ClientNamePipe } from './utilities/client-name.pipe';
import { SpinnerComponent } from './utilities/spinner/spinner.component';
import { WCButtonComponent } from './utilities/wc-button/wc-button.component';
import { FileUploadService } from './utilities/file-upload.service';
import { JwtHelper } from './utilities/JwtHelper';
import { LoggedInGuard } from './utilities/loggedin.guard';

import { routing } from './app.routing';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    Ng2PaginationModule,
    routing
  ],
  declarations: [
    AppComponent,
    DatePickerComponent,
    SpinnerComponent,
    WCButtonComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    CalibrationsDueComponent,
    GenerateEmailComponent,
    InspectionDataComponent,
    AddressBookComponent,
    RecentCalibrationsComponent,
    QCCheckComponent,
    CentreCheckComponent,
    RegisterUserComponent,
    ManageAccessComponent,
    SoftwareLicensesComponent,
    StatusReportComponent,
    DetailedExceptionsComponent,
    DirectUploadComponent,
    DepotNamePipe,
    SplitByCapitalsPipe,
    TickPipe,
    ClientNamePipe
  ],
  providers: [
    FileUploadService,
    JwtHelper,
    LoggedInGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
